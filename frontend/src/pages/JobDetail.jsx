import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icon.jsx";
import { getJob, createApplication } from "../api.js";
import { formatDate } from "../lib/format.js";

// Simple section heading with underline, per the reference design
function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold pb-2 border-b border-slate-100">{title}</h2>
      <div className="mt-4 text-sm text-slate-600 leading-relaxed">{children}</div>
    </section>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    getJob(id)
      .then(setJob)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleTrack() {
    setBusy(true);
    try {
      await createApplication(job.id, "saved");
      setTracked(true);
    } catch {
      setTracked(true); // duplicate => already tracked
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="card p-10 animate-pulse">
          <div className="h-6 bg-slate-100 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/4 mt-3" />
        </div>
      </AppLayout>
    );
  }

  if (notFound || !job) {
    return (
      <AppLayout>
        <div className="card p-10 text-center">
          <p className="text-slate-500">This internship doesn't exist (or was removed).</p>
          <Link to="/internships" className="btn-primary mt-5 inline-flex">Back to Internships</Link>
        </div>
      </AppLayout>
    );
  }

  // Split description into readable bullet-ish lines
  const paragraphs = (job.description || "")
    .split(/\n+|(?<=\.)\s{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <AppLayout>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 mb-5"
      >
        <Icon name="chevron-left" className="w-4 h-4" /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* ------- Main card ------- */}
        <div className="lg:col-span-2 card p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="avatar w-14 h-14 text-lg">{(job.company || "C")[0]?.toUpperCase()}</span>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold leading-snug">{job.title}</h1>
              <div className="text-sm font-medium text-indigo-600 mt-0.5">{job.company}</div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Icon name="map-pin" className="w-3.5 h-3.5" /> {job.location || "Anywhere"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="calendar" className="w-3.5 h-3.5" /> Posted {formatDate(job.posted_at) || "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="building" className="w-3.5 h-3.5" /> via Adzuna
                </span>
              </div>
            </div>
          </div>

          {job.matchCount > 0 && (
            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold">
                <Icon name="bolt" className="w-3.5 h-3.5" /> {job.matchCount} of your skills match
              </span>
              {job.matchedSkills?.map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <a href={job.apply_url} target="_blank" rel="noreferrer" className="btn-gradient !px-7">
              Apply Now <Icon name="external" className="w-4 h-4" />
            </a>
            <button onClick={handleTrack} disabled={busy || tracked} className="btn-secondary">
              {tracked ? "Tracked ✓" : busy ? "..." : "Track Application"}
            </button>
            <button
              onClick={() => setSaved((s) => !s)}
              className={`icon-btn !w-10 !h-10 ${saved ? "!text-red-500 !border-red-100" : ""}`}
              title="Save"
            >
              <Icon name="heart" className={`w-4.5 h-4.5 w-[18px] h-[18px] ${saved ? "fill-red-500" : ""}`} />
            </button>
          </div>

          <Section title="About the Internship">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className="mb-3 last:mb-0">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-slate-400">No description provided.</p>
            )}
          </Section>
        </div>

        {/* ------- Sidebar ------- */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="text-sm font-semibold">Job Overview</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-400 inline-flex items-center gap-2">
                  <Icon name="building" className="w-4 h-4" /> Company
                </dt>
                <dd className="font-medium text-slate-800 text-right truncate">{job.company || "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-400 inline-flex items-center gap-2">
                  <Icon name="map-pin" className="w-4 h-4" /> Location
                </dt>
                <dd className="font-medium text-slate-800 text-right truncate">{job.location || "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-400 inline-flex items-center gap-2">
                  <Icon name="calendar" className="w-4 h-4" /> Posted
                </dt>
                <dd className="font-medium text-slate-800">{formatDate(job.posted_at) || "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-slate-400 inline-flex items-center gap-2">
                  <Icon name="bolt" className="w-4 h-4" /> Match
                </dt>
                <dd className="font-medium text-slate-800">{job.matchCount ?? 0} skills</dd>
              </div>
            </dl>
          </div>

          {job.matchedSkills?.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold">Your Matching Skills</h3>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.matchedSkills.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          )}

          <Link to="/internships" className="btn-secondary w-full">
            <Icon name="search" className="w-4 h-4" /> Explore more internships
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
