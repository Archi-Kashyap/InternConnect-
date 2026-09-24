import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function Logo({ to = "/", light = false }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 shrink-0">
      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white inline-flex items-center justify-center shadow-md shadow-indigo-300/40">
        <Icon name="grad-cap" className="w-5 h-5" />
      </span>
      <span className={`font-display font-bold text-lg ${light ? "text-white" : "text-slate-900"}`}>
        Intern<span className="text-indigo-500">Connect</span>
      </span>
    </Link>
  );
}
