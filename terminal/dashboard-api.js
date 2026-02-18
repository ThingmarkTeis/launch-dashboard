// Dashboard API Client
// This replaces the placeholder functions in dashboard.js with real API calls

const API_BASE = window.location.origin + '/api';

// Replace the fetchDepartmentData function
async function fetchDepartmentData(departmentName) {
    try {
        const response = await fetch(`${API_BASE}/departments/${encodeURIComponent(departmentName)}`);
        const data = await response.json();
        
        if (data.status === 'no_data') {
            return null;
        }
        
        return data;
    } catch (error) {
        console.error(`Error fetching department data for ${departmentName}:`, error);
        return null;
    }
}

// Replace the fetchFailuresData function
async function fetchFailuresData() {
    try {
        const response = await fetch(`${API_BASE}/failures`);
        const failures = await response.json();
        return failures;
    } catch (error) {
        console.error('Error fetching failures:', error);
        return [];
    }
}

// Replace the fetchFunnelStageData function
async function fetchFunnelStageData(stage) {
    try {
        const response = await fetch(`${API_BASE}/funnel`);
        const funnelData = await response.json();
        
        if (funnelData && funnelData[stage]) {
            return funnelData[stage];
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching funnel data:', error);
        return null;
    }
}

// Update loadFileSystem function
async function loadFileSystem() {
    try {
        const response = await fetch(`${API_BASE}/files?path=${encodeURIComponent(currentPath)}`);
        const files = await response.json();
        
        const breadcrumb = document.getElementById('fileBreadcrumb');
        breadcrumb.innerHTML = `<span>departments</span> ${currentPath ? '/ ' + currentPath.split('/').join(' / ') : ''}`;
        
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        
        if (files.length === 0) {
            fileList.innerHTML = '<div style="text-align: center; color: var(--text-dim); padding: 40px;">No files in this directory</div>';
            return;
        }
        
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = `file-item ${file.type}`;
            fileItem.dataset.name = file.name;
            fileItem.dataset.type = file.type;
            fileItem.dataset.path = file.path;
            
            const fileSize = file.type === 'dir' ? '' : formatFileSize(file.size);
            const fileDate = new Date(file.modified).toLocaleDateString();
            
            fileItem.innerHTML = `
                <div class="file-name">${file.type === 'dir' ? '📁 ' : '📄 '}${file.name}</div>
                <div class="file-meta">
                    ${fileSize ? `<span>${fileSize}</span>` : ''}
                    <span>${fileDate}</span>
                </div>
            `;
            
            fileList.appendChild(fileItem);
        });
    } catch (error) {
        console.error('Error loading file system:', error);
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '<div style="text-align: center; color: var(--error-red); padding: 40px;">Error loading files</div>';
    }
}

// Update loadFileContent function
async function loadFileContent(filePath) {
    try {
        const response = await fetch(`${API_BASE}/files/content?path=${encodeURIComponent(filePath)}`);
        const data = await response.json();
        
        if (data.content) {
            displayMarkdownPreview(data.content);
        }
    } catch (error) {
        console.error('Error loading file:', error);
        const preview = document.getElementById('filePreview');
        preview.innerHTML = '<div style="text-align: center; color: var(--error-red); padding: 40px;">Error loading file</div>';
        preview.classList.remove('hidden');
    }
}

// Update downloadFile function
function downloadFile(filePath) {
    window.open(`${API_BASE}/files/download?path=${encodeURIComponent(filePath)}`, '_blank');
}

// Update handleFileClick to use the full path
function handleFileClick(event) {
    const fileItem = event.target.closest('.file-item');
    if (!fileItem) return;
    
    const fileName = fileItem.dataset.name;
    const fileType = fileItem.dataset.type;
    const filePath = fileItem.dataset.path;
    
    if (fileType === 'dir') {
        currentPath = filePath;
        loadFileSystem();
    } else if (fileName.endsWith('.md')) {
        loadFileContent(filePath);
    } else {
        downloadFile(filePath);
    }
}

// Add back navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentPath) {
        // Go up one directory
        const parts = currentPath.split('/');
        parts.pop();
        currentPath = parts.join('/');
        loadFileSystem();
        
        // Hide preview if shown
        document.getElementById('filePreview').classList.add('hidden');
    }
});

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Enhanced markdown preview with basic parsing
function displayMarkdownPreview(content) {
    const preview = document.getElementById('filePreview');
    
    // Basic markdown to HTML conversion
    let html = escapeHtml(content);
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    html = html.replace(/__(.+?)__/g, '<b>$1</b>');
    
    // Italic
    html = html.replace(/\*(.+?)\*/g, '<i>$1</i>');
    html = html.replace(/_(.+?)_/g, '<i>$1</i>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Code blocks
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    preview.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0;">File Preview</h3>
            <button onclick="document.getElementById('filePreview').classList.add('hidden')" 
                    style="background: var(--error-red); color: white; border: none; padding: 5px 15px; cursor: pointer;">
                Close
            </button>
        </div>
        <div style="padding: 20px; background: var(--bg-primary); border: 1px solid var(--border-color); overflow-y: auto; max-height: 400px;">
            ${html}
        </div>
    `;
    preview.classList.remove('hidden');
}

// Check API health on load
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const health = await response.json();
        console.log('Dashboard API:', health.status);
    } catch (error) {
        console.error('Dashboard API not running. Start with: node dashboard/server.js');
        
        // Show error message in UI
        document.body.insertAdjacentHTML('afterbegin', `
            <div style="background: var(--error-red); color: white; padding: 15px; text-align: center;">
                Dashboard API not running. Start server with: node dashboard/server.js
            </div>
        `);
    }
}

// Initialize API health check
checkAPIHealth();