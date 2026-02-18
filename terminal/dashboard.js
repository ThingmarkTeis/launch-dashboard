// Dashboard State
let currentPath = '';
let departmentData = {};
let funnelData = {};
let failuresData = [];
let fileSystem = {};

// GitHub Configuration (Set these via environment variables or config file)
const GITHUB_TOKEN = ''; // Set via environment variable GITHUB_TOKEN
const GITHUB_OWNER = 'ThingmarkTeis'; // GitHub username
const GITHUB_REPO = 'launch-dashboard'; // Repository name

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateLastUpdated();
    loadDashboardData();
    
    // Set up hourly refresh
    setInterval(loadDashboardData, 3600000); // 1 hour
    
    // Set up click handlers
    document.getElementById('fileList').addEventListener('click', handleFileClick);
});

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toUTCString();
}

// Load all dashboard data
async function loadDashboardData() {
    try {
        await loadDepartmentStatus();
        await loadFunnelData();
        await loadFailuresLog();
        await loadFileSystem();
        updateLastUpdated();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load department status from agent logs
async function loadDepartmentStatus() {
    // This would connect to your agent system to get real data
    // For now, showing the structure for real data integration
    
    const departments = [
        'Web Developer',
        'Landing Page Specialist',
        'SEO Specialist',
        'Web Analytics',
        'E-commerce Manager',
        'Author Platform Manager'
    ];
    
    const departmentGrid = document.getElementById('departmentGrid');
    departmentGrid.innerHTML = '';
    
    for (const dept of departments) {
        const deptData = await fetchDepartmentData(dept);
        if (deptData) {
            departmentGrid.appendChild(createDepartmentCard(deptData));
        } else {
            // Show empty state for departments with no activity
            departmentGrid.appendChild(createEmptyDepartmentCard(dept));
        }
    }
}

// Fetch department data from agent logs
async function fetchDepartmentData(departmentName) {
    // This would connect to your agent system
    // Return null if no real data exists
    
    // Example structure:
    // return {
    //     name: departmentName,
    //     status: 'active', // active, idle, error
    //     agent: {
    //         name: 'agent-name',
    //         skills: ['skill1', 'skill2']
    //     },
    //     tasks: {
    //         inProgress: ['task1'],
    //         queued: ['task2'],
    //         completed: ['task3']
    //     },
    //     insights: 'Key insight from recent work',
    //     lastActivity: new Date()
    // };
    
    return null; // No data until integrated
}

// Create department card
function createDepartmentCard(data) {
    const card = document.createElement('div');
    card.className = `department-card ${data.status}`;
    
    card.innerHTML = `
        <div class="department-header">
            <div class="department-name">${data.name}</div>
            <div class="department-status ${data.status}">${data.status}</div>
        </div>
        
        <div class="agent-info">
            <div class="agent-name">Agent: ${data.agent.name}</div>
            <div class="agent-skills">Skills: ${data.agent.skills.join(', ')}</div>
        </div>
        
        <div class="task-section">
            <div class="task-label">In Progress</div>
            <div class="task-list">${formatTaskList(data.tasks.inProgress)}</div>
        </div>
        
        <div class="task-section">
            <div class="task-label">Queued</div>
            <div class="task-list">${formatTaskList(data.tasks.queued)}</div>
        </div>
        
        <div class="task-section">
            <div class="task-label">Completed</div>
            <div class="task-list">${formatTaskList(data.tasks.completed)}</div>
        </div>
        
        <div class="key-insights">
            <div class="task-label">Key Insights</div>
            <div class="insight-text">${data.insights}</div>
        </div>
        
        <div class="last-activity">${formatTimestamp(data.lastActivity)}</div>
    `;
    
    return card;
}

// Create empty department card
function createEmptyDepartmentCard(departmentName) {
    const card = document.createElement('div');
    card.className = 'department-card idle';
    
    card.innerHTML = `
        <div class="department-header">
            <div class="department-name">${departmentName}</div>
            <div class="department-status idle">IDLE</div>
        </div>
        <div class="agent-info">
            <div class="agent-name">No agent assigned</div>
        </div>
        <div class="key-insights">
            <div class="insight-text">No activity</div>
        </div>
    `;
    
    return card;
}

// Format task list
function formatTaskList(tasks) {
    if (!tasks || tasks.length === 0) {
        return 'None';
    }
    return tasks.map(task => `• ${task}`).join('<br>');
}

// Format timestamp
function formatTimestamp(date) {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
}

// Load funnel data
async function loadFunnelData() {
    const funnelContainer = document.getElementById('funnelVisualization');
    funnelContainer.innerHTML = '';
    
    // Define funnel stages
    const stages = [
        'Discovery',
        'Interest',
        'Consideration',
        'Intent',
        'Purchase',
        'Retention'
    ];
    
    for (const stage of stages) {
        const stageData = await fetchFunnelStageData(stage);
        funnelContainer.appendChild(createFunnelStage(stage, stageData));
    }
}

// Fetch funnel stage data
async function fetchFunnelStageData(stage) {
    // This would connect to your analytics
    // Return null if no real data exists
    return null;
}

// Create funnel stage element
function createFunnelStage(stageName, data) {
    const stage = document.createElement('div');
    stage.className = 'funnel-stage';
    
    if (data) {
        stage.classList.add(data.status); // completed, in-progress
        stage.innerHTML = `
            <div class="stage-info">
                <div class="stage-name">${stageName}</div>
                <div class="stage-status">${data.description}</div>
            </div>
            <div class="stage-metrics">
                <div class="metric-value">${data.value}</div>
                <div class="metric-label">${data.label}</div>
            </div>
        `;
    } else {
        stage.innerHTML = `
            <div class="stage-info">
                <div class="stage-name">${stageName}</div>
                <div class="stage-status">No data</div>
            </div>
            <div class="stage-metrics">
                <div class="metric-value">--</div>
                <div class="metric-label">No data</div>
            </div>
        `;
    }
    
    return stage;
}

// Load failures log
async function loadFailuresLog() {
    const failuresContainer = document.getElementById('failuresContainer');
    failuresContainer.innerHTML = '';
    
    const failures = await fetchFailuresData();
    
    if (failures.length === 0) {
        failuresContainer.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 40px;">No failures logged</div>';
        return;
    }
    
    failures.forEach(failure => {
        failuresContainer.appendChild(createFailureEntry(failure));
    });
}

// Fetch failures data
async function fetchFailuresData() {
    // This would connect to your logging system
    // Return empty array if no failures
    return [];
}

// Create failure entry
function createFailureEntry(failure) {
    const entry = document.createElement('div');
    entry.className = 'failure-entry';
    
    entry.innerHTML = `
        <div class="failure-header">
            <div class="failure-department">${failure.department} / ${failure.agent}</div>
            <div class="failure-timestamp">${failure.timestamp}</div>
        </div>
        <div class="failure-details">
            <div class="failure-error">${failure.error}</div>
            <div class="failure-task">Task: ${failure.task}</div>
        </div>
        <div class="failure-status ${failure.status}">${failure.status}</div>
    `;
    
    return entry;
}

// Load file system
async function loadFileSystem() {
    try {
        // For GitHub integration, you'd fetch the repo structure here
        const breadcrumb = document.getElementById('fileBreadcrumb');
        breadcrumb.innerHTML = `<span>root</span> ${currentPath ? '/ ' + currentPath : ''}`;
        
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 40px;">Connect to GitHub to browse files</div>';
        
        // Example of how to fetch from GitHub:
        // const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${currentPath}`, {
        //     headers: {
        //         'Authorization': `token ${GITHUB_TOKEN}`
        //     }
        // });
        // const files = await response.json();
        // displayFiles(files);
        
    } catch (error) {
        console.error('Error loading file system:', error);
    }
}

// Handle file clicks
function handleFileClick(event) {
    const fileItem = event.target.closest('.file-item');
    if (!fileItem) return;
    
    const fileName = fileItem.dataset.name;
    const fileType = fileItem.dataset.type;
    
    if (fileType === 'dir') {
        currentPath = currentPath ? `${currentPath}/${fileName}` : fileName;
        loadFileSystem();
    } else if (fileName.endsWith('.md')) {
        loadFileContent(fileName);
    } else {
        downloadFile(fileName);
    }
}

// Load file content for preview
async function loadFileContent(fileName) {
    try {
        // Fetch file content from GitHub
        // const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${currentPath}/${fileName}`, {
        //     headers: {
        //         'Authorization': `token ${GITHUB_TOKEN}`
        //     }
        // });
        // const data = await response.json();
        // const content = atob(data.content);
        // displayMarkdownPreview(content);
        
        const preview = document.getElementById('filePreview');
        preview.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 40px;">Connect to GitHub to preview files</div>';
        preview.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading file:', error);
    }
}

// Display markdown preview
function displayMarkdownPreview(content) {
    const preview = document.getElementById('filePreview');
    // In a real implementation, you'd use a markdown parser here
    // For now, just display the raw content with basic formatting
    preview.innerHTML = `<pre>${escapeHtml(content)}</pre>`;
    preview.classList.remove('hidden');
}

// Download file
function downloadFile(fileName) {
    // Implementation for downloading files from GitHub
    console.log('Downloading:', fileName);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}