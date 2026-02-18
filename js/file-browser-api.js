// File Browser API - Reads real workspace files
// This script generates a JSON file with actual workspace data

const fs = require('fs');
const path = require('path');

const WORKSPACE_ROOT = '/home/clawdbot/.openclaw';
const OUTPUT_FILE = 'workspace-data.json';

// Department to agent mapping
const departmentAgents = {
    'content-boss': 'Content Creation',
    'design-boss': 'Design & Visual',
    'funnel-boss': 'Funnel & Sales',
    'ads-boss': 'Marketing & Ads',
    'reviews-boss': 'Reviews & Social Proof',
    'seo-boss': 'SEO & Search',
    'analytics-boss': 'Analytics & Data',
    'launch-boss': 'Launch Operations',
    'thingmark-leader': 'Leadership'
};

async function scanWorkspace() {
    const workspaceData = {
        timestamp: new Date().toISOString(),
        departments: {},
        recentActivity: [],
        stats: {
            totalFiles: 0,
            totalDepartments: 0,
            activeDepartments: 0,
            lastUpdate: null
        }
    };

    try {
        // Scan each workspace directory
        for (const [agent, deptName] of Object.entries(departmentAgents)) {
            const agentPath = path.join(WORKSPACE_ROOT, `workspace-${agent}`);
            
            if (fs.existsSync(agentPath)) {
                console.log(`Scanning ${agent}...`);
                const files = await scanDirectory(agentPath);
                
                workspaceData.departments[agent] = {
                    name: deptName,
                    path: agentPath,
                    files: files,
                    fileCount: files.length,
                    lastModified: files.length > 0 ? 
                        new Date(Math.max(...files.map(f => new Date(f.modified).getTime()))) : null
                };

                workspaceData.stats.totalFiles += files.length;
                if (files.length > 0) {
                    workspaceData.stats.activeDepartments++;
                }
            }
        }

        workspaceData.stats.totalDepartments = Object.keys(workspaceData.departments).length;
        workspaceData.stats.lastUpdate = new Date().toISOString();

        // Get recent activity across all workspaces
        const allFiles = [];
        for (const dept of Object.values(workspaceData.departments)) {
            allFiles.push(...dept.files.map(f => ({...f, department: dept.name})));
        }
        
        // Sort by modified date and take top 20
        workspaceData.recentActivity = allFiles
            .sort((a, b) => new Date(b.modified) - new Date(a.modified))
            .slice(0, 20);

        return workspaceData;
    } catch (error) {
        console.error('Error scanning workspace:', error);
        return workspaceData;
    }
}

async function scanDirectory(dirPath, basePath = '') {
    const files = [];
    
    try {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            // Skip hidden files and common directories
            if (item.startsWith('.') || ['node_modules', '__pycache__', '.git'].includes(item)) {
                continue;
            }
            
            const itemPath = path.join(dirPath, item);
            const relativePath = path.join(basePath, item);
            const stats = fs.statSync(itemPath);
            
            if (stats.isDirectory()) {
                // Recursively scan subdirectories (limit depth)
                if (basePath.split('/').length < 3) {
                    const subFiles = await scanDirectory(itemPath, relativePath);
                    files.push(...subFiles);
                }
            } else {
                // Add file info
                const ext = path.extname(item).toLowerCase();
                files.push({
                    name: item,
                    path: relativePath,
                    size: formatFileSize(stats.size),
                    sizeBytes: stats.size,
                    modified: stats.mtime.toISOString(),
                    type: getFileType(ext),
                    extension: ext
                });
            }
        }
    } catch (error) {
        console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
    
    return files;
}

function getFileType(ext) {
    const typeMap = {
        '.md': 'document',
        '.txt': 'document',
        '.json': 'data',
        '.js': 'code',
        '.py': 'code',
        '.html': 'code',
        '.css': 'code',
        '.pdf': 'document',
        '.png': 'image',
        '.jpg': 'image',
        '.jpeg': 'image',
        '.gif': 'image',
        '.svg': 'image',
        '.mp3': 'audio',
        '.wav': 'audio',
        '.mp4': 'video',
        '.mov': 'video',
        '.zip': 'archive',
        '.tar': 'archive',
        '.gz': 'archive'
    };
    
    return typeMap[ext] || 'file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Generate the data file
async function generateDataFile() {
    console.log('Generating workspace data file...');
    const data = await scanWorkspace();
    
    // Write to file
    fs.writeFileSync(
        path.join(__dirname, '..', OUTPUT_FILE), 
        JSON.stringify(data, null, 2)
    );
    
    console.log(`Generated ${OUTPUT_FILE} with data from ${data.stats.totalDepartments} departments and ${data.stats.totalFiles} files`);
    
    // Also write a minified version for production
    fs.writeFileSync(
        path.join(__dirname, '..', 'workspace-data.min.json'), 
        JSON.stringify(data)
    );
    
    return data;
}

// Run if called directly
if (require.main === module) {
    generateDataFile().catch(console.error);
}

module.exports = { generateDataFile, scanWorkspace };