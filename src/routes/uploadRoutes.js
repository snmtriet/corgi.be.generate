const express = require("express");
const uploadController = require("../controller/uploadController");

const router = express.Router();

router.post("/upload", uploadController.uploadFile);

module.exports = router;
