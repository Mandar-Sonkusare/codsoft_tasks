const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/projectmanagement';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => console.log('✗ MongoDB connection error:', err.message));

// Schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'completed', 'on-hold'], default: 'active' },
    startDate: { type: Date },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['todo', 'in-progress', 'review', 'done'], default: 'todo' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No authentication token' });
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) return res.status(401).json({ message: 'User not found' });
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Project Routes
app.get('/api/projects', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ ownerId: req.user._id }, { members: req.user._id }]
        }).populate('ownerId', 'name email').populate('members', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/projects/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('ownerId', 'name email')
            .populate('members', 'name email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            ownerId: req.user._id,
            members: [req.user._id]
        });
        await project.save();
        await project.populate('ownerId members');
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, ownerId: req.user._id },
            req.body,
            { new: true }
        ).populate('ownerId members');
        if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found or unauthorized' });
        await Task.deleteMany({ projectId: req.params.id });
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Task Routes
app.get('/api/projects/:projectId/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ projectId: req.params.projectId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            createdBy: req.user._id
        });
        await task.save();
        await task.populate('assignedTo createdBy');
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        ).populate('assignedTo createdBy');
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users (for assigning tasks)
app.get('/api/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, 'name email');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});
