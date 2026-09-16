# Job Board - CodSoft Level 2

A full-stack job board application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- Browse and search jobs
- Filter by job type and location
- View detailed job descriptions
- Post new jobs
- Apply for jobs
- Responsive design

## Technologies

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML, CSS, JavaScript

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install MongoDB:
- Download from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud)

3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobboard
```

4. Start MongoDB (if using local):
```bash
mongod
```

5. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

6. Open browser: http://localhost:5000

## API Endpoints

- `GET /api/jobs` - Get all jobs (with optional filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job
- `POST /api/applications` - Submit application
- `GET /api/jobs/:id/applications` - Get applications for a job

## Usage

- Search for jobs using keywords and location
- Filter by job type (Full-time, Part-time, Contract, Internship)
- Click on job cards to view details
- Post new jobs via the "Post a Job" link
- Apply to jobs with your information
