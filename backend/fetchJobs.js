require('dotenv').config();
const axios = require('axios');
const db = require('./db');

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

// Ek job ko database mein insert karne ka query (agar already ho toh skip)
const insertJob = db.prepare(`
  INSERT OR IGNORE INTO jobs (source_job_id, title, company, location, description, apply_url, posted_at)
  VALUES (@id, @title, @company, @location, @description, @apply_url, @posted_at)
`);

async function fetchJobs(keyword = 'software developer', location = 'india') {
  try {
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
    console.log(`Total jobs mile: ${jobs.length}\n`);

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
        console.log(`⏭ Skipped (already exists): ${job.title}`);
      }
    });

    console.log(`\n${savedCount} nayi jobs database mein save hui.`);

  } catch (error) {
    console.error('Error aaya:', error.response ? error.response.data : error.message);
  }
}

fetchJobs('python developer');