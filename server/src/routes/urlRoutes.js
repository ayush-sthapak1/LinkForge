const express = require("express");

const router = express.Router();

const { createShortUrl, getAllUrls, deleteUrl, updateUrl } = require("../controllers/urlController");

router.post("/", createShortUrl);
router.get("/", getAllUrls);
router.delete("/:id", deleteUrl);
router.patch("/:id", updateUrl);

module.exports = router;