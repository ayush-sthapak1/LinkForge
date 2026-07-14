const Url = require("../models/Url");
const { nanoid } = require("nanoid");

async function generateUniqueShortCode() {
    let shortCode;

    do {
        shortCode = nanoid(7);
    } while (await Url.findOne({ shortCode }));

    return shortCode;
}

module.exports = {
    generateUniqueShortCode,
};