const express = require("express");
const db = require("./db");
const { fetchJobs } = require("./fetchJobs");

const app = express();
app.use(express.json());

// Dev CORS — React frontend alag port (5173) par chalega
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// URL :id ko number mein convert karo (invalid ho toh null)
function getId(param) {
  const id = Number(param);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ---------- Matching helper (matchJobs.js jaisa logic) ----------
function getMatchedJobs() {
  const jobs = db.prepare("SELECT * FROM jobs ORDER BY posted_at DESC").all();
  const skills = db.prepare("SELECT name FROM skills").all().map((s) => s.name);

  return jobs
    .map((job) => {
      const text = `${job.title} ${job.description}`.toLowerCase();
      const matchedSkills = skills.filter((skill) => text.includes(skill));
      return { ...job, matchedSkills, matchCount: matchedSkills.length };
    })
    .sort((a, b) => b.matchCount - a.matchCount);
}

// ---------- Health / Root ----------
app.get("/", (req, res) => {
  res.json({
    name: "InternConnect API",
    status: "running",
    endpoints: [
      "GET    /api/jobs",
      "GET    /api/jobs?match=1",
      "GET    /api/jobs/:id",
      "POST   /api/jobs/fetch",
      "GET    /api/matches",
      "GET    /api/skills",
      "POST   /api/skills",
      "DELETE /api/skills/:name",
      "GET    /api/applications",
      "POST   /api/applications",
      "PATCH  /api/applications/:id",
      "DELETE /api/applications/:id"
    ]
  });
});

// ---------- Jobs ----------
app.get("/api/jobs", (req, res) => {
  if (req.query.match === "1") return res.json(getMatchedJobs());
  res.json(db.prepare("SELECT * FROM jobs ORDER BY posted_at DESC").all());
});

app.get("/api/jobs/:id", (req, res) => {
  const id = getId(req.params.id);
  const job = id ? db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) : null;
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

// Adzuna se fresh jobs fetch karke database mein save karo
app.post("/api/jobs/fetch", async (req, res) => {
  const { keyword = "software developer", location = "india" } = req.body || {};
  try {
    const stats = await fetchJobs(keyword, location);
    res.json({ message: "Fetch complete", keyword, location, ...stats });
  } catch (error) {
    res.status(500).json({
      error: "Adzuna fetch failed",
      details: error.response ? error.response.data : error.message
    });
  }
});

// ---------- Skills ----------
app.get("/api/skills", (req, res) => {
  res.json(db.prepare("SELECT * FROM skills ORDER BY name").all());
});

app.post("/api/skills", (req, res) => {
  const name = (req.body?.name || "").trim().toLowerCase();
  if (!name) return res.status(400).json({ error: "Skill name is required" });

  db.prepare("INSERT OR IGNORE INTO skills (name) VALUES (?)").run(name);
  const skill = db.prepare("SELECT * FROM skills WHERE name = ?").get(name);
  res.status(201).json(skill);
});

app.delete("/api/skills/:name", (req, res) => {
  const result = db.prepare("DELETE FROM skills WHERE name = ?").run(req.params.name.toLowerCase());
  if (result.changes === 0) return res.status(404).json({ error: "Skill not found" });
  res.json({ message: "Skill removed" });
});

// ---------- Applications (Job Tracker) ----------
const ALLOWED_STATUSES = ["saved", "applied", "interview", "offer", "rejected"];

app.get("/api/applications", (req, res) => {
  const rows = db.prepare(`
    SELECT a.id, a.job_id, a.status, a.notes, a.created_at, a.updated_at,
           j.title, j.company, j.apply_url
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    ORDER BY a.updated_at DESC
  `).all();
  res.json(rows);
});

app.post("/api/applications", (req, res) => {
  const { job_id, status = "saved", notes = "" } = req.body || {};

  if (!job_id) return res.status(400).json({ error: "job_id is required" });
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
  }
  const job = db.prepare("SELECT id FROM jobs WHERE id = ?").get(job_id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  try {
    const result = db.prepare("INSERT INTO applications (job_id, status, notes) VALUES (?, ?, ?)")
      .run(job_id, status, notes);
    res.status(201).json({ id: result.lastInsertRowid, job_id, status, notes });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "This job is already being tracked" });
    }
    throw error;
  }
});

app.patch("/api/applications/:id", (req, res) => {
  const { status, notes } = req.body || {};

  const id = getId(req.params.id);
  const existing = id ? db.prepare("SELECT id FROM applications WHERE id = ?").get(id) : null;
  if (!existing) return res.status(404).json({ error: "Application not found" });
  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
  }

  db.prepare(`
    UPDATE applications
    SET status = COALESCE(?, status),
        notes = COALESCE(?, notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status ?? null, notes ?? null, id);

  res.json(db.prepare("SELECT * FROM applications WHERE id = ?").get(id));
});

app.delete("/api/applications/:id", (req, res) => {
  const id = getId(req.params.id);
  const result = id ? db.prepare("DELETE FROM applications WHERE id = ?").run(id) : { changes: 0 };
  if (result.changes === 0) return res.status(404).json({ error: "Application not found" });
  res.json({ message: "Application deleted" });
});

// ---------- Matched jobs (matchJobs.js ka API version) ----------
app.get("/api/matches", (req, res) => {
  res.json(getMatchedJobs().filter((job) => job.matchCount > 0));
});

// ---------- 404 — unknown route ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found: " + req.method + " " + req.originalUrl });
});

// ---------- Error handler (invalid JSON etc.) ----------
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(error);
  res.status(500).json({ error: "Server error" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
