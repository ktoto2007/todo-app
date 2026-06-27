const express = require("express");

const router = express.Router();

const {
    getFolders,
    createFolder,
    deleteFolder,
    updateFolder
} = require("../controllers/foldersController");

router.get("/", getFolders);
router.post("/", createFolder);
router.delete("/:id", deleteFolder);
router.patch("/:id", updateFolder);

module.exports = router;