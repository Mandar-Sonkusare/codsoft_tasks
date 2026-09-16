const API_URL = 'http://localhost:5003/api';

let user = JSON.parse(localStorage.getItem('user')) || null;
let token = localStorage.getItem('token') || null;
let projects = [];
let currentProject = null;
let tasks = [];
let users = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (token && user) {
        showMainApp();
        loadProjects();
        loadUsers();
    } else {
        showAuthPage();
    }
    setupEventListeners();
});

function setupEventListeners() {
    // Auth tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Modal close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Auth
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            user = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            showMainApp();
            loadProjects();
            loadUsers();
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error logging in. Make sure the server is running.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            token = data.token;
            user = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            showMainApp();
            loadProjects();
            loadUsers();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering. Make sure the server is running.');
    }
}

function logout() {
    token = null;
    user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuthPage();
}

function showAuthPage() {
    document.getElementById('auth-page').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
}

function showMainApp() {
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('main-app').style.display = 'grid';
    document.getElementById('user-name').textContent = `👤 ${user.name}`;
    document.getElementById('logout-btn').style.display = 'block';
}

// Projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        projects = await response.json();
        renderProjects();
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProjects() {
    const list = document.getElementById('projects-list');
    if (projects.length === 0) {
        list.innerHTML = '<div style="padding: 1rem; text-align: center; color: #9CA3AF;">No projects yet</div>';
        return;
    }

    list.innerHTML = projects.map(project => `
        <div class="project-item ${currentProject?._id === project._id ? 'active' : ''}" 
             onclick="selectProject('${project._id}')">
            <div class="project-item-name">${project.name}</div>
            <div class="project-item-status">${project.status}</div>
        </div>
    `).join('');
}

function selectProject(projectId) {
    currentProject = projects.find(p => p._id === projectId);
    if (currentProject) {
        renderProjects();
        loadTasks(projectId);
    }
}

async function loadTasks(projectId) {
    try {
        const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        tasks = await response.json();
        renderProjectView();
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProjectView() {
    const view = document.getElementById('project-view');

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const reviewTasks = tasks.filter(t => t.status === 'review');
    const doneTasks = tasks.filter(t => t.status === 'done');

    view.innerHTML = `
        <div class="project-header">
            <h1>${currentProject.name}</h1>
            <p>${currentProject.description || ''}</p>
            <div class="project-meta">
                <span>Status: ${currentProject.status}</span>
                <span>Owner: ${currentProject.ownerId.name}</span>
                <span>Members: ${currentProject.members.length}</span>
            </div>
            <div class="project-actions">
                <button class="btn btn-primary" onclick="showCreateTaskModal()">+ New Task</button>
                <button class="btn btn-danger" onclick="deleteProject()">Delete Project</button>
            </div>
        </div>

        <div class="kanban-board">
            <div class="kanban-column">
                <div class="column-header">
                    <h3>📋 To Do</h3>
                    <span class="task-count">${todoTasks.length}</span>
                </div>
                <div class="column-tasks">
                    ${todoTasks.map(task => renderTaskCard(task)).join('')}
                </div>
            </div>

            <div class="kanban-column">
                <div class="column-header">
                    <h3>🔄 In Progress</h3>
                    <span class="task-count">${inProgressTasks.length}</span>
                </div>
                <div class="column-tasks">
                    ${inProgressTasks.map(task => renderTaskCard(task)).join('')}
                </div>
            </div>

            <div class="kanban-column">
                <div class="column-header">
                    <h3>👀 Review</h3>
                    <span class="task-count">${reviewTasks.length}</span>
                </div>
                <div class="column-tasks">
                    ${reviewTasks.map(task => renderTaskCard(task)).join('')}
                </div>
            </div>

            <div class="kanban-column">
                <div class="column-header">
                    <h3>✅ Done</h3>
                    <span class="task-count">${doneTasks.length}</span>
                </div>
                <div class="column-tasks">
                    ${doneTasks.map(task => renderTaskCard(task)).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderTaskCard(task) {
    return `
        <div class="task-card priority-${task.priority}">
            <div class="task-title">${task.title}</div>
            ${task.description ? `<p style="font-size: 0.875rem; margin: 0.5rem 0;">${task.description}</p>` : ''}
            <div class="task-meta">
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                <span>${task.assignedTo ? task.assignedTo.name : 'Unassigned'}</span>
            </div>
            <div class="task-actions">
                ${task.status !== 'in-progress' ? `<button class="btn btn-secondary" onclick="updateTaskStatus('${task._id}', 'in-progress')">Start</button>` : ''}
                ${task.status !== 'done' ? `<button class="btn btn-secondary" onclick="updateTaskStatus('${task._id}', 'done')">Complete</button>` : ''}
                <button class="btn btn-danger" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        </div>
    `;
}

// Modals
function showCreateProjectModal() {
    document.getElementById('project-modal').style.display = 'block';
}

function showCreateTaskModal() {
    const select = document.getElementById('assign-select');
    select.innerHTML = '<option value="">Unassigned</option>' + 
        users.map(u => `<option value="${u._id}">${u.name}</option>`).join('');
    document.getElementById('task-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Create Project
async function handleCreateProject(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const projectData = Object.fromEntries(formData);

    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(projectData)
        });

        if (response.ok) {
            closeModal('project-modal');
            e.target.reset();
            loadProjects();
        } else {
            alert('Error creating project');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating project');
    }
}

// Create Task
async function handleCreateTask(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = Object.fromEntries(formData);
    taskData.projectId = currentProject._id;
    if (!taskData.assignedTo) delete taskData.assignedTo;

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            closeModal('task-modal');
            e.target.reset();
            loadTasks(currentProject._id);
        } else {
            alert('Error creating task');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating task');
    }
}

// Update Task Status
async function updateTaskStatus(taskId, status) {
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            loadTasks(currentProject._id);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Delete Task
async function deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;

    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadTasks(currentProject._id);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Delete Project
async function deleteProject() {
    if (!confirm('Delete this project and all its tasks?')) return;

    try {
        const response = await fetch(`${API_URL}/projects/${currentProject._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            currentProject = null;
            loadProjects();
            document.getElementById('project-view').innerHTML = '<div class="empty-state"><h2>Project deleted</h2><p>Select another project or create a new one</p></div>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        users = await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}
