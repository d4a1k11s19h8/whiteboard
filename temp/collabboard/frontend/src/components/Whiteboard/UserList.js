import React, { useState } from 'react';
import './UserList.css';

const UserList = ({ users }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="user-dropdown">
            <button 
                className="dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                👥 Users ({users.length})
                <span>▼</span>
            </button>
            
            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-header">
                        Online Users ({users.length})
                    </div>
                    {users.length === 0 ? (
                        <div className="no-users">No users online</div>
                    ) : (
                        users.map((user, index) => (
                            <div key={index} className="user-item">
                                <div className="user-avatar">
                                    {user.charAt(0).toUpperCase()}
                                </div>
                                <span className="username">{user}</span>
                                <div className="online-indicator"></div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default UserList;