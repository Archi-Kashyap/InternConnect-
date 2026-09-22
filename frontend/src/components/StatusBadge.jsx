// Status ke hisaab se rang aur emoji
const STATUS_STYLES = {
  saved: "bg-yellow-100 text-yellow-800",
  applied: "bg-blue-100 text-blue-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-700"
};

const STATUS_EMOJI = {
  saved: "🟡",
  applied: "🔵",
  interview: "🟣",
  offer: "🟢",
  rejected: "🔴"
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
        STATUS_STYLES[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {STATUS_EMOJI[status] || "⚪"} {status}
    </span>
  );
}
