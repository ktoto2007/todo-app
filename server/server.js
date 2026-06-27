const pool = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
      console.error("Ошибка подключения к БД:", err.message);
  } else {
      console.log("База данных подключена!");
      console.log(result.rows[0]);
  }
});

app.get("/todos", async (req, res) => {
  try {
      const result = await pool.query(
          "SELECT * FROM todos ORDER BY id"
      );
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({
          error: "Ошибка сервера"
      });
  }
});

app.post("/todos", async (req, res) => {
  try {
      const { title } = req.body;
      const result = await pool.query(
          "INSERT INTO todos (title) VALUES ($1) RETURNING *",
          [title]
      );
      res.status(201).json(result.rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({
          error: "Ошибка сервера"
      });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});