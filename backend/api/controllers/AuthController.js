/**
 * ClientsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const crypto = require('crypto');

module.exports = {
  login: async (req, res) => {
    try {
      console.log(_.get(req.body, 'email'));
      const email = _.get(req.body, 'email');
      const password = _.get(req.body, 'password');
      const user = await Users.findOne({ email: email });

      const hash = crypto
        .createHmac('sha256', 'leadspeed')
        .update(password)
        .digest('hex');

      if (user) {
        if (hash === user.password) {
          req.session.user = user;
          return res.ok({
            message: 'Logged in',
            content: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role
            }
          });
        } else {
          return res.status(401).send({ message: 'Invalid email or password' });
        }
      } else {
        return res.status(404).send({ message: 'User not found' });
      }
    } catch (e) {
      return res.serverError(e);
    }
  },
  logout: async (req, res) => {
    req.session.user = null;
    return res.ok({ message: 'Logged out' });
  }
};
