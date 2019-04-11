/**
 * ClientsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  chart: async (req, res) => {
    try {
      const campaignsCountPerClient = (await Clients.find().populate(
        "campaigns"
      )).map(c => ({
        clientName: c.name,
        campaignsCount: c.campaigns.length
      }));
      const leadsCountPerClient = (await Clients.find()).map(c => ({
        id: c.id,
        clientName: c.name,
        leads: { ok: 0, fail: 0 }
      }));
      (await Leads.find()).forEach(lead => {
        const client = leadsCountPerClient.find(c => c.id === lead.client);
        const leadsOK = lead.progress.filter(l => l.status === "Success")
          .length;
        const leadsFAIL = lead.progress.filter(l => l.status === "Error")
          .length;
        client.leads.ok += leadsOK;
        client.leads.fail += leadsFAIL;
      });

      return res.ok([
        { name: "CampaignsCountPerClient", value: campaignsCountPerClient },
        { name: "LeadsCountPerClient", value: leadsCountPerClient }
      ]);
    } catch (e) {
      return res.serverError(e);
    }
  }
};
