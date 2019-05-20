const request = require("request");
const { ObjectId } = require("mongodb");
const queryString = require("query-string");

class Pool {
  constructor(db) {
    this.jobs = [];
    this.db = db;

    this.startup();
  }

  /**
   * Startup check
   */
  startup() {
    this.db
      .collection("leads")
      .find({
        status: { $regex: "^Pending" },
        status: { $regex: "^Processing" }
      })
      .toArray((err, leads) => {
        console.log(
          `Found ${
            leads.length
          } jobs that are in pending/processing state, resuming all of them.`
        );
        for (let lead of leads) {
          this.processJob(lead._id.toString());
        }
      });
  }

  /**
   * Returns queue list
   */
  getJobs() {
    return this.jobs;
  }

  /**
   * Start processing job(Lead)
   * @param {*} id Queue Name
   */
  processJob(id) {
    const campaignsCollection = this.db.collection("campaigns");
    const leadsCollection = this.db.collection("leads");

    leadsCollection.findOne({ _id: new ObjectId(id) }, (err1, lead) => {
      campaignsCollection.findOne(
        { _id: new ObjectId(lead.campaign) },
        (err2, campaign) => {
          this.db
            .collection("leads")
            .updateOne(
              { _id: lead._id },
              { $set: { status: "Started" } },
              (err, result) => {}
            );
          this.process(campaign, lead, 0);
        }
      );
    });
  }

  process(campaign, lead, jobNumber) {
    const formData = {};
    for (let key in lead.data[jobNumber].value) {
      formData[key] = lead.data[jobNumber].value[key];
    }

    const options = { url: campaign.url, method: "post", form: formData };
    const callback = (error, response, body) => {
      // console.log(error);
      // console.log(response);
      // console.log(body);
      this.db.collection("leads").updateOne(
        { _id: lead._id, "progress.id": jobNumber },
        {
          $set: {
            "progress.$.email": 
              lead.data[jobNumber].value['EM'] != undefined ? lead.data[jobNumber].value['EM'] :
              (lead.data[jobNumber].value['Email'] != undefined ? lead.data[jobNumber].value['Email'] : 'not set'),
            "progress.$.status":
              error || response.statusCode !== 200  || !body.includes('GlobalDataCaptureKey') ? "Error" : "Success",
            "progress.$.response": body.includes('GlobalDataCaptureKey') ? body : "incorrect campaign URL"
          }
        },
        (err, result) => {}
      );

      this.db.collection("leads").updateOne(
        { _id: lead._id },
        {
          $set: { status: `Processing ${jobNumber + 1}/${lead.data.length}` }
        },
        (err, result) => {}
      );

      if (jobNumber + 1 < lead.data.length) {
        setTimeout(
          () => this.process(campaign, lead, jobNumber + 1),
          campaign.delay * 1000
        );
      } else {
        this.db.collection("leads").findOne({ _id: lead._id }, (err, lead2) => {
          const leadsOK = lead2.progress.filter(l => l.status === "Success")
            .length;
          const leadsFAIL = lead2.progress.filter(l => l.status === "Error")
            .length;
          this.db.collection("leads").updateOne(
            { _id: lead._id },
            {
              $set: {
                status: `Finished`
              }
            },
            (err, result) => {}
          );
        });
      }
    };

    if (lead.progress[jobNumber].status === "Pending") {
      request(options, callback);
    } else {
      this.process(campaign, lead, jobNumber + 1);
    }
  }
}

module.exports = db => new Pool(db);
