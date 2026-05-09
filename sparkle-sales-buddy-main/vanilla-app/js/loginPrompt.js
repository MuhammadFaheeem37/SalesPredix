/**
 * Login Prompt System for Sparkle Sales Buddy
 * This script adds a login prompt that sends data to server
 * and displays it in activity logs
 */

class LoginPromptSystem {
    constructor(config = {}) {
        this.config = {
            serverUrl: config.serverUrl || 'http://localhost:5000/api/auth',
            autoShow: config.autoShow || false,
            enableOffline: config.enableOffline || true,
            ...config
        };
        
        this.isAuthenticated = false;
        this.currentUser = null;
        this.offlineMode = false;
        this.initialize();
    }
    
    initialize() {
        console.log('🔧 Login Prompt System Initializing...');
        
        // Create toast container if not exists
        this.createToastContainer();
        
        // Create login modal container
        this.createLoginModal();
        
        // Check server connection
        this.checkServerConnection();
        
        // Auto-show login if configured
        if (this.config.autoShow) {
            setTimeout(() => this.showLoginPrompt(), 1000);
        }
        
        console.log('✅ Login Prompt System Ready');
    }
    
    createToastContainer() {
        if (!document.getElementById('toast-notifications')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-notifications';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                max-width: 350px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            `;
            document.body.appendChild(toastContainer);
        }
    }
    
