# CodSoft Web Development Internship - Complete Tasks

This repository contains all 7 tasks from the CodSoft Web Development Internship program (Levels 1, 2, and 3).

## 📁 Project Structure

```
CODSOFT_TASKSNO/
├── Level-1/
│   ├── Task-1-Portfolio/           (Personal Portfolio)
│   ├── Task-2-Landing-Page/        (FINTECH AI Landing Page)
│   └── Task-3-Calculator/          (Calculator App)
├── Level-2/
│   ├── Task-1-Job-Board/           (Job Board Platform)
│   └── Task-2-Quiz-Maker/          (Online Quiz Maker)
└── Level-3/
    ├── Task-1-E-Commerce/          (E-Commerce Website)
    └── Task-2-Project-Management/  (Project Management Tool)
```

---

## 📋 Level 1 Tasks (HTML, CSS, JavaScript)

### Task 1: Personal Portfolio
A professional personal portfolio showcasing education, skills, and projects.

**Technologies:** HTML, CSS, JavaScript  
**Features:**
- Responsive navigation with mobile menu
- Hero section with call-to-action
- About, Skills, Projects sections
- Resume download
- Contact information
- Smooth scrolling and animations

**How to Run:**
```bash
cd Level-1/Task-1-Portfolio
# Open index.html in browser
```

---

### Task 2: Landing Page
A modern landing page for "FINTECH AI" - an AI-powered financial insights platform.

**Technologies:** HTML, CSS, JavaScript  
**Features:**
- Fixed navigation with smooth scrolling
- Animated hero section
- Solutions showcase (4 feature cards)
- How It Works section (3-step process)
- Benefits and statistics
- Fully responsive design

**How to Run:**
```bash
cd Level-1/Task-2-Landing-Page
# Open index.html in browser
```

---

### Task 3: Calculator
A fully functional calculator with keyboard support.

**Technologies:** HTML, CSS, JavaScript  
**Features:**
- Basic operations (+, −, ×, ÷)
- Decimal number support
- Percentage calculation
- Clear and backspace functions
- Division by zero error handling
- Keyboard support
- Chained calculations
- CSS Grid layout

**How to Run:**
```bash
cd Level-1/Task-3-Calculator
# Open index.html in browser
```

---

## 🔧 Level 2 Tasks (Node.js, Express, MongoDB)

### Task 1: Job Board
A full-stack job board application for posting and applying to jobs.

**Technologies:** Node.js, Express, MongoDB, Vanilla JavaScript  
**Features:**
- Browse and search jobs
- Filter by job type and location
- View detailed job descriptions
- Post new jobs
- Apply for jobs with application form
- Responsive design

**How to Run:**
```bash
cd Level-2/Task-1-Job-Board
npm install
# Create .env file (see .env.example)
# Start MongoDB
npm start
# Open http://localhost:5000
```

**API Endpoints:**
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `POST /api/applications` - Submit application

---

### Task 2: Online Quiz Maker
Create and take quizzes with instant results and leaderboard.

**Technologies:** Node.js, Express, MongoDB, Vanilla JavaScript  
**Features:**
- Create quizzes with multiple-choice questions
- Take quizzes and get instant results
- Filter by category and difficulty
- Leaderboard for each quiz
- Score tracking and statistics
- Responsive design

**How to Run:**
```bash
cd Level-2/Task-2-Quiz-Maker
npm install
# Create .env file (see .env.example)
# Start MongoDB
npm start
# Open http://localhost:5001
```

**API Endpoints:**
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create quiz
- `POST /api/results` - Submit quiz results

---

## 🚀 Level 3 Tasks (Full-Stack Applications)

### Task 1: E-Commerce Website
A full-featured e-commerce platform with shopping cart and checkout.

**Technologies:** Node.js, Express, MongoDB, JWT, Vanilla JavaScript  
**Features:**
- User authentication (register/login)
- Product browsing with search and filters
- Shopping cart functionality
- Checkout process with shipping form
- Order history
- Demo payment integration (test only)
- Responsive design

**How to Run:**
```bash
cd Level-3/Task-1-E-Commerce
npm install
# Create .env file (see .env.example)
# Start MongoDB
npm start
# Open http://localhost:5002
```

