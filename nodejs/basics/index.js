const http = require("http");
const { requestHandler } = require("./routes");
// const routes = require("./routes");

const server = http.createServer(requestHandler);
// const server = http.createServer(routes);

server.listen(3000, "localhost", () => {
  console.log("Server is running on port 3000");
});
