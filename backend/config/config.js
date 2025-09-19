require("dotenv").config();

const env = (k, d) => process.env[k] ?? d;

module.exports = {
  development: {
    username: env("DB_USER", "admin"),
    password: env("DB_PASSWORD", ""), //
    database: env("DB_NAME", "jahinsurance"),
    host: env("DB_HOST", "mysql"),
    port: Number(env("DB_PORT", 3306)),
    dialect: "mysql",
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
  production: {
    username: env("DB_USER", "admin"),
    password: env("DB_PASSWORD", ""), //
    database: env("DB_NAME", "jahinsurance"),
    host: env("DB_HOST", "mysql"),
    port: Number(env("DB_PORT", 3306)),
    dialect: "mysql",
    logging: console.log,
  },
};
