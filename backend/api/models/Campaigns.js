/**
 * Clients.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    name: {
      type: "string",
      required: true
    },
    url: {
      type: "string",
      required: true
    },
    delay: {
      type: "number",
      required: true
    },
    client: {
      model: "clients",
      required: true
    },
    structure: {
      type: "json",
      required: true
    }
  }
};
