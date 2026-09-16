const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizmaker';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => console.log('✗ MongoDB connection error:', err.message));

// Quiz Schema
const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    questions: [{
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true },
        points: { type: Number, default: 10 }
    }],
    createdBy: { type: String, default: 'Anonymous' },
    createdAt: { type: Date, default: Date.now },
    totalAttempts: { type: Number, default: 0 }
});

const Quiz = mongoose.model('Quiz', quizSchema);

// Result Schema
const resultSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userName: { type: String, required: true },
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answers: [{
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean
    }],
    completedAt: { type: Date, default: Date.now }
});

const Result = mongoose.model('Result', resultSchema);

// Routes

// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        const { category, difficulty } = req.query;
        let filter = {};
        
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        
        const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single quiz
app.get('/api/quizzes/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create quiz
app.post('/api/quizzes', async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        const savedQuiz = await quiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Submit quiz result
app.post('/api/results', async (req, res) => {
    try {
        const { quizId, userName, answers } = req.body;
        
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        // Calculate score
        let score = 0;
        let totalPoints = 0;
        const resultAnswers = [];
        
        quiz.questions.forEach((question, index) => {
            totalPoints += question.points;
            const userAnswer = answers.find(a => a.questionIndex === index);
            const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;
            
            if (isCorrect) {
                score += question.points;
            }
            
            resultAnswers.push({
                questionIndex: index,
                selectedAnswer: userAnswer ? userAnswer.selectedAnswer : -1,
                isCorrect
            });
        });
        
        const percentage = (score / totalPoints) * 100;
        
        const result = new Result({
            quizId,
            userName,
            score,
            totalPoints,
            percentage,
            answers: resultAnswers
        });
        
        await result.save();
        
        // Update quiz attempts
        quiz.totalAttempts += 1;
        await quiz.save();
        
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get leaderboard for a quiz
app.get('/api/quizzes/:id/leaderboard', async (req, res) => {
    try {
        const results = await Result.find({ quizId: req.params.id })
            .sort({ score: -1, completedAt: 1 })
            .limit(10);
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});
