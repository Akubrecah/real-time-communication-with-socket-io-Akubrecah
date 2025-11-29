import React, { useState, useEffect, useRef } from 'react';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [message, isTyping, onTyping]);

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('File size too large. Please select an image under 1MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || image) {
      onSendMessage(message, image);
      setMessage('');
      clearImage();
      setIsTyping(false);
      onTyping(false);
    }
  };

  return (
    <div className="message-input-container">
      {image && (
        <div className="image-preview">
          <img src={image} alt="Preview" />
          <button onClick={clearImage} className="remove-image-btn">×</button>
        </div>
      )}
      <form className="message-input-form" onSubmit={handleSubmit}>
        <button 
          type="button" 
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleChange}
        />
        <button type="submit" className="send-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
