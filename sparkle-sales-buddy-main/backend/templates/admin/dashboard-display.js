// dashboard-display.js
// COMPLETE SOLUTION TO SHOW ALL DATA

class DataVisibilitySystem {
    constructor() {
        this.initializeStorage();
        this.setupEventListeners();
        this.refreshAllData();
        
        // Auto-refresh every 30 seconds (changed from 3 to reduce conflicts)
        setInterval(() => this.refreshAllData(), 30000);
        
        console.log('✅ Data Visibility System Loaded');
        console.log('📊 Checking stored data...');
        this.debugData();
    }
    
    initializeStorage() {
        // Create localStorage keys if they don't exist
        const defaultUsers = [
            {id: 1, name: "John Doe", email: "john@example.com", role: "Admin", createdAt: new Date().toISOString()},
            {id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", createdAt: new Date().toISOString()}
        ];
        
        const defaultLogs = [
            {logId: "#1001", action: "Login", user: "admin", timestamp: "2024-01-16 10:30:00", type: "AUTH"},
            {logId: "#1002", action: "Data Export", user: "john", timestamp: "2024-01-16 11:15:00", type: "DATA"}
        ];
        
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
        
        if (!localStorage.getItem('activity_logs')) {
            localStorage.setItem('activity_logs', JSON.stringify(defaultLogs));
        }
        
        if (!localStorage.getItem('login_logs')) {
            localStorage.setItem('login_logs', JSON.stringify([]));
        }
    }
    
    setupEventListeners() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // Signup form
        document.getElementById('signupForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup();
        });
        
