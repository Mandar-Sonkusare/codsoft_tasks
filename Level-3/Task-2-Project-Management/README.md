# Project Management Tool - CodSoft Level 3

A comprehensive project management tool with Kanban board, task tracking, and team collaboration.

## Features

- User authentication
- Create and manage projects
- Kanban-style task board (To Do, In Progress, Review, Done)
- Task assignment to team members
- Task priorities (Low, Medium, High)
- Due dates for tasks
- Project status tracking
- Team collaboration
- Responsive design

## Technologies

- **Backend:** Node.js, Express, JWT authentication
- **Database:** MongoDB with Mongoose
- **Frontend:** Vanilla JavaScript, HTML, CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install MongoDB

3. Create `.env` file:
```
PORT=5003
MONGODB_URI=mongodb://localhost:27017/projectmanagement
JWT_SECRET=your-secret-key-change-in-production
```

4. Start the server:
```bash
npm start
```

Or for development:
```bash
npm run dev
```

5. Open browser: http://localhost:5003

## Usage

1. Register a new account or login
2. Create a new project
3. Add tasks to your project
4. Assign tasks to team members
5. Move tasks across the Kanban board
6. Track project progress

## Features Breakdown

**Projects:**
- Create, view, and delete projects
- Set project status (active, completed, on-hold)
- Add project descriptions and dates
- View all projects in sidebar

**Tasks:**
- Create tasks with title and description
- Set task priority (low, medium, high)
- Assign tasks to team members
- Set due dates
- Move tasks between columns (todo, in-progress, review, done)
- Delete tasks

**Kanban Board:**
- Visual task management
- Drag-free column-based organization
- Color-coded priorities
- Task counts per column
