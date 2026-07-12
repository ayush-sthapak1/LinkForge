const mongoose = require('mongoose');

// TODO: Define URL schema fields (originalUrl, shortCode, user reference, click tracking, etc.)
const UrlSchema = new mongoose.Schema({});

module.exports = mongoose.model('Url', UrlSchema);
