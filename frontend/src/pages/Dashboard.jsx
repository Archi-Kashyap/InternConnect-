import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMatchedJobs, getSkills, getApplications, fetchNewJobs } from "../api.js";

function StatCard({ icon, label, value, to }) {
  const inner = (
    <div className="card p-5 hover:shadow-md transition-shadow h-full">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export default function Dashboard() {
  const [stats, setStats] = useState({ jobs: 0, skills: 0, applications: 0 });
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState("");

  async function loadAll() {
    setLoading(true);
    try {
      const [jobs, skills, apps] = await Promise.all([
        getMatchedJobs(),
        getSkills(),
        getApplications()
      ]);
      setStats({ jobs: jobs.length, skills: skills.length, applications: apps.length });
      // API already returns sorted results — just take top 5 matched
      setTopMatches(jobs.filter((j) => j.matchCount > 0).slice(0, 5));
    } catch (err) {
      setFetchMsg("⚠️ Can't connect to the backend — is the server running?");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleFetch() {
    setFetching(true);
    setFetchMsg("Fetching jobs from Adzuna... ⏳");
    try {
      const result = await fetchNewJobs("software developer", "india");
      setFetchMsg(`✅ ${result.saved} new jobs found (${result.total} checked)`);
      await loadAll();
    } catch (err) {
      setFetchMsg(`❌ Fetch failed: ${err.message}`);
    }
    setFetching(false);
  }

  if (loading) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard 📊</h1>
          <p className="text-slate-500 mt-1">Your personal job assistant — everything at a glance.</p>
        </div>
        <button onClick={handleFetch} disabled={fetching} className="btn-primary">
          {fetching ? "Fetching..." : "🔄 Fetch New Jobs"}
        </button>
      </div>

      {fetchMsg && (
        <div className="card p-4 text-sm text-slate-700">{fetchMsg}</div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="💼" label="Total Jobs" value={stats.jobs} to="/jobs" />
        <StatCard icon="🧠" label="My Skills" value={stats.skills} to="/skills" />
        <StatCard icon="📋" label="Applications" value={stats.applications} to="/applications" />
      </div>

      {/* Top matched jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">⚡ Top Matched Jobs</h2>
          <Link to="/jobs" className="text-sm text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>

        {topMatches.length === 0 ? (
          <div className="card p-6 text-slate-500 text-sm">
            No matches yet. <Link to="/skills" className="text-indigo-600 hover:underline">Add skills</Link> or fetch new jobs!
          </div>
        ) : (
          <div className="space-y-3">
            {topMatches.map((job) => (
              <Link
                key={job.id}
                to="/jobs"
                className="card p-4 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{job.title}</div>
                  <div className="text-sm text-slate-500 truncate">
                    🏢 {job.company} · 📍 {job.location}
                  </div>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                  ⚡ {job.matchCount} match
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
