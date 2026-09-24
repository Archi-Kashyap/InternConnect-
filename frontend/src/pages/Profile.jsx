import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import Icon from "../components/Icon.jsx";
import { useUser } from "../components/UserContext.jsx";
import { initials } from "../lib/user.js";
import { getSkills, addSkill, removeSkill, getMatchedJobs } from "../api.js";

export default function Profile() {
  const { user, setUser } = useUser();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    college: user?.college || "",
    degree: user?.degree || "",
    about: user?.about || ""
  });

  // Skills — synced with the backend (they drive job matching)
  const [skills, setSkills] = useState([]);
  const [counts, setCounts] = useState({});
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadSkills() {
    try {
      const [skillsData, jobsData] = await Promise.all([getSkills(), getMatchedJobs()]);
      setSkills(skillsData);
      const c = {};
      skillsData.forEach((s) => {
        c[s.name] = jobsData.filter((j) => `${j.title} ${j.description}`.toLowerCase().includes(s.name)).length;
      });
      setCounts(c);
    } catch {
      /* backend offline — ignore here */
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function saveProfile(e) {
    e.preventDefault();
    setUser({ ...user, ...form });
    setEditing(false);
  }

  async function handleAddSkill(e) {
    e.preventDefault();
    const name = input.trim();
    if (!name) return;
    setBusy(true);
    try {
      await addSkill(name);
      setInput("");
      await loadSkills();
    } catch {
      /* ignore */
    }
    setBusy(false);
  }

  async function handleRemoveSkill(name) {
    setBusy(true);
    try {
      await removeSkill(name);
      await loadSkills();
    } catch {
      /* ignore */
    }
    setBusy(false);
  }

  return (
    <AppLayout
      title="My Profile"
      actions={
        <button onClick={() => (editing ? saveProfile(e) : setEditing(true))} className="btn-primary">
          <Icon name="edit" className="w-4 h-4" />
          {editing ? "Save Profile" : "Edit Profile"}
        </button>
      }
    >
      <div className="grid lg:grid-cols-3 gap-6 items-start max-w-5xl">
        {/* Identity card */}
        <div className="card p-6 text-center lg:sticky lg:top-24">
          <span className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-2xl font-bold inline-flex items-center justify-center">
            {initials(form.name || user?.name)}
          </span>
          <h2 className="mt-4 text-lg font-bold">{form.name || user?.name || "Your Name"}</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {form.degree || "Add your degree"} · {form.college || "Add your college"}
          </p>
          {user?.email && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full">
              <Icon name="mail" className="w-3.5 h-3.5" /> {user.email}
            </p>
          )}
        </div>

        {/* Details + skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* About / education form */}
          <div className="card p-6">
            <h3 className="text-base font-semibold pb-2 border-b border-slate-100">Education & About</h3>

            {editing ? (
              <form onSubmit={saveProfile} className="mt-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name</label>
                    <input className="input w-full" value={form.name} onChange={set("name")} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1.5">Degree</label>
                    <input className="input w-full" placeholder="B.Tech IT" value={form.degree} onChange={set("degree")} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">College</label>
                  <input
                    className="input w-full"
                    placeholder="Government Engineering College"
                    value={form.college}
                    onChange={set("college")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">About Me</label>
                  <textarea
                    rows={3}
                    className="input w-full resize-none"
                    placeholder="Passionate about technology and eager to learn..."
                    value={form.about}
                    onChange={set("about")}
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide">Name</dt>
                  <dd className="mt-1 text-slate-800">{form.name || user?.name || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide">Education</dt>
                  <dd className="mt-1 text-slate-800">
                    {form.degree || "—"} {form.college && <span className="text-slate-400">· {form.college}</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide">About Me</dt>
                  <dd className="mt-1 text-slate-800 leading-relaxed">
                    {form.about || <span className="text-slate-400">Click “Edit Profile” to add a short bio.</span>}
                  </dd>
                </div>
              </dl>
            )}
          </div>

          {/* Skills manager */}
          <div className="card p-6">
            <h3 className="text-base font-semibold pb-2 border-b border-slate-100">Skills</h3>
            <p className="text-xs text-slate-400 mt-2">
              These skills power your job matching — add what you know!
            </p>

            <form onSubmit={handleAddSkill} className="mt-4 flex gap-2">
              <input
                className="input flex-1"
                placeholder="Add a skill (e.g. react, python...)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={busy}
              />
              <button type="submit" disabled={busy || !input.trim()} className="btn-primary">
                <Icon name="plus" className="w-4 h-4" /> Add
              </button>
            </form>

            {skills.length === 0 ? (
              <p className="text-sm text-slate-500 mt-4">No skills yet — add your first one above!</p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-4">
                {skills.map((s) => (
                  <span
                    key={s.name}
                    className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
                  >
                    <span className="text-sm font-medium text-slate-700">{s.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                      {counts[s.name] ?? 0} jobs
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(s.name)}
                      disabled={busy}
                      title={`Remove ${s.name}`}
                      className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 text-xs leading-none transition-colors"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
