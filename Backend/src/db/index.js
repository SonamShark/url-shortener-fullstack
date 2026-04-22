const { Sequelize } = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: "postgres",
  logging: config.env === "development" ? console.log : false,
  pool: { max: 10, min: 0, idle: 10_000 },
});

module.exports = { sequelize, Sequelize };
