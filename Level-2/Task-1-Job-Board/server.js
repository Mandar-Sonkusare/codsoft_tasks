const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection (using local MongoDB or connection string from .env)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobboard';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✓ Connected to MongoDB'))
    .catch(err => console.log('✗ MongoDB connection error:', err.message));

// Job Schema
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // Full-time, Part-time, Contract
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    salary: { type: String },
    postedDate: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);

// Application Schema
const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String },
    coverLetter: { type: String },
    appliedDate: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);

// Routes

// Get all jobs
app.get('/api/jobs', async (req, res) => {
    try {
        const { search, type, location } = req.query;
        let filter = {};
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (type && type !== 'all') {
            filter.type = type;
        }
        
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        
        const jobs = await Job.find(filter).sort({ postedDate: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single job
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Post a new job
app.post('/api/jobs', async (req, res) => {
    try {
        const job = new Job(req.body);
        const savedJob = await job.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Submit job application
app.post('/api/applications', async (req, res) => {
    try {
        const application = new Application(req.body);
        const savedApplication = await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application: savedApplication });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get applications for a job
app.get('/api/jobs/:id/applications', async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.id });
        res.json(applications);
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
