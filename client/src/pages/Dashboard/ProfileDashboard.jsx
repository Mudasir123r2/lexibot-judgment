import { useContext, useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/http";
import { FaUser, FaEnvelope, FaFeatherAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ProfileDashboard() {
  const { user, updateUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", tone: "formal" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/profile");
        setForm({
          name: data.name || "",
          email: data.email || "",
          tone: data.preferences?.tone || "formal",
        });
      } catch (err) {
        setStatus({
          message: err.response?.data?.message || "Failed to load profile",
          type: "error",
        });
        if (user) {
          setForm({
            name: user.name || "",
            email: user.email || "",
            tone: user.preferences?.tone || "formal",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ message: "", type: "" });
    try {
      const { data } = await api.put("/profile", {
        name: form.name,
        email: form.email,
        preferences: { tone: form.tone, language: "English" },
      });
      updateUser(data.user);
      setStatus({ message: data.message || "Profile updated successfully!", type: "success" });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60dvh] grid place-items-center">
          <div className="h-12 w-12 rounded-full border-2 border-t-transparent border-indigo-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative w-full">
        {/* Background mesh */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_60%),radial-gradient(90%_70%_at_0%_0%,rgba(99,102,241,0.10)_0%,transparent_60%),radial-gradient(90%_70%_at_100%_0%,rgba(236,72,153,0.10)_0%,transparent_60%)]" />
          <div className="absolute -top-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/10 to-emerald-400/10 blur-3xl" />
        {/* fixed unclosed tag */}
        </div>
          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-fuchsia-600/15 to-indigo-600/10 blur-3xl" />
        </div>

        {/* Centered responsive container */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-6">Profile Management</h1>

          {/* Glass card with halo, full width of container */}
          <div className="relative w-full">
            <div className="absolute -inset-[2px] rounded-3xl bg-[conic-gradient(from_140deg,rgba(99,102,241,.35),rgba(236,72,153,.35),rgba(16,185,129,.35),rgba(99,102,241,.35))] blur opacity-70" />
            <div className="relative rounded-3xl ring-1 ring-white/10 bg-neutral-900/50 backdrop-blur-xl p-5 sm:p-6 md:p-7 lg:p-8">
              {/* Status banner */}
              {status.message ? (
                <div
                  className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "text-indigo-200 bg-indigo-900/20 border border-indigo-500/30"
                      : "text-rose-300 bg-rose-900/20 border border-rose-500/30"
                  }`}
                >
                  {status.type === "success" ? (
                    <FaCheckCircle className="text-indigo-300" />
                  ) : (
                    <FaTimesCircle className="text-rose-300" />
                  )}
                  <span className="break-words">{status.message}</span>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 pl-10 pr-3 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                      placeholder="Your full name"
                      minLength={2}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 pl-10 pr-3 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Changing your email may require verification.</p>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Tone Preference</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                      <FaFeatherAlt />
                    </span>
                    <select
                      name="tone"
                      value={form.tone}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-white/10 bg-neutral-900/60 text-slate-100 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-transparent"
                    >
                      <option value="formal">Formal</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Choose the tone for conversation interactions.</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="group relative flex-1 overflow-hidden rounded-xl px-5 py-2.5 font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.35)] bg-[linear-gradient(135deg,#4338CA_0%,#6D28D9_30%,#7C3AED_55%,#DB2777_100%)] hover:shadow-[0_10px_40px_rgba(236,72,153,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="relative z-10">{saving ? "Saving..." : "Save Changes"}</span>
                    <span className="absolute inset-0 translate-x-[-120%] group-hover:translate-x-0 transition-transform bg-white/10" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        name: user?.name || "",
                        email: user?.email || "",
                        tone: user?.preferences?.tone || "formal",
                      })
                    }
                    className="flex-1 rounded-xl px-5 py-2.5 font-semibold border border-white/15 bg-neutral-900/40 hover:bg-neutral-800/60"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
    </DashboardLayout>
  );
}
