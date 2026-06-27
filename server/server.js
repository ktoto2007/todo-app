const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// подключаем роуты
const todoRoutes = require("./routes/todos");

app.use("/todos", todoRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Backend работает" });
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});