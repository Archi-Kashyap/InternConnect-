import { useEffect, useState } from "react";
import { getApplications, updateApplication, deleteApplication } from "../api.js";
import StatusBadge from "../components/StatusBadge.jsx";

const STATUSES = ["saved", "applied", "interview", "offer", "rejected"];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      setApps(await getApplications());
    } catch (err) {
      setError("Can't connect to the backend.");
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

  const countBy = (status) => apps.filter((a) => a.status === status).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Application Tracker 📋</h1>
        <p className="text-slate-500 mt-1">Where you applied, what's in interview — all in one place.</p>
      </div>

      {/* Status summary */}
      {apps.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {STATUSES.map((s) => (
            <span key={s} className="card px-3 py-1.5 flex items-center gap-2">
              <StatusBadge status={s} />
              <b>{countBy(s)}</b>
            </span>
          ))}
        </div>
      )}

      {error && <div className="card p-3 text-sm text-red-600">{error}</div>}

      {loading ? (
        <p className="text-slate-500">Loading applications...</p>
      ) : apps.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          No applications tracked yet. Hit the <b>Track</b> button on any job in the Jobs page!
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app.id} className="card p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">{app.title}</div>
                  <div className="text-sm text-slate-500">🏢 {app.company}</div>
                  {app.notes && (
                    <div className="text-sm text-slate-600 mt-1">📝 {app.notes}</div>
                  )}
                  <div className="text-xs text-slate-400 mt-1">
                    Updated: {new Date(app.updated_at + "Z").toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={app.status} />

                  {/* Status dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleStatus(app.id, e.target.value)}
                    className="input text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {app.apply_url && (
                    <a href={app.apply_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs">
                      Apply →
                    </a>
                  )}
                  <button onClick={() => handleDelete(app.id)} className="btn-danger text-xs">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
