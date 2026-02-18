// Dashboard functionality
class LaunchDashboard {
    constructor() {
        this.launchDate = new Date('2026-03-20T00:00:00Z');
        this.init();
    }

    init() {
        // Require authentication
        if (!requireAuth()) return;

        // Initialize components
        this.updateCountdown();
        this.updateRefreshTime();
        this.setupAutoRefresh();
        this.setupInteractivity();
        
        // Update countdown every minute
        setInterval(() => this.updateCountdown(), 60000);
    }

    updateCountdown() {
        const now = new Date();
        const timeLeft = this.launchDate - now;
        const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
        
        const countdownEl = document.getElementById('daysRemaining');
        if (countdownEl) {
            countdownEl.textContent = daysLeft;
        }

        // Update urgency color based on days remaining
        const countdownBar = document.querySelector('.countdown-bar');
        if (countdownBar) {
            if (daysLeft <= 7) {
                countdownBar.style.background = '#dc2626'; // Red
            } else if (daysLeft <= 14) {
                countdownBar.style.background = '#f59e0b'; // Orange
            } else {
                countdownBar.style.background = '#dc2626'; // Default red
            }
        }
    }

    updateRefreshTime() {
        const refreshEl = document.getElementById('refreshTime');
        if (refreshEl) {
            const now = new Date();
            refreshEl.textContent = `Updated: ${now.toLocaleTimeString()}`;
        }
    }

    setupAutoRefresh() {
        // Auto-refresh data every 5 minutes
        setInterval(() => {
            this.refreshData();
        }, 5 * 60 * 1000);
    }

    setupInteractivity() {
        // Make metrics clickable for details
        document.querySelectorAll('.metric').forEach(metric => {
            metric.addEventListener('click', () => {
                const label = metric.querySelector('.metric-label').textContent;
                this.showMetricDetails(label);
            });
        });

        // Make activity items clickable
        document.querySelectorAll('.activity-item').forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('.activity-title').textContent;
                this.showActivityDetails(title);
            });
        });

        // Make blockers clickable for action
        document.querySelectorAll('.blocker').forEach(blocker => {
            blocker.addEventListener('click', () => {
                const title = blocker.querySelector('.blocker-title').textContent;
                this.showBlockerActions(title);
            });
        });

        // Make action items clickable
        document.querySelectorAll('.action-item').forEach(action => {
            action.addEventListener('click', () => {
                const title = action.querySelector('.action-title').textContent;
                this.showActionDetails(title);
            });
        });
    }

    refreshData() {
        // In a real implementation, this would fetch fresh data from an API
        // For now, we'll simulate some updates
        this.updateRefreshTime();
        this.simulateDataChanges();
    }

    simulateDataChanges() {
        // Simulate some metric changes
        const metrics = document.querySelectorAll('.metric-number');
        metrics.forEach(metric => {
            if (metric.textContent.includes('+')) {
                // Add some random variation to daily metrics
                const currentNum = parseInt(metric.textContent.replace(/\D/g, ''));
                const variation = Math.floor(Math.random() * 20) - 10;
                const newNum = Math.max(0, currentNum + variation);
                metric.textContent = `+${newNum}`;
            }
        });
    }

    showMetricDetails(label) {
        let details = '';
        switch(label) {
            case '📝 Manuscript':
                details = 'Manuscript Status:\n• Final draft completed\n• Editing complete\n• Proofreading done\n• Ready for publication';
                break;
            case '🎨 Cover Design':
                details = 'Cover Design Status:\n• 4 concepts created\n• Author feedback pending\n• Marketing team waiting\n• Target: 100% by Feb 19';
                break;
            case '📢 Marketing Materials':
                details = 'Marketing Materials:\n• Back cover copy: Done\n• Sales page: 50%\n• Email sequences: 2/7 done\n• Social content: 20%';
                break;
            case '🎯 Pre-orders':
                details = 'Pre-order Progress:\n• Current: 2,847\n• Target: 5,000\n• Conversion rate: 4.2%\n• Trend: +4.5% daily';
                break;
            default:
                details = `Details for ${label}:\nClick "View All" for comprehensive data.`;
        }
        alert(details);
    }

    showActivityDetails(title) {
        let details = '';
        switch(title) {
            case 'Cover Designs (4x)':
                details = 'Cover Designs:\n• Executive Suite theme\n• Natural Elements theme\n• Scientific Authority theme\n• Energy Transformation theme\n\nStatus: Awaiting your feedback';
                break;
            case 'Back Cover Copy':
                details = 'Back Cover Copy:\n• Compelling hook written\n• Benefits highlighted\n• Social proof included\n• Call-to-action optimized\n\nStatus: Complete';
                break;
            default:
                details = `${title}:\nFile created and ready for review.\nLocation: /deliverables/`;
        }
        alert(details);
    }

    showBlockerActions(title) {
        let actions = '';
        switch(title) {
            case '🎨 Cover Design Delays':
                actions = 'Actions Available:\n1. Review 4 cover concepts\n2. Provide feedback to Design Boss\n3. Select preferred direction\n4. Approve final version\n\nImpact: Unblocks marketing materials';
                break;
            case '📋 Media Kit Incomplete':
                actions = 'Actions Needed:\n1. Provide author bio (150 words)\n2. Submit high-res headshot\n3. Add book description\n4. Include testimonials\n\nImpact: Enables PR outreach';
                break;
            default:
                actions = `${title}:\nAction required to unblock downstream tasks.`;
        }
        
        const response = confirm(actions + '\n\nWould you like to take action now?');
        if (response) {
            this.handleBlockerAction(title);
        }
    }

    handleBlockerAction(title) {
        switch(title) {
            case '🎨 Cover Design Delays':
                window.location.href = 'pages/files.html#covers';
                break;
            case '📋 Media Kit Incomplete':
                alert('Redirecting to media kit form...\n(In production: would open form or file upload)');
                break;
            default:
                alert('Action handler not implemented for: ' + title);
        }
    }

    showActionDetails(title) {
        let details = '';
        switch(title) {
            case 'Cover Approval Needed':
                details = 'Cover Approval:\n• 4 concepts ready for review\n• Marketing materials on hold\n• Estimated review time: 30 minutes\n• Impact: Unblocks entire pipeline';
                break;
            case 'Complete Media Kit':
                details = 'Media Kit Requirements:\n• Author bio (150 words)\n• High-res photo (300dpi)\n• Book description\n• Key testimonials\n• Estimated time: 45 minutes';
                break;
            case 'Email Sequence #2':
                details = 'Email Sequence #2:\n• Content: Ready\n• Design: Complete\n• Testing: Done\n• Schedule: Ready to deploy\n• Action: Approve & schedule';
                break;
            default:
                details = `${title}:\nClick for detailed action plan.`;
        }
        alert(details);
    }

    // Utility methods
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new LaunchDashboard();
});

// Global functions for external access
window.refreshDashboard = () => {
    if (window.dashboard) {
        window.dashboard.refreshData();
    }
};

window.showQuickStats = () => {
    const stats = {
        'Days to Launch': Math.ceil((new Date('2026-03-20') - new Date()) / (1000 * 60 * 60 * 24)),
        'Active Agents': 32,
        'Completion': '60%',
        'Pre-orders': '2,847',
        'Active Blockers': 3
    };
    
    let message = '📊 Quick Stats:\n';
    Object.entries(stats).forEach(([key, value]) => {
        message += `• ${key}: ${value}\n`;
    });
    
    alert(message);
};