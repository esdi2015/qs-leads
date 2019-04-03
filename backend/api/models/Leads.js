/**
 * Leads.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    filename: {
      type: 'string',
      required: true
    },
    filepath: {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
      required: false
    },
    client: {
      model: 'clients'
    },
    campaign: {
      model: 'campaigns'
    },
    data: {
      type: 'json',
      required: true
    },
    progress: {
      type: 'json',
      required: false
    }
  }
};
