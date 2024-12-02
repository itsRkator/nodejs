const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Z0351$AlPhA", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;