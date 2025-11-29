import React from 'react';

const UserList = ({ users, onSelectUser, selectedUser, unreadCounts = {} }) => {
  return (
    <div className="user-list-sidebar">
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map((user) => (
          <li 
            key={user.id} 
            className={`user-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
            onClick={() => user.id !== 'me' && onSelectUser && onSelectUser(user)}
          >
            <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="username">{user.username}</span>
              {user.id === 'me' && <span className="me-badge">(You)</span>}
            </div>
            {unreadCounts[user.id] > 0 && (
              <span className="unread-badge">{unreadCounts[user.id]}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
