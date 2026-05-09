// Router System
// Handles client-side routing with SEQUENTIAL NAVIGATION

class Router {
    constructor() {
        this.publicRoutes = {
            '/login': 'login',
            '/register': 'register',
        };

        this.protectedRoutes = {
            '/': 'dashboard',
            '/upload': 'upload',
            '/dashboard-overview': 'dashboard-overview',
            '/predictions': 'predictions',
            '/analytics': 'analytics',
            '/assistant': 'assistant',
            '/achievements': 'achievements',
            '/settings': 'settings',
        };

        // Sequential navigation order - users MUST complete in this order
        this.navigationSequence = [
            { path: '/upload', name: 'upload', step: 0 },
            { path: '/', name: 'dashboard', step: 1 },
            { path: '/predictions', name: 'predictions', step: 2 },
            { path: '/analytics', name: 'analytics', step: 3 },
            { path: '/assistant', name: 'assistant', step: 4 },
            { path: '/achievements', name: 'achievements', step: 5 }
        ];

        this.routes = { ...this.publicRoutes, ...this.protectedRoutes };
        this.currentPage = null;
        this.completedSteps = this.loadCompletedSteps();
        this.init();
    }

    // Load completed steps from localStorage
    loadCompletedSteps() {
        const saved = localStorage.getItem('salesPredix_completedSteps');
        return saved ? JSON.parse(saved) : [];
    }

    // Save completed steps to localStorage
    saveCompletedSteps() {
        localStorage.setItem('salesPredix_completedSteps', JSON.stringify(this.completedSteps));
    }

    // Mark a step as completed
    completeStep(stepName) {
        if (!this.completedSteps.includes(stepName)) {
            this.completedSteps.push(stepName);
            this.saveCompletedSteps();
            this.updateNavigationUI();
            
            // Show success toast
            const stepInfo = this.navigationSequence.find(s => s.name === stepName);
            if (stepInfo) {
                const nextStep = this.navigationSequence.find(s => s.step === stepInfo.step + 1);
                if (nextStep) {
                    utils.showToast(`✓ ${stepName.charAt(0).toUpperCase() + stepName.slice(1)} complete! ${nextStep.name.charAt(0).toUpperCase() + nextStep.name.slice(1)} unlocked.`, 'success');
                    
                    // Add just-unlocked animation to the next nav item
                    const nextNavItem = document.querySelector(`.nav-item[data-page="${nextStep.name}"]`);
                    if (nextNavItem) {
                        nextNavItem.classList.add('just-unlocked');
                        setTimeout(() => nextNavItem.classList.remove('just-unlocked'), 1000);
                    }
                }
            }
        }
    }

    // Check if a step can be accessed
    canAccessStep(stepName) {
        // Settings is always accessible
        if (stepName === 'settings') return true;
        
        const targetStep = this.navigationSequence.find(s => s.name === stepName);
        if (!targetStep) return true;
        
        // Upload is always accessible (it's the first step)
        if (targetStep.step === 0) return true;
        
        // Check if previous step is completed
        const previousStep = this.navigationSequence.find(s => s.step === targetStep.step - 1);
        return previousStep ? this.completedSteps.includes(previousStep.name) : true;
    }

    // Update navigation UI to show locked/unlocked states
    updateNavigationUI() {
        document.querySelectorAll('.nav-item[data-step]').forEach(link => {
            const stepName = link.getAttribute('data-page');
            const canAccess = this.canAccessStep(stepName);
            const isCompleted = this.completedSteps.includes(stepName);
            
            // Update locked state
            link.setAttribute('data-locked', canAccess ? 'false' : 'true');
            
            // Update completed state
            if (isCompleted) {
                link.classList.add('completed');
                const lockIcon = link.querySelector('.nav-lock-icon');
                const completeIcon = link.querySelector('.nav-complete-icon');
                if (lockIcon) lockIcon.style.display = 'none';
                if (completeIcon) completeIcon.style.display = 'inline-block';
            }
            
            // If accessible but not completed, show as available
            if (canAccess && !isCompleted) {
                const lockIcon = link.querySelector('.nav-lock-icon');
                if (lockIcon) lockIcon.style.display = 'none';
            }
        });
    }

