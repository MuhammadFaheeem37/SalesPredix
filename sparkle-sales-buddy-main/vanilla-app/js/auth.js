// Authentication System
// Handles user login, registration, and session management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.listeners = [];
        this.init();
    }

    init() {
        // Load user from localStorage
        const stored = localStorage.getItem('currentUser');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }
    
    // ============================================
    // SECURE SESSION & DATA ISOLATION (defined early for login use)
    // ============================================
    
    /**
     * Clear any previous session data before new login
     * Prevents cross-user data leakage
     */
    clearPreviousSessionData() {
        // Clear all generic (non-user-scoped) data keys
        const dataKeys = [
            'salesData',
            'salesPredix_analysisResults',
            'salesPredix_uploadedData',
            'salesPredix_predictions',
            'salesPredix_dashboardState',
            'salesPredix_chartData',
            'salesPredix_completedSteps'
        ];
        
        dataKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Reset in-memory data safely
        if (typeof window !== 'undefined') {
            if (window.dataManager) {
                window.dataManager.salesData = [];
                window.dataManager.dataValidated = false;
            }
            
            if (window.smartAnalyzer) {
                window.smartAnalyzer.data = [];
                window.smartAnalyzer.columns = {};
                window.smartAnalyzer.metrics = {};
                window.smartAnalyzer.categoryPerformance = [];
                window.smartAnalyzer.topProducts = [];
                window.smartAnalyzer.salesPredictions = { historical: [], predictions: [] };
            }
            
            window.uploadedData = null;
            
            if (window.router && typeof window.router.resetSteps === 'function') {
                window.router.resetSteps();
            }
        }
        
        console.log('[Security] Previous session data cleared');
    }
    
    /**
     * Load user-scoped data for the logged-in user
     */
    loadUserScopedData(userId) {
        if (!userId) return;
        
        const userAnalysis = localStorage.getItem(`${userId}_salesPredix_analysisResults`);
        const userData = localStorage.getItem(`${userId}_salesData`);
        
        if (userAnalysis && userData) {
            try {
                localStorage.setItem('salesPredix_analysisResults', userAnalysis);
                localStorage.setItem('salesData', userData);
                
                if (typeof window !== 'undefined' && window.dataManager) {
                    window.dataManager.init();
                }
                
                console.log(`[Security] Loaded data for user: ${userId}`);
            } catch (e) {
                console.warn('[Security] Error loading user data:', e);
            }
        } else {
            console.log(`[Security] No existing data for user: ${userId} - starting fresh`);
        }
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.listeners.forEach(callback => callback(this.currentUser));
    }

    // Register new user
    register(email, password, name) {
        return new Promise((resolve, reject) => {
            // Validate input
            if (!email || !password || !name) {
                reject('All fields are required');
                return;
            }

            if (password.length < 6) {
                reject('Password must be at least 6 characters');
                return;
            }

            // Check if email already exists
            const users = this.getAllUsers();
            if (users.some(u => u.email === email)) {
                reject('Email already registered');
                return;
            }

            // Create new user
            const newUser = {
                id: this.generateId(),
                name,
                email,
                password: this.hashPassword(password),
                profileImage: null, // Will be set if user uploads an image
                createdAt: new Date().toISOString(),
            };

            // Save user
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Auto login
            this.currentUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                profileImage: newUser.profileImage,
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.notify();
            this.updateProfileUI();

            resolve('Registration successful!');
        });
    }

    // Login user
    login(email, password) {
        return new Promise((resolve, reject) => {
            // Validate input
            if (!email || !password) {
                reject('Email and password are required');
                return;
            }

            // Find user
            const users = this.getAllUsers();
            const user = users.find(u => u.email === email);

            if (!user) {
                reject('User not found');
                return;
            }

            // Check password
            if (user.password !== this.hashPassword(password)) {
                reject('Invalid password');
                return;
            }

            // SECURITY: Clear any existing session data before loading new user
            // This prevents cross-user data leakage
            this.clearPreviousSessionData();
            
            // Set current user
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage || null,
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Load user-specific data (if any exists for this user)
            this.loadUserScopedData(user.id);
            
            this.notify();
            this.updateProfileUI();

            resolve('Login successful!');
        });
    }

    // Logout user - SECURE SESSION ISOLATION
    // Clears ALL session data, uploaded datasets, and resets to empty state
    logout() {
        const userId = this.currentUser?.id;
        this.currentUser = null;
        
        // Clear current user session
        localStorage.removeItem('currentUser');
        
        // SECURITY: Clear all user-specific data on logout
        this.clearAllUserSessionData(userId);
        
        // Reset DataManager to empty state
        if (window.dataManager) {
            window.dataManager.clearData();
        }
        
        // Reset SmartAnalyzer state
        if (window.smartAnalyzer) {
            window.smartAnalyzer.data = [];
            window.smartAnalyzer.columns = {};
            window.smartAnalyzer.metrics = {};
            window.smartAnalyzer.categoryPerformance = [];
            window.smartAnalyzer.topProducts = [];
            window.smartAnalyzer.salesPredictions = { historical: [], predictions: [] };
        }
        
        // Clear any uploaded data from memory
        window.uploadedData = null;
        
        // Reset router steps
        if (window.router) {
            window.router.resetSteps();
        }
        
        this.notify();
        this.hideProfileUI();
        
        console.log('[Security] Session cleared - all user data removed');
    }
    
    // Clear all user-specific session data from storage
    clearAllUserSessionData(userId) {
        // List of all data keys that contain user-specific information
        const userDataKeys = [
            'salesData',
            'salesPredix_analysisResults',
            'salesPredix_uploadedData',
            'salesPredix_predictions',
            'salesPredix_dashboardState',
            'salesPredix_chartData'
        ];
        
        // Clear generic keys (legacy support)
        userDataKeys.forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Clear user-scoped keys if userId exists
        if (userId) {
            userDataKeys.forEach(key => {
                localStorage.removeItem(`${userId}_${key}`);
            });
        }
        
        // Clear any session storage as well
        sessionStorage.clear();
    }

    // Get all users (for demo)
    getAllUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : this.createDemoUsers();
    }

    // Create demo users for testing
    createDemoUsers() {
        const demoUsers = [
            {
                id: 'demo-1',
                name: 'Demo User',
                email: 'demo@example.com',
                password: this.hashPassword('demo123'),
                createdAt: new Date().toISOString(),
            },
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
        return demoUsers;
    }

    // Simple password hashing (NOT for production - use bcrypt in real apps)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return `hash_${Math.abs(hash)}`;
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getUser() {
        return this.currentUser;
    }

    // Generate unique ID
    generateId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Default avatar SVG (data URI)
    getDefaultAvatar() {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
    }

    // Update profile UI in sidebar
    updateProfileUI() {
        const profileSection = document.getElementById('user-profile');
        const avatarImg = document.getElementById('user-avatar');
        const nameSpan = document.getElementById('user-name');
        const emailSpan = document.getElementById('user-email');

        if (!this.currentUser) {
            this.hideProfileUI();
            return;
        }

        const avatarSrc = this.currentUser.profileImage || this.getDefaultAvatar();
        const userName = this.currentUser.name || 'User';
        const userEmail = this.currentUser.email || '';

        // Show the profile section
        if (profileSection) {
            profileSection.style.display = 'flex';
        }

        // Update avatar
        if (avatarImg) {
            avatarImg.src = avatarSrc;
            avatarImg.onerror = () => {
                avatarImg.src = this.getDefaultAvatar();
            };
        }

        // Update name
        if (nameSpan) {
            nameSpan.textContent = userName;
        }

        // Update email
        if (emailSpan) {
            emailSpan.textContent = userEmail;
        }

        // Add tooltip
        if (profileSection) {
            profileSection.title = `Logged in as ${userName}`;
            profileSection.onclick = () => {
                if (typeof router !== 'undefined') {
                    router.navigate('/settings');
                }
            };
        }

        // Update Settings page if open
        const settingsAvatar = document.getElementById('settings-avatar');
        const settingsName = document.getElementById('profile-name');
        
        if (settingsAvatar) {
            settingsAvatar.src = avatarSrc;
        }
        
        if (settingsName && settingsName !== document.activeElement) {
            settingsName.value = userName;
        }
    }

    // Hide profile UI on logout
    hideProfileUI() {
        const profileSection = document.getElementById('user-profile');
        if (profileSection) {
            profileSection.style.display = 'none';
        }
    }

    // Update profile image
    updateProfileImage(imageUrl) {
        if (!this.currentUser) return;

        // Update current user
        this.currentUser.profileImage = imageUrl;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Update stored user
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].profileImage = imageUrl;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update UI
        this.updateProfileUI();
        this.notify();
    }

    // Update user name
    updateUserName(newName) {
        if (!this.currentUser || !newName) return;

        // Update current user
        this.currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Update stored user
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update UI
        this.updateProfileUI();
        this.notify();
    }
    
    /**
     * Save current data scoped to the logged-in user
     * Call this when data is uploaded/processed
     */
    saveUserScopedData() {
        if (!this.currentUser?.id) return;
        
        const userId = this.currentUser.id;
        
        // Save all data with user-scoped keys
        const dataKeys = [
            'salesData',
            'salesPredix_analysisResults',
            'salesPredix_uploadedData'
        ];
        
        dataKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                localStorage.setItem(`${userId}_${key}`, data);
            }
        });
        
        console.log(`[Security] Data saved for user: ${userId}`);
    }
    
    /**
     * Get the current user's ID for data scoping
     */
    getUserId() {
        return this.currentUser?.id || null;
    }
    
    /**
     * Check if data belongs to current user
     */
    isCurrentUserData(userId) {
        return this.currentUser?.id === userId;
    }
}

// Global auth manager instance
const authManager = new AuthManager();

// Initialize profile UI on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (authManager.isLoggedIn()) {
            authManager.updateProfileUI();
        } else {
            authManager.hideProfileUI();
        }
    }, 100);
});
