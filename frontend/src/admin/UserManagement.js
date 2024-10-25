import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, [filterRole, searchQuery]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: {
          "x-token": token
        },
        params: { role: filterRole, search: searchQuery }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle role update (promote/demote user roles)
  const updateUserRole = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}/role`, {
        role: newRole
      });
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  // Handle account activation/deactivation
  const updateUserStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/users/${id}/status`, {
        status: newStatus
      });
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Handle user deletion
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>

      {/* Filters */}
      <div className="filters">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status === "active" ? "Active" : "Inactive"}</td>
              <td>
                {/* Update Role */}
                <button
                  onClick={() =>
                    updateUserRole(
                      user._id,
                      user.role === "student" ? "teacher" : "student"
                    )
                  }
                >
                  {user.role === "student"
                    ? "Promote to Teacher"
                    : "Demote to Student"}
                </button>

                {/* Activate/Deactivate */}
                <button
                  onClick={() =>
                    updateUserStatus(
                      user._id,
                      user.status === "active" ? "inactive" : "active"
                    )
                  }
                >
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </button>

                {/* Delete User */}
                <button onClick={() => deleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
