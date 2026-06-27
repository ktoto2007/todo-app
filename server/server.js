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

app.listen(5000, () => {
    console.log("Server started on port 5000");
});