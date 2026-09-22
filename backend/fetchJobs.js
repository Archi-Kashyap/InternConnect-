require('dotenv').config();
const axios = require('axios');
const db = require('./db');

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

// Insert query for one job (skips if it already exists)
const insertJob = db.prepare(`
  INSERT OR IGNORE INTO jobs (source_job_id, title, company, location, description, apply_url, posted_at)
  VALUES (@id, @title, @company, @location, @description, @apply_url, @posted_at)
`);

async function fetchJobs(keyword = 'software developer', location = 'india') {
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1`;
  const response = await axios.get(url, {
    params: {
      app_id: APP_ID,
      app_key: APP_KEY,
      results_per_page: 10,
      what: keyword,
      where: location
    }
  });

  const jobs = response.data.results;
  console.log(`Total jobs fetched: ${jobs.length}\n`);

  let savedCount = 0;

  jobs.forEach((job) => {
    const result = insertJob.run({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description,
      apply_url: job.redirect_url,
      posted_at: job.created
    });

    if (result.changes > 0) {
      savedCount++;
      console.log(`✔ Saved: ${job.title} - ${job.company.display_name}`);
    } else {
      console.log(`⏭ Skipped (duplicate): ${job.title}`);
    }
  });

  return { total: jobs.length, saved: savedCount };
}

// Sirf direct chalane par auto-fetch karo (server.js import kare toh nahi)
if (require.main === module) {
  fetchJobs('python developer')
    .then(({ total, saved }) => console.log(`\n${saved} new jobs saved to database (${total} total).`))
    .catch((error) => console.error('Error:', error.response ? error.response.data : error.message));
}

module.exports = { fetchJobs };
