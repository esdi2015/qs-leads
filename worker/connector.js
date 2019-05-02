// Retrieve
const MongoClient = require("mongodb").MongoClient;

module.exports = cb => {
  console.log("MongoClient.connect");
  MongoClient.connect(
    "mongodb://localhost:27017/leadspeed-stage",
    (err, client) => {
      // console.log(err);
      // console.log(client);
      // console.log(cb);
      if (!err) console.log("Connected to MongoDB successfully");
      cb(client.db("leadspeed-stage"));
    }
  );
};
