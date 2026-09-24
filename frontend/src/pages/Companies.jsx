import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icon.jsx";
import { getMatchedJobs } from "../api.js";

export default function Companies() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getMatchedJobs()
      .then(setJobs)
      .catch(() => setOffline(true))
      .finally(() => setLoading(false));
  }, []);

  // Group jobs by company
  const companies = useMemo(() => {
    const map = new Map();
    jobs.forEach((job) => {
      const name = job.company || "Unknown";
      if (!map.has(name)) map.set(name, { name, jobs: [] });
      map.get(name).jobs.push(job);
    });
    let list = [...map.values()];
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    // Biggest companies first
    list.sort((a, b) => b.jobs.length - a.jobs.length);
    return list;
  }, [jobs, query]);

  return (
    <AppLayout title="Companies" subtitle="Every company in your internship database, at a glance.">
      <div className="relative max-w-md mb-6">
        <Icon name="search" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input w-full !pl-10"
          placeholder="Search companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {offline ? (
        <div className="card p-8 text-center text-slate-500 text-sm">
          Can't connect to the backend — start it with <code className="text-xs">npm start</code> in backend/.
        </div>
      ) : loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
              <div className="h-4 bg-slate-100 rounded w-2/3 mt-4" />
            </div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="card p-10 text-center text-slate-500 text-sm">No companies found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c) => (
            <div key={c.name} className="card p-5 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="avatar w-11 h-11 text-base">{c.name[0]?.toUpperCase()}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{c.name}</div>
                  <div className="text-xs text-slate-400">
                    {c.jobs.length} internship{c.jobs.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {c.jobs.slice(0, 3).map((j) => (
                  <span key={j.id} className="chip !py-0.5 max-w-full truncate">{j.title}</span>
                ))}
                {c.jobs.length > 3 && (
                  <span className="text-xs text-slate-400 self-center">+{c.jobs.length - 3} more</span>
                )}
              </div>

              <Link
                to={`/internships?q=${encodeURIComponent(c.name)}`}
                className="mt-auto text-sm font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                View internships <Icon name="arrow-right" className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
