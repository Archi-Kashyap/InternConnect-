const Database = require('better-sqlite3');
const db = new Database('internconnect.db');

// Jobs table banao agar pehle se nahi hai
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_job_id TEXT UNIQUE,
    title TEXT,
    company TEXT,
    location TEXT,
    description TEXT,
    apply_url TEXT,
    source TEXT DEFAULT 'adzuna',
    posted_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Skills table banao agar pehle se nahi hai
db.exec(`
  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  )
`);

module.exports = db;