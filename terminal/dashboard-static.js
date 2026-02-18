// Dashboard State - Using Static Workspace Data
let workspaceData = null;
let currentDepartment = null;
let currentPath = '';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadStaticData();
    
    // Refresh every 5 minutes
    setInterval(loadStaticData, 300000);
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Department clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.department-card')) {
            const deptKey = e.target.closest('.department-card').dataset.dept;
            showDepartmentFiles(deptKey);
        }
        
        if (e.target.closest('.file-item')) {
            const file = e.target.closest('.file-item');
            highlightFile(file);
        }
    });
}

// Load static workspace data
async function loadStaticData() {
    try {
        const response = await fetch('workspace-data.json?' + Date.now());
        workspaceData = await response.json();
        
        updateDashboard();
        updateLastUpdated();
    } catch (error) {
        console.error('Error loading workspace data:', error);
        showError('Failed to load workspace data');
    }
}

// Update entire dashboard
function updateDashboard() {
    if (!workspaceData) return;
    
    updateDepartmentStatus();
    updateFunnelPipeline();
    updateFileSystem();
    updateFailuresLog();
}

// Update department status grid
function updateDepartmentStatus() {
    const grid = document.getElementById('departmentGrid');
    grid.innerHTML = '';
    
    // Define expected departments
    const expectedDepts = {
        'content-boss': 'Content Creation',
        'design-boss': 'Design & Visual',
        'funnel-boss': 'Funnel & Sales',
        'ads-boss': 'Marketing & Ads',
        'reviews-boss': 'Reviews & Social Proof',
        'seo-boss': 'SEO & Search',
        'analytics-boss': 'Analytics & Data',
        'launch-boss': 'Launch Operations',
        'operations-boss': 'Operations & Infrastructure'
    };
    
    for (const [key, name] of Object.entries(expectedDepts)) {
        const dept = workspaceData.departments[key];
        const card = createDepartmentCard(key, name, dept);
        grid.appendChild(card);
    }
}

// Create department card
function createDepartmentCard(key, name, data) {
    const card = document.createElement('div');
    card.className = 'department-card';
    card.dataset.dept = key;
    
    if (!data || data.fileCount === 0) {
        card.classList.add('inactive');
        card.innerHTML = `
            <h3>${name}</h3>
            <div class="status-indicator inactive"></div>
            <div class="insights">No agent assigned</div>
            <div class="details">
                <span><i class="fas fa-folder"></i> 0 files</span>
            </div>
        `;
    } else {
        card.classList.add('active');
        const lastActivity = data.lastModified ? formatTimeAgo(new Date(data.lastModified)) : 'Unknown';
        
        card.innerHTML = `
            <h3>${name}</h3>
            <div class="status-indicator active"></div>
            <div class="insights">${data.fileCount} files • Last activity ${lastActivity}</div>
            <div class="details">
                <span><i class="fas fa-folder"></i> ${data.fileCount} files</span>
                <span><i class="fas fa-robot"></i> Active</span>
            </div>
        `;
    }
    
    return card;
}

// Update funnel pipeline
function updateFunnelPipeline() {
    const container = document.getElementById('funnelVisualization');
    container.innerHTML = '';
    
    // Calculate funnel stages based on department activity
    const stages = [
        { 
            name: 'Research', 
            progress: workspaceData.departments['content-boss'] ? 100 : 0,
            status: 'completed' 
        },
        { 
            name: 'Content', 
            progress: workspaceData.departments['content-boss']?.fileCount > 0 ? 100 : 0,
            status: workspaceData.departments['content-boss']?.fileCount > 0 ? 'completed' : 'not_started'
        },
        { 
            name: 'Design', 
            progress: workspaceData.departments['design-boss']?.fileCount > 0 ? 80 : 0,
            status: workspaceData.departments['design-boss']?.fileCount > 0 ? 'in_progress' : 'not_started'
        },
        { 
            name: 'Launch', 
            progress: workspaceData.departments['launch-boss']?.fileCount > 0 ? 50 : 0,
            status: workspaceData.departments['launch-boss']?.fileCount > 0 ? 'in_progress' : 'not_started'
        },
        { 
            name: 'Marketing', 
            progress: workspaceData.departments['ads-boss']?.fileCount > 0 ? 20 : 0,
            status: workspaceData.departments['ads-boss']?.fileCount > 0 ? 'in_progress' : 'not_started'
        }
    ];
    
    stages.forEach((stage, index) => {
        const stageEl = document.createElement('div');
        stageEl.className = `funnel-stage ${stage.status}`;
        stageEl.style.setProperty('--stage-index', index);
        
        stageEl.innerHTML = `
            <div class="stage-name">${stage.name}</div>
            <div class="stage-progress">
                <div class="progress-bar" style="width: ${stage.progress}%"></div>
            </div>
            <div class="stage-status">${stage.progress}%</div>
        `;
        
        container.appendChild(stageEl);
    });
}

