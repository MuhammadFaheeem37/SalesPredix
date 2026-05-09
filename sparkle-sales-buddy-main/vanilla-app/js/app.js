// Main Application Entry Point
// Initializes the application and sets up event listeners

class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('🎉 Sparkle Sales Buddy - Initializing...');

        // Initialize theme
        utils.theme.init();

        // Setup global event listeners
        this.setupEventListeners();

        // Subscribe to data changes
        dataManager.subscribe((data) => {
            // Reload current page when data changes
            if (router.currentPage) {
                router.reload();
            }
        });

        // Add fade-in animation to CSS
        this.addAnimations();

        console.log('✅ Application ready!');
    }

    setupEventListeners() {
        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                utils.theme.toggle();
            });
        }

        // Refresh data button
        const refreshButton = document.getElementById('refresh-data');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                dataManager.refreshData();
                utils.showToast('Data refreshed successfully', 'success');
            });
        }

        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        
        if (sidebarToggle && sidebar) {
            // Toggle sidebar open/close
            sidebarToggle.addEventListener('click', () => {
                const isOpen = sidebar.classList.toggle('open');
                if (backdrop) {
                    backdrop.classList.toggle('active', isOpen);
                }
            });

            // Close sidebar when clicking backdrop
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                    backdrop.classList.remove('active');
                });
            }

            // Close sidebar when clicking a nav-item on mobile/tablet
            sidebar.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('open');
                        if (backdrop) backdrop.classList.remove('active');
                    }
                });
            });

            // Close sidebar when clicking outside on mobile (fallback)
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    sidebar.classList.contains('open') &&
                    !sidebar.contains(e.target) && 
                    !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                    if (backdrop) backdrop.classList.remove('active');
                }
            });
        }

        // Mobile bottom nav: sync active state and handle clicks
        this.setupMobileBottomNav();

        // Handle window resize
        window.addEventListener('resize', utils.debounce(() => {
            // Update margin-left based on viewport
            const mainContent = document.querySelector('.main-content');
            const sidebar = document.getElementById('sidebar');
            if (mainContent && sidebar) {
                if (window.innerWidth <= 768) {
                    mainContent.style.marginLeft = '0';
                    // Close sidebar on resize to desktop → mobile transition
                    sidebar.classList.remove('open');
                    if (backdrop) backdrop.classList.remove('active');
                } else if (sidebar.style.display !== 'none') {
                    mainContent.style.marginLeft = 'var(--sidebar-width)';
                }
            }

            // Redraw charts on resize
            if (router.currentPage === 'dashboard' || 
                router.currentPage === 'analytics') {
                setTimeout(() => {
                    chartManager.destroyAll();
                    router.reload();
                }, 100);
            }
        }, 250));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search/assistant
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                router.navigate('/assistant');
            }

            // Ctrl/Cmd + H for home/dashboard
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                router.navigate('/');
            }

            // Ctrl/Cmd + U for upload
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                router.navigate('/upload');
            }
        });
    }

    setupMobileBottomNav() {
        const mobileNav = document.getElementById('mobile-bottom-nav');
        if (!mobileNav) return;

        // Handle mobile nav item clicks
        mobileNav.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.getAttribute('data-locked') === 'true') {
                    e.preventDefault();
                    return;
                }
            });
        });
    }

    // Sync mobile bottom nav locked/active state with sidebar nav
    syncMobileNav() {
        const mobileNav = document.getElementById('mobile-bottom-nav');
        if (!mobileNav) return;

        // Sync locked states from sidebar nav items
        document.querySelectorAll('#sidebar .nav-item[data-step]').forEach(sidebarItem => {
            const step = sidebarItem.getAttribute('data-step');
            const locked = sidebarItem.getAttribute('data-locked');
            const mobileItem = mobileNav.querySelector(`.mobile-nav-item[data-step="${step}"]`);
            if (mobileItem) {
                mobileItem.setAttribute('data-locked', locked || 'false');
            }
        });

        // Sync active state
        const activeSidebarItem = document.querySelector('#sidebar .nav-item.active');
        if (activeSidebarItem) {
            const activePage = activeSidebarItem.getAttribute('data-page');
            mobileNav.querySelectorAll('.mobile-nav-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('data-page') === activePage);
            });
        }
    }

    // Show/hide mobile bottom nav based on auth state
    updateMobileNavVisibility() {
        const mobileNav = document.getElementById('mobile-bottom-nav');
        if (!mobileNav) return;
        
        if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
            mobileNav.style.display = '';  // Let CSS media queries control display
        } else {
            mobileNav.style.display = 'none';
        }
    }

    addAnimations() {
        // Add fade-in animation to stylesheet dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            /* Smooth transitions */
            * {
                transition-property: background-color, border-color, color, fill, stroke;
                transition-duration: 200ms;
                transition-timing-function: ease;
            }

            /* Loading animation */
            .loading-container {
                animation: fadeIn 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    logout(event) {
        event.preventDefault();
        this.showLogoutModal();
    }

    showLogoutModal() {
        const modal = document.createElement('div');
        modal.id = 'logout-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
            pointer-events: auto;
        `;

        const card = document.createElement('div');
        card.style.cssText = `
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 16px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
            pointer-events: auto;
        `;

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                ">
                    <i class="fas fa-sign-out-alt" style="color: white;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; color: var(--color-text); font-size: 1.25rem; font-weight: 600;">Confirm Logout</h3>
                    <p style="margin: 0.25rem 0 0 0; color: var(--color-text-secondary); font-size: 0.875rem;">Are you sure you want to logout?</p>
                </div>
            </div>
            
            <p style="color: var(--color-text-secondary); margin: 0 0 1.5rem 0; font-size: 0.875rem; line-height: 1.5;">
                You will be returned to the login page and your session will be ended.
            </p>
            
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button id="cancel-logout" class="modal-button" style="
                    padding: 0.625rem 1.25rem;
                    background: var(--color-surface-alt);
                    border: 1px solid var(--color-border);
                    border-radius: 8px;
                    color: var(--color-text);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    pointer-events: auto;
                ">Cancel</button>
                <button id="confirm-logout" class="modal-button" style="
                    padding: 0.625rem 1.25rem;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    pointer-events: auto;
                ">Logout</button>
            </div>
        `;

        modal.appendChild(card);
        document.body.appendChild(modal);

        // Prevent clicks on the card from bubbling to backdrop
        card.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const cancelBtn = document.getElementById('cancel-logout');
        const confirmBtn = document.getElementById('confirm-logout');

        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        });

        confirmBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => {
                modal.remove();
                authManager.logout();
                utils.showToast('Logged out successfully', 'success');
                router.navigate('/login');
            }, 200);
        });

        // Click backdrop to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.2s ease';
                setTimeout(() => modal.remove(), 200);
            }
        });
    }
}

// Initialize application
const app = new App();

// Subscribe to auth changes
authManager.subscribe((user) => {
    if (user) {
        console.log('✅ User logged in:', user.name);
        authManager.updateProfileUI();
    } else {
        console.log('👋 User logged out');
        authManager.hideProfileUI();
    }
});

// Expose utilities globally for console debugging
window.app = app;
window.dataManager = dataManager;
window.router = router;
window.chartManager = chartManager;
window.utils = utils;
window.authManager = authManager;

console.log('%c🌟 Sparkle Sales Buddy', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cVanilla JavaScript Edition with Authentication', 'font-size: 14px; color: #64748b;');
console.log('%c\nAvailable keyboard shortcuts:', 'font-size: 12px; font-weight: bold;');
console.log('%cCtrl/Cmd + H: Go to Dashboard', 'font-size: 11px;');
console.log('%cCtrl/Cmd + K: Open AI Assistant', 'font-size: 11px;');
console.log('%cCtrl/Cmd + U: Upload Data', 'font-size: 11px;');
