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
    users,
    typingUsers,
    sendMessage,
    setTyping
  } = useSocket();
  
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    disconnect();
    setIsLoggedIn(false);
    setUsername('');
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
          users={users}
          typingUsers={typingUsers}
          currentUserId={socket?.id}
          onSendMessage={sendMessage}
          onTyping={setTyping}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
