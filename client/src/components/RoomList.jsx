import React, { useState } from 'react';

const RoomList = ({ currentRoom, onJoinRoom, onLeaveRoom }) => {
  const [newRoom, setNewRoom] = useState('');
  const rooms = ['General', 'Tech', 'Random', 'Music']; // Predefined rooms for now

  const handleJoin = (room) => {
    if (room === currentRoom) return;
    onJoinRoom(room);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (newRoom.trim()) {
      onJoinRoom(newRoom.trim());
      setNewRoom('');
    }
  };

  return (
    <div className="room-list-sidebar">
      <h3>Chat Rooms</h3>
      <div className="active-room-indicator">
        {currentRoom ? `Current: ${currentRoom}` : 'Current: Global Chat'}
        {currentRoom && <button onClick={onLeaveRoom} className="leave-room-btn">Exit</button>}
      </div>
      
      <ul className="room-list">
        <li 
          className={!currentRoom ? 'active' : ''} 
          onClick={onLeaveRoom}
        >
          # Global Chat
        </li>
        {rooms.map(room => (
          <li 
            key={room} 
            className={currentRoom === room ? 'active' : ''}
            onClick={() => handleJoin(room)}
          >
            # {room}
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreate} className="create-room-form">
        <input
          type="text"
          placeholder="Join/Create Room..."
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
        />
        <button type="submit">+</button>
      </form>
    </div>
  );
};

export default RoomList;
