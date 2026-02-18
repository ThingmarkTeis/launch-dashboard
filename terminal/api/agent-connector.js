const fs = require('fs').promises;
const path = require('path');

// Agent System Connector
// This connects to your OpenClaw agent system to fetch real data

class AgentConnector {
    constructor(config) {
        this.workspacePath = config.workspacePath || '/home/clawdbot/.openclaw/workspace-website-boss';
        this.agentConfigs = {
            'Web Developer': {
                agentId: 'web-developer',
                skills: ['Next.js', 'React', 'TypeScript', 'API Integration', 'Database Design']
            },
            'Landing Page Specialist': {
                agentId: 'landing-page',
                skills: ['Conversion Optimization', 'A/B Testing', 'Copy Writing', 'Design Systems']
            },
            'SEO Specialist': {
                agentId: 'seo-specialist',
                skills: ['Keyword Research', 'Technical SEO', 'Content Strategy', 'Link Building']
            },
            'Web Analytics': {
                agentId: 'web-analytics',
                skills: ['Google Analytics', 'Tag Manager', 'Data Visualization', 'Reporting']
            },
            'E-commerce Manager': {
                agentId: 'ecommerce-manager',
                skills: ['Sales Funnels', 'Payment Integration', 'Cart Optimization', 'Revenue Tracking']
            },
            'Author Platform Manager': {
                agentId: 'author-platform',
                skills: ['Content Management', 'Email Marketing', 'Community Building', 'Social Integration']
            }
        };
    }

    // Get department status from agent logs
    async getDepartmentStatus(departmentName) {
        try {
            const config = this.agentConfigs[departmentName];
            if (!config) return null;

            // Check for agent activity logs
            const logsPath = path.join(this.workspacePath, 'logs', config.agentId);
            const tasksPath = path.join(this.workspacePath, 'tasks', config.agentId);
            
            // Read current status
            const status = await this.getAgentStatus(config.agentId);
            const tasks = await this.getAgentTasks(config.agentId);
            const insights = await this.getAgentInsights(config.agentId);
            const lastActivity = await this.getLastActivity(config.agentId);

            // Only return data if there's actual activity
            if (!status && !tasks.inProgress.length && !tasks.completed.length) {
                return null;
            }

            return {
                name: departmentName,
                status: status || 'idle',
                agent: {
                    name: config.agentId,
                    skills: config.skills
                },
                tasks: tasks,
                insights: insights || 'No recent insights',
                lastActivity: lastActivity
            };
        } catch (error) {
            console.error(`Error fetching department status for ${departmentName}:`, error);
            return null;
        }
    }

    // Get agent status
    async getAgentStatus(agentId) {
        try {
            const statusFile = path.join(this.workspacePath, 'status', `${agentId}.json`);
            const data = await fs.readFile(statusFile, 'utf8');
            const status = JSON.parse(data);
            return status.currentStatus || 'idle';
        } catch {
            return 'idle';
        }
    }

    // Get agent tasks
    async getAgentTasks(agentId) {
        const tasks = {
            inProgress: [],
            queued: [],
            completed: []
        };

        try {
            const tasksFile = path.join(this.workspacePath, 'tasks', `${agentId}.json`);
            const data = await fs.readFile(tasksFile, 'utf8');
            const taskData = JSON.parse(data);
            
            // Only include real tasks, not placeholders
            if (taskData.inProgress && Array.isArray(taskData.inProgress)) {
                tasks.inProgress = taskData.inProgress.filter(t => t && t.trim());
            }
            if (taskData.queued && Array.isArray(taskData.queued)) {
                tasks.queued = taskData.queued.filter(t => t && t.trim());
            }
            if (taskData.completed && Array.isArray(taskData.completed)) {
                tasks.completed = taskData.completed.slice(-3).filter(t => t && t.trim()); // Last 3
            }
        } catch {
            // No tasks file means no activity
        }

        return tasks;
    }

    // Get agent insights
    async getAgentInsights(agentId) {
        try {
            const insightsFile = path.join(this.workspacePath, 'insights', `${agentId}.txt`);
            const insights = await fs.readFile(insightsFile, 'utf8');
            
            // Return only the most recent insight (last line or paragraph)
            const lines = insights.trim().split('\n').filter(l => l.trim());
            return lines[lines.length - 1] || null;
        } catch {
            return null;
        }
    }

    // Get last activity timestamp
    async getLastActivity(agentId) {
        try {
            const activityFile = path.join(this.workspacePath, 'activity', `${agentId}.log`);
            const stats = await fs.stat(activityFile);
            return stats.mtime;
        } catch {
            return null;
        }
    }

    // Get failures log
    async getFailuresLog() {
        const failures = [];
        
        try {
            const failuresPath = path.join(this.workspacePath, 'failures');
            const files = await fs.readdir(failuresPath);
            
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = await fs.readFile(path.join(failuresPath, file), 'utf8');
                    const failure = JSON.parse(data);
                    
                    // Only include if it has required fields
                    if (failure.department && failure.error && failure.timestamp) {
                        failures.push(failure);
                    }
                }
            }
            
            // Sort by timestamp, most recent first
            failures.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            return failures.slice(0, 50); // Return last 50 failures
        } catch {
            return [];
        }
    }

    // Get funnel metrics
    async getFunnelMetrics() {
        try {
            const metricsFile = path.join(this.workspacePath, 'analytics', 'funnel.json');
            const data = await fs.readFile(metricsFile, 'utf8');
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    // Get file system structure
    async getFileSystemStructure(relativePath = '') {
        const files = [];
        
        try {
            const targetPath = path.join(this.workspacePath, 'departments', relativePath);
            const items = await fs.readdir(targetPath, { withFileTypes: true });
            
            for (const item of items) {
                const stats = await fs.stat(path.join(targetPath, item.name));
                
                files.push({
                    name: item.name,
                    type: item.isDirectory() ? 'dir' : 'file',
                    size: stats.size,
                    modified: stats.mtime,
                    path: path.join(relativePath, item.name)
                });
            }
            
            // Sort by modified date, most recent first
            files.sort((a, b) => b.modified - a.modified);
            
            return files;
        } catch {
            return [];
        }
    }

    // Get file content
    async getFileContent(filePath) {
        try {
            const fullPath = path.join(this.workspacePath, 'departments', filePath);
            const content = await fs.readFile(fullPath, 'utf8');
            return content;
        } catch (error) {
            throw new Error(`Failed to read file: ${error.message}`);
        }
    }
}

module.exports = AgentConnector;