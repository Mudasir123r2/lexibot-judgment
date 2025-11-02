import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import api from "../../api/http";
import { FiUsers, FiCheckCircle, FiXCircle, FiTrash2, FiMail, FiUser } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, verified: 0, unverified: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
      setStats(data.stats);
      setStatus({ message: "", type: "" });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Failed to load users",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      setActionLoading(userId);
      await api.put(`/admin/users/${userId}/activate`);
      await fetchUsers();
      setStatus({ message: "User activated successfully", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Failed to activate user",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      setActionLoading(userId);
      await api.put(`/admin/users/${userId}/deactivate`);
      await fetchUsers();
      setStatus({ message: "User deactivated successfully", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Failed to deactivate user",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(userId);
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
      setStatus({ message: "User deleted successfully", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Failed to delete user",
        type: "error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-900/30 text-purple-300 border-purple-500/30";
      case "advocate":
        return "bg-blue-900/30 text-blue-300 border-blue-500/30";
      default:
        return "bg-green-900/30 text-green-300 border-green-500/30";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Panel - User Management</h1>

        {/* Status Message */}
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              status.type === "success"
                ? "bg-green-900/20 text-green-200 border border-green-500/30"
                : "bg-red-900/20 text-red-200 border border-red-500/30"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Stats halo card */}
        <div className="relative mb-8">
          <div className="absolute -inset-[2px] rounded-3xl bg-[conic-gradient(from_140deg,rgba(99,102,241,.35),rgba(236,72,153,.35),rgba(16,185,129,.35),rgba(99,102,241,.35))] blur opacity-70" />
          <div className="relative rounded-3xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-5 sm:p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiUsers className="text-indigo-400" />
              System Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-4">
                <div className="text-slate-400 text-sm">Total Users</div>
                <div className="text-2xl font-extrabold mt-1">{stats.total}</div>
              </div>
              <div className="rounded-2xl border border-green-500/30 bg-green-900/20 p-4">
                <div className="text-green-400 text-sm">Active</div>
                <div className="text-2xl font-extrabold mt-1 text-green-300">{stats.active}</div>
              </div>
              <div className="rounded-2xl border border-red-500/30 bg-red-900/20 p-4">
                <div className="text-red-400 text-sm">Inactive</div>
                <div className="text-2xl font-extrabold mt-1 text-red-300">{stats.inactive}</div>
              </div>
              <div className="rounded-2xl border border-blue-500/30 bg-blue-900/20 p-4">
                <div className="text-blue-400 text-sm">Verified</div>
                <div className="text-2xl font-extrabold mt-1 text-blue-300">{stats.verified}</div>
              </div>
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-900/20 p-4">
                <div className="text-yellow-400 text-sm">Unverified</div>
                <div className="text-2xl font-extrabold mt-1 text-yellow-300">{stats.unverified}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="relative">
          <div className="absolute -inset-[2px] rounded-3xl bg-[conic-gradient(from_140deg,rgba(99,102,241,.35),rgba(236,72,153,.35),rgba(16,185,129,.35),rgba(99,102,241,.35))] blur opacity-70" />
          <div className="relative rounded-3xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-5 sm:p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiUsers className="text-indigo-400" />
              All Users ({users.length})
            </h2>

            {users.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Email Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-white/5 hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center">
                              <FiUser className="text-slate-400" />
                            </div>
                            <span className="text-slate-200">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-slate-300">
                            <FiMail className="text-slate-500" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {user.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-900/30 text-green-300 border border-green-500/30">
                              <FiCheckCircle /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-red-900/30 text-red-300 border border-red-500/30">
                              <FiXCircle /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {user.isEmailVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-500/30">
                              <FaCheckCircle /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-yellow-900/30 text-yellow-300 border border-yellow-500/30">
                              <FaTimesCircle /> Unverified
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <button
                                onClick={() => handleDeactivate(user._id)}
                                disabled={actionLoading === user._id}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-yellow-900/30 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-900/50 disabled:opacity-50"
                              >
                                {actionLoading === user._id ? "..." : "Deactivate"}
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(user._id)}
                                disabled={actionLoading === user._id}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-900/30 text-green-300 border border-green-500/30 hover:bg-green-900/50 disabled:opacity-50"
                              >
                                {actionLoading === user._id ? "..." : "Activate"}
                              </button>
                            )}
                            {user.role !== "admin" && (
                              <button
                                onClick={() => handleDelete(user._id)}
                                disabled={actionLoading === user._id}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-900/30 text-red-300 border border-red-500/30 hover:bg-red-900/50 disabled:opacity-50 flex items-center gap-1"
                              >
                                <FiTrash2 /> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
