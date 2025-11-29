// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware (additional)
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};

// Socket.io connection handler
  // Store timeouts for disconnecting users
  const disconnectTimeouts = {};

  // Handle user joining
  socket.on('user_join', (username) => {
    // Check if user is reconnecting (refreshing)
    if (disconnectTimeouts[username]) {
      clearTimeout(disconnectTimeouts[username]);
      delete disconnectTimeouts[username];
      
      // Find and remove old socket entry for this username
      const oldSocketId = Object.keys(users).find(id => users[id].username === username);
      if (oldSocketId) {
        delete users[oldSocketId];
      }
      
      users[socket.id] = { username, id: socket.id };
      io.emit('user_list', Object.values(users));
      console.log(`${username} reconnected`);
    } else {
      // New join
      users[socket.id] = { username, id: socket.id };
      io.emit('user_list', Object.values(users));
      io.emit('user_joined', { username, id: socket.id });
      console.log(`${username} joined the chat`);
    }
  });

  // ... (keep join_room, leave_room, send_message, typing, private_message handlers as is) ...

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const { username } = users[socket.id];
      
      // Set a grace period before announcing leave
      disconnectTimeouts[username] = setTimeout(() => {
        if (users[socket.id]) { // Check if still exists (might have been removed by reconnect)
          io.emit('user_left', { username, id: socket.id });
          console.log(`${username} left the chat`);
          delete users[socket.id];
          io.emit('user_list', Object.values(users));
          delete typingUsers[socket.id];
          io.emit('typing_users', Object.values(typingUsers).map(u => u.username));
        }
        delete disconnectTimeouts[username];
      }, 3000); // 3 second grace period
    }
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