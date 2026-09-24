import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icon.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { getApplications, updateApplication, deleteApplication } from "../api.js";
import { formatDate } from "../lib/format.js";

const STATUSES = ["saved", "applied", "interview", "offer", "rejected"];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      setApps(await getApplications());
      setOffline(false);
    } catch {
      setOffline(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatus(id, status) {
    try {
      await updateApplication(id, { status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteApplication(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const countBy = (s) => apps.filter((a) => a.status === s).length;

  return (
    <AppLayout title="My Applications" subtitle="Track everything you've saved and applied to.">
      {error && <div className="card p-3 text-sm text-red-600 mb-4">{error}</div>}

      {offline ? (
        <div className="card p-8 text-center text-slate-500 text-sm">
          Can't connect to the backend — start it with <code className="text-xs">npm start</code> in backend/.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pipeline summary */}
          <div className="card p-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {STATUSES.map((s) => (
                <div key={s} className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      { saved: "bg-amber-500", applied: "bg-blue-500", interview: "bg-violet-500", offer: "bg-green-500", rejected: "bg-red-500" }[s]
                    }`}
                  />
                  <div>
                    <div className="text-lg font-bold leading-none capitalize">{countBy(s)}</div>
                    <div className="text-xs text-slate-400 mt-1 capitalize">{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-5 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : apps.length === 0 ? (
            <div className="card p-10 text-center text-slate-500 text-sm">
              No applications yet. Hit <b>Track</b> on any internship in the{" "}
              <Link to="/internships" className="text-indigo-600 font-medium hover:underline">
                Internships
              </Link>{" "}
              page!
            </div>
          ) : (
            <div className="space-y-3">
              {apps.map((app) => (
                <div key={app.id} className="card p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex gap-3.5 min-w-0">
                      <span className="avatar w-11 h-11 text-sm">{(app.company || "C")[0]?.toUpperCase()}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 leading-snug">{app.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {app.company} · Updated {formatDate(app.updated_at)}
                        </div>
                        {app.notes && <div className="text-sm text-slate-600 mt-1.5">📝 {app.notes}</div>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={app.status} />
                      <select
                        value={app.status}
                        onChange={(e) => handleStatus(app.id, e.target.value)}
                        className="input !py-1.5 !px-2.5 !text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {app.apply_url && (
                        <a href={app.apply_url} target="_blank" rel="noreferrer" className="btn-secondary !px-3.5 !py-2 !text-xs">
                          Apply <Icon name="external" className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(app.id)}
                        title="Delete"
                        className="icon-btn !w-8 !h-8 hover:!text-red-500 hover:!border-red-100"
                      >
                        <Icon name="trash" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
