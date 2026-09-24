const STATUS_STYLES = {
  saved: "bg-amber-50 text-amber-700",
  applied: "bg-blue-50 text-blue-700",
  interview: "bg-violet-50 text-violet-700",
  offer: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600"
};

const DOT_COLORS = {
  saved: "bg-amber-500",
  applied: "bg-blue-500",
  interview: "bg-violet-500",
  offer: "bg-green-500",
  rejected: "bg-red-500"
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
        STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[status] || "bg-slate-400"}`} />
      {status}
    </span>
  );
}
