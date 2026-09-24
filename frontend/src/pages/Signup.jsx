import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { useUser } from "../components/UserContext.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    // Demo signup — saves local profile, no real auth yet
    setUser({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      college: "",
      degree: ""
    });
    navigate("/profile");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white p-10">
        <Logo light />
        <div>
          <h2 className="font-display text-3xl font-bold !text-white">Join InternConnect</h2>
          <p className="mt-3 text-indigo-200 max-w-sm">
            Create your account and start exploring amazing opportunities.
          </p>
          <p className="mt-10 font-display text-xl text-indigo-300 italic">Dream. Apply. Grow 🚀</p>
        </div>
        <p className="text-xs text-indigo-300/70">© {new Date().getFullYear()} InternConnect</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-sm text-slate-500 mt-1">Create your account.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Full Name</label>
              <input className="input w-full" placeholder="Enter your name" value={form.name} onChange={set("name")} />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="Create a password"
                value={form.password}
                onChange={set("password")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Role</label>
              <select className="input w-full" value={form.role} onChange={set("role")}>
                <option value="student">Student</option>
                <option value="graduate">Recent Graduate</option>
                <option value="other">Other</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" className="btn-gradient w-full !py-3">Sign Up</button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
