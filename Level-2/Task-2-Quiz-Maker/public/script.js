const API_URL = 'http://localhost:5001/api';

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];

// DOM Elements
const homeSection = document.getElementById('home-section');
const createSection = document.getElementById('create-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');

const homeLink = document.getElementById('home-link');
const createLink = document.getElementById('create-link');

const quizzesList = document.getElementById('quizzes-list');
const categoryFilter = document.getElementById('category-filter');
const difficultyFilter = document.getElementById('difficulty-filter');

const quizForm = document.getElementById('quiz-form');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadQuizzes();
    setupEventListeners();
    addQuestion(); // Add first question by default
});

// Setup Event Listeners
function setupEventListeners() {
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
        loadQuizzes();
    });

    createLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('create');
    });

    categoryFilter.addEventListener('change', loadQuizzes);
    difficultyFilter.addEventListener('change', loadQuizzes);

    addQuestionBtn.addEventListener('click', addQuestion);
    quizForm.addEventListener('submit', handleCreateQuiz);
}

// Show Section
function showSection(section) {
    homeSection.style.display = 'none';
    createSection.style.display = 'none';
    quizSection.style.display = 'none';
    resultSection.style.display = 'none';

    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

    if (section === 'home') {
        homeSection.style.display = 'block';
        homeLink.classList.add('active');
    } else if (section === 'create') {
        createSection.style.display = 'block';
        createLink.classList.add('active');
    } else if (section === 'quiz') {
        quizSection.style.display = 'block';
    } else if (section === 'result') {
        resultSection.style.display = 'block';
    }
}

// Load Quizzes
async function loadQuizzes() {
    try {
        quizzesList.innerHTML = '<div class="loading">Loading quizzes...</div>';

        const params = new URLSearchParams();
        if (categoryFilter.value) params.append('category', categoryFilter.value);
        if (difficultyFilter.value) params.append('difficulty', difficultyFilter.value);

        const response = await fetch(`${API_URL}/quizzes?${params}`);
        const quizzes = await response.json();

        if (quizzes.length === 0) {
            quizzesList.innerHTML = '<div class="no-quizzes">No quizzes found. Create one!</div>';
            return;
        }

        quizzesList.innerHTML = '';
        quizzes.forEach(quiz => {
            const card = createQuizCard(quiz);
            quizzesList.appendChild(card);
        });
    } catch (error) {
        quizzesList.innerHTML = '<div class="no-quizzes">Error loading quizzes. Make sure the server is running.</div>';
        console.error('Error:', error);
    }
}

// Create Quiz Card
function createQuizCard(quiz) {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.onclick = () => startQuiz(quiz._id);

    card.innerHTML = `
        <div class="quiz-title">${quiz.title}</div>
        <div class="quiz-meta">
            <span class="quiz-badge badge-category">${quiz.category}</span>
            <span class="quiz-badge badge-difficulty ${quiz.difficulty.toLowerCase()}">${quiz.difficulty}</span>
        </div>
        <p>${quiz.description || 'Test your knowledge with this quiz!'}</p>
        <div class="quiz-stats">
            📝 ${quiz.questions.length} Questions • 👤 ${quiz.createdBy} • 🎯 ${quiz.totalAttempts} attempts
        </div>
    `;

    return card;
}

// Add Question
function addQuestion() {
    const questionNum = questionsContainer.children.length + 1;
    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';

    questionBlock.innerHTML = `
        <button type="button" class="remove-question" onclick="this.parentElement.remove()">Remove</button>
        <h4>Question ${questionNum}</h4>
        <div class="form-group">
            <label>Question Text *</label>
            <input type="text" class="question-text" required>
        </div>
        <div class="form-group">
            <label>Options (select the correct answer) *</label>
            <div class="option-input">
                <input type="radio" name="correct-${questionNum}" value="0" required>
                <input type="text" class="option-text" placeholder="Option 1" required>
            </div>
            <div class="option-input">
                <input type="radio" name="correct-${questionNum}" value="1">
                <input type="text" class="option-text" placeholder="Option 2" required>
            </div>
            <div class="option-input">
                <input type="radio" name="correct-${questionNum}" value="2">
                <input type="text" class="option-text" placeholder="Option 3" required>
            </div>
            <div class="option-input">
                <input type="radio" name="correct-${questionNum}" value="3">
                <input type="text" class="option-text" placeholder="Option 4" required>
            </div>
        </div>
        <div class="form-group">
            <label>Points</label>
            <input type="number" class="question-points" value="10" min="1">
        </div>
    `;

    questionsContainer.appendChild(questionBlock);
}

