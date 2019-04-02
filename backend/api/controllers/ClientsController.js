/**
 * ClientsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  list: async (req, res) => {
    try {
      const sort = req.query.sort || "createdAt";
      const direction = (req.query.direction || "DESC").toUpperCase();
      const page = req.query.page || 0;

      const clients = await Clients.find()
        .populate("campaigns")
        .sort(`${sort} ${direction}`)
        .limit(10)
        .skip(page * 10);
      const clientsTotal = await Clients.count();
      return res.ok({
        content: clients,
        metadata: {
          total: clientsTotal
        }
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  listAll: async (req, res) => {
    try {
      const clients = await Clients.find().sort(`name DESC`);
      return res.ok(clients);
    } catch (e) {
      return res.serverError(e);
    }
  },
  single: async (req, res) => {
    try {
      const client = await Clients.findOne({ id: req.params.id });
      return res.ok(client);
    } catch (e) {
      return res.serverError(e);
    }
  },
  create: async (req, res) => {
    try {
      const newClient = await Clients.create({
        name: req.body.name
      });
      return res.ok({
        content: newClient,
        message: "Client created"
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  update: async (req, res) => {
    try {
      const updatedClient = await Clients.update(
        {
          id: req.params.id
        },
        {
          name: req.body.name
        }
      );
      return res.ok({
        content: updatedClient,
        message: "Client updated"
      });
    } catch (e) {
      return res.serverError(e);
    }
  },
  delete: async (req, res) => {
    try {
      const deletedClient = await Clients.destroy({
        id: req.params.id
      });
      return res.ok({
        content: deletedClient,
        message: "Client deleted"
      });
    } catch (e) {
      return res.serverError(e);
    }
  }
};
