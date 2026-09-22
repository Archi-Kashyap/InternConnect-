// InternConnect Backend Test Suite
// Chalane ke liye (server chalu ho toh):  npm test
// Server + tests dono apne aap:           npm run test:server
const { test } = require("node:test");
const assert = require("node:assert");

// Test kis server par chalana hai (default: 3000)
const PORT = process.env.TEST_PORT || "3000";
const BASE = `http://localhost:${PORT}`;

// Helper: API call karo, {status, data} wapas do
async function api(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = null;
  const text = await res.text();
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

// ---------- Health ----------
test("GET / — API info deti hai", async () => {
  const { status, data } = await api("/");
  assert.equal(status, 200);
  assert.equal(data.name, "InternConnect API");
  assert.ok(data.endpoints.length >= 12);
});

// ---------- Jobs ----------
test("GET /api/jobs — jobs list 200", async () => {
  const { status, data } = await api("/api/jobs");
  assert.equal(status, 200);
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0, "database me jobs honi chahiye");
  assert.ok(data[0].title && data[0].company);
});

test("GET /api/jobs/:id — valid job", async () => {
  const { status, data } = await api("/api/jobs/1");
  assert.equal(status, 200);
  assert.equal(data.id, 1);
});

test("GET /api/jobs/:id — invalid id par 404", async () => {
  const { status, data } = await api("/api/jobs/999999");
  assert.equal(status, 404);
  assert.ok(data.error);
});

test("GET /api/jobs/:id — non-numeric id par 404", async () => {
  const { status } = await api("/api/jobs/abc");
  assert.equal(status, 404);
});

test("GET /api/jobs?match=1 — matched jobs sorted", async () => {
  const { status, data } = await api("/api/jobs?match=1");
  assert.equal(status, 200);
  assert.ok(Array.isArray(data));
  for (let i = 1; i < data.length; i++) {
    assert.ok(data[i - 1].matchCount >= data[i].matchCount, "sort order sahi hona chahiye");
  }
});

// ---------- Skills ----------
test("GET /api/skills — skills list", async () => {
  const { status, data } = await api("/api/skills");
  assert.equal(status, 200);
  assert.ok(Array.isArray(data));
  assert.ok(data.length > 0);
});

test("POST /api/skills — nayi skill add (lowercase normalize)", async () => {
  const { status, data } = await api("/api/skills", {
    method: "POST",
    body: JSON.stringify({ name: "TestSkillXYZ" }),
  });
  assert.equal(status, 201);
  assert.equal(data.name, "testskillxyz");
});

test("POST /api/skills — duplicate add par bhi safe (OR IGNORE)", async () => {
  const { status } = await api("/api/skills", {
    method: "POST",
    body: JSON.stringify({ name: "TestSkillXYZ" }),
  });
  assert.equal(status, 201); // insert-or-ignore hone se 201 hi milega
});

test("POST /api/skills — empty name par 400", async () => {
  const { status, data } = await api("/api/skills", {
    method: "POST",
    body: JSON.stringify({ name: "   " }),
  });
  assert.equal(status, 400);
  assert.ok(data.error);
});

test("POST /api/skills — bina body ke 400", async () => {
  const { status } = await api("/api/skills", { method: "POST" });
  assert.equal(status, 400);
});

test("DELETE /api/skills/:name — remove ho jaati hai", async () => {
  const { status, data } = await api("/api/skills/testskillxyz", { method: "DELETE" });
  assert.equal(status, 200);
  assert.ok(data.message);
});

test("DELETE /api/skills/:name — dobara delete par 404", async () => {
  const { status } = await api("/api/skills/testskillxyz", { method: "DELETE" });
  assert.equal(status, 404);
});

// ---------- Matches ----------
test("GET /api/matches — sirf matched jobs (matchCount > 0)", async () => {
  const { status, data } = await api("/api/matches");
  assert.equal(status, 200);
  assert.ok(Array.isArray(data));
  data.forEach((job) => assert.ok(job.matchCount > 0));
  data.forEach((job) => assert.ok(Array.isArray(job.matchedSkills)));
});

// ---------- Applications (full CRUD cycle) ----------
let testJobId = null;
let testAppId = null;

test("SETUP — ek test job uthao", async () => {
  const { data } = await api("/api/jobs");
  testJobId = data[0].id;
  assert.ok(testJobId);
});

test("POST /api/applications — create hoti hai", async () => {
  const { status, data } = await api("/api/applications", {
    method: "POST",
    body: JSON.stringify({ job_id: testJobId, status: "applied", notes: "auto-test" }),
  });
  assert.equal(status, 201);
  assert.equal(data.status, "applied");
  testAppId = data.id;
  assert.ok(testAppId);
});

test("POST /api/applications — duplicate par 409", async () => {
  const { status } = await api("/api/applications", {
    method: "POST",
    body: JSON.stringify({ job_id: testJobId }),
  });
  assert.equal(status, 409);
});

test("POST /api/applications — invalid status par 400", async () => {
  const { status } = await api("/api/applications", {
    method: "POST",
    body: JSON.stringify({ job_id: testJobId, status: "waiting" }),
  });
  assert.equal(status, 400);
});

test("POST /api/applications — nonexistent job par 404", async () => {
  const { status } = await api("/api/applications", {
    method: "POST",
    body: JSON.stringify({ job_id: 999999 }),
  });
  assert.equal(status, 404);
});

test("POST /api/applications — bina job_id par 400", async () => {
  const { status } = await api("/api/applications", {
    method: "POST",
    body: JSON.stringify({}),
  });
  assert.equal(status, 400);
});

test("GET /api/applications — job details JOIN ke saath", async () => {
  const { status, data } = await api("/api/applications");
  assert.equal(status, 200);
  const mine = data.find((a) => a.id === testAppId);
  assert.ok(mine, "test application dikhni chahiye");
  assert.ok(mine.title && mine.company, "job title JOIN se aana chahiye");
});

test("PATCH /api/applications/:id — status update", async () => {
  const { status, data } = await api(`/api/applications/${testAppId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "interview" }),
  });
  assert.equal(status, 200);
  assert.equal(data.status, "interview");
});

test("PATCH /api/applications/:id — invalid status par 400", async () => {
  const { status } = await api(`/api/applications/${testAppId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "cancelled" }),
  });
  assert.equal(status, 400);
});

test("PATCH /api/applications/:id — nonexistent par 404", async () => {
  const { status } = await api("/api/applications/999999", {
    method: "PATCH",
    body: JSON.stringify({ status: "offer" }),
  });
  assert.equal(status, 404);
});

test("DELETE /api/applications/:id — delete hoti hai", async () => {
  const { status } = await api(`/api/applications/${testAppId}`, { method: "DELETE" });
  assert.equal(status, 200);
});

test("DELETE /api/applications/:id — dobara delete par 404", async () => {
  const { status } = await api(`/api/applications/${testAppId}`, { method: "DELETE" });
  assert.equal(status, 404);
});

// ---------- Misc ----------
test("Unknown route par 404 JSON", async () => {
  const { status, data } = await api("/api/unknown");
  assert.equal(status, 404);
  assert.ok(data.error);
});

test("Invalid JSON body par 400", async () => {
  const res = await fetch(BASE + "/api/skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{invalid json",
  });
  assert.equal(res.status, 400);
});
