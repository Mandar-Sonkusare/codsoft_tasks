const API_URL = 'http://localhost:5000/api';

// DOM Elements
const jobsList = document.getElementById('jobs-list');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const locationInput = document.getElementById('location-input');
const typeFilter = document.getElementById('type-filter');
const clearFiltersBtn = document.getElementById('clear-filters');

const postJobModal = document.getElementById('post-job-modal');
const jobDetailsModal = document.getElementById('job-details-modal');
const applicationModal = document.getElementById('application-modal');

const postJobForm = document.getElementById('post-job-form');
const applicationForm = document.getElementById('application-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            if (e.target.textContent === 'Post a Job') {
                postJobModal.style.display = 'block';
            }
        });
    });

    // Search and Filters
    searchBtn.addEventListener('click', loadJobs);
    typeFilter.addEventListener('change', loadJobs);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Forms
    postJobForm.addEventListener('submit', handlePostJob);
    applicationForm.addEventListener('submit', handleApplication);

    // Modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Enter key for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadJobs();
    });
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadJobs();
    });
}

// Load Jobs
async function loadJobs() {
    try {
        jobsList.innerHTML = '<div class="loading">Loading jobs...</div>';
        
        const params = new URLSearchParams();
        const search = searchInput.value.trim();
        const location = locationInput.value.trim();
        const type = typeFilter.value;
        
        if (search) params.append('search', search);
        if (location) params.append('location', location);
        if (type !== 'all') params.append('type', type);
        
        const response = await fetch(`${API_URL}/jobs?${params}`);
        const jobs = await response.json();
        
        if (jobs.length === 0) {
            jobsList.innerHTML = '<div class="no-jobs">No jobs found. Try adjusting your search criteria.</div>';
            return;
        }
        
        jobsList.innerHTML = '';
        jobs.forEach(job => {
            const jobCard = createJobCard(job);
            jobsList.appendChild(jobCard);
        });
    } catch (error) {
        jobsList.innerHTML = '<div class="no-jobs">Error loading jobs. Make sure the server is running.</div>';
        console.error('Error loading jobs:', error);
    }
}

// Create Job Card
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.onclick = () => showJobDetails(job._id);
    
    const postedDate = new Date(job.postedDate).toLocaleDateString();
    
    card.innerHTML = `
        <div class="job-header">
            <div>
                <div class="job-title">${job.title}</div>
                <div class="job-company">${job.company}</div>
            </div>
            <span class="job-type">${job.type}</span>
        </div>
        <div class="job-meta">
            <span>📍 ${job.location}</span>
            <span>📅 ${postedDate}</span>
        </div>
        <div class="job-description">${job.description}</div>
        ${job.salary ? `<div class="job-salary">💰 ${job.salary}</div>` : ''}
    `;
    
    return card;
}

// Show Job Details
async function showJobDetails(jobId) {
    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`);
        const job = await response.json();
        
        const detailsDiv = document.getElementById('job-details');
        detailsDiv.innerHTML = `
            <div class="job-details-header">
                <h2 class="job-details-title">${job.title}</h2>
                <p><strong>${job.company}</strong> • ${job.location} • ${job.type}</p>
                ${job.salary ? `<p class="job-salary">💰 ${job.salary}</p>` : ''}
                <p><small>Posted: ${new Date(job.postedDate).toLocaleDateString()}</small></p>
            </div>
            
            <div class="job-details-section">
                <h3>Job Description</h3>
                <p>${job.description}</p>
            </div>
            
            <div class="job-details-section">
                <h3>Requirements</h3>
                <p>${job.requirements}</p>
            </div>
            
            <button class="btn btn-primary apply-btn" onclick="openApplicationModal('${job._id}')">
                Apply for this Job
            </button>
        `;
        
        jobDetailsModal.style.display = 'block';
    } catch (error) {
        console.error('Error loading job details:', error);
        alert('Error loading job details');
    }
}

// Open Application Modal
function openApplicationModal(jobId) {
    document.getElementById('application-job-id').value = jobId;
    jobDetailsModal.style.display = 'none';
    applicationModal.style.display = 'block';
}

// Handle Post Job
async function handlePostJob(e) {
    e.preventDefault();
    
    const formData = new FormData(postJobForm);
    const jobData = Object.fromEntries(formData);
    
    try {
        const response = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });
        
        if (response.ok) {
            alert('Job posted successfully!');
            postJobForm.reset();
            postJobModal.style.display = 'none';
            loadJobs();
        } else {
            alert('Error posting job');
        }
    } catch (error) {
        console.error('Error posting job:', error);
        alert('Error posting job. Make sure the server is running.');
    }
}

// Handle Application
async function handleApplication(e) {
    e.preventDefault();
    
    const formData = new FormData(applicationForm);
    const applicationData = Object.fromEntries(formData);
    applicationData.jobId = document.getElementById('application-job-id').value;
    
    try {
        const response = await fetch(`${API_URL}/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(applicationData)
        });
        
        if (response.ok) {
            const result = await response.json();
            applicationForm.reset();
            applicationModal.style.display = 'none';
            
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = 'Application submitted successfully!';
            document.querySelector('.jobs-section .container').insertBefore(
                successDiv,
                jobsList
            );
            
            setTimeout(() => successDiv.remove(), 5000);
        } else {
            alert('Error submitting application');
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        alert('Error submitting application. Make sure the server is running.');
    }
}

// Clear Filters
function clearFilters() {
    searchInput.value = '';
    locationInput.value = '';
    typeFilter.value = 'all';
    loadJobs();
}
