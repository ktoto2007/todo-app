require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const todoRoutes = require("./routes/todos");
const folderRoutes = require("./routes/folders");

app.use("/todos", todoRoutes);
app.use("/folders", folderRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Backend работает" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});