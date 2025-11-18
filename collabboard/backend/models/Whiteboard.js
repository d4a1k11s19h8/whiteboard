const mongoose = require('mongoose');

const whiteboardSchema = new mongoose.Schema({
    roomCode: { type: String, required: true, unique: true },
    roomName: { type: String, default: 'My Whiteboard' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    users: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String,
        joinedAt: { type: Date, default: Date.now }
    }],
    // This stores the LIVE state (strokes)
    drawings: [{
        tool: String,
        color: String,
        brushSize: Number,
        points: [[Number]],
        sender: String,
        timestamp: { type: Date, default: Date.now }
    }],
    // This stores the STATIC copies (images)
    savedVersions: [{
        savedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        imageData: String, 
        thumbnail: String,
        name: String,
        savedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Whiteboard', whiteboardSchema);