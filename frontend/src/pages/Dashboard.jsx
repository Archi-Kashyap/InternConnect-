import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icon.jsx";
import { getMatchedJobs, getSkills, getApplications, fetchNewJobs } from "../api.js";
import { useUser } from "../components/UserContext.jsx";
import { greeting } from "../lib/user.js";

const PIPELINE = [
  { key: "applied", label: "Applied", dot: "bg-blue-500", bar: "bg-blue-500" },
  { key: "saved", label: "Under Review", dot: "bg-amber-500", bar: "bg-amber-400" },
  { key: "interview", label: "Interview", dot: "bg-violet-500", bar: "bg-violet-500" },
  { key: "offer", label: "Offer", dot: "bg-green-500", bar: "bg-green-500" }
];

export default function Dashboard() {
  const { user } = useUser();
  const [apps, setApps] = useState([]);
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchMsg, setFetchMsg] = useState("");

  async function loadAll() {
    setLoading(true);
    try {
      const [jobs, skillsData, appsData] = await Promise.all([
        getMatchedJobs(),
        getSkills(),
        getApplications()
      ]);
      setMatches(jobs.filter((j) => j.matchCount > 0));
      setSkills(skillsData);
      setApps(appsData);
      setOffline(false);
    } catch {
      setOffline(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleFetch() {
    setFetching(true);
    setFetchMsg("Fetching jobs from Adzuna...");
    try {
      const result = await fetchNewJobs("software developer", "india");
      setFetchMsg(`✅ ${result.saved} new jobs found (${result.total} checked)`);
      await loadAll();
    } catch (err) {
      setFetchMsg(`❌ Fetch failed: ${err.message}`);
    }
    setFetching(false);
  }

  const countBy = (s) => apps.filter((a) => a.status === s).length;

  return (
    <AppLayout
      title="Dashboard"
      subtitle={`Keep going, your efforts will pay off.`}
      actions={
        <button onClick={handleFetch} disabled={fetching} className="btn-primary">
          <Icon name="refresh" className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} />
          {fetching ? "Fetching..." : "Fetch New Jobs"}
        </button>
      }
    >
      {fetchMsg && <div className="card p-4 text-sm text-slate-700 mb-5">{fetchMsg}</div>}

      {offline ? (
        <div className="card p-8 text-center text-slate-500 text-sm">
          Can't connect to the backend — make sure it's running (<code className="text-xs">npm start</code> in backend/).
        </div>
      ) : (
        <div className="space-y-7">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/applications" className="card p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Applications</div>
              <div className="text-3xl font-bold mt-2">{loading ? "—" : apps.length}</div>
            </Link>
            <Link to="/applications" className="card p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Active</div>
              <div className="text-3xl font-bold mt-2">{loading ? "—" : countBy("applied") + countBy("interview")}</div>
            </Link>
            <Link to="/internships?match=1" className="card p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Matches</div>
              <div className="text-3xl font-bold mt-2">{loading ? "—" : matches.length}</div>
            </Link>
            <Link to="/profile" className="card p-5 hover:shadow-md transition-shadow">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Skills</div>
              <div className="text-3xl font-bold mt-2">{loading ? "—" : skills.length}</div>
            </Link>
          </div>

          {/* Application pipeline */}
          <section className="card p-6">
            <h2 className="text-base font-semibold">Application Status</h2>
            {apps.length === 0 ? (
              <p className="text-sm text-slate-500 mt-4">
                No applications yet —{" "}
                <Link to="/internships" className="text-indigo-600 font-medium hover:underline">
                  explore internships
                </Link>{" "}
                and hit Track on the ones you like.
              </p>
            ) : (
              <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-5">
                {PIPELINE.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                      <span className="text-xs font-medium text-slate-500">{s.label}</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.bar} transition-all`}
                        style={{ width: `${Math.min(100, (countBy(s.key) / Math.max(apps.length, 1)) * 100)}%` }}
                      />
                    </div>
                    <div className="text-lg font-bold mt-1.5">{countBy(s.key)}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent applications */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Recent Applications</h2>
              <Link to="/applications" className="text-sm font-medium text-indigo-600 hover:underline">
                View all →
              </Link>
            </div>

            {apps.length === 0 ? (
              <div className="card p-6 text-sm text-slate-500">Nothing here yet.</div>
            ) : (
              <div className="card divide-y divide-slate-100">
                {apps.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center gap-4 p-4">
                    <span className="avatar w-10 h-10 text-sm">{(app.company || "C")[0]?.toUpperCase()}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-900 text-sm truncate">{app.title}</div>
                      <div className="text-xs text-slate-400 truncate">{app.company}</div>
                    </div>
                    {app.status === "saved" ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">Under Review</span>
                    ) : app.status === "applied" ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Applied</span>
                    ) : app.status === "interview" ? (
                      <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-semibold">Interview</span>
                    ) : app.status === "offer" ? (
                      <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">Offer</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold">Rejected</span>
                    )}
                    <Icon name="chevron-right" className="w-4 h-4 text-slate-300" />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Top matches */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">Top Matches for You</h2>
              <Link to="/internships?match=1" className="text-sm font-medium text-indigo-600 hover:underline">
                View all →
              </Link>
            </div>

            {matches.length === 0 ? (
              <div className="card p-6 text-sm text-slate-500">
                No matches yet — add skills on your{" "}
                <Link to="/profile" className="text-indigo-600 font-medium hover:underline">profile</Link> or fetch new jobs.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.slice(0, 3).map((job) => (
                  <Link
                    key={job.id}
                    to={`/internships/${job.id}`}
                    className="card p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="avatar w-10 h-10 text-sm">{(job.company || "C")[0]?.toUpperCase()}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
                        ⚡ {job.matchCount} MATCH
                      </span>
                    </div>
                    <div className="font-semibold text-sm text-slate-900 mt-3 line-clamp-2">{job.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{job.company}</div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.matchedSkills?.slice(0, 3).map((s) => (
                        <span key={s} className="chip !py-0.5">{s}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </AppLayout>
  );
}