// Handle Create Quiz
async function handleCreateQuiz(e) {
    e.preventDefault();

    const questions = [];
    const questionBlocks = questionsContainer.querySelectorAll('.question-block');

    questionBlocks.forEach((block, index) => {
        const questionText = block.querySelector('.question-text').value;
        const optionTexts = Array.from(block.querySelectorAll('.option-text')).map(input => input.value);
        const correctAnswer = parseInt(block.querySelector(`input[name="correct-${index + 1}"]:checked`).value);
        const points = parseInt(block.querySelector('.question-points').value) || 10;

        questions.push({
            question: questionText,
            options: optionTexts,
            correctAnswer,
            points
        });
    });

    const quizData = {
        title: document.getElementById('quiz-title').value,
        description: document.getElementById('quiz-description').value,
        category: document.getElementById('quiz-category').value,
        difficulty: document.getElementById('quiz-difficulty').value,
        createdBy: document.getElementById('quiz-creator').value || 'Anonymous',
        questions
    };

    try {
        const response = await fetch(`${API_URL}/quizzes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizData)
        });

        if (response.ok) {
            alert('Quiz created successfully!');
            quizForm.reset();
            questionsContainer.innerHTML = '';
            addQuestion();
            showSection('home');
            loadQuizzes();
        } else {
            alert('Error creating quiz');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating quiz. Make sure the server is running.');
    }
}

// Start Quiz
async function startQuiz(quizId) {
    try {
        const response = await fetch(`${API_URL}/quizzes/${quizId}`);
        currentQuiz = await response.json();
        currentQuestionIndex = 0;
        userAnswers = [];

        showSection('quiz');
        displayQuizQuestion();
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading quiz');
    }
}

// Display Quiz Question
function displayQuizQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const question = currentQuiz.questions[currentQuestionIndex];

    const isLast = currentQuestionIndex === currentQuiz.questions.length - 1;

    quizContent.innerHTML = `
        <div class="quiz-header">
            <h2>${currentQuiz.title}</h2>
            <p>Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}</p>
        </div>

        <div class="quiz-question">
            <div class="question-number">Question ${currentQuestionIndex + 1}</div>
            <div class="question-text">${question.question}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label class="option" onclick="selectOption(this, ${index})">
                        <input type="radio" name="answer" value="${index}">
                        ${option}
                    </label>
                `).join('')}
            </div>
        </div>

        <div class="quiz-navigation">
            <button class="btn btn-secondary" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'style="visibility:hidden"' : ''}>
                ← Previous
            </button>
            <button class="btn btn-primary" onclick="${isLast ? 'finishQuiz()' : 'nextQuestion()'}">
                ${isLast ? 'Finish Quiz' : 'Next →'}
            </button>
        </div>
    `;

    // Restore previous answer if exists
    if (userAnswers[currentQuestionIndex] !== undefined) {
        const options = document.querySelectorAll('.option');
        options[userAnswers[currentQuestionIndex]].classList.add('selected');
        options[userAnswers[currentQuestionIndex]].querySelector('input').checked = true;
    }
}

function selectOption(label, index) {
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
    label.classList.add('selected');
    userAnswers[currentQuestionIndex] = index;
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuizQuestion();
    }
}

function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        alert('Please select an answer');
        return;
    }

    currentQuestionIndex++;
    displayQuizQuestion();
}

async function finishQuiz() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
        alert('Please select an answer');
        return;
    }

    const userName = prompt('Enter your name for the leaderboard:') || 'Anonymous';

    const answers = userAnswers.map((answer, index) => ({
        questionIndex: index,
        selectedAnswer: answer
    }));

    try {
        const response = await fetch(`${API_URL}/results`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quizId: currentQuiz._id,
                userName,
                answers
            })
        });

        const result = await response.json();
        displayResult(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting quiz');
    }
}

async function displayResult(result) {
    showSection('result');

    const leaderboardResponse = await fetch(`${API_URL}/quizzes/${currentQuiz._id}/leaderboard`);
    const leaderboard = await leaderboardResponse.json();

    const resultContent = document.getElementById('result-content');
    resultContent.innerHTML = `
        <div class="result-card">
            <h2>Quiz Completed!</h2>
            <div class="result-score">${result.percentage.toFixed(0)}%</div>
            <div class="result-message">
                ${result.percentage >= 80 ? 'Excellent! 🎉' : result.percentage >= 60 ? 'Good job! 👍' : 'Keep practicing! 💪'}
            </div>

            <div class="result-details">
                <div class="result-row">
                    <span>Score:</span>
                    <strong>${result.score} / ${result.totalPoints}</strong>
                </div>
                <div class="result-row">
                    <span>Correct Answers:</span>
                    <strong>${result.answers.filter(a => a.isCorrect).length} / ${result.answers.length}</strong>
                </div>
                <div class="result-row">
                    <span>Percentage:</span>
                    <strong>${result.percentage.toFixed(1)}%</strong>
                </div>
            </div>

            <div class="leaderboard">
                <h3>🏆 Top 10 Leaderboard</h3>
                ${leaderboard.map((entry, index) => `
                    <div class="leaderboard-item">
                        <span><span class="leaderboard-rank">#${index + 1}</span> ${entry.userName}</span>
                        <strong>${entry.score} pts (${entry.percentage.toFixed(0)}%)</strong>
                    </div>
                `).join('')}
            </div>

            <button class="btn btn-primary" onclick="showSection('home'); loadQuizzes();">
                Back to Quizzes
            </button>
        </div>
    `;
}
