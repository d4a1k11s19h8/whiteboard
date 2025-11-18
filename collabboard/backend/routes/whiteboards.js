const express = require('express');
const router = express.Router();
const Whiteboard = require('../models/Whiteboard');

function generateRoomCode() {
    const adjectives = ['swift', 'quick', 'smart', 'bold', 'clear', 'sharp', 'bright'];
    const nouns = ['star', 'moon', 'sun', 'wave', 'tree', 'cloud', 'river'];
    const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${nouns[Math.floor(Math.random() * nouns.length)]}-${number}`;
}

// Create New Room
router.post('/create', async (req, res) => {
    try {
        const { roomName, userId } = req.body;
        const roomCode = generateRoomCode();
        
        const whiteboard = new Whiteboard({
            roomCode,
            roomName: roomName || 'My Whiteboard',
            owner: userId || null,
            users: [],
            drawings: [], // Starts empty
            savedVersions: []
        });

        await whiteboard.save();
        res.json({ success: true, roomCode, message: 'Whiteboard created' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating whiteboard' });
    }
});

// Join Room
router.post('/:roomCode/join', async (req, res) => {
    try {
        const { roomCode } = req.params;
        const { username, userId } = req.body;

        const whiteboard = await Whiteboard.findOne({ roomCode });
        if (!whiteboard) return res.status(404).json({ success: false, message: 'Room not found' });

        const existingUser = whiteboard.users.find(u => u.username === username);
        if (!existingUser) {
            whiteboard.users.push({ username, userId, joinedAt: new Date() });
            await whiteboard.save();
        }

        res.json({ success: true, whiteboard });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error joining' });
    }
});

// Get Info
router.get('/:roomCode', async (req, res) => {
    try {
        const whiteboard = await Whiteboard.findOne({ roomCode: req.params.roomCode });
        if (!whiteboard) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, whiteboard });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching' });
    }
});

// Save Snapshot (Creates a copy, DOES NOT clear live board)
router.post('/:roomCode/save-version', async (req, res) => {
    try {
        const { roomCode } = req.params;
        const { userId, imageData, name } = req.body;

        const board = await Whiteboard.findOne({ roomCode });
        if (!board) return res.status(404).json({ success: false, message: "Room not found" });

        const newVersion = {
            savedBy: userId,
            imageData, 
            thumbnail: imageData,
            name: name || `Save-${Date.now()}`,
            savedAt: new Date()
        };

        board.savedVersions.push(newVersion);
        await board.save();

        res.json({ success: true, message: "Snapshot saved", version: newVersion });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error saving version" });
    }
});

// List User's Saved Snapshots
router.get('/user/:userId/list', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find boards where user saved something
        const boards = await Whiteboard.find({ "savedVersions.savedBy": userId });

        let result = [];
        boards.forEach(b => {
            const userVersions = b.savedVersions.filter(v => v.savedBy == userId);
            userVersions.forEach(v => {
                result.push({
                    _id: v._id,
                    type: 'snapshot',
                    name: v.name,
                    roomCode: b.roomCode, // Origin room
                    imageData: v.imageData,
                    savedAt: v.savedAt
                });
            });
        });

        res.json({ success: true, boards: result });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching list" });
    }
});

// Delete Snapshot
router.delete('/saved/:versionId', async (req, res) => {
    try {
        const { versionId } = req.params;
        const board = await Whiteboard.findOne({ "savedVersions._id": versionId });
        if(board) {
            board.savedVersions.pull({ _id: versionId });
            await board.save();
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;