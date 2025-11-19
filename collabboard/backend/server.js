require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

// Import Routes and Models
const whiteboardRoutes = require('./routes/whiteboards');
const User = require('./models/User');
const Whiteboard = require('./models/Whiteboard');

const app = express();
const server = http.createServer(app);

// --- CORS Configuration ---
const allowedOrigins = [
    "http://localhost:3000", 
    "https://collabboard-real-time-collaborative-thjg.onrender.com",
    "https://whiteboard-1-p4c5.onrender.com"
];

const io = socketIO(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Increased payload limit for saving large Canvas images (base64)
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collabboard';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Routes ---
app.use('/api/whiteboards', whiteboardRoutes);

// --- Auth Routes ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });
        
        const user = new User({ username, email, password });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating user' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

// --- Socket.IO Logic (Live Persistence) ---
const roomUsers = new Map();

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join-room', async (roomCode, username) => {
        socket.join(roomCode);

        // 1. Track Active Users
        if (!roomUsers.has(roomCode)) {
            roomUsers.set(roomCode, new Set());
        }
        roomUsers.get(roomCode).add(username);

        // 2. Notify Room
        socket.to(roomCode).emit('user-joined', username);
        io.to(roomCode).emit('current-users', Array.from(roomUsers.get(roomCode)));

        // 3. LOAD HISTORY (This restores the state when you rejoin)
        try {
            const board = await Whiteboard.findOne({ roomCode });
            if (board && board.drawings && board.drawings.length > 0) {
                console.log(`Restoring ${board.drawings.length} strokes for room ${roomCode}`);
                board.drawings.forEach(stroke => {
                    socket.emit('drawing', stroke);
                });
            }
        } catch (err) {
            console.error("Error loading board history:", err);
        }
    });

    socket.on('drawing', async (data) => {
        // 1. Broadcast to others
        socket.to(data.roomCode).emit('drawing', data);

        // 2. PERSIST to MongoDB (This saves the state for later)
        try {
            if (data.roomCode) {
                await Whiteboard.updateOne(
                    { roomCode: data.roomCode },
                    { $push: { drawings: data } }
                );
            }
        } catch (err) {
            console.error("Error saving drawing stroke:", err);
        }
    });

    socket.on('chat-message', (data) => {
        io.to(data.roomCode).emit('chat-message', data);
    });

    socket.on('clear-canvas', async (data) => {
        io.to(data.roomCode).emit('canvas-cleared');
        try {
            await Whiteboard.updateOne(
                { roomCode: data.roomCode },
                { $set: { drawings: [] } }
            );
        } catch (err) {
            console.error("Error clearing DB:", err);
        }
    });

    socket.on('disconnect', () => {
        // Cleanup logic if needed
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
