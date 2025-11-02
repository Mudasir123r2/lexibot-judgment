import DashboardLayout from "../../layout/DashboardLayout";
import { useState, useEffect } from "react";
import { FaPlus, FaCheckCircle, FaTimesCircle, FaCalendar, FaExclamationTriangle } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import api from "../../api/http";

export default function RemindersDashboard() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    caseId: ""
  });
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetchReminders();
    fetchCases();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/reminders");
      setReminders(data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const { data } = await api.get("/cases");
      setCases(data);
    } catch (err) {
      console.error("Error fetching cases:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reminders", {
        ...formData,
        caseId: formData.caseId || undefined
      });
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        caseId: ""
      });
      fetchReminders();
    } catch (err) {
      console.error("Error creating reminder:", err);
      alert(err.response?.data?.message || "Failed to create reminder");
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.patch(`/reminders/${id}/complete`);
      fetchReminders();
    } catch (err) {
      console.error("Error completing reminder:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reminder?")) return;
    try {
      await api.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const isUpcoming = (dueDate) => {
    const daysUntil = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 3;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60dvh] grid place-items-center">
          <FiLoader className="h-12 w-12 text-indigo-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const upcomingReminders = reminders.filter(r => !r.isCompleted && (isUpcoming(r.dueDate) || isOverdue(r.dueDate)));
  const completedReminders = reminders.filter(r => r.isCompleted);
  const otherReminders = reminders.filter(r => !r.isCompleted && !isUpcoming(r.dueDate) && !isOverdue(r.dueDate));

  return (
    <DashboardLayout>
      <div className="relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Reminders</h1>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            <FaPlus /> New Reminder
          </button>
        </div>

        {/* Upcoming/Overdue */}
        {upcomingReminders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaExclamationTriangle className="text-yellow-500" />
              Upcoming / Overdue
            </h2>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className={`rounded-xl p-4 border-2 ${isOverdue(reminder.dueDate) ? "border-rose-500/50 bg-rose-900/20" : "border-yellow-500/50 bg-yellow-900/20"}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{reminder.title}</h3>
                      {reminder.description && (
                        <p className="text-sm text-slate-300 mt-1">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <FaCalendar /> {new Date(reminder.dueDate).toLocaleDateString()}
                        </span>
                        {reminder.caseId && (
                          <span>Case: {reminder.caseId.title || "N/A"}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(reminder._id)}
                        className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() => handleDelete(reminder._id)}
                        className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Reminders */}
        {otherReminders.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">All Reminders</h2>
            <div className="space-y-3">
              {otherReminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="rounded-xl p-4 border border-white/10 bg-neutral-900/50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{reminder.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority}
                        </span>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-slate-300 mt-1">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <FaCalendar /> {new Date(reminder.dueDate).toLocaleDateString()}
                        </span>
                        {reminder.caseId && (
                          <span>Case: {reminder.caseId.title || "N/A"}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(reminder._id)}
                        className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400"
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        onClick={() => handleDelete(reminder._id)}
                        className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                      >
                        <FaTimesCircle />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-400 mb-3">Completed</h2>
            <div className="space-y-3">
              {completedReminders.map((reminder) => (
                <div
                  key={reminder._id}
                  className="rounded-xl p-4 border border-white/10 bg-neutral-900/50 opacity-60"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-400 line-through">{reminder.title}</h3>
                        <FaCheckCircle className="text-green-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Completed on {new Date(reminder.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reminders.length === 0 && (
          <div className="rounded-2xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-12 text-center text-slate-400">
            <p>No reminders yet. Create your first reminder to track important deadlines.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 rounded-2xl ring-1 ring-white/10 p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">New Reminder</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Due Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Link to Case (Optional)</label>
                  <select
                    value={formData.caseId}
                    onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                  >
                    <option value="">No case linked</option>
                    {cases.map((caseItem) => (
                      <option key={caseItem._id} value={caseItem._id}>
                        {caseItem.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    Create Reminder
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 bg-neutral-800 hover:bg-neutral-700 text-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

