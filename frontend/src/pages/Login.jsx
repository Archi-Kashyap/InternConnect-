import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import Icon from "../components/Icon.jsx";
import { useUser } from "../components/UserContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }
    // Demo login — no real auth yet, just create the local profile
    setUser({
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      college: "",
      degree: ""
    });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white p-10">
        <Logo light />
        <div>
          <h2 className="font-display text-3xl font-bold !text-white">Welcome Back!</h2>
          <p className="mt-3 text-indigo-200 max-w-sm">
            Login to your account to continue your journey toward better opportunities.
          </p>
          <p className="mt-10 font-display text-xl text-indigo-300 italic">Better Opportunities Ahead ✨</p>
        </div>
        <p className="text-xs text-indigo-300/70">© {new Date().getFullYear()} InternConnect</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your details to access your account.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Email or Username</label>
              <input
                className="input w-full"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="input w-full !pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Icon name="lock" className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Remember me
              </label>
              <button type="button" className="text-indigo-600 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" className="btn-gradient w-full !py-3">Login</button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
