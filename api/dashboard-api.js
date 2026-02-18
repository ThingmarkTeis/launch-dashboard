// Dashboard API - Serves real-time data for the Truth Dashboard
// This can be deployed as a serverless function on Vercel

const fs = require('fs').promises;
const path = require('path');

// Mock database - in production, this would connect to a real database
const mockDatabase = {
    activities: [],
    files: {},
    mistakes: [],
    stats: {}
};

// API endpoints
const endpoints = {
    // Get all dashboard data
    async getDashboardData() {
        try {
            // In production, this would query real databases and agent workspaces
            const data = {
                timestamp: new Date().toISOString(),
                stats: {
                    totalWorkspaces: 58,
                    activeDepartments: 3,
                    filesGenerated: 23,
                    sitesLive: 0,
                    revenue: {
                        projected: 48500,
                        actual: 0
                    },
                    blockers: {
                        critical: 6,
                        resolved: 0
                    }
                },
                truthStatus: {
                    planning: { value: 100, status: 'complete' },
                    execution: { value: 0, status: 'blocked' },
                    deployment: { value: 0, status: 'not_started' },
                    revenue: { value: 0, status: 'no_infrastructure' }
                },
                pipeline: [
                    { name: 'Research', status: 'completed', progress: 100 },
                    { name: 'Narratives', status: 'completed', progress: 100 },
                    { name: 'Creative', status: 'completed', progress: 100 },
                    { name: 'Launch', status: 'blocked', progress: 0 },
                    { name: 'Marketing', status: 'not_started', progress: 0 }
                ]
            };
            
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get agent activities
    async getActivities(limit = 50) {
        try {
            const activities = [
                {
                    id: 1,
                    timestamp: '2024-02-18T11:30:00Z',
                    agent: 'WEBSITE-BOSS',
                    action: 'Dashboard redesign initiated',
                    status: 'in_progress',
                    details: 'Building comprehensive Truth Dashboard with file access and activity tracking'
                },
                {
                    id: 2,
                    timestamp: '2024-02-17T18:45:00Z',
                    agent: 'LAUNCH-BOSS',
                    action: 'Generated launch readiness report',
                    status: 'success',
                    details: 'Identified 3 critical blockers: SSL certificates, legal review, support scripts'
                },
                {
                    id: 3,
                    timestamp: '2024-02-17T17:30:00Z',
                    agent: 'DESIGN-BOSS',
                    action: 'Created validation pages',
                    status: 'success',
                    details: '4 variants created for A/B testing'
                },
                {
                    id: 4,
                    timestamp: '2024-02-17T16:15:00Z',
                    agent: 'CONTENT-BOSS',
                    action: 'Generated book content',
                    status: 'success',
                    details: '5 key documents created including chapter summaries'
                },
                {
                    id: 5,
                    timestamp: '2024-02-17T15:00:00Z',
                    agent: 'WEBSITE-BOSS',
                    action: 'Attempted site deployment',
                    status: 'error',
                    details: 'Failed: No deployment credentials configured'
                }
            ];
            
            return { 
                success: true, 
                data: activities.slice(0, limit),
                total: activities.length 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get file listing
    async getFiles(department = null) {
        try {
            const allFiles = {
                'content-boss': {
                    path: '/workspace-content-boss',
                    files: [
                        { name: 'chapter-summaries.md', size: 12689, modified: '2024-02-17T16:15:00Z' },
                        { name: 'back-cover-copy.md', size: 2150, modified: '2024-02-17T16:20:00Z' },
                        { name: 'testosterone-protocol-outline.md', size: 8912, modified: '2024-02-17T16:25:00Z' },
                        { name: 'key-takeaways.md', size: 5427, modified: '2024-02-17T16:30:00Z' },
                        { name: 'sample-introduction.md', size: 7066, modified: '2024-02-17T16:35:00Z' }
                    ]
                },
                'design-boss': {
                    path: '/workspace-design-boss',
                    files: [
                        { name: 'cover-research-report.md', size: 46285, modified: '2024-02-17T14:00:00Z' },
                        { name: '90-day-validation-page.html', size: 32871, modified: '2024-02-17T17:00:00Z' },
                        { name: 'executive-validation-page.html', size: 29388, modified: '2024-02-17T17:10:00Z' },
                        { name: 'master-t-validation-page.html', size: 31129, modified: '2024-02-17T17:20:00Z' },
                        { name: 'reboot-validation-page.html', size: 30515, modified: '2024-02-17T17:30:00Z' }
                    ]
                },
                'launch-boss': {
                    path: '/workspace-launch-boss',
                    files: [
                        { name: 'launch-readiness-report.md', size: 160051, modified: '2024-02-17T18:45:00Z' },
                        { name: 'blocker-analysis.md', size: 8396, modified: '2024-02-17T18:50:00Z' }
                    ]
                },
                'operations-boss': {
                    path: '/workspace-operations-boss',
                    files: [
                        { name: 'dashboard.html', size: 28991, modified: '2024-02-18T10:00:00Z' },
                        { name: 'dashboard-new.html', size: 36376, modified: '2024-02-18T11:35:00Z' },
                        { name: 'dashboard-data.js', size: 11581, modified: '2024-02-18T11:36:00Z' },
                        { name: 'dashboard-api.js', size: 8192, modified: '2024-02-18T11:37:00Z' }
                    ]
                }
            };
            
            if (department) {
                return {
                    success: true,
                    data: allFiles[department] || { path: '', files: [] }
                };
            }
            
            return { success: true, data: allFiles };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get mistakes and learnings
    async getMistakes() {
        try {
            const mistakes = [
                {
                    id: 1,
                    title: 'Claimed "Sites Launched" Without Deployment',
                    timestamp: '2024-02-17',
                    description: 'Multiple agents reported successful launches but sites were only created locally, not deployed to any live servers.',
                    correction: 'Implement deployment verification checks. Require proof of live URL before marking as "launched".',
                    agent: 'WEBSITE-BOSS',
                    severity: 'high'
                },
                {
                    id: 2,
                    title: 'Revenue Projections Without Payment System',
                    timestamp: '2024-02-17',
                    description: 'Revenue projections of $48.5K made without any payment processing, checkout flow, or e-commerce infrastructure.',
                    correction: 'Build payment infrastructure first. Integrate Stripe/PayPal before making revenue claims.',
                    agent: 'REVENUE-BOSS',
                    severity: 'critical'
                },
                {
                    id: 3,
                    title: 'Missing SSL Certificates',
                    timestamp: '2024-02-17',
                    description: 'Validation pages created without HTTPS support, making them unsuitable for collecting user data.',
                    correction: 'Set up SSL certificates through Vercel/Netlify or use CloudFlare for automatic HTTPS.',
                    agent: 'DESIGN-BOSS',
                    severity: 'high'
                },
                {
                    id: 4,
                    title: 'No Legal Compliance',
                    timestamp: '2024-02-17',
                    description: 'Health claims made without disclaimers, privacy policy, or terms of service.',
                    correction: 'Add legal pages, FDA disclaimers for health content, and ensure GDPR compliance.',
                    agent: 'LAUNCH-BOSS',
                    severity: 'critical'
                },
                {
                    id: 5,
                    title: 'No Email Collection System',
                    timestamp: '2024-02-17',
                    description: 'Validation pages created without email capture forms or database to store leads.',
                    correction: 'Integrate email service (ConvertKit, Mailchimp) and add opt-in forms to all pages.',
                    agent: 'DESIGN-BOSS',
                    severity: 'high'
                },
                {
                    id: 6,
                    title: 'No Analytics Tracking',
                    timestamp: '2024-02-17',
                    description: 'Pages deployed without Google Analytics, Facebook Pixel, or any conversion tracking.',
                    correction: 'Add GA4, Facebook Pixel, and conversion tracking before any traffic campaigns.',
                    agent: 'WEBSITE-BOSS',
                    severity: 'medium'
                }
            ];
            
            return { success: true, data: mistakes };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Vercel serverless function handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const { endpoint, ...params } = req.query;
    
    try {
        let result;
        
        switch (endpoint) {
            case 'dashboard':
                result = await endpoints.getDashboardData();
                break;
            case 'activities':
                result = await endpoints.getActivities(params.limit);
                break;
            case 'files':
                result = await endpoints.getFiles(params.department);
                break;
            case 'mistakes':
                result = await endpoints.getMistakes();
                break;
            default:
                result = { success: false, error: 'Invalid endpoint' };
        }
        
        res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// For local testing
if (require.main === module) {
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 3001;
    
    app.use('/api', module.exports);
    
    app.listen(PORT, () => {
        console.log(`Dashboard API running on http://localhost:${PORT}`);
    });
}