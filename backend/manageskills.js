const db = require('./db');

const action = process.argv[2];  // add, list, ya remove
const value = process.argv[3];   // skill ka naam

if (action === 'add') {
  db.prepare('INSERT OR IGNORE INTO skills (name) VALUES (?)').run(value.toLowerCase());
  console.log(`✔ Skill add ho gayi: ${value}`);
}

else if (action === 'remove') {
  db.prepare('DELETE FROM skills WHERE name = ?').run(value.toLowerCase());
  console.log(`✔ Skill remove ho gayi: ${value}`);
}

else if (action === 'list') {
  const skills = db.prepare('SELECT name FROM skills').all();
  console.log('Tumhari skills:');
  skills.forEach(s => console.log(`- ${s.name}`));
}

else {
  console.log('Usage: node manageSkills.js add|remove|list <skill_name>');
}