import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icon.jsx";
import JobListCard from "../components/JobListCard.jsx";
import { getMatchedJobs, getApplications, fetchNewJobs } from "../api.js";

export default function Internships() {
  const [jobs, setJobs] = useState([]);
  const [trackedIds, setTrackedIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [matchedOnly, setMatchedOnly] = useState(searchParams.get("match") === "1");

  async function loadJobs() {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        getMatchedJobs(),
        getApplications().catch(() => [])
      ]);
      setJobs(jobsData);
      setTrackedIds(new Set(appsData.map((a) => a.job_id)));
      setOffline(false);
    } catch {
      setOffline(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function updateFilter(q, match) {
    setQuery(q);
    setMatchedOnly(match);
    const next = {};
    if (q) next.q = q;
    if (match) next.match = "1";
    setSearchParams(next, { replace: true });
  }

  async function handleFetch() {
    setFetching(true);
    try {
      await fetchNewJobs("software developer", "india");
      await loadJobs();
    } catch (err) {
      console.error(err);
    }
    setFetching(false);
  }

  const filtered = jobs.filter((job) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q);
    return matchesQuery && (!matchedOnly || job.matchCount > 0);
  });

  return (
    <AppLayout
      title="Explore Internships"
      subtitle="Find internships that match your skills and interests."
      actions={
        <button onClick={handleFetch} disabled={fetching} className="btn-primary">
          <Icon name="refresh" className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} />
          {fetching ? "Fetching..." : "Fetch New Jobs"}
        </button>
      }
    >
      {/* Filter bar */}
      <div className="flex gap-2.5 flex-wrap mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Icon name="search" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input w-full !pl-10"
            placeholder="Search title, company or skill..."
            value={query}
            onChange={(e) => updateFilter(e.target.value, matchedOnly)}
          />
        </div>
        <button onClick={() => updateFilter(query, !matchedOnly)} className={matchedOnly ? "btn-primary" : "btn-secondary"}>
          <Icon name="bolt" className="w-4 h-4" />
          Matched only
        </button>
      </div>

      {offline ? (
        <div className="card p-8 text-center text-slate-500 text-sm">
          Can't connect to the backend — start it with <code className="text-xs">npm start</code> in backend/.
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center text-slate-500 text-sm">
          No internships found {query && <>for "<b>{query}</b>"</>}.{" "}
          <button onClick={handleFetch} className="text-indigo-600 font-medium hover:underline">
            Fetch new jobs
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">
            Showing {filtered.length} of {jobs.length} internships
          </p>
          <div className="card divide-y divide-slate-100 overflow-hidden">
            {filtered.map((job) => (
              <JobListCard
                key={job.id}
                job={job}
                alreadyTracked={trackedIds.has(job.id)}
                onTracked={(id) => setTrackedIds((prev) => new Set(prev).add(id))}
                saved={savedIds.has(job.id)}
                onSave={() => setSavedIds((prev) => new Set(prev).add(job.id))}
              />
            ))}
          </div>
        </>
      )}
    </AppLayout>
  );
}
