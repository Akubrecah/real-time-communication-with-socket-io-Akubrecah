import { useState } from 'react';
import { useSocket } from './socket/socket';
import ChatRoom from './components/ChatRoom';
import './App.css';

function App() {
  const { 
    isConnected, 
    connect, 
    disconnect, 
    socket,
    messages,
    privateMessages,
    users,
    typingUsers,
    currentRoom,
    unreadCounts,
    sendMessage,
    sendPrivateMessage,
    joinRoom,
    leaveRoom,
    setTyping,
    markAsRead
  } = useSocket();
  
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'private'
  const [selectedUser, setSelectedUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username);
      setIsLoggedIn(true);
      // Request notification permission
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
  };

  const handleLogout = () => {
    disconnect();
    setIsLoggedIn(false);
    setUsername('');
    setActiveTab('rooms');
    setSelectedUser(null);
  };

  const handleUserSelect = (user) => {
    if (user.id === socket?.id) return;
    setSelectedUser(user);
    setActiveTab('private');
    markAsRead(user.id);
  };

  const handleJoinRoom = (room) => {
    joinRoom(room);
    setActiveTab('rooms');
    setSelectedUser(null);
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setActiveTab('rooms');
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <div className="login-screen">
          <div className="login-container">
            <h1>Socket.io Chat</h1>
            <p>Join the conversation</p>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
              <button type="submit">Join Chat</button>
            </form>
          </div>
        </div>
      ) : (
        <ChatRoom 
          messages={messages}
          privateMessages={privateMessages}
          users={users}
          typingUsers={typingUsers}
          currentUserId={socket?.id}
          currentRoom={currentRoom}
          unreadCounts={unreadCounts}
          activeTab={activeTab}
          selectedUser={selectedUser}
          onSendMessage={sendMessage}
          onSendPrivateMessage={sendPrivateMessage}
          onJoinRoom={handleJoinRoom}
          onLeaveRoom={handleLeaveRoom}
          onTyping={setTyping}
          onLogout={handleLogout}
          onSelectUser={handleUserSelect}
        />
      )}
    </div>
  );
}

export default App;
