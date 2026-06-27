const pool = require("../db");

const getFolders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM folders ORDER BY id"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Ошибка сервера"
    });
  }
};

const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO folders(name) VALUES($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Ошибка сервера"
    });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      "DELETE FROM folders WHERE id=$1",
      [id]
    );
    res.json({
      message: "Папка удалена"
    });
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Ошибка сервера"
    });
  }
};

const updateFolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query(
      `UPDATE folders
       SET name = $1 
       WHERE id = $2 
       RETURNING id, name, created_at`, 
      [name, id]
    );
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Ошибка сервера"
    });
  }
};

module.exports = {
  getFolders,
  createFolder,
  deleteFolder,
  updateFolder
};