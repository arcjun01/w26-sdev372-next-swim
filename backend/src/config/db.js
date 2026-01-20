require("dotenv").config(); // make sure this is at the top
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "nextswim",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;
