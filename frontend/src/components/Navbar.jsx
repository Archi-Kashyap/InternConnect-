import { NavLink, Link } from "react-router-dom";

const tabs = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/jobs", label: "Jobs", icon: "💼" },
  { to: "/skills", label: "Skills", icon: "🧠" },
  { to: "/applications", label: "Applications", icon: "📋" }
];

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-slate-900">
          <span className="text-2xl">🎓</span>
          <span>
            Intern<span className="text-indigo-600">Connect</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
