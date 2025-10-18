/**
 * Admin Panel JavaScript
 * Portfolio Content Management System
 */

(function() {
    'use strict';

    // Default credentials (CHANGE THESE!)
    const DEFAULT_USERNAME = 'admin';
    const DEFAULT_PASSWORD = 'portfolio2025';

    // Check if user is logged in
    function isLoggedIn() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    }

    // Initialize admin panel
    function init() {
        if (isLoggedIn()) {
            showDashboard();
            loadProjects();
            loadExperience();
            loadSkills();
        } else {
            showLogin();
        }

        setupEventListeners();
    }

    // Show/Hide screens
    function showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    }

    function showDashboard() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
    }

    // Authentication
    function login(username, password) {
        const storedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD;

        if (username === DEFAULT_USERNAME && password === storedPassword) {
            localStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
            loadProjects();
            loadExperience();
            loadSkills();
            return true;
        }
        return false;
    }

    function logout() {
        localStorage.setItem('adminLoggedIn', 'false');
        showLogin();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Login form
        document.getElementById('login-form')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (login(username, password)) {
                document.getElementById('login-error').style.display = 'none';
            } else {
                const errorEl = document.getElementById('login-error');
                errorEl.textContent = 'Invalid credentials';
                errorEl.style.display = 'block';
            }
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', logout);

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;

                // Remove active class
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                // Add active class
                this.classList.add('active');
                document.getElementById(`tab-${tab}`).classList.add('active');
            });
        });

        // Add project button
        document.getElementById('add-project-btn')?.addEventListener('click', () => openProjectModal());

        // Add experience button
        document.getElementById('add-experience-btn')?.addEventListener('click', () => openExperienceModal());

        // Project form
        document.getElementById('project-form')?.addEventListener('submit', saveProject);

        // Change password
        document.getElementById('change-password-form')?.addEventListener('submit', changePassword);

        // Export/Import data
        document.getElementById('export-data-btn')?.addEventListener('click', exportData);
        document.getElementById('import-data-btn')?.addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file')?.addEventListener('change', importData);

        // Save skills
        document.getElementById('save-skills-btn')?.addEventListener('click', saveSkills);
    }

    // Projects Management
    function loadProjects() {
        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const container = document.getElementById('projects-list');

        if (projects.length === 0) {
            container.innerHTML = '<p class="text-dim">No projects added yet</p>';
            return;
        }

        container.innerHTML = projects.map((project, index) => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-title">${project.title}</div>
                    <div class="admin-item-meta">${project.subtitle} • ${project.technologies?.join(', ') || 'No tech'}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="icon-btn" onclick="editProject(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="icon-btn danger" onclick="deleteProject(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function openProjectModal(index = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-form');
        form.reset();

        if (index !== null) {
            const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
            const project = projects[index];

            document.getElementById('project-id').value = index;
            document.getElementById('project-title').value = project.title;
            document.getElementById('project-subtitle').value = project.subtitle;
            document.getElementById('project-tech').value = project.technologies?.join(', ') || '';
            document.getElementById('project-code').value = project.code || '';
            document.getElementById('project-github').value = project.github || '';
            document.getElementById('project-demo').value = project.demo || '';
            document.getElementById('project-image').value = project.image || '';
        }

        modal.style.display = 'flex';
    }

    function saveProject(e) {
        e.preventDefault();

        const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
        const index = document.getElementById('project-id').value;

        const project = {
            title: document.getElementById('project-title').value,
            subtitle: document.getElementById('project-subtitle').value,
            technologies: document.getElementById('project-tech').value.split(',').map(t => t.trim()),
            code: document.getElementById('project-code').value,
            github: document.getElementById('project-github').value,
            demo: document.getElementById('project-demo').value,
            image: document.getElementById('project-image').value || './assets/images/project-placeholder.png'
        };

        if (index) {
            projects[index] = project;
        } else {
            projects.push(project);
        }

        localStorage.setItem('portfolioProjects', JSON.stringify(projects));
        closeModal();
        loadProjects();
    }

    function editProject(index) {
        openProjectModal(index);
    }

    function deleteProject(index) {
        if (confirm('Delete this project?')) {
            const projects = JSON.parse(localStorage.getItem('portfolioProjects') || '[]');
            projects.splice(index, 1);
            localStorage.setItem('portfolioProjects', JSON.stringify(projects));
            loadProjects();
        }
    }

    // Experience Management
    function loadExperience() {
        const experience = JSON.parse(localStorage.getItem('portfolioExperience') || '[]');
        const container = document.getElementById('experience-list');

        if (experience.length === 0) {
            container.innerHTML = '<p class="text-dim">No experience added yet</p>';
            return;
        }

        container.innerHTML = experience.map((exp, index) => `
            <div class="admin-item">
                <div class="admin-item-content">
                    <div class="admin-item-title">${exp.title} @ ${exp.company}</div>
                    <div class="admin-item-meta">${exp.period}</div>
                </div>
                <div class="admin-item-actions">
                    <button class="icon-btn danger" onclick="deleteExperience(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function deleteExperience(index) {
        if (confirm('Delete this experience?')) {
            const experience = JSON.parse(localStorage.getItem('portfolioExperience') || '[]');
            experience.splice(index, 1);
            localStorage.setItem('portfolioExperience', JSON.stringify(experience));
            loadExperience();
        }
    }

    // Skills Management
    function loadSkills() {
        const skills = JSON.parse(localStorage.getItem('portfolioSkills') || '{}');
        const container = document.getElementById('skills-editor');

        const categories = ['languages', 'frontend', 'backend', 'security', 'tools'];

        container.innerHTML = categories.map(cat => {
            const catSkills = skills[cat] || [];
            return `
                <div class="skill-category-editor">
                    <div class="skill-category-header">
                        <span class="skill-category-title">${cat}/</span>
                    </div>
                    <div class="skill-inputs" id="skills-${cat}">
                        ${catSkills.map((skill, i) => `
                            <div class="skill-input-row">
                                <input type="text" value="${skill.name}" placeholder="Skill name" data-cat="${cat}" data-idx="${i}" data-field="name">
                                <input type="text" value="${skill.comment || ''}" placeholder="Comment" data-cat="${cat}" data-idx="${i}" data-field="comment">
                                <button class="icon-btn danger" onclick="removeSkill('${cat}', ${i})">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('')}
                        <button class="btn-terminal-small" onclick="addSkillInput('${cat}')">
                            <i class="fas fa-plus"></i> Add Skill
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function addSkillInput(category) {
        const skills = JSON.parse(localStorage.getItem('portfolioSkills') || '{}');
        if (!skills[category]) skills[category] = [];
        skills[category].push({ name: '', comment: '' });
        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
        loadSkills();
    }

    function removeSkill(category, index) {
        const skills = JSON.parse(localStorage.getItem('portfolioSkills') || '{}');
        skills[category].splice(index, 1);
        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
        loadSkills();
    }

    function saveSkills() {
        const skills = {};
        const categories = ['languages', 'frontend', 'backend', 'security', 'tools'];

        categories.forEach(cat => {
            skills[cat] = [];
            document.querySelectorAll(`[data-cat="${cat}"]`).forEach(input => {
                const idx = parseInt(input.dataset.idx);
                const field = input.dataset.field;

                if (!skills[cat][idx]) skills[cat][idx] = {};
                skills[cat][idx][field] = input.value;
            });
        });

        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
        alert('Skills saved successfully!');
    }

    // Settings
    function changePassword(e) {
        e.preventDefault();
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;

        if (newPass !== confirmPass) {
            alert('Passwords do not match');
            return;
        }

        localStorage.setItem('adminPassword', newPass);
        alert('Password changed successfully!');
        e.target.reset();
    }

    // Data Export/Import
    function exportData() {
        const data = {
            projects: JSON.parse(localStorage.getItem('portfolioProjects') || '[]'),
            experience: JSON.parse(localStorage.getItem('portfolioExperience') || '[]'),
            skills: JSON.parse(localStorage.getItem('portfolioSkills') || '{}')
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-data-${Date.now()}.json`;
        a.click();
    }

    function importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);

                if (data.projects) localStorage.setItem('portfolioProjects', JSON.stringify(data.projects));
                if (data.experience) localStorage.setItem('portfolioExperience', JSON.stringify(data.experience));
                if (data.skills) localStorage.setItem('portfolioSkills', JSON.stringify(data.skills));

                alert('Data imported successfully!');
                loadProjects();
                loadExperience();
                loadSkills();
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Modal functions
    window.closeModal = function() {
        document.getElementById('project-modal').style.display = 'none';
    };

    window.editProject = editProject;
    window.deleteProject = deleteProject;
    window.deleteExperience = deleteExperience;
    window.addSkillInput = addSkillInput;
    window.removeSkill = removeSkill;

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
