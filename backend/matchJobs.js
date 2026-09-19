const db = require('./db');

// Saari skills nikal lo database se
const skills = db.prepare('SELECT name FROM skills').all().map(s => s.name);

// Saari jobs nikal lo
const jobs = db.prepare('SELECT * FROM jobs').all();

console.log(`Tumhari skills: ${skills.join(', ')}\n`);
console.log('--- Matching Jobs ---\n');

const results = jobs.map(job => {
  const text = (job.title + ' ' + job.description).toLowerCase();
  const matchedSkills = skills.filter(skill => text.includes(skill));
  return { ...job, matchedSkills, matchCount: matchedSkills.length };
});

// Sabse zyada match wali job pehle dikhao
results.sort((a, b) => b.matchCount - a.matchCount);

results.forEach(job => {
  if (job.matchCount > 0) {
    console.log(`✅ ${job.title} - ${job.company}`);
    console.log(`   Matched: ${job.matchedSkills.join(', ')}`);
    console.log(`   Apply: ${job.apply_url}`);
    console.log('---');
  }
});

const noMatch = results.filter(j => j.matchCount === 0).length;
console.log(`\n${noMatch} jobs mein koi skill match nahi hui.`);