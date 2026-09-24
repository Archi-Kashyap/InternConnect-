import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon.jsx";
import Logo from "../components/Logo.jsx";
import { getMatchedJobs } from "../api.js";

const FEATURES = [
  { icon: "check", title: "Verified Internships", desc: "Only genuine and trusted opportunities" },
  { icon: "building", title: "Top Companies", desc: "Get noticed by leading companies" },
  { icon: "bolt", title: "Easy Applications", desc: "Apply in just a few clicks" },
  { icon: "award", title: "Track Progress", desc: "Stay updated on your applications" }
];

export default function Landing() {
  const navigate = useNavigate();
  const [popular, setPopular] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    getMatchedJobs()
      .then((jobs) => setPopular(jobs.slice(0, 4)))
      .catch(() => setPopular([]));
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("loc", location.trim());
    navigate(`/internships?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ---------- Navbar ---------- */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <Logo to="/" />
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <Link to="/" className="text-slate-900">Home</Link>
            <Link to="/internships" className="hover:text-slate-900">Internships</Link>
            <Link to="/companies" className="hover:text-slate-900">Companies</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-secondary !px-4">Login</Link>
            <Link to="/signup" className="btn-primary !px-4">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-indigo-100">
            <Icon name="bolt" className="w-3.5 h-3.5" /> Your Career, Our Priority
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight !text-white max-w-xl">
            Find the Right Internship, Build Your Future 🚀
          </h1>
          <p className="mt-4 text-indigo-200 max-w-lg">
            InternConnect helps students discover genuine internships, connect with top companies and kickstart their careers.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Icon name="search" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search internships, companies, skills..."
                className="input w-full !pl-11 !py-3.5 !rounded-xl !border-transparent"
              />
            </div>
            <div className="relative sm:w-44">
              <Icon name="map-pin" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="input w-full !pl-11 !py-3.5 !rounded-xl !border-transparent"
              />
            </div>
            <button type="submit" className="btn-primary !py-3.5 !px-7">Search</button>
          </form>
        </div>
      </section>

      {/* ---------- Feature strip ---------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5 flex flex-col items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 inline-flex items-center justify-center">
                <Icon name={f.icon} className="w-5 h-5" />
              </span>
              <div>
                <div className="font-semibold text-slate-900 text-sm">{f.title}</div>
                <div className="text-xs text-slate-500 mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Popular internships ---------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Popular Internships</h2>
          <Link to="/internships" className="text-sm font-semibold text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>

        {popular.length === 0 ? (
          <div className="card p-8 text-center text-slate-500 text-sm">
            No internships in the database yet — start the backend and hit “Fetch New Jobs”.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((job) => (
              <div key={job.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <span className="avatar w-11 h-11 text-sm">{(job.company || "C")[0]?.toUpperCase()}</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold uppercase tracking-wide">
                    {job.matchCount > 0 ? "Match for you" : "Featured"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">{job.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{job.company}</div>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Icon name="map-pin" className="w-3.5 h-3.5" /> {job.location || "Anywhere"}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(job.matchedSkills?.length ? job.matchedSkills.slice(0, 3) : ["Internship"]).map((s) => (
                    <span key={s} className="chip !py-0.5">{s}</span>
                  ))}
                </div>
                <Link
                  to={`/internships/${job.id}`}
                  className="mt-auto text-sm font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1"
                >
                  View Details <Icon name="arrow-right" className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} InternConnect — Personal Job Aggregator</span>
          <span>Built with the Adzuna API · Node.js · React</span>
        </div>
      </footer>
    </div>
  );
}
