import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icon.jsx";
import { useUser } from "../components/UserContext.jsx";
import { initials } from "../lib/user.js";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { user, logout } = useUser();
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ic_prefs")) || {};
    } catch {
      return {};
    }
  });

  function setPref(key, value) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem("ic_prefs", JSON.stringify(next));
  }

  function resetAll() {
    if (confirm("Reset all local data? (profile, preferences, saved items)")) {
      localStorage.removeItem("ic_user");
      localStorage.removeItem("ic_prefs");
      location.href = "/";
    }
  }

  return (
    <AppLayout title="Settings" subtitle="Preferences are saved on this device.">
      <div className="space-y-6 max-w-2xl">
        {/* Account summary */}
        <div className="card p-6 flex items-center gap-4">
          <span className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold inline-flex items-center justify-center">
            {initials(user?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-slate-900">{user?.name || "Guest"}</div>
            <div className="text-sm text-slate-400 truncate">{user?.email || "Not logged in"}</div>
          </div>
          <Link to="/profile" className="btn-secondary !py-2 !text-xs">Edit Profile</Link>
        </div>

        {/* Notification preferences */}
        <div className="card p-6">
          <h3 className="text-base font-semibold pb-2 border-b border-slate-100">Notifications</h3>
          <div className="mt-4 space-y-4">
            {[
              { key: "jobAlerts", label: "New job matches", desc: "Tell me when jobs match my skills" },
              { key: "appUpdates", label: "Application updates", desc: "Status changes on my applications" },
              { key: "emailDigest", label: "Email digest", desc: "Weekly summary of new internships" }
            ].map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-800">{row.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{row.desc}</div>
                </div>
                <Toggle checked={!!prefs[row.key]} onChange={(v) => setPref(row.key, v)} />
              </div>
            ))}
          </div>
        </div>

        {/* Account actions */}
        <div className="card p-6">
          <h3 className="text-base font-semibold pb-2 border-b border-slate-100">Account</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={logout} className="btn-secondary">
              <Icon name="logout" className="w-4 h-4" /> Log Out
            </button>
            <button onClick={resetAll} className="btn-danger">
              <Icon name="trash" className="w-4 h-4" /> Reset Local Data
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Note: Internships, skills and applications live on the backend database — “Reset Local Data” only clears this
            browser's profile &amp; preferences.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
