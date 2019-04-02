// Retrieve
const MongoClient = require("mongodb").MongoClient;

module.exports = cb => {
  MongoClient.connect(
    "mongodb://localhost:27017/leadspeed-new",
    (err, client) => {
      if (!err) console.log("Connected to MongoDB successfully");
      cb(client.db("leadspeed-new"));
    }
  );
};
