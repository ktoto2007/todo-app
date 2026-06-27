const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "Arseniy2007@",
  port: 5432,
});

module.exports = pool;