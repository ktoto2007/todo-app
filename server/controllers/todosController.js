const pool = require("../db");

const getTodos = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM todos ORDER BY id"
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        const result = await pool.query(
            "INSERT INTO todos (title) VALUES ($1) RETURNING *",
            [title]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        const result = await pool.query(
            `UPDATE todos
             SET completed = $1
             WHERE id = $2
             RETURNING *`,
            [completed, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM todos WHERE id = $1",
            [id]
        );

        res.json({ message: "Удалено" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};