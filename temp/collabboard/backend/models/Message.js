const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomCode: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);