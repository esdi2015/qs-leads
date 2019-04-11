const http = require("http");
const server = http.createServer((req, res) => res.end());

const Connector = require("./connector");

Connector(db => {
  const Pool = require("./pool")(db);
  const io = require("socket.io").listen(server);
  io.sockets.on("connection", socket => {
    console.log("Backend server connected");

    socket.on("process_job", data => {
      Pool.processJob(data.id);
    });

    socket.on("stop_job", data => {
      console.log("delete_queue", data);
    });
  });
  server.listen(1349);
});
