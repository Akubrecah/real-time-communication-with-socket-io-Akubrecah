import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';

const ChatRoom = ({ 
  messages, 
  privateMessages,
  users, 
  typingUsers, 
  currentUserId, 
  currentRoom,
  unreadCounts,
  activeTab,
  selectedUser,
  onSendMessage, 
  onSendPrivateMessage,
  onJoinRoom,
  onLeaveRoom,
  onTyping,
  onLogout,
  onSelectUser
}) => {
  
  const handleSendMessage = (text) => {
    if (activeTab === 'private' && selectedUser) {
      onSendPrivateMessage(selectedUser.id, text);
    } else {
      onSendMessage(text);
    }
  };

  const currentMessages = activeTab === 'private' && selectedUser 
    ? (privateMessages[selectedUser.id] || []) 
    : messages;

  const chatTitle = activeTab === 'private' && selectedUser
    ? `Chat with ${selectedUser.username}`
    : currentRoom 
      ? `# ${currentRoom}` 
      : '# Global Chat';

  return (
    <div className="chat-room">
      <Sidebar 
        currentRoom={currentRoom}
        users={users}
        onJoinRoom={onJoinRoom}
        onLeaveRoom={onLeaveRoom}
        onSelectUser={onSelectUser}
        selectedUser={selectedUser}
        unreadCounts={unreadCounts}
        currentUserId={currentUserId}
      />
      
      <div className="chat-main">
        <header className="chat-header">
          <h2>{chatTitle}</h2>
          <div className="header-actions">
             <button onClick={onLogout} className="logout-btn-small">Logout</button>
          </div>
        </header>
        
        <MessageList 
          messages={currentMessages} 
          currentUserId={currentUserId} 
          typingUsers={typingUsers} 
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage} 
          onTyping={onTyping} 
        />
      </div>
    </div>
  );
};

export default ChatRoom;
