// Authentication System
class AuthSystem {
    constructor() {
        this.credentials = {
            'teis': 'MyNewPassword2026',
            'admin': 'AdminSecure2026', 
            'guest': 'GuestView2026'
        };
        this.init();
    }

    init() {
        // Check if already authenticated
        if (this.isAuthenticated()) {
            this.redirectToDashboard();
            return;
        }

        // Set up login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Handle enter key in password field
        const passwordField = document.getElementById('password');
        if (passwordField) {
            passwordField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleLogin(e);
                }
            });
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.toLowerCase().trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');

        // Clear previous errors
        this.hideError();

        // Validate credentials
        if (this.validateCredentials(username, password)) {
            // Store session
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('loginTime', Date.now());
            
            // Redirect to dashboard
            this.redirectToDashboard();
        } else {
            this.showError('Invalid username or password. Try: teis/MyNewPassword2026');
        }
    }

    validateCredentials(username, password) {
        return this.credentials[username] === password;
    }

    isAuthenticated() {
        const authenticated = sessionStorage.getItem('authenticated');
        const loginTime = sessionStorage.getItem('loginTime');
        
        // Check if session expired (24 hours)
        if (loginTime && (Date.now() - parseInt(loginTime)) > 24 * 60 * 60 * 1000) {
            this.logout();
            return false;
        }
        
        return authenticated === 'true';
    }

    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    }

    logout() {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    hideError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.classList.add('hidden');
        }
    }

    getCurrentUser() {
        return sessionStorage.getItem('username');
    }
}

// Global auth functions
function logout() {
    auth.logout();
}

function requireAuth() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Initialize authentication system
const auth = new AuthSystem();

// Export for use in other scripts
window.auth = auth;
window.logout = logout;
window.requireAuth = requireAuth;