        // Manual refresh button
        const refreshBtn = document.createElement('button');
        refreshBtn.innerHTML = '🔄 Refresh Data';
        refreshBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        refreshBtn.onclick = () => this.refreshAllData();
        document.body.appendChild(refreshBtn);
    }
    
    refreshAllData() {
        console.log('🔄 Refreshing all data displays...');
        this.displayUsers();
        this.displayActivityLogs();
        this.updateCounters();
        this.updateRevenue();
        this.showToast('Data refreshed', 'info');
    }
    
    // ============ USERS TABLE ============
    displayUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const tableBody = document.querySelector('#usersTable');
        
        console.log(`👥 Found ${users.length} users to display`);
        
        if (!tableBody) {
            console.error('❌ Users table body not found! Looking for #usersTable');
            // Create fallback display
            this.createFallbackUsersDisplay(users);
            return;
        }
        
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge badge-info">${user.role}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm btn-primary" onclick='dataSystem.editUser(${JSON.stringify(user.id)})'>Edit</button>
                        <button class="btn btn-sm btn-danger" onclick='dataSystem.deleteUser(${JSON.stringify(user.id)})'>Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        console.log('✅ Users table updated');
    }
    
    // ============ ACTIVITY LOGS TABLE ============
    displayActivityLogs() {
        const activityLogs = JSON.parse(localStorage.getItem('activity_logs')) || [];
        const loginLogs = JSON.parse(localStorage.getItem('login_logs')) || [];
        
        // Combine and sort all logs
        const allLogs = [...activityLogs, ...loginLogs];
        allLogs.sort((a, b) => new Date(b.timestamp || b.time) - new Date(a.timestamp || a.time));
        
        const tableBody = document.querySelector('#logsTable');
        
        console.log(`📝 Found ${allLogs.length} activity logs to display`);
        
        if (!tableBody) {
            console.error('❌ Activity logs table body not found!');
            // Create fallback display
            this.createFallbackLogsDisplay(allLogs);
            return;
        }
        
        tableBody.innerHTML = '';
        
        // Show only recent 50 logs
        allLogs.slice(0, 50).forEach(log => {
            const row = document.createElement('tr');
            
            // Determine log type and styling
            const logType = this.getLogType(log.action || log.type);
            const badgeClass = this.getBadgeClass(logType);
            
            row.innerHTML = `
                <td>${log.logId || `#LOG${Date.now()}`}</td>
                <td><span class="badge ${badgeClass}">${log.action || 'Unknown'}</span></td>
                <td>${log.user || log.email || 'Unknown'}</td>
                <td>${this.formatTimestamp(log.timestamp || log.time)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="dataSystem.deleteLog('${log.logId || log.id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        console.log('✅ Activity logs table updated');
    }
    
    // ============ COUNTERS & REVENUE ============
    updateCounters() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userCountElement = document.querySelector('#totalUsers');
        
        if (userCountElement) {
            userCountElement.textContent = users.length;
        }
        
        // Update activity logs count
        const activityLogs = JSON.parse(localStorage.getItem('activity_logs')) || [];
        const loginLogs = JSON.parse(localStorage.getItem('login_logs')) || [];
        const totalLogsElement = document.querySelector('#totalLogs');
        if (totalLogsElement) {
            totalLogsElement.textContent = activityLogs.length + loginLogs.length;
        }
    }
    
    updateRevenue() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const revenue = users.length * 514.99; // Sample calculation
        
        const revenueElement = document.querySelector('#totalRevenue');
        if (revenueElement) {
            revenueElement.textContent = `$${revenue.toFixed(2)}`;
        }
    }
    
    // ============ LOGIN HANDLER ============
    handleLogin() {
        const email = document.getElementById('loginEmail')?.value || 'test@example.com';
        const password = document.getElementById('loginPassword')?.value || 'password';
        
        console.log(`🔑 Login attempt: ${email}`);
        
        // Create login log
        const loginLog = {
            id: `LOGIN${Date.now()}`,
            logId: `#LOGIN${Date.now()}`,
            action: "LOGIN_SUCCESS",
            user: email,
            timestamp: new Date().toISOString(),
            ip: "127.0.0.1",
            status: "SUCCESS",
            browser: navigator.userAgent
        };
        
        // Save to login logs
        const loginLogs = JSON.parse(localStorage.getItem('login_logs')) || [];
        loginLogs.push(loginLog);
        localStorage.setItem('login_logs', JSON.stringify(loginLogs));
        
        // Also add to activity logs
        const activityLogs = JSON.parse(localStorage.getItem('activity_logs')) || [];
        activityLogs.push({
            logId: `#LOG${Date.now()}`,
            action: "User Login",
            user: email.split('@')[0],
            timestamp: new Date().toLocaleString(),
            type: "LOGIN"
        });
        localStorage.setItem('activity_logs', JSON.stringify(activityLogs));
        
        // Update displays
        this.refreshAllData();
        this.showToast(`✅ ${email} logged in successfully`, 'success');
        
        console.log('📝 Login logged and displayed');
    }
    
    // ============ SIGNUP HANDLER ============
    handleSignup() {
        const name = document.getElementById('signupName')?.value || 'New User';
        const email = document.getElementById('signupEmail')?.value || `user${Date.now()}@example.com`;
        const password = document.getElementById('signupPassword')?.value || 'password123';
        
        console.log(`📝 Signup attempt: ${name} (${email})`);
        
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            this.showToast('❌ Email already registered', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: 'User',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Create signup log
        const activityLogs = JSON.parse(localStorage.getItem('activity_logs')) || [];
        activityLogs.push({
            logId: `#USER${newUser.id}`,
            action: "User Created",
            user: email,
            timestamp: new Date().toLocaleString(),
            type: "SIGNUP",
            details: `New user: ${name}`
        });
        localStorage.setItem('activity_logs', JSON.stringify(activityLogs));
        
        // Update everything
        this.refreshAllData();
        this.showToast(`✅ Account created for ${name}`, 'success');
        
        console.log('👤 New user added and displayed');
    }
    
    // ============ HELPER FUNCTIONS ============
    getLogType(action) {
        if (action.includes('LOGIN')) return 'login';
        if (action.includes('CREATE')) return 'create';
        if (action.includes('DELETE')) return 'delete';
        if (action.includes('EXPORT')) return 'export';
        if (action.includes('EDIT')) return 'edit';
        return 'other';
    }
    
    getBadgeClass(type) {
        const classes = {
            'login': 'badge-success',
            'create': 'badge-info',
            'delete': 'badge-danger',
            'export': 'badge-warning',
            'edit': 'badge-warning',
            'other': 'badge-info'
        };
        return classes[type] || 'badge-info';
    }
    
    formatTimestamp(timestamp) {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString();
        } catch {
            return timestamp;
        }
    }
    
    showToast(message, type = 'info') {
        // Use the existing alert system if available
        if (window.showAlert && typeof showAlert === 'function') {
            showAlert(message, type);
            return;
        }
        
        // Create toast container if not exists
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 99999;
                max-width: 300px;
            `;
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `alert alert-${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? '#d4edda' : 
                        type === 'error' ? '#f8d7da' : 
                        type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : 
                    type === 'error' ? '#721c24' : 
                    type === 'warning' ? '#856404' : '#0c5460'};
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : 
                                 type === 'error' ? '#f5c6cb' : 
                                 type === 'warning' ? '#ffeaa7' : '#b8daff'};
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const icon = type === 'success' ? '✅' : 
                    type === 'error' ? '❌' : 
                    type === 'warning' ? '⚠️' : 'ℹ️';
        
        toast.innerHTML = `${icon} ${message}`;
        container.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    debugData() {
        console.log('=== STORAGE DEBUG ===');
        console.log('Users:', JSON.parse(localStorage.getItem('users')));
        console.log('Activity Logs:', JSON.parse(localStorage.getItem('activity_logs')));
        console.log('Login Logs:', JSON.parse(localStorage.getItem('login_logs')));
        console.log('===================');
    }
    
    // Fallback displays if tables not found
    createFallbackUsersDisplay(users) {
        let container = document.getElementById('fallback-users');
        if (!container) {
            container = document.createElement('div');
            container.id = 'fallback-users';
            container.style.cssText = `
                background: white;
                padding: 20px;
                margin: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(container);
        }
        
        container.innerHTML = `
            <h3>👥 Registered Users (${users.length})</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; margin-top: 15px;">
                ${users.map(user => `
                    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                        <strong>${user.name}</strong><br>
                        <small>${user.email}</small><br>
                        <span style="background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-size: 12px;">${user.role}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    createFallbackLogsDisplay(logs) {
        let container = document.getElementById('fallback-logs');
        if (!container) {
            container = document.createElement('div');
            container.id = 'fallback-logs';
            container.style.cssText = `
                background: white;
                padding: 20px;
                margin: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(container);
        }
        
        container.innerHTML = `
            <h3>📝 Activity Logs (${logs.length})</h3>
            <div style="max-height: 300px; overflow-y: auto; margin-top: 15px;">
                ${logs.map(log => `
                    <div style="border-left: 4px solid #007bff; padding: 8px 15px; margin-bottom: 8px; background: #f8f9fa;">
                        <div style="display: flex; justify-content: space-between;">
                            <strong>${log.action || 'Unknown Action'}</strong>
                            <small>${this.formatTimestamp(log.timestamp || log.time)}</small>
                        </div>
                        <div>User: ${log.user || log.email || 'Unknown'}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Delete functions
    deleteUser(userId) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        
        if (user && confirm(`Delete user ${user.name}?`)) {
            const updatedUsers = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Log deletion
            const logs = JSON.parse(localStorage.getItem('activity_logs')) || [];
            logs.push({
                logId: `#DEL${Date.now()}`,
                action: "User Deleted",
                user: user.email,
                timestamp: new Date().toLocaleString(),
                type: "DELETE"
            });
            localStorage.setItem('activity_logs', JSON.stringify(logs));
            
            this.refreshAllData();
            this.showToast(`User ${user.name} deleted`, 'error');
        }
    }
    
    deleteLog(logId) {
        const logs = JSON.parse(localStorage.getItem('activity_logs')) || [];
        const updatedLogs = logs.filter(log => log.logId !== logId);
        localStorage.setItem('activity_logs', JSON.stringify(updatedLogs));
        this.refreshAllData();
        this.showToast('Log deleted', 'info');
    }
    
    editUser(userId) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === userId);
        if (user) {
            const newName = prompt('Enter new name:', user.name);
            if (newName) {
                user.name = newName;
                localStorage.setItem('users', JSON.stringify(users));
                this.refreshAllData();
                this.showToast('User updated', 'success');
            }
        }
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.dataSystem = new DataVisibilitySystem();
});

// Quick test function
function testDataVisibility() {
    console.log('🧪 Testing Data Visibility...');
    
    // Test 1: Check localStorage
    console.log('📦 localStorage contents:');
    console.log('- users:', JSON.parse(localStorage.getItem('users'))?.length || 0, 'users');
    console.log('- activity_logs:', JSON.parse(localStorage.getItem('activity_logs'))?.length || 0, 'logs');
    console.log('- login_logs:', JSON.parse(localStorage.getItem('login_logs'))?.length || 0, 'logins');
    
    // Test 2: Trigger a login
    console.log('🔑 Triggering test login...');
    if (window.dataSystem) {
        window.dataSystem.handleLogin();
    }
    
    // Test 3: Trigger a signup
    console.log('📝 Triggering test signup...');
    if (window.dataSystem) {
        window.dataSystem.handleSignup();
    }
    
    alert('Test completed! Check console and dashboard for updates.');
}
