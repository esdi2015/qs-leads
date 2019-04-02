/**
 * ClientsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcrypt");

module.exports = {
  test: (req, res) => {
    console.log("Received");
    // console.log(req.body);
    const random = Math.floor(Math.random() * 100);
    if (random < 50) res.ok(req.body);
    else res.serverError(req.body);
  }
};
