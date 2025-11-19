import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../../utils/api';
import { DrawingTool } from '../../classes/DrawingTool';
import Toolbar from './Toolbar';
import Canvas from './Canvas';
import ChatPanel from './ChatPanel';
import UserList from './UserList';
import './WhiteboardRoom.css';

const WhiteboardRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [user] = useState(() => {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    });

    const [drawingTool] = useState(new DrawingTool());
    const [roomUsers, setRoomUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [history, setHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Connect and Setup Socket
    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const newSocket = io('https://whiteboard-afvw.onrender.com');
        setSocket(newSocket);

        if (roomId) {
            newSocket.emit('join-room', roomId, user.username);
        }

        newSocket.on('current-users', setRoomUsers);
        newSocket.on('user-joined', (username) => {
            setRoomUsers(prev => [...prev, username]);
            addMessage('System', `${username} joined`);
        });

        // LISTEN FOR DRAWINGS (Live & History)
        newSocket.on('drawing', (data) => {
            if (canvasRef.current) {
                // Draw the stroke
                const ctx = canvasRef.current.getContext('2d');
                drawRemote(ctx, data);
            }
        });

        newSocket.on('chat-message', (data) => addMessage(data.sender, data.text));
        
        newSocket.on('canvas-cleared', () => {
             if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                setHistory([]);
                setRedoHistory([]);
            }
        });

        return () => newSocket.disconnect();
    }, [user, roomId, navigate]);

    // 2. Drawing Tool Bindings
    useEffect(() => {
        if (!socket) return;
        
        drawingTool.setOnDraw((data) => {
            // Send stroke to server (Persistence happens here)
            socket.emit('drawing', {
                ...data,
                roomCode: roomId,
                sender: user?.username
            });
        });

        drawingTool.setOnDrawEnd(() => {
             saveHistoryState();
        });
    }, [socket, drawingTool, user, roomId]);

    // 3. Load Background Snapshot (If this room was created from a saved board)
    useEffect(() => {
        if (location.state?.savedSnapshot && !isLoaded && canvasRef.current) {
            const img = new Image();
            img.onload = () => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.drawImage(img, 0, 0);
                saveHistoryState();
                setIsLoaded(true);
            };
            img.src = location.state.savedSnapshot.imageData;
        }
    }, [location.state, isLoaded]);

    const saveHistoryState = () => {
        if(canvasRef.current) {
            setHistory(prev => [...prev, canvasRef.current.toDataURL()]);
            setRedoHistory([]);
        }
    };

    const saveBoard = async () => {
        if (!canvasRef.current) return;
        const imageData = canvasRef.current.toDataURL('image/png');
        
        try {
            const res = await api.post(`/whiteboards/${roomId}/save-version`, {
                userId: user.id || user._id,
                imageData: imageData,
                name: `Save ${new Date().toLocaleTimeString()}`
            });
            
            const data = res.data || res;
            if(data.success) {
                addMessage('System', 'Snapshot saved to dashboard!');
            }
        } catch(err) {
            alert("Failed to save board");
        }
    };

    const handleExport = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `board-${roomId}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    const clearCanvas = () => {
        socket.emit('clear-canvas', { roomCode: roomId });
    };

    const undo = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            const currentState = newHistory.pop();
            setRedoHistory(prev => [currentState, ...prev]); 
            
            const prev = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            
            const img = new Image();
            img.onload = () => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0,0,10000,10000);
                ctx.drawImage(img,0,0);
            };
            img.src = prev;
        }
    };

    const redo = () => {
        if (redoHistory.length > 0) {
            const newRedo = [...redoHistory];
            const nextState = newRedo.shift();
            setHistory(prev => [...prev, nextState]);
            setRedoHistory(newRedo);

            const img = new Image();
            img.onload = () => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.clearRect(0, 0, 10000, 10000);
                ctx.drawImage(img, 0, 0);
            };
            img.src = nextState;
        }
    };

    const drawRemote = (ctx, data) => {
        const { tool, color, brushSize, points } = data;
        ctx.strokeStyle = tool === 'eraser' ? '#f0f0f0' : color; 
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if(points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for(let i=1; i<points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
        ctx.stroke();
    };

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { 
            id: Date.now(), 
            sender, 
            text, 
            timestamp: new Date() 
        }]);
    };

    const handleSendMessage = (text) => {
        if(socket) {
            socket.emit('chat-message', { roomCode: roomId, sender: user.username, text });
            addMessage(user.username, text);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/auth');
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="whiteboard-room">
            <header className="whiteboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <button className="back-btn" onClick={() => navigate("/dashboard")}>
                            <span className="back-arrow">←</span>
                            Dashboard
                        </button>
                        <div className="room-info">
                            <span className="room-label">Room:</span>
                            <span className="room-code">{roomId}</span>
                        </div>
                    </div>
                    
                    <div className="header-center">
                        <div className="active-users">
                            <span className="users-count">{roomUsers.length}</span>
                            <span className="users-label">Users Online</span>
                        </div>
                    </div>

                    <div className="header-right">
                        <UserList users={roomUsers} />
                        <button onClick={handleLogout} className="logout-btn">
                            <span className="logout-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="whiteboard-content">
                <div className="tools-section">
                    <Toolbar
                        drawingTool={drawingTool}
                        onClear={clearCanvas}
                        onExport={handleExport}
                        onUndo={undo}
                        onRedo={redo}
                        onSave={saveBoard}
                        canUndo={history.length > 1}
                        canRedo={redoHistory.length > 0}
                    />
                </div>

                <div className="canvas-section">
                    <div className="canvas-container">
                        <Canvas ref={canvasRef} drawingTool={drawingTool} className="drawing-canvas" />
                    </div>
                </div>

                <div className="chat-section">
                    <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
};


export default WhiteboardRoom;
