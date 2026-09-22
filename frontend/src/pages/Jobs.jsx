import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMatchedJobs, getApplications, fetchNewJobs } from "../api.js";
import JobCard from "../components/JobCard.jsx";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [trackedIds, setTrackedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [matchedOnly, setMatchedOnly] = useState(searchParams.get("match") === "1");
  const [fetching, setFetching] = useState(false);

  async function loadJobs() {
    setLoading(true);
    try {
      // ?match=1 endpoint returns all jobs with matchCount, sorted
      const [jobsData, appsData] = await Promise.all([getMatchedJobs(), getApplications().catch(() => [])]);
      setJobs(jobsData);
      setTrackedIds(new Set(appsData.map((a) => a.job_id)));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  // Sync URL query with search box state
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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Jobs 💼</h1>
          <p className="text-slate-500 mt-1">
            {jobs.length} jobs in database — {jobs.filter((j) => j.matchCount > 0).length} match your skills.
          </p>
        </div>
        <button onClick={handleFetch} disabled={fetching} className="btn-primary">
          {fetching ? "Fetching..." : "🔄 Fetch New Jobs"}
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 flex-wrap">
        <input
          className="input flex-1 min-w-[220px]"
          placeholder="🔍 Search title, company or description..."
          value={query}
          onChange={(e) => updateFilter(e.target.value, matchedOnly)}
        />
        <button
          onClick={() => updateFilter(query, !matchedOnly)}
          className={matchedOnly ? "btn-primary" : "btn-secondary"}
        >
          ⚡ Matched only
        </button>
      </div>

      {/* Jobs grid */}
      {loading ? (
        <p className="text-slate-500">Loading jobs...</p>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          No jobs found {query && <>for "<b>{query}</b>"</>}. {" "}
          <button onClick={handleFetch} className="text-indigo-600 hover:underline">
            Fetch new jobs!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              alreadyTracked={trackedIds.has(job.id)}
              onTracked={(id) => setTrackedIds((prev) => new Set(prev).add(id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
