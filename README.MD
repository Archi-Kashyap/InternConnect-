# 🌐 InternConnect – Personal Job Aggregator

InternConnect is a web-based personal job and internship aggregator that helps users discover relevant opportunities based on their skills.

The project fetches job listings using the Adzuna API, stores them locally in SQLite, and matches available jobs with the user's selected skills.

---

## 🚀 Features

- 🔎 Fetch job and internship listings using Adzuna API
- 🗄️ Store jobs locally using SQLite
- 🛑 Prevent duplicate job entries
- 🧠 Match jobs with user's skills
- 🛠️ Add and remove skills
- 📋 View matched job opportunities
- 📝 Track job/internship applications
- 🔗 REST API based backend
- 🎨 Web-based frontend

---

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- REST APIs
- Adzuna API

### Database
- SQLite

### Frontend
- react.js
- tailwindcss 

### Development Tools
- Git
- GitHub
- VS Code

---

## 🔗 REST API

Server chalao:

```bash
cd backend
npm start        # http://localhost:3000
```

| Method | Endpoint | Kaam |
|--------|----------|------|
| GET | `/api/jobs` | Saari saved jobs |
| GET | `/api/jobs?match=1` | Skills se matched jobs (sorted) |
| GET | `/api/jobs/:id` | Ek job ki details |
| POST | `/api/jobs/fetch` | Adzuna se fresh jobs laao (body: `{ "keyword": "python", "location": "india" }`) |
| GET | `/api/matches` | Sirf matched jobs |
| GET | `/api/skills` | Saari skills |
| POST | `/api/skills` | Nayi skill add karo (body: `{ "name": "react" }`) |
| DELETE | `/api/skills/:name` | Skill remove karo |
| GET | `/api/applications` | Tracked applications |
| POST | `/api/applications` | Application track karo (body: `{ "job_id": 1, "status": "applied", "notes": "..." }`) |
| PATCH | `/api/applications/:id` | Status/notes update karo |
| DELETE | `/api/applications/:id` | Application hatao |

Application statuses: `saved`, `applied`, `interview`, `offer`, `rejected`

### npm Scripts

```bash
npm start        # Server chalao
cd backend && npm run fetch    # Adzuna se jobs fetch karo
cd backend && npm run skills -- list    # Skills list karo
cd backend && npm run match     # Matched jobs dikhao
```

### Testing

```bash
cd backend
npm run test:server   # Recommended: khud test-server start karke 28 tests chalata hai
npm test              # Pehle se chalu server par tests chalao (TEST_PORT=3000 default)
TEST_PORT=3100 npm test  # Kisi aur port par chalu server test karo
```

---

## 📁 Project Structure

```text
InternConnect/
│
├──   backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── README.md
│
└── ...