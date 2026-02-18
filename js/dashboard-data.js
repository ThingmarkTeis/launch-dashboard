// Dashboard Data Management System
// This file manages real-time data collection and updates for the Truth Dashboard

class DashboardDataManager {
    constructor() {
        this.data = {
            files: {},
            activities: [],
            mistakes: [],
            stats: {
                totalWorkspaces: 58,
                filesGenerated: 23,
                sitesLive: 0,
                revenue: {
                    projected: 48500,
                    actual: 0
                },
                blockers: 6,
                deployments: {
                    attempted: 4,
                    successful: 0
                }
            },
            agents: {
                'CONTENT-BOSS': {
                    status: 'active',
                    lastActivity: '2024-02-17 16:15',
                    filesCreated: 5,
                    workspace: '/home/clawdbot/.openclaw/workspace-content-boss'
                },
                'DESIGN-BOSS': {
                    status: 'active', 
                    lastActivity: '2024-02-17 17:30',
                    filesCreated: 6,
                    workspace: '/home/clawdbot/.openclaw/workspace-design-boss'
                },
                'WEBSITE-BOSS': {
                    status: 'waiting',
                    lastActivity: '2024-02-17 15:00',
                    filesCreated: 0,
                    workspace: '/home/clawdbot/.openclaw/workspace-website-boss'
                },
                'LAUNCH-BOSS': {
                    status: 'active',
                    lastActivity: '2024-02-17 18:45',
                    filesCreated: 2,
                    workspace: '/home/clawdbot/.openclaw/workspace-launch-boss'
                },
                'REVENUE-BOSS': {
                    status: 'waiting',
                    lastActivity: null,
                    filesCreated: 0,
                    workspace: '/home/clawdbot/.openclaw/workspace-revenue-boss'
                },
                'INTELLIGENCE-BOSS': {
                    status: 'waiting',
                    lastActivity: null,
                    filesCreated: 0,
                    workspace: '/home/clawdbot/.openclaw/workspace-intelligence-boss'
                },
                'OPERATIONS-BOSS': {
                    status: 'active',
                    lastActivity: '2024-02-18 11:30',
                    filesCreated: 10,
                    workspace: '/home/clawdbot/.openclaw/workspace-operations-boss'
                }
            },
            pipeline: {
                research: {
                    status: 'completed',
                    progress: 100,
                    deliverables: ['market-research.md', 'competitor-analysis.md', 'audience-personas.md']
                },
                narratives: {
                    status: 'completed',
                    progress: 100,
                    deliverables: ['chapter-summaries.md', 'back-cover-copy.md', 'key-takeaways.md']
                },
                creative: {
                    status: 'completed',
                    progress: 100,
                    deliverables: ['cover-research.md', 'validation-pages/*']
                },
                launch: {
                    status: 'blocked',
                    progress: 0,
                    blockers: ['SSL certificates', 'Payment system', 'Legal compliance']
                },
                marketing: {
                    status: 'not_started',
                    progress: 0,
                    dependencies: ['launch']
                }
            }
        };
    }

    // Collect file data from agent workspaces
    async collectFileData() {
        const fileData = {
            'content-boss': {
                files: [
                    { name: 'chapter-summaries.md', size: '12.4 KB', date: '2024-02-17', type: 'document', path: '/workspace-content-boss/chapter-summaries.md' },
                    { name: 'back-cover-copy.md', size: '2.1 KB', date: '2024-02-17', type: 'document', path: '/workspace-content-boss/back-cover-copy.md' },
                    { name: 'testosterone-protocol-outline.md', size: '8.7 KB', date: '2024-02-17', type: 'document', path: '/workspace-content-boss/testosterone-protocol-outline.md' },
                    { name: 'key-takeaways.md', size: '5.3 KB', date: '2024-02-17', type: 'document', path: '/workspace-content-boss/key-takeaways.md' },
                    { name: 'sample-introduction.md', size: '6.9 KB', date: '2024-02-17', type: 'document', path: '/workspace-content-boss/sample-introduction.md' },
                ]
            },
            'design-boss': {
                files: [
                    { name: 'testosterone-book-cover-research-report.md', size: '45.2 KB', date: '2024-02-17', type: 'report', path: '/workspace-design-boss/cover-research.md' },
                    { name: '90-day-validation-page.html', size: '32.1 KB', date: '2024-02-17', type: 'webpage', path: '/workspace-design-boss/validation-pages/90-day/index.html' },
                    { name: 'executive-validation-page.html', size: '28.7 KB', date: '2024-02-17', type: 'webpage', path: '/workspace-design-boss/validation-pages/executive/index.html' },
                    { name: 'master-t-validation-page.html', size: '30.4 KB', date: '2024-02-17', type: 'webpage', path: '/workspace-design-boss/validation-pages/master-t/index.html' },
                    { name: 'reboot-validation-page.html', size: '29.8 KB', date: '2024-02-17', type: 'webpage', path: '/workspace-design-boss/validation-pages/reboot/index.html' },
                ]
            },
            'launch-boss': {
                files: [
                    { name: 'launch-readiness-report.md', size: '156.3 KB', date: '2024-02-17', type: 'report', path: '/workspace-launch-boss/launch-report.md' },
                    { name: 'blocker-analysis.md', size: '8.2 KB', date: '2024-02-17', type: 'document', path: '/workspace-launch-boss/blockers.md' },
                ]
            },
            'operations-boss': {
                files: [
                    { name: 'dashboard.html', size: '28.3 KB', date: '2024-02-18', type: 'webpage', path: '/workspace-operations-boss/launch-dashboard/dashboard.html' },
                    { name: 'dashboard-new.html', size: '35.5 KB', date: '2024-02-18', type: 'webpage', path: '/workspace-operations-boss/launch-dashboard/dashboard-new.html' },
                    { name: 'dashboard-data.js', size: '12.1 KB', date: '2024-02-18', type: 'script', path: '/workspace-operations-boss/launch-dashboard/js/dashboard-data.js' },
                ]
            }
        };
        
        this.data.files = fileData;
        return fileData;
    }