// Update file system browser
function updateFileSystem() {
    const breadcrumb = document.getElementById('fileBreadcrumb');
    const fileList = document.getElementById('fileList');
    
    breadcrumb.innerHTML = `
        <span class="breadcrumb-item" onclick="showAllDepartments()">Workspaces</span>
        ${currentDepartment ? ` / <span class="breadcrumb-item">${workspaceData.departments[currentDepartment].name}</span>` : ''}
    `;
    
    if (!currentDepartment) {
        // Show all departments
        showAllDepartments();
    } else {
        // Show files for selected department
        showDepartmentFiles(currentDepartment);
    }
}

// Show all departments in file browser
function showAllDepartments() {
    currentDepartment = null;
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    for (const [key, dept] of Object.entries(workspaceData.departments)) {
        if (dept.fileCount === 0) continue;
        
        const item = document.createElement('div');
        item.className = 'file-item';
        item.dataset.dept = key;
        item.onclick = () => showDepartmentFiles(key);
        
        item.innerHTML = `
            <span class="file-icon"><i class="fas fa-folder"></i></span>
            <span class="file-name">${dept.name}</span>
            <span class="file-size">${dept.fileCount} files</span>
            <span class="file-date">${formatTimeAgo(new Date(dept.lastModified))}</span>
        `;
        
        fileList.appendChild(item);
    }
}

// Show files for a specific department
function showDepartmentFiles(deptKey) {
    currentDepartment = deptKey;
    const dept = workspaceData.departments[deptKey];
    if (!dept) return;
    
    updateFileSystem();
    
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';
    
    // Sort files by date
    const sortedFiles = dept.files.sort((a, b) => 
        new Date(b.modified) - new Date(a.modified)
    );
    
    sortedFiles.forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-item';
        
        const icon = getFileIcon(file.type);
        
        item.innerHTML = `
            <span class="file-icon">${icon}</span>
            <span class="file-name">${file.name}</span>
            <span class="file-size">${file.size}</span>
            <span class="file-date">${formatTimeAgo(new Date(file.modified))}</span>
        `;
        
        fileList.appendChild(item);
    });
}

// Update failures log
function updateFailuresLog() {
    const container = document.getElementById('failuresList');
    if (!container) return;
    
    // For now, show recent activity as a proxy for potential issues
    const recentFiles = workspaceData.recentActivity.slice(0, 5);
    
    container.innerHTML = recentFiles.map(file => `
        <div class="failure-item">
            <div class="failure-header">
                <span class="failure-type">Activity</span>
                <span class="failure-time">${formatTimeAgo(new Date(file.modified))}</span>
            </div>
            <div class="failure-description">${file.name} updated in ${file.department}</div>
        </div>
    `).join('');
}

// Utility functions
function getFileIcon(type) {
    const icons = {
        'document': '<i class="fas fa-file-alt"></i>',
        'code': '<i class="fas fa-file-code"></i>',
        'data': '<i class="fas fa-file-csv"></i>',
        'image': '<i class="fas fa-file-image"></i>',
        'video': '<i class="fas fa-file-video"></i>',
        'audio': '<i class="fas fa-file-audio"></i>',
        'archive': '<i class="fas fa-file-archive"></i>',
        'file': '<i class="fas fa-file"></i>'
    };
    return icons[type] || icons.file;
}

function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + 'd ago';
    
    return date.toLocaleDateString();
}

function highlightFile(element) {
    document.querySelectorAll('.file-item').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function updateLastUpdated() {
    const timestamp = workspaceData ? new Date(workspaceData.timestamp) : new Date();
    document.getElementById('lastUpdated').textContent = timestamp.toUTCString();
}

function showError(message) {
    console.error(message);
    // Could show a user-friendly error message
}