import { NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";
import { useUser } from "./UserContext.jsx";
import { initials } from "../lib/user.js";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", icon: "home", end: true },
  { to: "/internships", label: "Internships", icon: "search" },
  { to: "/applications", label: "My Applications", icon: "file-text" },
  { to: "/companies", label: "Companies", icon: "building" },
  { to: "/profile", label: "Profile", icon: "user" },
  { to: "/settings", label: "Settings", icon: "settings" }
];

export default function AppLayout({ children, title, subtitle, actions }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* ---------- Sidebar ---------- */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-100 bg-white sticky top-0 h-screen">
        <div className="p-5">
          <Logo to="/dashboard" />
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`
              }
            >
              <Icon name={item.icon} className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User card + logout */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold inline-flex items-center justify-center">
              {initials(user?.name)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-900 truncate">{user?.name || "Guest"}</div>
              <div className="text-xs text-slate-400 truncate">{user?.college || "Set up your profile"}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="icon-btn !w-8 !h-8 hover:!text-red-500 hover:!border-red-100"
            >
              <Icon name="logout" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ---------- Main column ---------- */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="px-5 sm:px-8 py-3.5 flex items-center gap-3">
            <div className="lg:hidden">
              <Logo to="/dashboard" />
            </div>

            {/* Search (goes to internships page) */}
            <form
              className="flex-1 max-w-xl hidden sm:block"
              onSubmit={(e) => {
                e.preventDefault();
                const q = new FormData(e.currentTarget).get("q")?.trim();
                navigate(q ? `/internships?q=${encodeURIComponent(q)}` : "/internships");
              }}
            >
              <div className="relative">
                <Icon name="search" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  placeholder="Search internships, companies, skills..."
                  className="input w-full !pl-10 !rounded-full !bg-slate-50 focus:!bg-white"
                />
              </div>
            </form>

            <div className="flex-1 sm:hidden" />

            <button className="icon-btn" title="Notifications">
              <Icon name="bell" className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-xs font-bold inline-flex items-center justify-center"
              title="Your profile"
            >
              {initials(user?.name)}
            </button>
          </div>

          {/* Mobile nav (small screens) */}
          <nav className="lg:hidden flex gap-1 px-3 pb-2 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"
                  }`
                }
              >
                <Icon name={item.icon} className="w-3.5 h-3.5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        {/* Page header + content */}
        <main className="flex-1 px-5 sm:px-8 py-7">
          {(title || actions) && (
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
              <div>
                {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
                {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
