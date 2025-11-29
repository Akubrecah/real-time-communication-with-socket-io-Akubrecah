import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';
import Login from './components/Login';
import Register from './components/Register';
import { useSocket } from './socket/socket';
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
  
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('rooms');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      connect(parsedUser.username);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    connect(userData.username);
    navigate('/chat');
    
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const handleLogout = () => {
    disconnect();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setActiveTab('rooms');
    setSelectedUser(null);
    navigate('/login');
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
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/chat" />} />
        <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/chat" />} />
        <Route 
          path="/chat" 
          element={
            user ? (
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
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route path="/" element={<Navigate to={user ? "/chat" : "/login"} />} />
      </Routes>
    </div>
  );
}

export default App;
