import { useEffect, useState } from "react";
import { getSkills, addSkill, removeSkill, getJobs } from "../api.js";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [input, setInput] = useState("");
  const [matchCounts, setMatchCounts] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [skillsData, jobsData] = await Promise.all([getSkills(), getJobs()]);
      setSkills(skillsData);

      // How many jobs contain each skill
      const counts = {};
      skillsData.forEach((s) => {
        counts[s.name] = jobsData.filter((job) =>
          `${job.title} ${job.description}`.toLowerCase().includes(s.name)
        ).length;
      });
      setMatchCounts(counts);
    } catch (err) {
      setError("Can't connect to the backend.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const name = input.trim();
    if (!name) return;
    setBusy(true);
    setError("");
    try {
      await addSkill(name);
      setInput("");
      await load();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  async function handleRemove(name) {
    setBusy(true);
    setError("");
    try {
      await removeSkill(name);
      await load();
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Skills 🧠</h1>
        <p className="text-slate-500 mt-1">
          Add the skills you know — jobs are matched against them.
        </p>
      </div>

      {/* Add skill form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          className="input flex-1"
          placeholder="Type a new skill (e.g. react, nodejs...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn-primary">
          + Add Skill
        </button>
      </form>

      {error && <div className="card p-3 text-sm text-red-600">{error}</div>}

      {/* Skills chips */}
      {skills.length === 0 ? (
        <div className="card p-6 text-slate-500 text-sm">
          No skills yet. Add your first skill above!
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
            >
              <span className="text-sm font-medium text-slate-700">{s.name}</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold">
                {matchCounts[s.name] ?? 0} jobs
              </span>
              <button
                onClick={() => handleRemove(s.name)}
                disabled={busy}
                title={`Remove ${s.name}`}
                className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 text-xs leading-none transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400">
        💡 Tip: Matching updates instantly when you add a skill — hit "Fetch New Jobs" on the Dashboard or refresh the Jobs page to see it.
      </p>
    </div>
  );
}
