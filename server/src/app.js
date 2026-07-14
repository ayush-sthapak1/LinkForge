const express = require("express");
const cors = require("cors");

const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");
const { redirectToOriginalUrl } = require("./controllers/urlController");
const errorHandler = require("./middleware/errorHandler");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/urls", urlRoutes);
app.use("/api/auth", authRoutes);

app.get("/:shortCode", redirectToOriginalUrl);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});

app.use(errorHandler);

module.exports = app;