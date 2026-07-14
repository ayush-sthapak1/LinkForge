const Url = require("../models/Url");
const validator = require("validator");
const { generateUniqueShortCode } = require("../services/shortCodeService");

async function createShortUrl(req, res,user) {
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

        // Save URL
        const newUrl = await Url.create({
            originalUrl,
            shortCode,
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

async function redirectToOriginalUrl(req, res,user) {
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

async function getAllUrls(req, res,user) {
    try {
        const urls = await Url.find().sort({ createdAt: -1 });

        return res.status(200).json({
            count: urls.length,
            urls,
        });

    } catch (error) {
        next(error);
    }
}
async function deleteUrl(req, res,user) {
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

async function updateUrl(req, res,user) {
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