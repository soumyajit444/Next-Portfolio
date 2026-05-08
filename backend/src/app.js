const express = require("express");
const cors = require("cors");

const app = express();
require("./config/cloudinary");

app.use(cors());
app.use(express.json());

app.use("/api/profile", require("./routes/profileRoutes"));

module.exports = app;
