const express = require("express");
const cors = require("cors");

const urlRoutes = require("./routes/urlRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/urls", urlRoutes);
const { redirectToOriginalUrl } = require("./controllers/urlController");

app.get("/:shortCode", redirectToOriginalUrl);

module.exports = app;