import React from 'react';

const UserList = ({ users }) => {
  return (
    <div className="user-list-sidebar">
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
            <span className="username">{user.username}</span>
            {user.id === 'me' && <span className="me-badge">(You)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
