/**
 * LeadsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Papa = require('papaparse');
const XLSX = require('node-xlsx');
const fs = require('fs');

module.exports = {
  list: async (req, res) => {
    // console.log('list');
    try {
      const sort = req.query.sort || 'createdAt';
      const direction = (req.query.direction || 'DESC').toUpperCase();
      const page = req.query.page || 0;
      const search = req.query.search || '';

      if (search === '') {
        const leads = await Leads.find()
        .populate('client')
        .populate('campaign')
        .populate('user')
        .sort(`${sort} ${direction}`)
        .limit(10)
        .skip(page * 10);
        console.log(leads);
        const leadsTotal = await Leads.count();
        return res.ok({
          content: leads,
          metadata: {
            total: leadsTotal
          }
        });
      } else {
        const leads = await Leads.find(
          { name :  { 'contains' : search } }
        ).populate('client')
         .populate('campaign')
          .sort(`${sort} ${direction}`)
          .limit(10)
          .skip(page * 10);
        const leadsTotal = await Leads.count({ name :  { 'contains' : search } });
        return res.ok({
          content: leads,
          metadata: {
            total: leadsTotal
          }
        });
      }
    } catch (e) {
      return res.serverError(e);
    }
  },
  listAll: async (req, res) => {
    try {
      const leads = await Leads.find().sort(`name DESC`);
      return res.ok(leads);
    } catch (e) {
      return res.serverError(e);
    }
  },
  searchLeads: async (req, res) => {
    try {
      const sort = req.query.sort || 'createdAt';
      const direction = (req.query.direction || 'DESC').toUpperCase();
      const page = req.query.page || 0;
      const search = req.query.search || '';
      const leads = await Leads.find(
        { name :  { 'contains' : search } }
      ).populate('client')
       .populate('campaign')
        .sort(`${sort} ${direction}`)
        .limit(10)
        .skip(page * 10);
      const leadsTotal = await Leads.count({ name :  { 'contains' : search } });
      // const leadsTotal = await Leads.count();
      return res.ok({
        content: leads,
        metadata: {
          total: leadsTotal
        }
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  single: async (req, res) => {
    try {
      const lead = await Leads.findOne({ id: req.params.id });
      return res.ok(lead);
    } catch (e) {
      return res.serverError(e);
    }
  },
  create: async (req, res) => {
    try {
      req.file('file').upload(
        {
          maxBytes: 10000000
        },
        async (err, files) => {
          if (err) {
            return res.serverError(err);
          }
          if (files.length === 0) {
            return res.serverError({ message: 'No files uploaded' });
          }

          let inputFile;
          let parsedOutput;
          let result;

          if (files[0].fd.endsWith('.csv')) {
            inputFile = fs.readFileSync(files[0].fd, { encoding: 'utf8' });
            parsedOutput = Papa.parse(inputFile, { header: true });
            result = parsedOutput.data;
          } else if (
            files[0].fd.endsWith('.xls') ||
            files[0].fd.endsWith('.xlsx')
          ) {
            inputFile = fs.readFileSync(files[0].fd);
            parsedOutput = XLSX.parse(inputFile);
            result = parsedOutput;
          }
          const campaign = await Campaigns.findOne({ id: req.body.campaign });
          let resultData = [];
          let resultProgress = [];
          let index = 0;

          for (let row of result) {
            let newRow = {};
            for (let field of campaign.structure) {
              newRow[field.field_api] = field.field_api_value;
            }
            for (let key in row) {
              const foundField = campaign.structure.find(
                s => s.field_csv === key
              );
              if (foundField) {
                newRow[foundField.field_api] = row[key];
              }
            }
            const fieldsCount = Object.keys(newRow).length;
            let fieldsEmptyCount = 0;
            for (let field in newRow) {
              if (newRow[field].length === 0) {
                fieldsEmptyCount++;
              }
            }
            if (fieldsCount !== fieldsEmptyCount) {
              resultData.push({ id: index, value: newRow });
              resultProgress.push({
                id: index,
                status: 'Pending',
                response: ''
              });
            }
            index++;
          }
          const newLead = await Leads.create({
            name: req.body.name,
            filename: files[0].filename,
            filepath: files[0].fd,
            status: 'Pending',
            client: req.body.client,
            campaign: req.body.campaign,
            data: resultData,
            progress: resultProgress,
            user: req.body.user
          }).fetch();

          SocketService.emit('process_job', { id: newLead.id });

          return res.ok({
            content: {},
            message: 'Lead created'
          });
        }
      );
    } catch (e) {
      return res.serverError(e);
    }
  },
  download: async (req, res) => {
    try {
      const lead = await Leads.findOne({ id: req.params.id });
      const data = lead.data;
      const mapped = lead.progress.map((row, index) => {
        let result = {
          id: row.id,
          email: '',
          response: row.response
        };

        if(data[index]['value']['Email']) {
          result.email = data[index]['value']['Email'];
        }else if(data[index]['value']['EM']){
          result.email = data[index]['value']['EM'];
        }

        return result;
      });
      const csv = Papa.unparse(mapped);
      const filename = `${lead.name}-results.csv`;
      res.attachment(filename);
      res.end(csv, 'UTF-8');
    } catch (e) {
      return res.serverError(e);
    }
  },
  update: async (req, res) => {
    try {
      const updatedLead = await Leads.update(
        {
          id: req.params.id
        },
        {
          name: req.body.name
        }
      );
      return res.ok({
        content: updatedLead,
        message: 'Lead updated'
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedLead = await Leads.destroy({
        id: req.params.id
      });
      return res.ok({
        content: deletedLead,
        message: 'Lead deleted'
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  previewFile: async (req, res) => {
    try {
      req.file('file').upload(
        {
          maxBytes: 10000000
        },
        async (err, files) => {
          if (err) {return res.serverError(err);}
          if (files.length === 0)
          {return res.serverError({ message: 'No files uploaded' });}

          let inputFile;
          let parsedOutput;
          let result;

          if (files[0].fd.endsWith('.csv')) {
            inputFile = fs.readFileSync(files[0].fd, { encoding: 'utf8' });
            parsedOutput = Papa.parse(inputFile, { header: true });
            result = parsedOutput.data;
          } else if (
            files[0].fd.endsWith('.xls') ||
            files[0].fd.endsWith('.xlsx')
          ) {
            inputFile = fs.readFileSync(files[0].fd);
            parsedOutput = XLSX.parse(inputFile);
            const headers = parsedOutput[0].data[0];
            const values = parsedOutput[0].data;
            result = [];
            if (values && values.length) {
              for (let i = 1; i < values.length; i++) {
                let item = {};
                for (let j = 0; j < headers.length; j++) {
                  item[headers[j]] = values[i][j];
                }
                result.push(item);
              }
            }
          }
          const campaign = await Campaigns.findOne({ id: req.body.campaign });
          let resultData = [];

          for (let row of result) {
            let newRow = {};
            for (let field of campaign.structure) {
              newRow[field.field_csv] = field.field_api_value;
            }
            for (let key in row) {
              const foundField = campaign.structure.find(
                s => s.field_csv === key
              );
              if (foundField) {
                newRow[key] = row[key];
              }
            }

            const fieldsCount = Object.keys(newRow).length;
            let fieldsEmptyCount = 0;
            for (let field in newRow) {
              if (newRow[field].length === 0) {
                fieldsEmptyCount++;
              }
            }
            if (fieldsCount !== fieldsEmptyCount) {
              resultData.push(newRow);
            }
          }

          const timestamp = new Date();

          return res.ok({
            content: resultData,
            message: 'File parsed',
            date: timestamp.getTime()
          });
        }
      );
    } catch (e) {
      return res.serverError(e);
    }
  }
};
