const Url = require("../models/Url");
const validator = require("validator");
const { generateUniqueShortCode } = require("../services/shortCodeService");
const jwt = require("jsonwebtoken");

async function createShortUrl(req, res, next) {
    try {
        const { originalUrl } = req.body;

        // Validate input
        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required",
            });
        }

        if (!validator.isURL(originalUrl)) {
            return res.status(400).json({
                message: "Invalid URL",
            });
        }

        // Generate a unique short code
        const shortCode = await generateUniqueShortCode();

        // Extract user from token if present
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (err) {
                // Ignore invalid token
            }
        }

        // Save URL
        const newUrl = await Url.create({
            originalUrl,
            shortCode,
            user: userId,
        });

        return res.status(201).json({
            message: "Short URL created successfully",
            shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
            url: newUrl,
        });

    } catch (error) {
        next(error);
    }
}

async function redirectToOriginalUrl(req, res, next) {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                message: "URL not found",
            });
        }

        // Update analytics atomically
        await Url.findByIdAndUpdate(url._id, {
            $inc: {
                clickCount: 1,
            },
            $set: {
                lastVisited: new Date(),
            },
        });

        return res.redirect(url.originalUrl);

    } catch (error) {
        next(error);
    }
}

async function getAllUrls(req, res, next) {
    try {
        const urls = await Url.find({ user: req.user.id }).sort({ createdAt: -1 });

        return res.status(200).json({
            count: urls.length,
            urls,
        });

    } catch (error) {
        next(error);
    }
}
async function deleteUrl(req, res, next) {
    try {
        const { id } = req.params;

        const deletedUrl = await Url.findByIdAndDelete(id);

        if (!deletedUrl) {
            return res.status(404).json({
                message: "URL not found",
            });
        }

        return res.status(200).json({
            message: "URL deleted successfully",
        });

    } catch (error) {
        next(error);
    }
}

async function updateUrl(req, res, next) {
    try {
        const { id } = req.params;
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required",
            });
        }

        if (!validator.isURL(originalUrl)) {
            return res.status(400).json({
                message: "Invalid URL",
            });
        }

        const updatedUrl = await Url.findByIdAndUpdate(
            id,
            { originalUrl },
            { new: true }
        );

        if (!updatedUrl) {
            return res.status(404).json({
                message: "URL not found",
            });
        }

        return res.status(200).json({
            message: "URL updated successfully",
            url: updatedUrl,
            });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    getAllUrls,
    deleteUrl,
    updateUrl,
};