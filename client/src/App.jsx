import { useState, useEffect } from 'react';
import { useSocket } from './socket/socket';
import './App.css';

function App() {
  const { isConnected, connect, disconnect, socket } = useSocket();
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
      <header>
        <h1>Socket.io Chat</h1>
        <div className={`status ${isConnected ? 'online' : 'offline'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      <main>
        {!isLoggedIn ? (
          <div className="login-container">
            <h2>Join Chat</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <button type="submit">Join</button>
            </form>
          </div>
        ) : (
          <div className="chat-container">
            <div className="welcome-message">
              Welcome, <strong>{username}</strong>!
            </div>
            <button onClick={handleLogout} className="logout-btn">Leave Chat</button>
            <div className="debug-info">
              <p>Socket ID: {socket?.id}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
