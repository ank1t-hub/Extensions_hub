import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUsers, updateUserStatus } from "../../services/adminService.js";
import Badge from "../../components/common/Badge.jsx";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUsers();
        setUsers(data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch registered users list.");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);
      setError("");
      const updated = await updateUserStatus(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      setError(err.message || "Failed to update user role permissions.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      setUpdatingUserId(userId);
      setError("");
      const updated = await updateUserStatus(userId, { is_active: !currentStatus });
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    } catch (err) {
      setError(err.message || "Failed to update user active status.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted">
        <div className="w-8 h-8 rounded-full border-2 border-t-black dark:border-t-white border-zinc-200 dark:border-zinc-800 animate-spin" />
        <span className="text-sm font-medium">Loading users list...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-muted mb-1">
          <Link to="/admin" className="hover:text-black dark:hover:text-white transition-colors">
            Admin Dashboard
          </Link>
          <span>/</span>
          <span>Manage Users</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-zinc-50">
          User Profiles Directory
        </h1>
        <p className="text-xs text-muted mt-1">
          Update authorization roles, view registered profiles, and suspend/restore accounts.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-600 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Users table */}
      <div className="border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-950 text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-zinc-900/50 border-b border-neutral-100 dark:border-zinc-900 text-muted font-bold">
                <th className="p-4">Profile</th>
                <th className="p-4">Status</th>
                <th className="p-4">Access Level Role</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4 text-right">Administrative Toggles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-zinc-900">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/30 dark:hover:bg-zinc-900/20 transition-colors">
                  
                  {/* Name and Email */}
                  <td className="p-4">
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-zinc-100">{u.username}</span>
                      <p className="text-[10px] text-muted font-mono mt-0.5">{u.email}</p>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <Badge variant={u.is_active ? "success" : "danger"}>
                      {u.is_active ? "Active" : "Suspended"}
                    </Badge>
                  </td>

                  {/* Role dropdown select */}
                  <td className="p-4">
                    <select
                      value={u.role}
                      disabled={updatingUserId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-semibold focus:outline-none transition-all"
                    >
                      <option value="user">User</option>
                      <option value="developer">Developer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>

                  {/* Registered Date */}
                  <td className="p-4 text-muted">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>

                  {/* Disable/Restore Toggles */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(u.id, u.is_active)}
                      disabled={updatingUserId === u.id}
                      className={`px-3 py-1.5 rounded-lg font-semibold border shadow-sm transition-all ${
                        u.is_active
                          ? "bg-red-50 text-red-600 border-red-100 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400"
                      }`}
                    >
                      {updatingUserId === u.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-t-transparent border-current rounded-full animate-spin" />
                      ) : u.is_active ? (
                        "Suspend Account"
                      ) : (
                        "Restore Access"
                      )}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
