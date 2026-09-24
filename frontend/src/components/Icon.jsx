// Lightweight inline SVG icons (feather-style paths) — zero extra dependencies
const PATHS = {
  home: ["M3 10.5L12 3l9 7.5", "M5 9.5V21h14V9.5", "M9 21v-6h6v6"],
  briefcase: [
    "M4 7h16a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z",
    "M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
  ],
  "file-text": [
    "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
    "M10 9H8"
  ],
  building: [
    "M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18",
    "M2 22h20",
    "M10 6h.01M10 10h.01M10 14h.01M14 6h.01M14 10h.01M14 14h.01",
    "M10 22v-4h4v4"
  ],
  user: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
  settings: ["M4 21v-7", "M4 10V3", "M12 21v-9", "M12 8V3", "M20 21v-5", "M20 12V3", "M1 14h6", "M9 8h6", "M17 16h6"],
  search: ["M11 3a8 8 0 100 16 8 8 0 000-16z", "M21 21l-4.35-4.35"],
  logout: ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  heart: [
    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"
  ],
  "map-pin": ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z", "M12 13a3 3 0 100-6 3 3 0 000 6z"],
  clock: ["M12 3a9 9 0 100 18 9 9 0 000-18z", "M12 7v5l3 3"],
  "chevron-left": ["M15 18l-6-6 6-6"],
  "chevron-right": ["M9 18l6-6-6-6"],
  x: ["M18 6L6 18", "M6 6l12 12"],
  plus: ["M12 5v14", "M5 12h14"],
  check: ["M20 6L9 17l-5-5"],
  refresh: ["M23 4v6h-6", "M20.49 15a9 9 0 11-2.12-9.36L23 10"],
  "arrow-right": ["M5 12h14", "M12 5l7 7-7 7"],
  edit: [
    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7",
    "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
  ],
  trash: ["M3 6h18", "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6", "M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"],
  external: ["M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6", "M15 3h6v6", "M10 14L21 3"],
  bell: ["M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
  bolt: ["M13 2L3 14h9l-1 8 10-12h-9l1-8z"],
  mail: ["M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z", "M22 6l-10 7L2 6"],
  lock: ["M5 11h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z", "M7 11V7a5 5 0 0110 0v4"],
  award: ["M12 15a7 7 0 100-14 7 7 0 000 14z", "M8.2 13.9L7 23l5-3 5 3-1.2-9.1"],
  "grad-cap": ["M2 10l10-5 10 5-10 5z", "M6 12.5V17c3.5 2.5 8.5 2.5 12 0v-4.5", "M22 10v6"],
  calendar: ["M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M16 2v4", "M8 2v4", "M3 10h18"]
};

export default function Icon({ name, className = "w-4 h-4", ...props }) {
  const paths = PATHS[name] || [];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
