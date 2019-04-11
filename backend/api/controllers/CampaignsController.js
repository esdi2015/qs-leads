/**
 * CampaignsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Papa = require('papaparse');
const XLSX = require('node-xlsx');
const fs = require('fs');

module.exports = {
  list: async (req, res) => {
    try {
      const sort = req.query.sort || 'createdAt';
      const direction = (req.query.direction || 'DESC').toUpperCase();
      const page = req.query.page || 0;

      const campaigns = await Campaigns.find()
        .sort(`${sort} ${direction}`)
        .limit(10)
        .skip(page * 10)
        .populate('client');
      const campaignsTotal = await Campaigns.count();
      return res.ok({
        content: campaigns,
        metadata: {
          total: campaignsTotal
        }
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  listAll: async (req, res) => {
    try {
      console.log(req.params);
      const campaigns = await Campaigns.find({
        client: req.params.cid
      }).sort(`name DESC`);
      return res.ok(campaigns);
    } catch (e) {
      return res.serverError(e);
    }
  },
  listAllActive: async (req, res) => {
    try {
      console.log(req.params);
      const campaigns = await Campaigns.find({
        client: req.params.cid,
        status: 'live'
      }).sort(`name DESC`);
      return res.ok(campaigns);
    } catch (e) {
      return res.serverError(e);
    }
  },
  single: async (req, res) => {
    try {
      const campaign = await Campaigns.findOne({ id: req.params.id });
      return res.ok(campaign);
    } catch (e) {
      return res.serverError(e);
    }
  },
  create: async (req, res) => {
    try {
      const newCampaign = await Campaigns.create(req.body);
      return res.ok({
        content: newCampaign,
        message: 'Campaign created'
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  update: async (req, res) => {
    try {
      const updatedCampaign = await Campaigns.update(
        {
          id: req.params.id
        },
        {
          name: req.body.name,
          url: req.body.url,
          delay: req.body.delay,
          client: req.body.client,
          status: req.body.status,
          structure: req.body.structure
        }
      );
      return res.ok({
        content: updatedCampaign,
        message: 'Campaign updated'
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedCampaign = await Campaigns.destroy({
        id: req.params.id
      });
      return res.ok({
        content: deletedCampaign,
        message: 'Campaign deleted'
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  importFieldsFromFile: async (req, res) => {
    try {
      req.file('file').upload(
        {
          maxBytes: 10000000
        },
        (err, files) => {
          if (err) {return res.serverError(err);}
          if (files.length === 0)
          {return res.serverError({ message: 'No files uploaded' });}

          let inputFile;
          let parsedOutput;
          let result;

          if (files[0].fd.endsWith('.csv')) {
            inputFile = fs.readFileSync(files[0].fd, { encoding: 'utf8' });
            parsedOutput = Papa.parse(inputFile, { header: true });
            result = parsedOutput.data[0];
          } else if (
            files[0].fd.endsWith('.xls') ||
            files[0].fd.endsWith('.xlsx')
          ) {
            inputFile = fs.readFileSync(files[0].fd);
            parsedOutput = XLSX.parse(inputFile);
            const headers = parsedOutput[0].data[0];
            const values = parsedOutput[0].data[1];
            result = {};
            for (let i = 0; i < headers.length; i++) {
              result[headers[i]] = values[i];
            }
          }

          return res.ok({
            content: result,
            message: 'File parsed'
          });
        }
      );
    } catch (e) {
      return res.serverError(e);
    }
  }
};
