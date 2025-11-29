import React, { useEffect, useRef } from 'react';

const MessageList = ({ messages, currentUserId, typingUsers }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${msg.system ? 'system' : msg.senderId === currentUserId ? 'sent' : 'received'}`}
        >
          {!msg.system && (
            <div className="message-header">
              <span className="sender-name">{msg.sender}</span>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
          )}
          <div className="message-content">
            {msg.image && (
              <div className="message-image">
                <img src={msg.image} alt="Shared" />
              </div>
            )}
            {msg.message && <p>{msg.message}</p>}
          </div>
        </div>
      ))}
      
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