    createLoginModal() {
        // Remove existing modal if any
        const existingModal = document.getElementById('login-modal-overlay');
        if (existingModal) existingModal.remove();
        
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'login-modal-overlay';
        modalOverlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99990;
            justify-content: center;
            align-items: center;
        `;
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            color: #333;
        `;
        
        modalContent.innerHTML = `
            <h2 style="margin-top: 0; color: #2c3e50; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🔐</span>
                Login to Sparkle Sales
            </h2>
            
            <div style="margin-bottom: 20px; color: #7f8c8d; font-size: 14px;">
                Enter your credentials to access the system. All login attempts are logged.
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="login-email-field" style="display: block; margin-bottom: 8px; font-weight: 600; color: #34495e;">Email Address</label>
                <input type="email" id="login-email-field" name="email" autocomplete="email"
                       placeholder="your.email@example.com" 
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
                       value="admin@sparklesales.com">
            </div>
            
            <div style="margin-bottom: 25px;">
                <label for="login-password-field" style="display: block; margin-bottom: 8px; font-weight: 600; color: #34495e;">Password</label>
                <input type="password" id="login-password-field" name="password" autocomplete="current-password"
                       placeholder="Enter your password" 
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;"
                       value="admin123">
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="login-submit-btn" 
                        style="flex: 1; padding: 12px; background: #3498db; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.3s;">
                    Login
                </button>
                <button id="login-cancel-btn" 
                        style="flex: 1; padding: 12px; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: background 0.3s;">
                    Cancel
                </button>
            </div>
            
            <div style="font-size: 12px; color: #7f8c8d; text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <strong>Test Credentials:</strong><br>
                admin@sparklesales.com / admin123<br>
                user@example.com / password123
            </div>
            
            <div id="login-status" style="margin-top: 15px; padding: 10px; border-radius: 4px; display: none;"></div>
        `;
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Add event listeners
        document.getElementById('login-submit-btn').addEventListener('click', () => this.processLogin());
        document.getElementById('login-cancel-btn').addEventListener('click', () => this.hideLoginPrompt());
        
        // Allow Enter key to submit
        modalContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processLogin();
        });
    }
    
    async checkServerConnection() {
        try {
            const response = await fetch(`${this.config.serverUrl}/get-recent-login-logs`, { 
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                this.offlineMode = false;
                console.log('✅ Server connection established');
                return true;
            }
        } catch (error) {
            this.offlineMode = true;
            console.warn('⚠️ Server unavailable. Running in offline mode.');
            this.showToast('Server connection failed. Using offline mode.', 'warning');
            return false;
        }
    }
    
    showLoginPrompt() {
        const modal = document.getElementById('login-modal-overlay');
        if (modal) {
            modal.style.display = 'flex';
            
            // Focus on email field
            setTimeout(() => {
                const emailField = document.getElementById('login-email-field');
                if (emailField) emailField.focus();
            }, 100);
        }
    }
    
    hideLoginPrompt() {
        const modal = document.getElementById('login-modal-overlay');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    async processLogin() {
        const email = document.getElementById('login-email-field').value.trim();
        const password = document.getElementById('login-password-field').value;
        
        // Validation
        if (!email) {
            this.showStatusMessage('Please enter your email address', 'error');
            return;
        }
        
        if (!password) {
            this.showStatusMessage('Please enter your password', 'error');
            return;
        }
        
        this.showStatusMessage('Processing login...', 'info');
        
        // Prepare login data
        const loginData = {
            email: email,
            password: password,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        try {
            // Try to send to server
            const response = await fetch(`${this.config.serverUrl}/api/log-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Login successful
                this.isAuthenticated = true;
                this.currentUser = result.user;
                
                this.showStatusMessage('✅ Login successful!', 'success');
                this.showToast(`Welcome ${result.user}! Login logged successfully.`, 'success');
                
                // Update activity logs table
                this.addToActivityLogs({
                    logId: result.log_id || `#${Date.now()}`,
                    action: 'Login Success',
                    user: result.user,
                    timestamp: result.timestamp,
                    status: 'SUCCESS',
                    serverId: result.log_id
                });
                
                setTimeout(() => {
                    this.hideLoginPrompt();
                    this.updateUIAfterLogin();
                }, 1500);
                
            } else {
                // Login failed
                this.showStatusMessage(`❌ ${result.message || 'Login failed'}`, 'error');
                
                this.addToActivityLogs({
                    logId: `#FAIL${Date.now()}`,
                    action: 'Login Failed',
                    user: email.split('@')[0],
                    timestamp: new Date().toLocaleString(),
                    status: 'FAILED',
                    reason: result.message
                });
            }
            
        } catch (error) {
            console.error('Network error:', error);
            
            // Fallback to offline mode
            if (this.config.enableOffline) {
                this.handleOfflineLogin(email, password);
            } else {
                this.showStatusMessage('❌ Server connection failed', 'error');
            }
        }
    }
    
    handleOfflineLogin(email, password) {
        // Simple offline validation
        const validUsers = {
            'admin@sparklesales.com': 'admin123',
            'user@example.com': 'password123',
            'nazeem@uosahiwal.edu.pk': 'nazeem123'
        };
        
        const isValid = validUsers[email] && validUsers[email] === password;
        
        if (isValid) {
            this.isAuthenticated = true;
            this.currentUser = email.split('@')[0];
            this.offlineMode = true;
            
            this.showStatusMessage('✅ Login successful (offline mode)', 'success');
            this.showToast('Logged in offline. Data saved locally.', 'warning');
            
            // Save to localStorage
            this.saveLoginToLocalStorage(email, true);
            
            // Add to activity logs
            this.addToActivityLogs({
                logId: `#OFFLINE${Date.now()}`,
                action: 'Login (Offline)',
                user: this.currentUser,
                timestamp: new Date().toLocaleString(),
                status: 'OFFLINE_SUCCESS',
                note: 'Server unavailable - using local storage'
            });
            
            setTimeout(() => {
                this.hideLoginPrompt();
                this.updateUIAfterLogin();
            }, 1500);
            
        } else {
            this.showStatusMessage('❌ Invalid credentials (offline mode)', 'error');
            
            this.saveLoginToLocalStorage(email, false);
            
            this.addToActivityLogs({
                logId: `#OFFLINE_FAIL${Date.now()}`,
                action: 'Login Failed (Offline)',
                user: email.split('@')[0],
                timestamp: new Date().toLocaleString(),
                status: 'OFFLINE_FAILED'
            });
        }
    }
    
    saveLoginToLocalStorage(email, success) {
        try {
            const loginRecord = {
                email: email,
                success: success,
                timestamp: new Date().toISOString(),
                offline: true,
                browser: navigator.userAgent.substring(0, 50)
            };
            
            let offlineLogs = JSON.parse(localStorage.getItem('sparkle_offline_logins') || '[]');
            offlineLogs.push(loginRecord);
            
            // Keep only last 50 offline logs
            if (offlineLogs.length > 50) {
                offlineLogs = offlineLogs.slice(-50);
            }
            
            localStorage.setItem('sparkle_offline_logins', JSON.stringify(offlineLogs));
            
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }
    
    addToActivityLogs(logEntry) {
        // Find the activity logs table in your HTML
        const activityLogsTable = document.querySelector('#activity-logs-table tbody') || 
                                  document.querySelector('table tbody') ||
                                  document.querySelector('tbody');
        
        if (activityLogsTable) {
            const newRow = document.createElement('tr');
            
            // Style based on status
            let statusBadge = '';
            if (logEntry.status.includes('SUCCESS')) {
                statusBadge = `<span style="background: #d4edda; color: #155724; padding: 3px 8px; border-radius: 12px; font-size: 12px;">SUCCESS</span>`;
            } else if (logEntry.status.includes('FAIL')) {
                statusBadge = `<span style="background: #f8d7da; color: #721c24; padding: 3px 8px; border-radius: 12px; font-size: 12px;">FAILED</span>`;
            } else if (logEntry.status.includes('OFFLINE')) {
                statusBadge = `<span style="background: #fff3cd; color: #856404; padding: 3px 8px; border-radius: 12px; font-size: 12px;">OFFLINE</span>`;
            } else {
                statusBadge = `<span style="background: #d1ecf1; color: #0c5460; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${logEntry.status}</span>`;
            }
            
            newRow.innerHTML = `
                <td>${logEntry.logId}</td>
                <td>${logEntry.action}</td>
                <td>${logEntry.user}</td>
                <td>${logEntry.timestamp}</td>
                <td>${statusBadge}</td>
            `;
            
            // Add at the top of the table
            activityLogsTable.insertBefore(newRow, activityLogsTable.firstChild);
            
            // If table has more than 20 rows, remove the oldest
            const rows = activityLogsTable.querySelectorAll('tr');
            if (rows.length > 20) {
                rows[rows.length - 1].remove();
            }
            
        } else {
            console.warn('Activity logs table not found in HTML');
            
            // Create a notification instead
            this.showToast(`Login ${logEntry.status.toLowerCase()}: ${logEntry.user}`, 
                          logEntry.status.includes('SUCCESS') ? 'success' : 'error');
        }
    }
    
    showStatusMessage(message, type) {
        const statusDiv = document.getElementById('login-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.style.display = 'block';
            
            switch (type) {
                case 'success':
                    statusDiv.style.background = '#d4edda';
                    statusDiv.style.color = '#155724';
                    statusDiv.style.border = '1px solid #c3e6cb';
                    break;
                case 'error':
                    statusDiv.style.background = '#f8d7da';
                    statusDiv.style.color = '#721c24';
                    statusDiv.style.border = '1px solid #f5c6cb';
                    break;
                case 'info':
                    statusDiv.style.background = '#d1ecf1';
                    statusDiv.style.color = '#0c5460';
                    statusDiv.style.border = '1px solid #bee5eb';
                    break;
            }
        }
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-notifications');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Set styles based on type
        let icon = 'ℹ️';
        let bgColor = '#d1ecf1';
        let textColor = '#0c5460';
        let borderColor = '#bee5eb';
        
        switch (type) {
            case 'success':
                icon = '✅';
                bgColor = '#d4edda';
                textColor = '#155724';
                borderColor = '#c3e6cb';
                break;
            case 'error':
                icon = '❌';
                bgColor = '#f8d7da';
                textColor = '#721c24';
                borderColor = '#f5c6cb';
                break;
            case 'warning':
                icon = '⚠️';
                bgColor = '#fff3cd';
                textColor = '#856404';
                borderColor = '#ffeaa7';
                break;
        }
        
        toast.style.cssText = `
            background: ${bgColor};
            color: ${textColor};
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 6px;
            border-left: 4px solid ${borderColor};
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: toastSlideIn 0.3s ease;
            font-size: 14px;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 18px;">${icon}</span>
            <div>${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }
    
    updateUIAfterLogin() {
        // Update UI elements to show logged in state
        
        // Update any login buttons
        const loginButtons = document.querySelectorAll('[data-login-button]');
        loginButtons.forEach(btn => {
            btn.innerHTML = `👤 ${this.currentUser} ${this.offlineMode ? '(Offline)' : ''}`;
            btn.style.background = this.offlineMode ? '#f39c12' : '#27ae60';
            btn.style.cursor = 'default';
        });
        
        // Show user info somewhere
        const userInfoDiv = document.getElementById('user-info') || 
                           document.querySelector('.user-info') ||
                           document.querySelector('#header') ||
                           document.querySelector('header');
        
        if (userInfoDiv) {
            const userBadge = document.createElement('div');
            userBadge.id = 'logged-in-user-badge';
            userBadge.style.cssText = `
                background: ${this.offlineMode ? '#f39c12' : '#27ae60'};
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                margin-left: 10px;
            `;
            userBadge.innerHTML = `
                <span>👤</span>
                <span>${this.currentUser}</span>
                ${this.offlineMode ? '<span style="font-size:10px;">(OFFLINE)</span>' : ''}
            `;
            
            // Remove existing badge if any
            const existingBadge = document.getElementById('logged-in-user-badge');
            if (existingBadge) existingBadge.remove();
            
            userInfoDiv.appendChild(userBadge);
        }
        
        // Log the login event
        console.log(`✅ User logged in: ${this.currentUser} ${this.offlineMode ? '(offline mode)' : ''}`);
    }
    
    // Public method to trigger login
    triggerLogin() {
        this.showLoginPrompt();
    }
    
    // Check server logs
    async checkServerLogs() {
        try {
            const response = await fetch(`${this.config.serverUrl}/get-recent-login-logs`);
            const data = await response.json();
            return data.recent_logs || [];
        } catch (error) {
            console.error('Failed to fetch server logs:', error);
            return [];
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    #login-email-field:focus, #login-password-field:focus {
        outline: none;
        border-color: #3498db !important;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
    }
    
    #login-submit-btn:hover {
        background: #2980b9 !important;
    }
    
    #login-cancel-btn:hover {
        background: #7f8c8d !important;
    }
`;
document.head.appendChild(style);

// Export for global use
window.LoginPromptSystem = LoginPromptSystem;

// Auto-initialize with default settings
document.addEventListener('DOMContentLoaded', () => {
    window.loginPrompt = new LoginPromptSystem({
        serverUrl: 'http://localhost:5000/api/auth',
        autoShow: false, // Set to true to show login automatically
        enableOffline: true
    });
    
    console.log('🚀 Login Prompt System loaded and ready!');
    console.log('Use window.loginPrompt.triggerLogin() to show login prompt');
});
