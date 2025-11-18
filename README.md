# 🎨 CollabBoard - Real-time Collaborative Whiteboard

![CollabBoard](https://img.shields.io/badge/CollabBoard-Real--time%20Collaboration-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Socket.io](https://img.shields.io/badge/Real--time-Socket.io-orange)

A powerful, real-time collaborative whiteboard where teams can draw, brainstorm, and chat together instantly. Built with modern web technologies for seamless collaboration.

## ✨ Features

### 🎨 Core Functionality
- **Real-time Drawing**: Draw simultaneously with multiple users
- **Multiple Tools**: Pen, Eraser with customizable brush sizes
- **Color Palette**: 8 different colors for creative expression
- **Live Chat**: Communicate with collaborators in real-time
- **User Presence**: See who's online in the room

### 💾 Save & Export
- **Save Boards**: Save your work to access later
- **Export Options**: Download as PNG or JPG
- **Board History**: View all your saved boards with thumbnails

### 🔧 Advanced Features
- **Undo/Redo**: Full history tracking for mistakes
- **Clear Canvas**: Fresh start when needed
- **Room Management**: Join existing rooms or create new ones
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Cloud Atlas)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/collabboard.git
   cd collabboard
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=your_mongodb_connection_string" > .env
   echo "PORT=5000" >> .env
   echo "JWT_SECRET=your_jwt_secret" >> .env
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start React development server
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **HTML5 Canvas** - Drawing functionality
- **CSS3** - Styling and responsive design
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - WebSocket communication
- **MongoDB** - Database
- **Mongoose** - ODM

## 📁 Project Structure

```
collabboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/          # Authentication components
│   │   │   ├── Dashboard/     # Main dashboard
│   │   │   ├── Whiteboard/    # Whiteboard room components
│   │   │   └── Common/        # Shared components
│   │   ├── classes/           # ES6 Classes (DrawingTool, WhiteboardManager)
│   │   ├── contexts/          # React contexts
│   │   └── utils/             # Utility functions
│   └── public/
├── backend/
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── server.js            # Main server file
│   └── server-simple.js     # Simplified server (no DB required)
└── README.md
```

## 🎯 How to Use

### Creating a Whiteboard
1. **Sign Up/Login** - Create an account or login
2. **Create Room** - Click "New Whiteboard" to generate a room
3. **Share Code** - Share the room code with collaborators
4. **Start Drawing** - Use tools to draw and collaborate

### Joining a Whiteboard
1. **Enter Room Code** - Input the shared room code
2. **Join Session** - Click "Join Board" to enter
3. **Collaborate** - Start drawing and chatting instantly

### Saving Work
1. **Click Save** - Use the "💾 Save Board" button
2. **Access Later** - Find saved boards in your dashboard
3. **Export** - Download as PNG/JPG for sharing

## 🔧 API Endpoints

### Whiteboard Routes
- `POST /api/whiteboards/create` - Create new whiteboard
- `POST /api/whiteboards/:roomCode/join` - Join existing whiteboard
- `GET /api/whiteboards/:roomCode` - Get whiteboard info

### Real-time Events
- `join-room` - User joins a room
- `drawing` - Drawing data synchronization
- `chat-message` - Real-time messaging
- `user-joined/left` - User presence updates

## 🎨 Customization

### Adding New Tools
Extend the `DrawingTool` class in `frontend/src/classes/DrawingTool.js`:

```javascript
// Example: Add rectangle tool
drawRectangle(ctx, startX, startY, endX, endY) {
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
}
```

### Color Palette
Modify the colors array in `Toolbar.js`:
```javascript
const colors = [
    '#000000', '#ef4444', '#f59e0b', '#10b981',
    '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
    // Add your custom colors here
];
```

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React community for excellent documentation
- Socket.io for seamless real-time communication
- MongoDB for reliable data storage
- All contributors and testers

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the development team.

---

<div align="center">

**Built with ❤️ using React, Node.js, and Socket.io**

⭐ Star this repo if you found it helpful!

</div>
