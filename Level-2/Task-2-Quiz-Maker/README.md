# Quiz Maker - CodSoft Level 2

An online quiz maker application where users can create quizzes and take them.

## Features

- Create quizzes with multiple-choice questions
- Take quizzes and get instant results
- Filter quizzes by category and difficulty
- Leaderboard for each quiz
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

2. Install MongoDB or use MongoDB Atlas

3. Create `.env` file:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/quizmaker
```

4. Start the server:
```bash
npm start
```

Or for development:
```bash
npm run dev
```

5. Open browser: http://localhost:5001

## Usage

- Browse available quizzes
- Filter by category or difficulty
- Click "Create Quiz" to make a new quiz
- Take quizzes and compete on the leaderboard
