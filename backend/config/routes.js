/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  // Authorization
  "post /api/auth/login": "AuthController.login",
  "post /api/auth/logout": "AuthController.logout",
  // Clients
  "get /api/clients": "ClientsController.list",
  "get /api/clients/all": "ClientsController.listAll",
  "get /api/clients/:id": "ClientsController.single",
  "post /api/clients": "ClientsController.create",
  "delete /api/clients/:id": "ClientsController.delete",
  "put /api/clients/:id": "ClientsController.update",
  // Campaigns
  "get /api/campaigns": "CampaignsController.list",
  "get /api/campaigns/all/:cid": "CampaignsController.listAll",
  "get /api/campaigns/:id": "CampaignsController.single",
  "post /api/campaigns": "CampaignsController.create",
  "delete /api/campaigns/:id": "CampaignsController.delete",
  "put /api/campaigns/:id": "CampaignsController.update",
  "post /api/campaigns/import": "CampaignsController.importFieldsFromFile",
  // Leads
  "get /api/leads": "LeadsController.list",
  "get /api/leads/all/:cid": "LeadsController.listAll",
  "get /api/leads/:id": "LeadsController.single",
  "post /api/leads": "LeadsController.create",
  "delete /api/leads/:id": "LeadsController.delete",
  "put /api/leads/:id": "LeadsController.update",
  "post /api/leads/preview": "LeadsController.previewFile",
  "get /api/leads/download/:id": "LeadsController.download",
  // Users
  "get /api/users": "UsersController.list",
  "get /api/users/all/:cid": "UsersController.listAll",
  "get /api/users/:id": "UsersController.single",
  "post /api/users": "UsersController.create",
  "delete /api/users/:id": "UsersController.delete",
  "put /api/users/:id": "UsersController.update",
  // Overview
  "get /api/overview/chart": "OverviewController.chart",
  // Test
  "post /api/test": "TestController.test"
};
