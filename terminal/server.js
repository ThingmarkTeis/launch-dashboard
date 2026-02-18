const express = require('express');
const path = require('path');
const cors = require('cors');
const AgentConnector = require('./api/agent-connector');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize agent connector
const agentConnector = new AgentConnector({
    workspacePath: process.env.WORKSPACE_PATH || '/home/clawdbot/.openclaw/workspace-website-boss'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API Routes

// Get all departments status
app.get('/api/departments', async (req, res) => {
    try {
        const departments = [
            'Web Developer',
            'Landing Page Specialist',
            'SEO Specialist',
            'Web Analytics',
            'E-commerce Manager',
            'Author Platform Manager'
        ];
        
        const departmentData = [];
        
        for (const dept of departments) {
            const data = await agentConnector.getDepartmentStatus(dept);
            departmentData.push({
                name: dept,
                data: data
            });
        }
        
        res.json(departmentData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific department status
app.get('/api/departments/:name', async (req, res) => {
    try {
        const data = await agentConnector.getDepartmentStatus(req.params.name);
        if (data) {
            res.json(data);
        } else {
            res.json({ status: 'no_data' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get failures log
app.get('/api/failures', async (req, res) => {
    try {
        const failures = await agentConnector.getFailuresLog();
        res.json(failures);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get funnel metrics
app.get('/api/funnel', async (req, res) => {
    try {
        const metrics = await agentConnector.getFunnelMetrics();
        res.json(metrics || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get file system structure
app.get('/api/files', async (req, res) => {
    try {
        const relativePath = req.query.path || '';
        const files = await agentConnector.getFileSystemStructure(relativePath);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get file content
app.get('/api/files/content', async (req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) {
            return res.status(400).json({ error: 'File path required' });
        }
        
        const content = await agentConnector.getFileContent(filePath);
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download file
app.get('/api/files/download', async (req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) {
            return res.status(400).json({ error: 'File path required' });
        }
        
        const fullPath = path.join(
            process.env.WORKSPACE_PATH || '/home/clawdbot/.openclaw/workspace-website-boss',
            'departments',
            filePath
        );
        
        res.download(fullPath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Dashboard server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/*`);
});