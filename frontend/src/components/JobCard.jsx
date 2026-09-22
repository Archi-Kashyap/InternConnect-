import { Link } from "react-router-dom";
import { useState } from "react";
import { createApplication } from "../api.js";

export default function JobCard({ job, alreadyTracked = false, onTracked }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(alreadyTracked);

  async function handleTrack() {
    setSaving(true);
    try {
      await createApplication(job.id, "saved");
      setSaved(true);
      onTracked?.(job.id);
    } catch (err) {
      // Show "already tracked" even on duplicate (409)
      setSaved(true);
      console.log(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900 leading-snug">{job.title}</h3>
        {job.matchCount > 0 && (
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
            ⚡ {job.matchCount} match
          </span>
        )}
      </div>

      <div className="text-sm text-slate-600">
        🏢 {job.company || "Unknown"} &nbsp;·&nbsp; 📍 {job.location || "—"}
      </div>

      {job.matchedSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.matchedSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>

      <div className="mt-auto flex items-center gap-2 pt-2">
        <a
          href={job.apply_url}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          Apply →
        </a>
        <button onClick={handleTrack} disabled={saving || saved} className="btn-secondary">
          {saved ? "✓ Tracked" : saving ? "..." : "Track"}
        </button>
        <Link to={`/jobs?q=${encodeURIComponent(job.title)}`} className="ml-auto text-xs text-slate-400 hover:text-slate-600">
          id: {job.id}
        </Link>
      </div>
    </div>
  );
}
