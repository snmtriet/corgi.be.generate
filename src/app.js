require("dotenv").config();
const express = require("express");
const cors = require("cors");

const downloadRouter = require("./routes/downloadRoutes");
const uploadRouter = require("./routes/uploadRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", downloadRouter);
app.use("/api", uploadRouter);

app.listen(process.env.PORT || 4000);

module.exports = app;
