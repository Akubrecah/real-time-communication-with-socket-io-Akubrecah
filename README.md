# Real-Time Chat Application

A modern, full-stack real-time messaging platform built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. Features a futuristic UI, private messaging, image sharing, and robust authentication.

![Chat Interface](./screenshots/chat_interface.png)

## 🚀 Features

### Core Functionality
- **Real-time Messaging**: Instant communication powered by Socket.io.
- **Secure Authentication**: JWT-based login and registration system.
- **Global Chat**: Public room for all connected users.
- **Active User List**: Real-time tracking of online users.
- **Typing Indicators**: Visual cues when others are typing.

### Advanced Capabilities
- **Private Messaging**: Secure direct messages between users.
- **Custom Rooms**: Create and join specific topic rooms.
- **Rich Media**: Support for sending and viewing images.
- **Smart Notifications**:
  - Browser notifications for background activity.
  - In-app badges for unread messages.
  - System alerts for user joins/leaves.
- **Premium UI/UX**:
  - Glassmorphism design with dynamic backgrounds.
  - Responsive layout for all devices.
  - Seamless dark mode aesthetic.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, CSS3 (Custom Glassmorphism)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Auth**: JWT, Bcrypt

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local instance running on port 27018 or Atlas URI)

## ⚙️ Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd real-time-communication-with-socket-io-Akubrecah
   ```

2. **Server Setup**
   ```bash
   cd server
   npm install
   # Ensure MongoDB is running on port 27018 or update .env
   npm run dev
   ```

3. **Client Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the App**
   Open `http://localhost:5173` in your browser.

## 📖 Usage

1. **Register/Login**: Create an account to get started.
2. **Join the Conversation**: Post in the Global Chat or create a new room.
3. **Connect Privately**: Click any user in the sidebar to start a private chat.
4. **Share Moments**: Use the attachment button to send images.

## 📸 Screenshots

| Login Page | Register Page |
|:---:|:---:|
| ![Login](./screenshots/login_page.png) | ![Register](./screenshots/register_page.png) |

## 📂 Project Structure

```
├── client/                 # React Frontend
│   ├── public/            # Static assets (backgrounds)
│   ├── src/
│   │   ├── components/    # React Components (ChatRoom, Login, etc.)
│   │   ├── socket/        # Socket.io client configuration
│   │   ├── App.jsx        # Main App Component & Routing
│   │   ├── App.css        # Global Styles
│   │   └── main.jsx       # Entry Point
│   └── package.json
├── server/                 # Node.js Backend
│   ├── models/            # Mongoose Models (User)
│   ├── routes/            # Express Routes (Auth)
│   ├── server.js          # Main Server Entry Point (Socket.io logic)
│   ├── .env               # Environment Variables
│   └── package.json
├── screenshots/           # Application preview images
└── README.md              # Project Documentation
```