**Important:** Payment is DEMO mode only - no real transactions.

**Sample Product Data:**
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "image": "https://via.placeholder.com/300",
  "stock": 10,
  "rating": 4.5,
  "reviews": 100
}
```

---

### Task 2: Project Management Tool
A comprehensive project management tool with Kanban board and team collaboration.

**Technologies:** Node.js, Express, MongoDB, JWT, Vanilla JavaScript  
**Features:**
- User authentication
- Create and manage projects
- Kanban board (To Do, In Progress, Review, Done)
- Task assignment to team members
- Task priorities (Low, Medium, High)
- Due dates for tasks
- Project status tracking
- Team collaboration
- Responsive design

**How to Run:**
```bash
cd Level-3/Task-2-Project-Management
npm install
# Create .env file (see .env.example)
# Start MongoDB
npm start
# Open http://localhost:5003
```

---

## 🛠️ Prerequisites

**For Level 1:**
- Modern web browser

**For Level 2 & 3:**
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## 📦 MongoDB Setup

### Option 1: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Use default connection: `mongodb://localhost:27017`

### Option 2: MongoDB Atlas (Cloud)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` files with your connection string

---

## 🔐 Environment Variables

Each Level 2 & 3 project requires a `.env` file. Copy `.env.example` to `.env` and update values:

**Job Board (Port 5000):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobboard
```

**Quiz Maker (Port 5001):**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/quizmaker
```

**E-Commerce (Port 5002):**
```
PORT=5002
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
```

**Project Management (Port 5003):**
```
PORT=5003
MONGODB_URI=mongodb://localhost:27017/projectmanagement
JWT_SECRET=your-secret-key
```

---

## 🎯 Features Summary

| Task | Level | Tech Stack | Key Features |
|------|-------|------------|--------------|
| Portfolio | 1 | HTML, CSS, JS | Responsive, Smooth scrolling, Mobile menu |
| Landing Page | 1 | HTML, CSS, JS | Modern design, Animations, Responsive |
| Calculator | 1 | HTML, CSS, JS | Full operations, Keyboard support |
| Job Board | 2 | Node, Express, MongoDB | Job posting, Applications, Search |
| Quiz Maker | 2 | Node, Express, MongoDB | Create quizzes, Leaderboard, Results |
| E-Commerce | 3 | Node, Express, MongoDB, JWT | Auth, Cart, Checkout, Orders |
| Project Mgmt | 3 | Node, Express, MongoDB, JWT | Kanban, Tasks, Team collaboration |

---

## 📱 Responsive Design

All projects are fully responsive and tested on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (480px, 360px)

---

## 🧪 Testing

**Level 1 Projects:**
- Open in browser and test all interactive features
- Test on different screen sizes using browser DevTools (F12)

**Level 2 & 3 Projects:**
- Ensure MongoDB is running
- Check server logs for errors
- Test all API endpoints
- Verify authentication flows
- Test CRUD operations

---

## ⚠️ Important Notes

1. **Demo Payment:** E-Commerce payment integration is for demonstration only. No real transactions occur.

2. **Security:** JWT secrets in `.env.example` are placeholders. Use strong, unique secrets in production.

3. **MongoDB:** Each project uses a separate database. Ensure MongoDB is running before starting servers.

4. **Ports:** Each backend runs on a different port (5000, 5001, 5002, 5003) to avoid conflicts.

5. **CORS:** All backends allow CORS for development. Configure appropriately for production.

---

## 🔧 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify network access (for MongoDB Atlas)

**Port Already in Use:**
- Change PORT in `.env` file
- Update API_URL in frontend JavaScript files

**Authentication Errors:**
- Clear browser localStorage
- Re-register/login
- Check JWT_SECRET is set correctly

---

## 📚 Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Styling:** CSS Grid, Flexbox, Custom Properties
- **Tools:** Nodemon (development)

---

## 👤 Author

Created as part of CodSoft Web Development Internship

---

## 📄 License

This project is part of the CodSoft Internship program.

---

## 🙏 Acknowledgments

- CodSoft for the internship opportunity
- MongoDB for database solutions
- Express.js for backend framework
- All open-source contributors

---

**Status:** All 7 tasks completed ✅

For detailed instructions on each project, see the README.md file in each project directory.
