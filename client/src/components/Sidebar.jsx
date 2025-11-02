import { NavLink } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";

export default function Sidebar({ user }) {
  const links = [
    { path: "/chat", label: "Chat" },
    { path: "/cases", label: "My Cases" },
    { path: "/judgments", label: "Judgments" },
    { path: "/reminders", label: "Reminders" },
    { path: "/profile", label: "Profile" },
  ];
  if (user?.role === "admin") links.push({ path: "/admin", label: "Admin Panel" });

  return (
    <div className="h-[100dvh] w-64 flex flex-col">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-neutral-800 text-indigo-300 flex items-center justify-center ring-1 ring-white/10">
            <FaBalanceScale className="text-base" />
          </div>
          <span className="text-lg font-semibold text-slate-100">LexiBot</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  [
                    "block w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                    "border border-white/10 bg-neutral-900/40 hover:bg-neutral-900/60",
                    isActive
                      ? "text-white bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/20 ring-1 ring-white/10"
                      : "text-slate-300",
                  ].join(" ")
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer (optional) */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-neutral-800 text-slate-200 ring-1 ring-white/10 flex items-center justify-center">
            {(user?.name || "U").split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase()}
          </div>
        <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">
              {user?.name || "User"}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
