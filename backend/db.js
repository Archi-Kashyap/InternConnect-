const Database = require('better-sqlite3');
const db = new Database('internconnect.db');

// Foreign keys on karo (CASCADE delete ke liye zaroori)
db.pragma('foreign_keys = ON');

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

// Applications table (job application tracker)
db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'saved',
    notes TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  )
`);

module.exports = db;