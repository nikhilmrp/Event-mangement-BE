// Config for sequelize-cli (migrations/seeders). The app itself uses database.ts;
// this mirrors its connection settings in the plain-object form the CLI expects.
const path = require("path");
const dotenv = require("dotenv");

const NODE_ENV = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(process.cwd(), `.env.${NODE_ENV}`) });

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_NAME = "ecommerce_db",
  DB_USER = "root",
  DB_PASSWORD = "",
} = process.env;

const base = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: "mysql",
  timezone: "+00:00",
  dialectOptions: { charset: "utf8mb4" },
};

module.exports = {
  development: base,
  production: {
    ...base,
    dialectOptions: {
      ...base.dialectOptions,
      ssl: { require: true, rejectUnauthorized: false },
    },
  },
};
