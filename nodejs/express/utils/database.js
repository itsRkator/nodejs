const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "<Passwords>", // Must not be shared to Git Use .env
});


module.exports = pool.promise();
