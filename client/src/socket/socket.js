// socket.js - Socket.io client setup

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

// Socket.io connection URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({}); // { userId: [messages] }
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null); // null = global
  const [unreadCounts, setUnreadCounts] = useState({});

  // Sound effect
  const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2346/2346-preview.mp3');

  // Connect to socket server
  const connect = (username) => {
    socket.connect();
    if (username) {
      socket.emit('user_join', username);
    }
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
    setMessages([]);
    setPrivateMessages({});
    setCurrentRoom(null);
    setUnreadCounts({});
  };

  // Join a room
  const joinRoom = (room) => {
    if (currentRoom) {
      socket.emit('leave_room', currentRoom);
    }
    socket.emit('join_room', room);
    setCurrentRoom(room);
    setMessages([]); // Clear messages when switching rooms (optional)
  };

  // Leave a room (return to global)
  const leaveRoom = () => {
    if (currentRoom) {
      socket.emit('leave_room', currentRoom);
      setCurrentRoom(null);
      setMessages([]);
    }
  };

  // Send a message
  const sendMessage = (message) => {
    socket.emit('send_message', { message, room: currentRoom });
  };

  // Send a private message
  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
    // Optimistically add to local state
    const myMsg = {
      id: Date.now(),
      sender: 'Me',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
      to
    };
    setPrivateMessages(prev => ({
      ...prev,
      [to]: [...(prev[to] || []), myMsg]
    }));
  };

  // Set typing status
  const setTyping = (isTyping) => {
    socket.emit('typing', { isTyping, room: currentRoom });
  };

  // Mark messages as read
  const markAsRead = (userId) => {
    setUnreadCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[userId];
      return newCounts;
    });
  };

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Message events
    const onReceiveMessage = (message) => {
      // If message belongs to current room (or global if currentRoom is null)
      if (message.room === currentRoom || (!message.room && !currentRoom)) {
        setMessages((prev) => [...prev, message]);
        
        // Play sound for incoming messages (not from self)
        if (message.senderId !== socket.id) {
          notificationSound.play().catch(e => console.error("Audio play failed", e));
          
          // Browser notification if hidden
          if (document.hidden && Notification.permission === 'granted') {
            new Notification(`New message in ${message.room ? '#' + message.room : 'Global Chat'}`, {
              body: `${message.sender}: ${message.message}`
            });
          }
        }
      }
    };

    const onPrivateMessage = (message) => {
      const otherId = message.senderId === socket.id ? message.to : message.senderId;
      setPrivateMessages(prev => ({
        ...prev,
        [otherId]: [...(prev[otherId] || []), message]
      }));

      // Handle notifications for received messages
      if (message.senderId !== socket.id) {
        // Increment unread count
        setUnreadCounts(prev => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        }));

        // Play sound
        notificationSound.play().catch(e => console.error("Audio play failed", e));

        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification(`Private message from ${message.sender}`, {
            body: message.message
          });
        }
      }
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      // Only show global join messages if in global chat
      if (!currentRoom) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            system: true,
            message: `${user.username} joined the chat`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    const onUserLeft = (user) => {
      if (!currentRoom) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            system: true,
            message: `${user.username} left the chat`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    };

    // Typing events
    const onTypingUpdate = ({ userId, username, isTyping, room }) => {
      // Filter by current room
      if (room !== currentRoom && (room || currentRoom)) return;
      
      setTypingUsers(prev => {
        if (isTyping) {
          if (!prev.includes(username)) return [...prev, username];
          return prev;
        } else {
          return prev.filter(u => u !== username);
        }
      });
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_update', onTypingUpdate);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_update', onTypingUpdate);
    };
  }, [currentRoom]); // Re-run effect when room changes to ensure correct filtering

  return {
    socket,
    isConnected,
    messages,
    privateMessages,
    users,
    typingUsers,
    currentRoom,
    unreadCounts,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    markAsRead,
  };
};

export default socket; 