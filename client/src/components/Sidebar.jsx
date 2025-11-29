import React, { useState } from 'react';

const Sidebar = ({ 
  currentRoom, 
  users, 
  onJoinRoom, 
  onLeaveRoom, 
  onSelectUser, 
  selectedUser, 
  unreadCounts,
  currentUserId 
}) => {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' (DMs) or 'rooms'
  const [newRoom, setNewRoom] = useState('');
  
  const rooms = ['General', 'Tech', 'Random', 'Music', 'Gaming', 'Design'];

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoom.trim()) {
      onJoinRoom(newRoom.trim());
      setNewRoom('');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="app-logo">
          <span className="logo-icon">⚡</span>
          <h2>NeonChat</h2>
        </div>
      </div>

      <div className="sidebar-tabs">
        <button 
          className={`tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          Direct Messages
        </button>
        <button 
          className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Rooms
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'chats' ? (
          <div className="users-list">
            {users.filter(u => u.id !== currentUserId).length === 0 ? (
              <div className="empty-state">No other users online</div>
            ) : (
              users.map(user => {
                if (user.id === currentUserId) return null;
                return (
                  <div 
                    key={user.id} 
                    className={`sidebar-item ${selectedUser?.id === user.id ? 'active' : ''}`}
                    onClick={() => onSelectUser(user)}
                  >
                    <div className="avatar">
                      {user.username.charAt(0).toUpperCase()}
                      <span className="status-dot online"></span>
                    </div>
                    <div className="item-info">
                      <span className="item-name">{user.username}</span>
                      <span className="item-status">Online</span>
                    </div>
                    {unreadCounts[user.id] > 0 && (
                      <span className="unread-badge">{unreadCounts[user.id]}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="rooms-list">
            <div 
              className={`sidebar-item ${!currentRoom ? 'active' : ''}`}
              onClick={onLeaveRoom}
            >
              <div className="avatar room-avatar">#</div>
              <div className="item-info">
                <span className="item-name">Global Chat</span>
                <span className="item-status">Public Channel</span>
              </div>
            </div>
            
            {rooms.map(room => (
              <div 
                key={room} 
                className={`sidebar-item ${currentRoom === room ? 'active' : ''}`}
                onClick={() => onJoinRoom(room)}
              >
                <div className="avatar room-avatar">#</div>
                <div className="item-info">
                  <span className="item-name">{room}</span>
                  <span className="item-status">Channel</span>
                </div>
              </div>
            ))}

            <form onSubmit={handleCreateRoom} className="create-room-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Find or create a room..."
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                />
                <button type="submit">
                  <span className="plus-icon">+</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <div className="current-user-profile">
        <div className="avatar me-avatar">
          {users.find(u => u.id === currentUserId)?.username.charAt(0).toUpperCase() || 'M'}
        </div>
        <div className="user-info">
          <span className="username">You</span>
          <span className="status">Online</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
