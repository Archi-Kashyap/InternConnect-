import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { createApplication } from "../api.js";

// One internship row — matches the reference list layout
export default function JobListCard({ job, alreadyTracked, onTracked, saved, onSave }) {
  const [busy, setBusy] = useState(false);
  const [tracked, setTracked] = useState(alreadyTracked);

  async function handleTrack() {
    setBusy(true);
    try {
      await createApplication(job.id, "saved");
      setTracked(true);
      onTracked?.(job.id);
    } catch {
      // 409 duplicate => already tracked
      setTracked(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-5 flex gap-4 hover:bg-slate-50/60 transition-colors">
      {/* Company avatar */}
      <span className="avatar w-11 h-11 text-sm">{(job.company || "C")[0]?.toUpperCase()}</span>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/internships/${job.id}`}
              className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors leading-snug line-clamp-1"
            >
              {job.title}
            </Link>
            <div className="text-xs text-slate-400 mt-0.5">{job.company}</div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {job.matchCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">
                <Icon name="bolt" className="w-3 h-3" /> {job.matchCount} MATCH
              </span>
            )}
            <button
              onClick={onSave}
              title={saved ? "Saved" : "Save internship"}
              className={`icon-btn !w-8 !h-8 ${saved ? "!text-red-500 !border-red-100" : ""}`}
            >
              <Icon name="heart" className={`w-4 h-4 ${saved ? "fill-red-500" : ""}`} />
            </button>
            <button onClick={handleTrack} disabled={busy || tracked} className="btn-primary !px-4 !py-2 !text-xs">
              {tracked ? "Tracked ✓" : busy ? "..." : "Track"}
            </button>
            <a href={job.apply_url} target="_blank" rel="noreferrer" className="btn-secondary !px-4 !py-2 !text-xs">
              Apply Now
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Icon name="map-pin" className="w-3.5 h-3.5" /> {job.location || "Anywhere"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="calendar" className="w-3.5 h-3.5" />
            {job.posted_at ? new Date(job.posted_at.endsWith("Z") ? job.posted_at : job.posted_at + "Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—"}
          </span>
        </div>

        {job.matchedSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {job.matchedSkills.slice(0, 4).map((s) => (
              <span key={s} className="chip !py-0.5">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
