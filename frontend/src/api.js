
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

// Small API helper
async function api(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

// ---------- Jobs ----------
export const getJobs = () => api("/api/jobs");
export const getMatchedJobs = () => api("/api/jobs?match=1");
export const getJob = (id) => api(`/api/jobs/${id}`);

export const fetchNewJobs = (keyword, location) =>
  api("/api/jobs/fetch", {
    method: "POST",
    body: JSON.stringify({ keyword, location })
  });

// ---------- Skills ----------
export const getSkills = () => api("/api/skills");

export const addSkill = (name) =>
  api("/api/skills", {
    method: "POST",
    body: JSON.stringify({ name })
  });

export const removeSkill = (name) =>
  api(`/api/skills/${encodeURIComponent(name)}`, {
    method: "DELETE"
  });

// ---------- Applications ----------
export const getApplications = () => api("/api/applications");

export const createApplication = (job_id, status = "saved", notes = "") =>
  api("/api/applications", {
    method: "POST",
    body: JSON.stringify({ job_id, status, notes })
  });

export const updateApplication = (id, patch) =>
  api(`/api/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });

export const deleteApplication = (id) =>
  api(`/api/applications/${id}`, {
    method: "DELETE"
  });
