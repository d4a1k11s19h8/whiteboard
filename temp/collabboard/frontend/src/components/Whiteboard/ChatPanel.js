import React, { useState, useRef, useEffect } from 'react';
import './ChatPanel.css';

const ChatPanel = ({ messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <h3>Chat</h3>
            </div>
            
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map(message => (
                        <div 
                            key={message.id} 
                            className={`message ${message.sender === 'system' ? 'system-message' : ''}`}
                        >
                            {message.sender !== 'system' && (
                                <div className="message-sender">{message.sender}</div>
                            )}
                            <div className="message-content">
                                {message.text}
                            </div>
                            <div className="message-time">
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="chat-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="chat-input"
                />
                <button type="submit" className="send-btn">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatPanel;