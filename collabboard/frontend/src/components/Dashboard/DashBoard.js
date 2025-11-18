import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [savedBoards, setSavedBoards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const u = JSON.parse(userData);
            setUser(u);
            loadSavedBoards(u.id || u._id);
        } else {
            navigate('/auth');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/auth');
    };

    const loadSavedBoards = async (userId) => {
        try {
            const res = await api.get(`/whiteboards/user/${userId}/list`);
            const data = res.data || res;
            if (data.success) {
                setSavedBoards(data.boards);
            }
        } catch (err) {
            console.error("Failed to load boards", err);
        }
    };

    // Logic: Creating/Opening a snapshot creates a NEW room
    const createNewWhiteboard = async (savedSnapshot = null) => {
        setIsCreating(true);
        try {
            const response = await api.post('/whiteboards/create', {
                roomName: savedSnapshot ? savedSnapshot.name : 'My Whiteboard',
                userId: user.id || user._id
            });
            
            const data = response.data || response;
            if (data.success) {
                const newRoomCode = data.roomCode;
                if (savedSnapshot) {
                    navigate(`/whiteboard/${newRoomCode}`, { state: { savedSnapshot } });
                } else {
                    navigate(`/whiteboard/${newRoomCode}`);
                }
            }
        } catch (error) {
            alert('Failed to create whiteboard.');
        } finally {
            setIsCreating(false);
        }
    };

    // Logic: Joining an existing code RESUMES that room
    const joinWhiteboard = async (e) => {
        e.preventDefault();
        if (roomCode.trim()) {
            try {
                const response = await api.post(`/whiteboards/${roomCode}/join`, {
                    username: user.username,
                    userId: user.id || user._id
                });
                const data = response.data || response;
                if (data.success) {
                    navigate(`/whiteboard/${roomCode}`);
                } else {
                    alert('Room not found.');
                }
            } catch (error) {
                alert('Room not found.');
            }
        }
    };

    const deleteSavedBoard = async (versionId) => {
        if(!window.confirm("Delete this saved snapshot?")) return;
        try {
            await api.delete(`/whiteboards/saved/${versionId}`);
            loadSavedBoards(user.id || user._id);
        } catch(err) {
            alert("Failed to delete");
        }
    };

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-container">
                    <div className="header-main">
                        <div className="welcome-section">
                            <h1>Welcome, {user.username}!</h1>
                            <p>Start a new whiteboard or resume a session</p>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="container">
                    <div className="actions-row">
                        <div className="action-card create-card">
                            <div className="card-icon">🎨</div>
                            <h2>Create New Whiteboard</h2>
                            <p>Start fresh (Blank Canvas)</p>
                            <button onClick={() => createNewWhiteboard()} className="btn btn-primary" disabled={isCreating}>
                                {isCreating ? 'Creating...' : 'Create Whiteboard'}
                            </button>
                        </div>

                        <div className="action-card join-card">
                            <div className="card-icon">👥</div>
                            <h2>Join Existing Room</h2>
                            <p>Resume work on a specific room code</p>
                            <form onSubmit={joinWhiteboard} className="join-form">
                                <input type="text" className="form-input" placeholder="Enter room code..." value={roomCode} onChange={(e) => setRoomCode(e.target.value)} required />
                                <button type="submit" className="btn btn-secondary">Join Room</button>
                            </form>
                        </div>
                    </div>

                   <div className="saved-section">
                        <div className="section-title">
                            <h2>Saved Snapshots</h2>
                            <span className="count-badge">{savedBoards.length}</span>
                        </div>
                        
                        {savedBoards.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">📁</div>
                                <h3>No saved snapshots yet</h3>
                                <p>Click "Save" inside a whiteboard to create a snapshot here.</p>
                            </div>
                        ) : (
                            <div className="boards-grid">
                                {savedBoards.map((board) => (
                                    <div key={board._id} className="board-card">
                                        <div className="board-header">
                                            <img src={board.imageData} alt={board.name} className="board-thumbnail" />
                                            <div className="board-actions">
                                                <button className="btn-action btn-open" onClick={() => createNewWhiteboard(board)}>Open Copy</button>
                                                <button className="btn-action btn-delete" onClick={() => deleteSavedBoard(board._id)}>Delete</button>
                                            </div>
                                        </div>
                                        <div className="board-content">
                                            <h4 className="board-name">{board.name}</h4>
                                            <div className="board-info">
                                                <span>Saved: {new Date(board.savedAt).toLocaleDateString()}</span>
                                                <span style={{fontSize:'0.8rem', color:'#666', display:'block'}}>Orig: {board.roomCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;