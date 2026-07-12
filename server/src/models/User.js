const mongoose = require('mongoose');

// TODO: Define user schema fields (username, email, password, etc.)
const UserSchema = new mongoose.Schema({});

module.exports = mongoose.model('User', UserSchema);
