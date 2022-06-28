const express = require("express");
const uploadController = require("../controller/uploadController");

const router = express.Router();

router.post("/upload", uploadController.uploadFile);
router.get("/download", uploadController.download);

module.exports = router;
