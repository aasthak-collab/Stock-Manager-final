"use client";

import { useEffect, useState } from "react";
import api from "../../libraries/axios";
import { Trash2, UserPlus, Key, Shield } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/settings/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }, []);

  const handleAddUser = async () => {
    setError("");
    try {
      await api.post("/api/settings/users", userForm);
      setUserForm({ name: "", email: "", password: "", role: "staff" });
      setShowAddUser(false);
      setSuccess("User added successfully!");
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      await api.delete(`/api/settings/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    setError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return;
    }
    try {
      await api.post("/api/settings/change-password", {
        email: currentUser?.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
      setSuccess("Password changed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to change password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-beige text-2xl font-bold">Settings</h2>
        <p className="text-soft text-sm mt-1">Manage users, password and app preferences</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          <p className="text-green-600 text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Current User Card */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg">
              {currentUser?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-beige font-semibold">{currentUser?.name}</p>
              <p className="text-soft text-sm">{currentUser?.email}</p>
              <span className="bg-blue-50 text-primary text-xs px-2 py-0.5 rounded-full mt-1 inline-block">
                {currentUser?.role}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="flex items-center gap-2 border border-gray-200 text-soft px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              <Key size={14} />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-xl text-sm hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        {showChangePassword && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
            <h4 className="text-beige font-medium text-sm">Change Password</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="bg-gray-50 border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              >
                Update Password
              </button>
              <button
                onClick={() => setShowChangePassword(false)}
                className="border border-gray-200 text-soft px-5 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Management */}
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <h3 className="text-beige font-semibold">User Management</h3>
          </div>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
          >
            <UserPlus size={14} />
            Add User
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">Full Name</label>
                <input
                  placeholder="Enter name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="bg-white border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="bg-white border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">Password</label>
                <input
                  type="password"
                  placeholder="Set password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="bg-white border border-gray-200 text-beige placeholder:text-soft/40 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-soft text-xs">Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="bg-white border border-gray-200 text-beige rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddUser}
                className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
              >
                Add User
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="border border-gray-200 text-soft px-5 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-soft py-3 font-medium">Name</th>
              <th className="text-left text-soft py-3 font-medium">Email</th>
              <th className="text-left text-soft py-3 font-medium">Role</th>
              <th className="text-left text-soft py-3 font-medium">Added</th>
              <th className="text-left text-soft py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50">
                <td className="py-3 text-beige font-medium">{user.name}</td>
                <td className="py-3 text-soft">{user.email}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-blue-50 text-primary"
                      : "bg-gray-50 text-soft"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 text-soft text-xs">
                  {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="py-3">
                  {user.email !== currentUser?.email && (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}