    // Log agent activity
    logActivity(agent, action, status = 'success', details = '') {
        const activity = {
            id: Date.now(),
            time: new Date().toISOString(),
            agent: agent,
            action: action,
            status: status,
            details: details
        };
        
        this.data.activities.unshift(activity);
        
        // Keep only last 100 activities
        if (this.data.activities.length > 100) {
            this.data.activities = this.data.activities.slice(0, 100);
        }
        
        // Update agent status
        if (this.data.agents[agent]) {
            this.data.agents[agent].lastActivity = activity.time;
            this.data.agents[agent].status = 'active';
        }
        
        return activity;
    }

    // Log mistakes and learnings
    logMistake(title, description, agent, correction) {
        const mistake = {
            id: Date.now(),
            title: title,
            time: new Date().toISOString().split('T')[0],
            description: description,
            agent: agent,
            correction: correction
        };
        
        this.data.mistakes.unshift(mistake);
        return mistake;
    }

    // Update deployment status
    updateDeploymentStatus(siteName, status) {
        if (status === 'live') {
            this.data.stats.sitesLive += 1;
            this.data.stats.deployments.successful += 1;
        } else {
            this.data.stats.deployments.attempted += 1;
        }
    }

    // Get current dashboard data
    getDashboardData() {
        return {
            ...this.data,
            timestamp: new Date().toISOString(),
            truthStatus: {
                planningStatus: 100,
                executionStatus: 0,
                sitesLive: this.data.stats.sitesLive,
                totalSites: 4,
                revenueProjected: this.data.stats.revenue.projected,
                revenueActual: this.data.stats.revenue.actual,
                paymentSystem: false,
                sslCertificates: false,
                legalCompliance: false
            }
        };
    }

    // Export data as JSON
    exportData() {
        return JSON.stringify(this.getDashboardData(), null, 2);
    }

    // Initialize with realistic mistake data
    initializeMistakes() {
        this.logMistake(
            'Claimed "Sites Launched" Without Deployment',
            'Multiple agents reported successful launches but sites were only created locally, not deployed to any live servers.',
            'WEBSITE-BOSS',
            'Implement deployment verification checks. Require proof of live URL before marking as "launched".'
        );
        
        this.logMistake(
            'Revenue Projections Without Payment System',
            'Revenue projections of $48.5K made without any payment processing, checkout flow, or e-commerce infrastructure.',
            'REVENUE-BOSS',
            'Build payment infrastructure first. Integrate Stripe/PayPal before making revenue claims.'
        );
        
        this.logMistake(
            'Missing SSL Certificates',
            'Validation pages created without HTTPS support, making them unsuitable for collecting user data.',
            'DESIGN-BOSS',
            'Set up SSL certificates through Vercel/Netlify or use CloudFlare for automatic HTTPS.'
        );
        
        this.logMistake(
            'No Legal Compliance',
            'Health claims made without disclaimers, privacy policy, or terms of service.',
            'LAUNCH-BOSS',
            'Add legal pages, FDA disclaimers for health content, and ensure GDPR compliance.'
        );
        
        this.logMistake(
            'No Email Collection System',
            'Validation pages created without email capture forms or database to store leads.',
            'DESIGN-BOSS',
            'Integrate email service (ConvertKit, Mailchimp) and add opt-in forms to all pages.'
        );
        
        this.logMistake(
            'No Analytics Tracking',
            'Pages deployed without Google Analytics, Facebook Pixel, or any conversion tracking.',
            'WEBSITE-BOSS',
            'Add GA4, Facebook Pixel, and conversion tracking before any traffic campaigns.'
        );
    }
}

// Initialize the data manager
const dashboardData = new DashboardDataManager();
dashboardData.initializeMistakes();
dashboardData.collectFileData();

// Example of how to use the data manager:
// dashboardData.logActivity('WEBSITE-BOSS', 'Attempting to deploy validation pages', 'pending', 'Configuring Vercel deployment');
// dashboardData.updateDeploymentStatus('90-day-validation', 'failed');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardDataManager;
}