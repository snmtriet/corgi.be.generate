const express = require("express");
const downloadController = require("../controller/downloadController");

const router = express.Router();

router.get("/fileExample", downloadController.getFileExample);

module.exports = router;
