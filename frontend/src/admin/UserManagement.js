import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:5000/users", {
      headers: { "x-token": token }
    });
    setUsers(response.data);
  };

  const searchUsers = async () => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `http://localhost:5000/users/search?query=${searchQuery}`,
      {
        headers: { "x-token": token }
      }
    );
    setUsers(response.data);
  };

  const updateUserRole = async (id) => {
    const token = localStorage.getItem("authToken");
    await axios.patch(
      `http://localhost:5000/users/${id}/role`,
      { role: newRole },
      {
        headers: { "x-token": token }
      }
    );
    fetchUsers();
  };

  const updateUserStatus = async (id) => {
    const token = localStorage.getItem("authToken");
    await axios.patch(
      `http://localhost:5000/users/${id}/status`,
      { status: newStatus },
      {
        headers: { "x-token": token }
      }
    );
    fetchUsers();
  };

  const resetPassword = async (id) => {
    const token = localStorage.getItem("authToken");
    await axios.patch(
      `http://localhost:5000/users/${id}/reset-password`,
      { newPassword },
      {
        headers: { "x-token": token }
      }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    const token = localStorage.getItem("authToken");
    await axios.delete(`http://localhost:5000/users/${id}`, {
      headers: { "x-token": token }
    });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>User Management</h1>

      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchUsers}>Search</button>

      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username} - {user.email} - {user.role} - {user.status}
            <button onClick={() => setSelectedUser(user)}>View</button>
            <button onClick={() => updateUserRole(user._id)}>
              Change Role
            </button>
            <button onClick={() => updateUserStatus(user._id)}>
              Change Status
            </button>
            <button onClick={() => resetPassword(user._id)}>
              Reset Password
            </button>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div>
          <h3>Update {selectedUser.username}'s Info</h3>
          <input
            type="text"
            placeholder="New Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={() => updateUserRole(selectedUser._id)}>
            Update Role
          </button>
          <button onClick={() => updateUserStatus(selectedUser._id)}>
            Update Status
          </button>
          <button onClick={() => resetPassword(selectedUser._id)}>
            Reset Password
          </button>
          <button onClick={() => deleteUser(selectedUser._id)}>
            Delete User
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
