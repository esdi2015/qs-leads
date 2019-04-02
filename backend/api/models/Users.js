/**
 * Users.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    firstName: {
      type: "string",
      required: true
    },
    lastName: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
      required: true
    },
    password: {
      type: "string",
      required: true
    },
    role: {
      type: "string",
      required: true
    },
    assignedCampaigns: {
      collection: "campaigns"
    }
  }
};
