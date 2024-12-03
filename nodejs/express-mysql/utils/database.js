const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "node-complete",
  "root",
  "DATABASE_PASSWORD", // To be replaced
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = sequelize;
