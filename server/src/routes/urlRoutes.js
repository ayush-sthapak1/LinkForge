const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

const { createShortUrl, getAllUrls, deleteUrl, updateUrl } = require("../controllers/urlController");

router.post("/", createShortUrl);
router.get("/", protect, getAllUrls);
router.delete("/:id", protect, deleteUrl);
router.patch("/:id", protect, updateUrl);

module.exports = router;