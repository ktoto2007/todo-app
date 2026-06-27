const pool = require("../db");

const getFolders = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM folders ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

const createFolder = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Название папки обязательно" });
        }

        const result = await pool.query(
            "INSERT INTO folders (name) VALUES ($1) RETURNING *",
            [name.trim()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

const updateFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "Некорректный id папки" });
        }
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Название папки обязательно" });
        }

        const result = await pool.query(
            `UPDATE folders SET name = $1 WHERE id = $2 RETURNING id, name`,
            [name.trim(), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Папка не найдена" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "Некорректный id папки" });
        }

        const result = await pool.query(
            "DELETE FROM folders WHERE id = $1 RETURNING id",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Папка не найдена" });
        }

        res.json({ message: "Папка удалена" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

module.exports = { getFolders, createFolder, updateFolder, deleteFolder };