    // Reset all progress (for testing)
    resetProgress() {
        this.completedSteps = [];
        localStorage.removeItem('salesPredix_completedSteps');
        localStorage.removeItem('salesPredix_uploadedData');
        this.updateNavigationUI();
        this.navigate('/upload');
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.hash.slice(1) || '/upload');
        });

        // Handle initial page load - START WITH UPLOAD if no progress
        let startPage = window.location.hash.slice(1) || '/upload';
        
        // If no steps completed, always start at upload
        if (this.completedSteps.length === 0) {
            startPage = '/upload';
        }
        
        this.loadPage(startPage);

        // Setup navigation links
        this.setupNavigation();
        
        // Initial UI update
        this.updateNavigationUI();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                const path = link.getAttribute('href').slice(1); // Remove #
                const isLocked = link.getAttribute('data-locked') === 'true';
                
                if (isLocked) {
                    utils.showToast('Complete the previous step first!', 'warning');
                    return;
                }
                
                this.navigate(path);
            });
        });
    }

    navigate(path) {
        // Get page name for access check
        const pageName = this.routes[path];
        
        // Check if step can be accessed
        if (!this.canAccessStep(pageName)) {
            utils.showToast('Please complete the previous step first!', 'warning');
            // Redirect to the last accessible step
            const lastAccessible = this.getLastAccessibleStep();
            if (lastAccessible && lastAccessible.path !== path) {
                this.navigate(lastAccessible.path);
            }
            return;
        }
        
        if (path !== window.location.hash.slice(1)) {
            window.location.hash = path;
        }
        this.loadPage(path);
    }

    // Get the last step the user can access
    getLastAccessibleStep() {
        for (let i = this.navigationSequence.length - 1; i >= 0; i--) {
            if (this.canAccessStep(this.navigationSequence[i].name)) {
                return this.navigationSequence[i];
            }
        }
        return this.navigationSequence[0]; // Default to upload
    }

    isPublicRoute(path) {
        return this.publicRoutes.hasOwnProperty(path);
    }

    isProtectedRoute(path) {
        return this.protectedRoutes.hasOwnProperty(path);
    }

    loadPage(path) {
        // Normalize empty path to '/'
        if (!path || path === '') {
            path = '/';
        }
        
        // Check if protected route and user not logged in
        if (this.isProtectedRoute(path) && !authManager.isLoggedIn()) {
            this.navigate('/login');
            return;
        }

        // Check if user is logged in and trying to access auth pages
        if (this.isPublicRoute(path) && authManager.isLoggedIn() && (path === '/login' || path === '/register')) {
            this.navigate('/');
            return;
        }

        // Get page name from path
        const pageName = this.routes[path] || 'notFound';
        
        // Update active navigation
        this.updateActiveNav(path);
        
        // Get current data
        const data = dataManager.getData();
        
        // Render page
        const pageContent = document.getElementById('page-content');
        
        // Hide/show sidebar based on auth status
        const sidebar = document.getElementById('sidebar');
        const header = document.querySelector('.header');
        if (sidebar && header) {
            if (authManager.isLoggedIn()) {
                sidebar.style.display = 'block';
                header.style.display = 'flex';
            } else {
                sidebar.style.display = 'none';
                header.style.display = 'none';
            }
        }

        // For auth pages, use full width; otherwise use sidebar margin (CSS handles mobile)
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            if (this.isPublicRoute(path) || !authManager.isLoggedIn()) {
                mainContent.style.marginLeft = '0';
            } else if (window.innerWidth > 768) {
                mainContent.style.marginLeft = 'var(--sidebar-width)';
            } else {
                mainContent.style.marginLeft = '0';
            }
        }
        
        // Check if page function exists
        if (typeof pages[pageName] === 'function') {
            pageContent.innerHTML = pages[pageName](data);
        } else {
            pageContent.innerHTML = pages.notFound();
        }
        
        // Scroll to top
        pageContent.scrollTop = 0;
        
        this.currentPage = pageName;

        // Sync mobile bottom nav state
        if (typeof app !== 'undefined' && app.syncMobileNav) {
            app.syncMobileNav();
            app.updateMobileNavVisibility();
        }
    }

    updateActiveNav(path) {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${path}`) {
                link.classList.add('active');
            }
        });
    }

    reload() {
        this.loadPage(window.location.hash.slice(1) || '/');
    }
}

// Global router instance
const router = new Router();
