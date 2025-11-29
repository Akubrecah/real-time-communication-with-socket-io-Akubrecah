// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username) => {
    users[socket.id] = { username, id: socket.id };
    io.emit('user_list', Object.values(users));
    io.emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined the chat`);
  });

  // Handle joining a room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    // Notify room members
    const username = users[socket.id]?.username || 'Anonymous';
    io.to(room).emit('receive_message', {
      id: Date.now(),
      system: true,
      message: `${username} joined the room`,
      timestamp: new Date().toISOString(),
      room
    });
  });

  // Handle leaving a room
  socket.on('leave_room', (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room: ${room}`);
    const username = users[socket.id]?.username || 'Anonymous';
    io.to(room).emit('receive_message', {
      id: Date.now(),
      system: true,
      message: `${username} left the room`,
      timestamp: new Date().toISOString(),
      room
    });
  });

  // Handle chat messages (Global or Room)
  socket.on('send_message', (messageData) => {
    const { room, message: content, image } = messageData;
    
    const message = {
      message: content,
      image, // Add image to message object
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      room // undefined for global, string for specific room
    };
    
    if (room) {
      io.to(room).emit('receive_message', message);
    } else {
      messages.push(message);
      // Limit stored messages
      if (messages.length > 100) messages.shift();
      io.emit('receive_message', message);
    }
  });

  // Handle typing indicator
  socket.on('typing', ({ isTyping, room }) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = { username, room };
      } else {
        delete typingUsers[socket.id];
      }
      
      // Broadcast typing status
      // Ideally we should filter this by room on the client or server
      // For simplicity, we emit all and filter on client, or emit to room
      if (room) {
        socket.to(room).emit('typing_update', { userId: socket.id, username, isTyping, room });
      } else {
        socket.broadcast.emit('typing_update', { userId: socket.id, username, isTyping, room: null });
      }
      
      // Keep the old event for backward compatibility or global list if needed
      io.emit('typing_users', Object.values(typingUsers).map(u => u.username));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message, image }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      image, // Add image to private message object
      timestamp: new Date().toISOString(),
      isPrivate: true,
      to // Add recipient ID for client-side handling
    };
    
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      io.emit('user_left', { username, id: socket.id });
      console.log(`${username} left the chat`);
    }
    
    delete users[socket.id];
    delete typingUsers[socket.id];
    
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers).map(u => u.username));
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 