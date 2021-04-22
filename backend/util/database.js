const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "mean-complete",
  password: "root",
});

module.exports = pool.promise();
