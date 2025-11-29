import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

const ChatRoom = ({ 
  messages, 
  users, 
  typingUsers, 
  currentUserId, 
  onSendMessage, 
  onTyping,
  onLogout 
}) => {
  // Filter out current user from typing users if present (optional, depending on server logic)
  // The server sends usernames of typing users.
  
  return (
    <div className="chat-room">
      <div className="chat-main">
        <header className="chat-header">
          <h2>Global Chat</h2>
          <button onClick={onLogout} className="logout-btn-small">Leave</button>
        </header>
        <MessageList 
          messages={messages} 
          currentUserId={currentUserId} 
          typingUsers={typingUsers} 
        />
        <MessageInput 
          onSendMessage={onSendMessage} 
          onTyping={onTyping} 
        />
      </div>
      <UserList users={users} />
    </div>
  );
};

export default ChatRoom;
