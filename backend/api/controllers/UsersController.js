/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const crypto = require("crypto");

module.exports = {
  list: async (req, res) => {
    try {
      const sort = req.query.sort || "createdAt";
      const direction = (req.query.direction || "DESC").toUpperCase();
      const page = req.query.page || 0;

      const users = await Users.find()
        .populate("assignedCampaigns")
        .sort(`${sort} ${direction}`)
        .limit(10)
        .skip(page * 10);
      const usersTotal = await Users.count();
      return res.ok({
        content: users,
        metadata: {
          total: usersTotal
        }
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  listAll: async (req, res) => {
    try {
      const users = await Users.find().sort(`name DESC`);
      return res.ok(users);
    } catch (e) {
      return res.serverError(e);
    }
  },
  single: async (req, res) => {
    try {
      const user = await Users.findOne({ id: req.params.id });
      return res.ok(user);
    } catch (e) {
      return res.serverError(e);
    }
  },
  create: async (req, res) => {
    try {
      const hash = crypto
        .createHmac("sha256", "leadspeed")
        .update(req.body.password)
        .digest("hex");
      const newUser = await Users.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        role: req.body.role
      });
      return res.ok({
        content: newUser,
        message: "User created"
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  update: async (req, res) => {
    try {
      const updatedUser = await Users.update(
        {
          id: req.params.id
        },
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          role: req.body.role
        }
      );
      return res.ok({
        content: updatedUser,
        message: "User updated"
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedUser = await Users.destroy({
        id: req.params.id
      });
      return res.ok({
        content: deletedUser,
        message: "User deleted"
      });
    } catch (e) {
      return res.serverError(e);
    }
  }
};
