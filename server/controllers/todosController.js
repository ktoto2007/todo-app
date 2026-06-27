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

const getTodosByFolder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `
            SELECT *
            FROM todos
            WHERE folder_id = $1
            ORDER BY important DESC,
                deadline ASC NULLS LAST,
                created_at ASC,
                id ASC
            `,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

const createTodo = async (req, res) => {
    try {
        const { title, folder_id, deadline } = req.body;

        const result = await pool.query(
            "INSERT INTO todos (title, folder_id, deadline) VALUES ($1, $2, $3) RETURNING *",
            [title, folder_id, deadline]
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
        const {
            title,
            completed,
            important,
            deadline,
            folder_id
        } = req.body;
        
        const result = await pool.query(
            `
            UPDATE todos
            SET
                title = COALESCE($1, title),
                completed = COALESCE($2, completed),
                important = COALESCE($3, important),
                deadline = COALESCE($4, deadline),
                folder_id = COALESCE($5, folder_id)
            WHERE id = $6
            RETURNING
                id,
                title,
                completed,
                important,
                deadline,
                folder_id,
                created_at
            `,
            [title, completed, important, deadline, folder_id, id]
        );
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Ошибка сервера"
        });
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
    deleteTodo,
    getTodosByFolder
};