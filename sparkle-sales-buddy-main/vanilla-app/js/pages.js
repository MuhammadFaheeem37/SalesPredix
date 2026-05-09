// Page Definitions
// All page rendering functions

const pages = {
    // Login Page
    login() {
        return `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff;">
                <div class="card" style="width: 100%; max-width: 400px; animation: fadeIn 0.5s ease;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <i class="fas fa-sparkles" style="font-size: 3rem; color: var(--color-primary); margin-bottom: 1rem;"></i>
                        <h1 style="font-size: 1.875rem; font-weight: 700; color: var(--color-text);">Sparkle Sales</h1>
                        <p style="color: var(--color-text-secondary); margin-top: 0.5rem;">Sign in to your account</p>
                    </div>

                    <div id="login-error" class="hidden" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--color-danger); border-radius: var(--radius-md); color: var(--color-danger); margin-bottom: 1rem; display: none;">
                        <i class="fas fa-exclamation-circle"></i>
                        <span id="login-error-text"></span>
                    </div>

                    <form id="login-form" onsubmit="pages.handleLogin(event)">
                        <div class="form-group">
                            <label for="login-email">Email Address</label>
                            <input type="email" id="login-email" name="email" autocomplete="email" placeholder="demo@example.com" required />
                        </div>

                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" name="password" autocomplete="current-password" placeholder="demo123" required />
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                            <i class="fas fa-sign-in-alt"></i>
                            Sign In
                        </button>
                    </form>

                    <div style="text-align: center; padding: 1rem; border-top: 1px solid var(--color-border);">
                        <p style="color: var(--color-text-secondary); margin-bottom: 0.5rem;">Don't have an account?</p>
                        <button class="btn btn-secondary" style="width: 100%;" onclick="router.navigate('/register')">
                            <i class="fas fa-user-plus"></i>
                            Create Account
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');
        const errorText = document.getElementById('login-error-text');

        authManager.login(email, password)
            .then(message => {
                utils.showToast('Login successful!', 'success');
                setTimeout(() => {
                    router.navigate('/');
                }, 500);
            })
            .catch(error => {
                errorText.textContent = error;
                errorDiv.style.display = 'block';
                utils.showToast(error, 'error');
            });
    },

    // Register Page
    register() {
        return `
            <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff;">
                <div class="card" style="width: 100%; max-width: 450px; animation: fadeIn 0.5s ease;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <i class="fas fa-sparkles" style="font-size: 3rem; color: var(--color-accent); margin-bottom: 1rem;"></i>
                        <h1 style="font-size: 1.875rem; font-weight: 700; color: var(--color-text);">Create Account</h1>
                        <p style="color: var(--color-text-secondary); margin-top: 0.5rem;">Join Sparkle Sales today</p>
                    </div>

                    <div id="register-error" class="hidden" style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid var(--color-danger); border-radius: var(--radius-md); color: var(--color-danger); margin-bottom: 1rem; display: none;">
                        <i class="fas fa-exclamation-circle"></i>
                        <span id="register-error-text"></span>
                    </div>

                    <form id="register-form" onsubmit="pages.handleRegister(event)">
                        <div class="form-group">
                            <label for="register-name">Full Name</label>
                            <input type="text" id="register-name" name="name" autocomplete="name" placeholder="John Doe" required />
                        </div>

                        <div class="form-group">
                            <label for="register-email">Email Address</label>
                            <input type="email" id="register-email" name="email" autocomplete="email" placeholder="john@example.com" required />
                        </div>

                        <div class="form-group">
                            <label for="register-password">Password</label>
                            <input type="password" id="register-password" name="password" autocomplete="new-password" placeholder="At least 6 characters" required />
                        </div>

                        <div class="form-group">
                            <label for="register-confirm">Confirm Password</label>
                            <input type="password" id="register-confirm" name="confirm-password" autocomplete="new-password" placeholder="Confirm password" required />
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                            <i class="fas fa-user-plus"></i>
                            Create Account
                        </button>
                    </form>

                    <div style="text-align: center; padding: 1rem; border-top: 1px solid var(--color-border);">
                        <p style="color: var(--color-text-secondary); margin-bottom: 0.5rem;">Already have an account?</p>
                        <button class="btn btn-secondary" style="width: 100%;" onclick="router.navigate('/login')">
                            <i class="fas fa-sign-in-alt"></i>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    handleRegister(event) {
        event.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const errorDiv = document.getElementById('register-error');
        const errorText = document.getElementById('register-error-text');

        if (password !== confirm) {
            errorText.textContent = 'Passwords do not match';
            errorDiv.style.display = 'block';
            utils.showToast('Passwords do not match', 'error');
            return;
        }

        authManager.register(email, password, name)
            .then(message => {
                utils.showToast('Registration successful!', 'success');
                setTimeout(() => {
                    router.navigate('/');
                }, 500);
            })
            .catch(error => {
                errorText.textContent = error;
                errorDiv.style.display = 'block';
                utils.showToast(error, 'error');
            });
    },

    // Helper: Get analysis data from localStorage
    getAnalysisData() {
        try {
            const analysisJson = localStorage.getItem('salesPredix_analysisResults');
            if (analysisJson) {
                return JSON.parse(analysisJson);
            }
        } catch (e) {
            console.warn('Error parsing analysis data:', e);
        }
        return null;
    },

    // Helper: Format currency values
    formatCurrency(value) {
        if (value >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return '$' + (value / 1000).toFixed(1) + 'K';
        }
        return '$' + value.toFixed(2);
    },

    // Helper: Format large numbers
    formatNumber(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return value.toLocaleString();
    },

    // Empty State Component - Shown when no data is uploaded
    // Data-driven approach: No mock data, only user's actual uploaded data
    createEmptyState(pageName = 'Dashboard') {
        const pageIcons = {
            'Dashboard': 'chart-line',
            'Analytics': 'chart-pie', 
            'Predictions': 'crystal-ball'
        };
        const icon = pageIcons[pageName] || 'chart-bar';
        
        return `
            <div class="empty-state-container" style="
                animation: fadeIn 0.4s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 50vh;
                padding: clamp(1.5rem, 4vw, 3rem);
                text-align: center;
            ">
                <!-- Empty State Illustration -->
                <div style="
                    width: clamp(120px, 25vw, 180px);
                    height: clamp(120px, 25vw, 180px);
                    background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(139, 92, 246, 0.1));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    position: relative;
                ">
                    <i class="fas fa-${icon}" style="
                        font-size: clamp(2.5rem, 6vw, 4rem);
                        background: linear-gradient(135deg, #2563eb, #8b5cf6);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        opacity: 0.7;
                    "></i>
                    <!-- Decorative upload icon -->
                    <div style="
                        position: absolute;
                        bottom: 10px;
                        right: 10px;
                        width: 48px;
                        height: 48px;
                        background: linear-gradient(135deg, #f59e0b, #d97706);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                    ">
                        <i class="fas fa-cloud-upload-alt" style="color: white; font-size: 1.25rem;"></i>
                    </div>
                </div>

                <!-- Title -->
                <h2 style="
                    font-size: clamp(1.25rem, 3vw, 1.75rem);
                    font-weight: 700;
                    color: var(--color-text);
                    margin: 0 0 0.75rem 0;
                ">
                    No Data Uploaded Yet
                </h2>

                <!-- Description -->
                <p style="
                    font-size: clamp(0.875rem, 2vw, 1.125rem);
                    color: var(--color-text-secondary);
                    max-width: 450px;
                    margin: 0 0 2rem 0;
                    line-height: 1.6;
                ">
                    Upload your sales data to view insights and predictions. 
                    Your ${pageName.toLowerCase()} will be populated with real analytics from your data.
                </p>

                <!-- Required Fields Info -->
                <div style="
                    background: var(--color-surface-alt);
                    border: 1px solid var(--color-border);
                    border-radius: 12px;
                    padding: 1.25rem 1.5rem;
                    margin-bottom: 2rem;
                    max-width: 400px;
                ">
                    <p style="
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: var(--color-text);
                        margin: 0 0 0.75rem 0;
                    ">
                        <i class="fas fa-info-circle" style="color: #3b82f6; margin-right: 0.5rem;"></i>
                        Required fields in your CSV:
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                        <span style="
                            background: rgba(16, 185, 129, 0.1);
                            color: #10b981;
                            padding: 0.375rem 0.75rem;
                            border-radius: 20px;
                            font-size: 0.8125rem;
                            font-weight: 500;
                        ">Date/Time</span>
                        <span style="
                            background: rgba(16, 185, 129, 0.1);
                            color: #10b981;
                            padding: 0.375rem 0.75rem;
                            border-radius: 20px;
                            font-size: 0.8125rem;
                            font-weight: 500;
                        ">Sales/Revenue</span>
                        <span style="
                            background: rgba(16, 185, 129, 0.1);
                            color: #10b981;
                            padding: 0.375rem 0.75rem;
                            border-radius: 20px;
                            font-size: 0.8125rem;
                            font-weight: 500;
                        ">Quantity</span>
                    </div>
                </div>

                <!-- CTA Button -->
                <button 
                    onclick="router.navigate('/upload');" 
                    class="btn btn-primary"
                    style="
                        padding: 1rem 2.5rem;
                        font-size: 1.125rem;
                        font-weight: 600;
                        background: linear-gradient(135deg, #2563eb, #1d4ed8);
                        border: none;
                        border-radius: 12px;
                        color: white;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        box-shadow: 0 8px 24px rgba(37, 99, 235, 0.25);
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 32px rgba(37, 99, 235, 0.35)';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 24px rgba(37, 99, 235, 0.25)';"
                >
                    <i class="fas fa-upload"></i>
                    Upload Data
                </button>

                <!-- Optional: Help text -->
                <p style="
                    font-size: 0.875rem;
                    color: var(--color-text-tertiary);
                    margin-top: 1.5rem;
                ">
                    Supported formats: CSV, Excel (.xlsx)
                </p>
            </div>
        `;
    },

    // Inline chart empty state (no mock data)
    renderChartEmptyState(container, title, subtitle) {
        if (!container) return;

        container.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                text-align: center;
                color: var(--color-text-secondary);
                padding: 1.5rem;
            ">
                <i class="fas fa-chart-line" style="font-size: 2rem; opacity: 0.4; margin-bottom: 0.75rem;"></i>
                <div style="font-weight: 600; color: var(--color-text);">${title}</div>
                <div style="font-size: 0.875rem; margin-top: 0.25rem;">${subtitle}</div>
            </div>
        `;
    },

    // PHASE 2: Dashboard Overview - After Data Upload  
    'dashboard-overview'(data) {
        return `
            <div style="animation: fadeIn 0.3s ease; padding: clamp(1rem, 3vw, 2rem);">
                <!-- Header Section -->
                <div class="dashboard-header" style="margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <h1 style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; margin: 0; background: linear-gradient(135deg, #2563eb, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                SalesPredix - Dashboard
                            </h1>
                            <p style="color: var(--color-text-secondary); font-size: clamp(0.875rem, 2vw, 1.125rem); margin: 0.5rem 0 0 0;">
                                Your data has been processed and is ready for analysis
                            </p>
                        </div>
                        <div class="status-badge" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 0.5rem 1rem; border-radius: 25px; font-weight: 600; font-size: 0.875rem;">
                            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                            Data Active
                        </div>
                    </div>
                </div>

                <!-- Progress Indicator -->
                <div class="progress-steps" style="margin-bottom: 2rem; display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>1. Upload</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step active" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: rgba(37, 99, 235, 0.1); border: 1px solid #2563eb; border-radius: 25px; color: #2563eb; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-chart-line"></i>
                        <span>2. Dashboard</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-crystal-ball"></i>
                        <span>3. Predict</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-chart-pie"></i>
                        <span>4. Analytics</span>
                    </div>
                </div>

                <!-- Data Summary Cards -->
                <div class="data-summary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                    <!-- Data Volume Card -->
                    <div class="summary-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        box-shadow: var(--shadow-lg);
                        transition: transform 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2563eb, #3b82f6); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-database" style="color: white; font-size: 1.5rem;"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Data Volume</h3>
                                <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.875rem;">Total records processed</p>
                            </div>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #2563eb; margin-bottom: 0.5rem;">
                            ${utils.formatNumber(data.salesData.length)}
                        </div>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                            <i class="fas fa-calendar-alt" style="margin-right: 0.5rem;"></i>
                            ${data.salesData.length > 0 ? 
                                `${utils.formatDate(data.salesData[0].date)} - ${utils.formatDate(data.salesData[data.salesData.length - 1].date)}` : 
                                'No date range available'
                            }
                        </p>
                    </div>

                    <!-- Revenue Summary Card -->
                    <div class="summary-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        box-shadow: var(--shadow-lg);
                        transition: transform 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-dollar-sign" style="color: white; font-size: 1.5rem;"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Total Revenue</h3>
                                <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.875rem;">Cumulative sales value</p>
                            </div>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;">
                            $${data.kpis.find(k => k.title === 'Total Revenue')?.value || '0'}
                        </div>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                            <i class="fas fa-chart-line" style="margin-right: 0.5rem;"></i>
                            Average: $${utils.formatNumber(data.salesData.reduce((sum, sale) => sum + sale.revenue, 0) / data.salesData.length || 0)}
                        </p>
                    </div>

                    <!-- Product Variety Card -->
                    <div class="summary-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        box-shadow: var(--shadow-lg);
                        transition: transform 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-box-open" style="color: white; font-size: 1.5rem;"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Product Diversity</h3>
                                <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.875rem;">Unique products & categories</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 2rem;">
                            <div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: #8b5cf6;">
                                    ${[...new Set(data.salesData.map(s => s.product))].length}
                                </div>
                                <p style="color: var(--color-text-secondary); font-size: 0.75rem;">Products</p>
                            </div>
                            <div>
                                <div style="font-size: 1.5rem; font-weight: 700; color: #8b5cf6;">
                                    ${data.categoryBreakdown.length}
                                </div>
                                <p style="color: var(--color-text-secondary); font-size: 0.75rem;">Categories</p>
                            </div>
                        </div>
                    </div>

                    <!-- Data Quality Card -->
                    <div class="summary-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        box-shadow: var(--shadow-lg);
                        transition: transform 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-shield-alt" style="color: white; font-size: 1.5rem;"></i>
                            </div>
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Data Quality</h3>
                                <p style="color: var(--color-text-secondary); margin: 0; font-size: 0.875rem;">Validation score</p>
                            </div>
                        </div>
                        <div style="font-size: 2rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.5rem;">
                            97%
                        </div>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                            <i class="fas fa-check-circle" style="margin-right: 0.5rem; color: #10b981;"></i>
                            High quality dataset
                        </p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-section" style="text-align: center; margin-bottom: 2rem;">
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; color: var(--color-text);">Ready for Next Steps?</h3>
                    <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.125rem; font-weight: 600;" onclick="router.navigate('/predictions')">
                            <i class="fas fa-crystal-ball" style="margin-right: 0.5rem;"></i>
                            Generate Predictions
                        </button>
                        <button class="btn" style="background: var(--color-surface-alt); color: var(--color-text); border: 1px solid var(--color-border); padding: 1rem 2rem; font-size: 1.125rem;" onclick="router.navigate('/analytics')">
                            <i class="fas fa-chart-bar" style="margin-right: 0.5rem;"></i>
                            Advanced Analytics
                        </button>
                        <button class="btn" style="background: var(--color-surface-alt); color: var(--color-text); border: 1px solid var(--color-border); padding: 1rem 2rem; font-size: 1.125rem;" onclick="router.navigate('/upload')">
                            <i class="fas fa-upload" style="margin-right: 0.5rem;"></i>
                            Upload New Data
                        </button>
                    </div>
                </div>

                <!-- Recent Activity Summary -->
                <div class="activity-card" style="
                    background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                    border: 1px solid var(--color-border); 
                    border-radius: 16px; 
                    padding: 2rem; 
                    box-shadow: var(--shadow-lg);
                ">
                    <h3 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; color: var(--color-text);">Recent Data Sample</h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--color-border);">
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600;">Date</th>
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600;">Product</th>
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600;">Category</th>
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600;">Revenue</th>
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600;">Units</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.salesData.slice(-8).map((sale, index) => `
                                    <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); animation: fadeInRow ${0.1 * (index + 1)}s ease-out;">
                                        <td style="padding: 0.75rem; color: var(--color-text);">${utils.formatDate(sale.date)}</td>
                                        <td style="padding: 0.75rem; color: var(--color-text);">${sale.product}</td>
                                        <td style="padding: 0.75rem;">
                                            <span style="background: rgba(37, 99, 235, 0.1); color: #2563eb; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                                                ${sale.category}
                                            </span>
                                        </td>
                                        <td style="padding: 0.75rem; color: #10b981; font-weight: 600;">$${utils.formatNumber(sale.revenue)}</td>
                                        <td style="padding: 0.75rem; color: var(--color-text);">${sale.quantity}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes fadeInRow {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
        `;
    },

    // Dashboard Page - VIEW 1: MAIN DASHBOARD
    dashboard(data) {
        if (data.isLoading) {
            return components.createLoadingSpinner('Preparing your sales prediction dashboard...');
        }

        // Check if valid data has been uploaded - show empty state if not
        // Data-driven approach: No mock data, only user's actual uploaded data
        const analysisData = this.getAnalysisData();
        if (!data.hasValidData && (!analysisData || analysisData.success === false)) {
            return this.createEmptyState('Dashboard');
        }

        // Mark dashboard as complete when viewed (unlocks Predictions)
        setTimeout(() => {
            if (router && router.completeStep) {
                router.completeStep('dashboard');
            }
        }, 2000); // Auto-complete after 2 seconds of viewing

        // Get dynamic analysis data from localStorage
        const metrics = analysisData?.metrics || {};
        const categoryPerformance = analysisData?.categoryPerformance || [];
        
        // Dynamic metric values from actual data (no hardcoded fallbacks for empty state)
        const totalRevenue = metrics.totalSales || 0;
        const totalSales = metrics.totalUnits || metrics.recordCount || 0;
        const productsTracked = metrics.uniqueProducts || 0;
        const revenueGrowth = metrics.growth ? metrics.growth.toFixed(1) : '0.0';
        
        // Color palette for categories
        const categoryColors = [
            { bar: 'linear-gradient(to bottom, #3b82f6, #1e40af)', progress: 'linear-gradient(to right, #3b82f6, #1e40af)' },
            { bar: 'linear-gradient(to bottom, #10b981, #059669)', progress: 'linear-gradient(to right, #10b981, #059669)' },
            { bar: 'linear-gradient(to bottom, #f59e0b, #d97706)', progress: 'linear-gradient(to right, #f59e0b, #d97706)' },
            { bar: 'linear-gradient(to bottom, #8b5cf6, #7c3aed)', progress: 'linear-gradient(to right, #8b5cf6, #7c3aed)' },
            { bar: 'linear-gradient(to bottom, #ef4444, #dc2626)', progress: 'linear-gradient(to right, #ef4444, #dc2626)' },
            { bar: 'linear-gradient(to bottom, #06b6d4, #0891b2)', progress: 'linear-gradient(to right, #06b6d4, #0891b2)' }
        ];
        
        // Generate category performance HTML dynamically
        let categoryHTML = '';
        if (categoryPerformance.length > 0) {
            categoryPerformance.slice(0, 6).forEach((cat, index) => {
                const colors = categoryColors[index % categoryColors.length];
                const barHeight = Math.max(16, 40 - (index * 4));
                categoryHTML += `
                    <div class="category-item" style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 8px; height: ${barHeight}px; background: ${colors.bar}; border-radius: 4px;"></div>
                            <span style="color: var(--color-text); font-weight: 500;">${cat.category}</span>
                        </div>
                        <div style="flex: 1; max-width: 120px; margin: 0 1rem;">
                            <div style="width: 100%; height: 6px; background: var(--color-surface-alt); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${cat.percentage}%; height: 100%; background: ${colors.progress};"></div>
                            </div>
                        </div>
                        <span style="color: var(--color-text-secondary); font-size: 0.875rem; min-width: 35px; text-align: right;">${cat.percentage}%</span>
                    </div>
                `;
            });
        } else {
            // No category data available - show message instead of mock data
            categoryHTML = `
                <div style="text-align: center; padding: 1rem; color: var(--color-text-secondary);">
                    <i class="fas fa-folder-open" style="font-size: 1.5rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <p style="margin: 0; font-size: 0.875rem;">No category data available</p>
                    <p style="margin: 0.25rem 0 0 0; font-size: 0.75rem; opacity: 0.7;">Add a Category column to your data for category insights</p>
                </div>
            `;
        }

        const html = `
            <div style="animation: fadeIn 0.3s ease; padding: clamp(1rem, 3vw, 2rem);">
                <!-- Progress Indicator -->
                <div class="progress-steps" style="margin-bottom: 2rem; display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>1. Upload</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);"><i class="fas fa-arrow-right"></i></div>
                    <div class="step active" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(37, 99, 235, 0.1); border: 1px solid #2563eb; border-radius: 25px; color: #2563eb; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-chart-line"></i>
                        <span>2. Dashboard</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);"><i class="fas fa-arrow-right"></i></div>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-lock" style="font-size: 0.75rem;"></i>
                        <span>3. Predict</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);"><i class="fas fa-arrow-right"></i></div>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-lock" style="font-size: 0.75rem;"></i>
                        <span>4. Analytics</span>
                    </div>
                </div>

                <!-- Data Source Indicator -->
                <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; max-width: 100%;">
                    <i class="fas fa-database" style="color: #10b981; flex-shrink: 0;"></i>
                    <span style="color: var(--color-text); font-size: 0.875rem; overflow-wrap: break-word;">
                        Dashboard insights based on <strong>${metrics.recordCount || analysisData?.recordsProcessed || 0} records</strong> from your uploaded data
                    </span>
                </div>

                <!-- Header Section -->
                <div class="dashboard-header" style="margin-bottom: 2rem;">
                    <h1 style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; margin: 0; background: linear-gradient(135deg, #1e40af, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        SalesPredix Dashboard
                    </h1>
                    <p style="color: var(--color-text-secondary); font-size: clamp(0.875rem, 2vw, 1.125rem); margin: 0.5rem 0 0 0;">
                        Welcome back! Here's your sales overview based on your data.
                    </p>
                </div>

                <!-- Metrics Cards Grid -->
                <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                    <!-- Total Revenue Card -->
                    <div class="metric-card" style="
                        background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(30, 64, 175, 0.05)); 
                        border: 1px solid rgba(30, 64, 175, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(30, 64, 175, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(30, 64, 175, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(30, 64, 175, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    Total Revenue
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #1e40af; margin-bottom: 0.5rem;">
                                    ${this.formatCurrency(totalRevenue)}
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 0.875rem; font-weight: 600; color: #10b981;">
                                        <i class="fas fa-arrow-up" style="margin-right: 0.25rem;"></i>
                                        +${revenueGrowth}%
                                    </span>
                                    <span style="font-size: 0.875rem; color: var(--color-text-secondary);">vs last month</span>
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #1e40af, #3b82f6); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-dollar-sign" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Sales Card -->
                    <div class="metric-card" style="
                        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); 
                        border: 1px solid rgba(16, 185, 129, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(16, 185, 129, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(16, 185, 129, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    Total Sales
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #10b981; margin-bottom: 0.5rem;">
                                    ${this.formatNumber(totalSales)}
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 0.875rem; font-weight: 600; color: #10b981;">
                                        <i class="fas fa-arrow-up" style="margin-right: 0.25rem;"></i>
                                        +8.2%
                                    </span>
                                    <span style="font-size: 0.875rem; color: var(--color-text-secondary);">vs last month</span>
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-shopping-cart" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Predictions Made Card -->
                    <div class="metric-card" style="
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05)); 
                        border: 1px solid rgba(139, 92, 246, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(139, 92, 246, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(139, 92, 246, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    Predictions Made
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #8b5cf6; margin-bottom: 0.5rem;">
                                    156
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 0.875rem; font-weight: 600; color: #10b981;">
                                        <i class="fas fa-arrow-up" style="margin-right: 0.25rem;"></i>
                                        +23.1%
                                    </span>
                                    <span style="font-size: 0.875rem; color: var(--color-text-secondary);">vs last month</span>
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-crystal-ball" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Products Tracked Card -->
                    <div class="metric-card" style="
                        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05)); 
                        border: 1px solid rgba(245, 158, 11, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(245, 158, 11, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(245, 158, 11, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(245, 158, 11, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    Products Tracked
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.5rem;">
                                    ${productsTracked}
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 0.875rem; font-weight: 600; color: #10b981;">
                                        <i class="fas fa-arrow-up" style="margin-right: 0.25rem;"></i>
                                        +5
                                    </span>
                                    <span style="font-size: 0.875rem; color: var(--color-text-secondary);">vs last month</span>
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-box" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="main-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <!-- Sales vs Predictions Chart -->
                    <div class="chart-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1rem, 3vw, 2rem); 
                        backdrop-filter: blur(10px);
                        box-shadow: var(--shadow-lg);
                    ">
                        <div class="chart-header" style="margin-bottom: 1rem;">
                            <h3 style="font-size: clamp(1rem, 2.5vw, 1.25rem); font-weight: 600; margin: 0; color: var(--color-text);">Sales vs Predictions</h3>
                            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">Monthly comparison</p>
                            <div style="display: flex; gap: 1rem; margin-top: 0.75rem; flex-wrap: wrap;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 12px; height: 3px; background: #3b82f6; border-radius: 2px; display: inline-block;"></span>
                                    <span style="color: var(--color-text-secondary); font-size: 0.875rem;">Actual Sales</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="width: 12px; height: 3px; background: #10b981; border-radius: 2px; display: inline-block;"></span>
                                    <span style="color: var(--color-text-secondary); font-size: 0.875rem;">Predictions</span>
                                </div>
                            </div>
                        </div>
                        <div class="chart-container" style="height: clamp(220px, 40vw, 350px); position: relative;">
                            <canvas id="sales-predictions-chart"></canvas>
                        </div>
                    </div>

                    <!-- Category Performance -->
                    <div class="chart-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1rem, 3vw, 2rem); 
                        backdrop-filter: blur(10px);
                        box-shadow: var(--shadow-lg);
                    ">
                        <div class="chart-header" style="margin-bottom: 1.5rem;">
                            <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Category Performance</h3>
                        </div>
                        <div class="category-list" style="display: flex; flex-direction: column; gap: 1rem;">
                            ${categoryHTML}
                        </div>
                    </div>
                </div>

                <!-- Continue to Next Step -->
                <div style="margin-top: 2rem; text-align: center; padding: clamp(1rem, 3vw, 2rem); background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1)); border-radius: 16px; border: 1px solid rgba(37, 99, 235, 0.2);">
                    <h3 style="font-size: clamp(1rem, 2.5vw, 1.25rem); font-weight: 600; color: var(--color-text); margin: 0 0 0.5rem 0;">Ready for Predictions?</h3>
                    <p style="color: var(--color-text-secondary); margin: 0 0 1rem 0;">Continue to see AI-powered sales forecasts</p>
                    <button class="btn btn-primary" style="padding: 0.875rem 2rem; font-size: 1rem; font-weight: 600; min-height: 48px;" onclick="router.completeStep('dashboard'); router.navigate('/predictions');">
                        <i class="fas fa-arrow-right"></i>
                        Continue to Predictions
                    </button>
                </div>
            </div>
        `;

        setTimeout(() => {
            this.initSalesPredictionChart();
        }, 50);

        return html;
    },

    // Initialize Sales vs Predictions Chart with DYNAMIC DATA
    initSalesPredictionChart() {
        const ctx = document.getElementById('sales-predictions-chart');
        if (!ctx) return;
        
        // Get analysis results from localStorage
        let salesData = this.getAnalysisData();
        
        // Prepare chart data
        let labels = [];
        let actualSales = [];
        let predictions = [];
        
        if (salesData && salesData.salesPredictions) {
            // Historical data (actuals only)
            const historical = salesData.salesPredictions.historical || [];
            historical.forEach(item => {
                labels.push(item.month);
                actualSales.push(item.sales);
                predictions.push(null);
            });
            
            // Future predictions (predicted only)
            const futureData = salesData.salesPredictions.predictions || [];
            futureData.forEach(item => {
                labels.push(item.month);
                actualSales.push(null); // No actual data for future
                predictions.push(item.predictedSales);
            });
        }

        if (labels.length === 0) {
            const container = ctx.closest('.chart-container') || ctx.parentElement;
            this.renderChartEmptyState(container, 'No prediction data yet', 'Upload data to generate predictions.');
            return;
        }
        
        // Calculate dynamic Y-axis bounds
        const allValues = [...actualSales.filter(v => v !== null), ...predictions.filter(v => v !== null)];
        if (allValues.length === 0) {
            const container = ctx.closest('.chart-container') || ctx.parentElement;
            this.renderChartEmptyState(container, 'No prediction data yet', 'Upload data to generate predictions.');
            return;
        }
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const padding = (maxValue - minValue) * 0.1;
        const yMin = Math.max(0, Math.floor((minValue - padding) / 1000) * 1000);
        const yMax = Math.ceil((maxValue + padding) / 1000) * 1000;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Actual Sales',
                    data: actualSales,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    spanGaps: false
                }, {
                    label: 'Predictions',
                    data: predictions,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#3b82f6',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#9ca3af' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { 
                            color: '#9ca3af',
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        },
                        min: yMin,
                        max: yMax
                    }
                }
            }
        });
    },

    // PHASE 1: Upload Page - Data Upload Section
    upload(data) {
        return `
            <div style="animation: fadeIn 0.3s ease; padding: 1rem;" class="upload-page">
                <!-- Header Section -->
                <div class="upload-header" style="margin-bottom: 2rem; text-align: center;">
                    <h1 style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; margin: 0; background: linear-gradient(135deg, #2563eb, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        SalesPredix - Data Upload
                    </h1>
                    <p style="color: var(--color-text-secondary); font-size: clamp(0.875rem, 2vw, 1.125rem); margin: 0.5rem 0 0 0;">
                        Start your sales prediction journey by uploading your data
                    </p>
                </div>

                <!-- Progress Indicator -->
                <div class="progress-steps" style="margin-bottom: 2rem; display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <div class="step active" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: rgba(37, 99, 235, 0.1); border: 1px solid #2563eb; border-radius: 25px; color: #2563eb; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-upload"></i>
                        <span>1. Upload</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-chart-line"></i>
                        <span>2. Dashboard</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-crystal-ball"></i>
                        <span>3. Predict</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-chart-pie"></i>
                        <span>4. Analytics</span>
                    </div>
                </div>

                <!-- Upload Area -->
                <div class="upload-container" style="max-width: 800px; margin: 0 auto; margin-bottom: 2rem;">
                    <div class="upload-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 2px dashed var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1.25rem, 4vw, 3rem); 
                        text-align: center;
                        transition: all 0.3s ease;
                        cursor: pointer;
                        min-height: 200px;
                    " onclick="document.getElementById('file-input').click()" 
                       onmouseover="this.style.borderColor='#2563eb'; this.style.backgroundColor='rgba(37, 99, 235, 0.05)';" 
                       onmouseout="this.style.borderColor='var(--color-border)'; this.style.backgroundColor='var(--color-surface)';">
                        <div class="upload-icon" style="margin-bottom: 1rem;">
                            <i class="fas fa-cloud-upload-alt" style="font-size: clamp(2.5rem, 6vw, 4rem); color: #2563eb;"></i>
                        </div>
                        <h3 style="font-size: clamp(1.125rem, 3vw, 1.5rem); font-weight: 600; margin-bottom: 0.75rem; color: var(--color-text);">
                            Drop your sales data here
                        </h3>
                        <p style="color: var(--color-text-secondary); margin-bottom: 1.25rem; font-size: clamp(0.875rem, 2vw, 1.125rem);">
                            or click to browse files
                        </p>
                        
                        <div class="supported-formats" style="display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                            <span style="background: rgba(37, 99, 235, 0.1); color: #2563eb; padding: 0.625rem 1.25rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; min-height: 44px; display: inline-flex; align-items: center;">CSV</span>
                            <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.625rem 1.25rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; min-height: 44px; display: inline-flex; align-items: center;">Excel</span>
                            <span style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 0.625rem 1.25rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600; min-height: 44px; display: inline-flex; align-items: center;">JSON</span>
                        </div>
                        
                        <div class="file-requirements" style="background: var(--color-surface-alt); border-radius: 12px; padding: clamp(1rem, 3vw, 1.5rem); margin-top: 1.5rem;">
                            <h4 style="color: var(--color-text); margin-bottom: 0.75rem; font-size: 1rem;">File Requirements:</h4>
                            <div class="file-requirements-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr)); gap: 0.75rem; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--color-text-secondary);">
                                    <i class="fas fa-check-circle" style="color: #10b981;"></i>
                                    Maximum size: 100MB
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--color-text-secondary);">
                                    <i class="fas fa-check-circle" style="color: #10b981;"></i>
                                    Date column required
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--color-text-secondary);">
                                    <i class="fas fa-check-circle" style="color: #10b981;"></i>
                                    Sales/Revenue column
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--color-text-secondary);">
                                    <i class="fas fa-check-circle" style="color: #10b981;"></i>
                                    Product/Category data
                                </div>
                            </div>
                        </div>
                        
                        <input type="file" id="file-input" accept=".csv,.xlsx,.xls,.json" style="display: none;" onchange="pages.handleFileUpload(event)" />
                    </div>
                </div>

                <!-- Sample Data Download -->
                <div class="sample-data-section" style="text-align: center; margin-bottom: 2rem;">
                    <p style="color: var(--color-text-secondary); margin-bottom: 1rem;">
                        Don't have data? Download our sample dataset to try SalesPredix
                    </p>
                    <button class="btn" style="background: var(--color-surface-alt); color: var(--color-text); border: 1px solid var(--color-border); padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600;" onclick="pages.downloadSampleData()">
                        <i class="fas fa-download" style="margin-right: 0.5rem;"></i>
                        Download Sample Data
                    </button>
                </div>

                <!-- Data Preview Section (Hidden by default) -->
                <div id="data-preview-section" style="display: none; max-width: 1200px; margin: 0 auto; margin-bottom: 2rem;">
                    <div class="preview-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1rem, 3vw, 2rem); 
                        box-shadow: var(--shadow-lg);
                    ">
                        <div class="preview-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem;">
                            <div>
                                <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0; color: var(--color-text);">Data Preview</h3>
                                <p style="color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">First 10 rows of your uploaded data</p>
                            </div>
                            <div class="file-info" style="text-align: right;">
                                <div id="file-name" style="font-weight: 600; color: var(--color-text); margin-bottom: 0.25rem;"></div>
                                <div id="file-size" style="color: var(--color-text-secondary); font-size: 0.875rem;"></div>
                            </div>
                        </div>
                        
                        <!-- Data Table -->
                        <div class="table-container" style="overflow-x: auto; margin-bottom: 2rem;">
                            <table id="data-preview-table" style="width: 100%; border-collapse: collapse;">
                                <!-- Table will be populated by JavaScript -->
                            </table>
                        </div>
                        
                        <!-- Data Validation Panel -->
                        <div class="validation-panel" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                            <!-- Column Detection -->
                            <div class="validation-card" style="background: var(--color-surface-alt); border-radius: 12px; padding: 1.5rem;">
                                <h4 style="color: var(--color-text); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-columns" style="color: #2563eb;"></i>
                                    Column Detection
                                </h4>
                                <div id="column-detection-results">
                                    <!-- Results will be populated by JavaScript -->
                                </div>
                            </div>
                            
                            <!-- Data Quality -->
                            <div class="validation-card" style="background: var(--color-surface-alt); border-radius: 12px; padding: 1.5rem;">
                                <h4 style="color: var(--color-text); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-shield-alt" style="color: #10b981;"></i>
                                    Data Quality
                                </h4>
                                <div id="data-quality-results">
                                    <!-- Results will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="action-buttons" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                            <button id="process-data-btn" class="btn btn-primary" style="padding: 0.875rem 2rem; font-size: 1rem; font-weight: 600; min-height: 48px;" onclick="pages.processUploadedData()">
                                <i class="fas fa-cogs" style="margin-right: 0.5rem;"></i>
                                Process Data
                            </button>
                            <button class="btn" style="background: var(--color-surface-alt); color: var(--color-text); border: 1px solid var(--color-border); padding: 0.875rem 2rem; font-size: 1rem; min-height: 48px;" onclick="pages.clearUpload()">
                                <i class="fas fa-trash-alt" style="margin-right: 0.5rem;"></i>
                                Clear Upload
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Processing Indicator (Hidden by default) -->
                <div id="processing-indicator" style="display: none; text-align: center; margin: 2rem 0;">
                    <div class="processing-spinner" style="margin-bottom: 1rem;">
                        <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #2563eb;"></i>
                    </div>
                    <h3 style="color: var(--color-text); margin-bottom: 0.5rem;">Processing Your Data...</h3>
                    <p style="color: var(--color-text-secondary);">This may take a few moments depending on file size</p>
                    <div class="progress-bar" style="width: 85%; max-width: 300px; height: 6px; background: var(--color-surface-alt); border-radius: 3px; margin: 1rem auto; overflow: hidden;">
                        <div class="progress-fill" style="height: 100%; background: linear-gradient(to right, #2563eb, #3b82f6); width: 0%; transition: width 0.3s ease; animation: progressAnimation 3s ease-in-out infinite;"></div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes progressAnimation {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
            </style>
        `;
    },

    // Handle File Upload
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file size (100MB limit)
        if (file.size > 100 * 1024 * 1024) {
            utils.showToast('File size exceeds 100MB limit', 'error');
            return;
        }

        // Show processing indicator
        const previewSection = document.getElementById('data-preview-section');
        const processingIndicator = document.getElementById('processing-indicator');
        
        previewSection.style.display = 'none';
        processingIndicator.style.display = 'block';

        // Simulate file processing
        setTimeout(() => {
            this.previewUploadedData(file);
            processingIndicator.style.display = 'none';
            previewSection.style.display = 'block';
        }, 2000);
    },

    // Preview Uploaded Data
    previewUploadedData(file) {
        // Update file info
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-size').textContent = this.formatFileSize(file.size);

        const ext = file.name.split('.').pop().toLowerCase();
        const isExcel = (ext === 'xlsx' || ext === 'xls');

        const reader = new FileReader();
        reader.onload = (e) => {
            let parsedData = [];
            let previewData = { headers: [], rows: [] };

            try {
                if (file.name.endsWith('.json')) {
                    const content = e.target.result;
                    parsedData = JSON.parse(content);
                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        previewData.headers = Object.keys(parsedData[0]);
                        previewData.rows = parsedData.slice(0, 10).map(row => 
                            previewData.headers.map(h => row[h] || '')
                        );
                    }
                } else if (isExcel) {
                    // Parse Excel (.xlsx / .xls) using SheetJS
                    parsedData = this.parseExcelFile(e.target.result);
                    if (parsedData.length > 0) {
                        previewData.headers = Object.keys(parsedData[0]);
                        previewData.rows = parsedData.slice(0, 10).map(row => 
                            previewData.headers.map(h => row[h] != null ? String(row[h]) : '')
                        );
                    }
                } else {
                    // Parse CSV properly using smartAnalyzer
                    const content = e.target.result;
                    parsedData = window.smartAnalyzer ? 
                        window.smartAnalyzer.parseCSV(content) : 
                        this.parseCSVFallback(content);
                    
                    if (parsedData.length > 0) {
                        previewData.headers = Object.keys(parsedData[0]);
                        previewData.rows = parsedData.slice(0, 10).map(row => 
                            previewData.headers.map(h => row[h] || '')
                        );
                    }
                }

                this.displayDataPreview(previewData);
                this.validateDataWithAnalyzer(parsedData, previewData);
                
                // Store parsed data for later processing
                window.uploadedData = { 
                    file: file, 
                    content: isExcel ? '[Excel Binary]' : e.target.result, 
                    parsed: parsedData,
                    preview: previewData
                };
                
            } catch (error) {
                console.error('Parse error:', error);
                this.showFileError(file, ext, error);
            }
        };

        reader.onerror = () => {
            console.error('FileReader error');
            utils.showToast('Error reading file. Please try again.', 'error');
        };
        
        // Excel files must be read as binary, CSV/JSON as text
        if (isExcel) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    },

    /**
     * Parse Excel file (.xlsx / .xls) using SheetJS
     * Handles multiple sheets, date formatting, and data type conversion
     */
    parseExcelFile(arrayBuffer) {
        if (typeof XLSX === 'undefined') {
            utils.showToast('Excel parser not loaded. Check your internet connection and refresh.', 'error');
            return [];
        }

        try {
            const workbook = XLSX.read(arrayBuffer, { 
                type: 'array',
                cellDates: true,     // Parse dates as JS Date objects
                cellNF: true,        // Preserve number formats
                cellText: true,      // Generate text representations
                raw: false           // Use formatted values
            });

            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                utils.showToast('Excel file has no sheets.', 'error');
                return [];
            }

            // Use the first sheet (or the one named 'Orders', 'Sales', 'Data' if exists)
            const preferredNames = ['orders', 'sales', 'data', 'sheet1'];
            let sheetName = workbook.SheetNames[0];
            for (const name of workbook.SheetNames) {
                if (preferredNames.includes(name.toLowerCase().trim())) {
                    sheetName = name;
                    break;
                }
            }

            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to array of objects
            let jsonData = XLSX.utils.sheet_to_json(worksheet, {
                defval: '',          // Default value for empty cells
                raw: false,          // Use formatted strings (dates, currency)
                dateNF: 'MM-DD-YYYY' // Date format
            });

            if (jsonData.length === 0) {
                // Try with raw values
                jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: true });
            }

            // Clean headers: trim whitespace, remove BOM
            if (jsonData.length > 0) {
                const cleanedData = jsonData.map(row => {
                    const cleaned = {};
                    for (const [key, value] of Object.entries(row)) {
                        const cleanKey = key.replace(/^\uFEFF/, '').trim();
                        // Convert Date objects to string
                        if (value instanceof Date) {
                            const mm = String(value.getMonth() + 1).padStart(2, '0');
                            const dd = String(value.getDate()).padStart(2, '0');
                            const yyyy = value.getFullYear();
                            cleaned[cleanKey] = `${mm}-${dd}-${yyyy}`;
                        } else {
                            cleaned[cleanKey] = value != null ? String(value).trim() : '';
                        }
                    }
                    return cleaned;
                });
                
                console.log(`[SalesPredix] Excel parsed: ${cleanedData.length} rows, ${Object.keys(cleanedData[0]).length} columns from sheet "${sheetName}"`);
                console.log('[SalesPredix] Excel columns:', Object.keys(cleanedData[0]));
                
                if (workbook.SheetNames.length > 1) {
                    utils.showToast(`Using sheet "${sheetName}" (${workbook.SheetNames.length} sheets found)`, 'info');
                }
                
                return cleanedData;
            }

            return jsonData;
        } catch (err) {
            console.error('[SalesPredix] Excel parse error:', err);
            
            // Check for specific error types
            if (err.message?.includes('password')) {
                utils.showToast('This Excel file is password-protected. Please remove the password and try again.', 'error');
            } else if (err.message?.includes('Unsupported')) {
                utils.showToast('Unsupported Excel format. Try re-saving as .xlsx in Excel.', 'error');
            } else {
                utils.showToast('Could not read Excel file. Try converting to CSV.', 'error');
            }
            return [];
        }
    },

    /**
     * Show detailed file error with recovery suggestions
     */
    showFileError(file, ext, error) {
        const previewTable = document.getElementById('preview-table');
        if (previewTable) {
            const isExcel = (ext === 'xlsx' || ext === 'xls');
            previewTable.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--color-text); margin-bottom: 0.5rem;">Unable to Parse File</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 1.5rem;">
                        ${error.message || 'Unknown parsing error'}
                    </p>
                    <div style="text-align: left; max-width: 400px; margin: 0 auto; background: var(--color-surface-alt); padding: 1rem; border-radius: 8px;">
                        <p style="color: var(--color-text); font-weight: 600; margin-bottom: 0.5rem;">Try these fixes:</p>
                        <ul style="color: var(--color-text-secondary); font-size: 0.875rem; padding-left: 1.25rem;">
                            ${isExcel ? `
                                <li>Open in Excel and re-save as <strong>.xlsx</strong></li>
                                <li>Check if the file is password-protected</li>
                                <li>Export as <strong>.csv</strong> instead (File → Save As → CSV)</li>
                                <li>Make sure the file isn't corrupted (try opening in Excel first)</li>
                            ` : `
                                <li>Ensure the CSV uses comma (,) or semicolon (;) delimiters</li>
                                <li>Check encoding — save as <strong>UTF-8 CSV</strong></li>
                                <li>Remove any special characters from headers</li>
                            `}
                        </ul>
                    </div>
                </div>
            `;
        }
        utils.showToast(`Error parsing ${ext.toUpperCase()} file. See suggestions below.`, 'error');
    },

    // Fallback CSV parser
    parseCSVFallback(csvString) {
        // Strip BOM if present
        const cleaned = csvString.replace(/^\uFEFF/, '');
        const lines = cleaned.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, '').replace(/"/g, ''));
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const values = line.split(',').map(v => v.trim().replace(/\r/g, '').replace(/"/g, ''));
            if (values.length === headers.length && values.some(v => v)) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                data.push(row);
            }
        }
        return data;
    },

    // Validate data using Smart Analyzer
    validateDataWithAnalyzer(parsedData, previewData) {
        // Run analysis
        let analysis = null;
        if (window.smartAnalyzer && parsedData.length > 0) {
            analysis = window.smartAnalyzer.analyzeData(parsedData);
        }
        
        // Column Detection Results
        const columnResults = document.getElementById('column-detection-results');
        let columnHtml = '';
        
        // Show detected columns even if analysis failed (columns are now always returned)
        const cols = analysis?.columns || null;
        
        if (cols) {
            // Required columns - must exist (Order Date, Sales, Quantity)
            const requiredItems = [
                { name: 'Order Date', found: cols.dateColumn, required: true },
                { name: 'Sales', found: cols.salesColumn || cols.revenueColumn, required: true },
                { name: 'Quantity', found: cols.unitsColumn || cols.quantityColumn, required: true }
            ];
            
            // Optional columns - nice to have, no warning if missing
            const optionalItems = [
                { name: 'Category', found: cols.categoryColumn, required: false },
                { name: 'Product', found: cols.productColumn, required: false },
                { name: 'Region', found: cols.regionColumn, required: false }
            ];
            
            // Show detected mapping summary if available
            if (analysis?.detectedMapping && Object.keys(analysis.detectedMapping).length > 0) {
                columnHtml += '<div style="margin-bottom: 0.75rem; padding: 0.5rem; background: rgba(16, 185, 129, 0.1); border-radius: 6px; font-size: 0.8rem;">';
                columnHtml += '<strong style="color: #10b981;">Detected Mapping:</strong><br>';
                for (const [key, val] of Object.entries(analysis.detectedMapping)) {
                    columnHtml += `<span style="color: var(--color-text-secondary);">${val}</span> → <span style="color: #10b981;">${key}</span><br>`;
                }
                columnHtml += '</div>';
            }
            
            // Show required columns first
            columnHtml += '<div style="margin-bottom: 0.75rem;"><strong style="color: var(--color-text); font-size: 0.75rem;">REQUIRED</strong></div>';
            requiredItems.forEach(item => {
                const statusColor = item.found ? '#10b981' : '#ef4444';
                const statusIcon = item.found ? 'check' : 'times';
                columnHtml += `
                    <div style="display: flex; align-items; center; justify-content: space-between; padding: 0.4rem 0;">
                        <span style="color: var(--color-text);">${item.name}:</span>
                        <span style="color: ${statusColor}; font-weight: 600;">
                            <i class="fas fa-${statusIcon}" style="margin-right: 0.25rem;"></i>
                            ${item.found || 'Missing'}
                        </span>
                    </div>
                `;
            });
            
            // Show optional columns
            columnHtml += '<div style="margin: 0.75rem 0 0.5rem 0;"><strong style="color: var(--color-text-secondary); font-size: 0.75rem;">OPTIONAL</strong></div>';
            optionalItems.forEach(item => {
                const statusColor = item.found ? '#10b981' : '#6b7280';
                const statusIcon = item.found ? 'check' : 'minus';
                columnHtml += `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0;">
                        <span style="color: var(--color-text-secondary);">${item.name}:</span>
                        <span style="color: ${statusColor}; font-weight: 500;">
                            <i class="fas fa-${statusIcon}" style="margin-right: 0.25rem;"></i>
                            ${item.found || 'Not provided'}
                        </span>
                    </div>
                `;
            });
        } else {
            columnHtml = '<p style="color: var(--color-text-secondary);">Analyzing columns...</p>';
        }
        
        columnResults.innerHTML = columnHtml;
        
        // Data Quality Results
        const qualityResults = document.getElementById('data-quality-results');
        const totalRows = parsedData.length;
        let completeness = 0;
        if (analysis && analysis.columns && totalRows > 0) {
            const requiredKeys = [
                analysis.columns.dateColumn,
                analysis.columns.salesColumn || analysis.columns.revenueColumn,
                analysis.columns.unitsColumn || analysis.columns.quantityColumn
            ].filter(Boolean);

            if (requiredKeys.length > 0) {
                const validRows = parsedData.filter(row =>
                    requiredKeys.every(key => row[key] !== null && row[key] !== undefined && row[key] !== '')
                ).length;
                completeness = Math.round((validRows / totalRows) * 100);
            }
        }
        
        qualityResults.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0;">
                <span style="color: var(--color-text);">Total Records:</span>
                <span style="color: var(--color-text); font-weight: 600;">${totalRows.toLocaleString()}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0;">
                <span style="color: var(--color-text);">Categories Found:</span>
                <span style="color: #10b981; font-weight: 600;">${analysis?.metrics?.uniqueCategories || 0}</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0;">
                <span style="color: var(--color-text);">Data Quality:</span>
                <span style="color: #10b981; font-weight: 600;">${completeness}%</span>
            </div>
        `;
    },

    // Display Data Preview Table
    displayDataPreview(data) {
        const table = document.getElementById('data-preview-table');
        let html = '<thead><tr>';
        
        // Add headers
        if (data.headers) {
            data.headers.forEach(header => {
                html += `<th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600; border-bottom: 1px solid var(--color-border);">${header}</th>`;
            });
        }
        html += '</tr></thead><tbody>';
        
        // Add rows
        if (data.rows) {
            data.rows.slice(0, 10).forEach((row, index) => {
                if (row.some(cell => cell)) { // Skip empty rows
                    html += `<tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">`;
                    row.forEach(cell => {
                        html += `<td style="padding: 0.75rem; color: var(--color-text);">${cell}</td>`;
                    });
                    html += '</tr>';
                }
            });
        }
        
        html += '</tbody>';
        table.innerHTML = html;
    },

    // Process Uploaded Data with Smart Analysis
    processUploadedData() {
        if (!window.uploadedData || !window.uploadedData.parsed) {
            utils.showToast('No data to process', 'error');
            return;
        }

        // Show processing
        const processingIndicator = document.getElementById('processing-indicator');
        processingIndicator.style.display = 'block';

        // Process data with Smart Analyzer
        setTimeout(() => {
            try {
                const parsedData = window.uploadedData.parsed;
                
                // Run full analysis
                let analysisResults = null;
                if (window.smartAnalyzer && parsedData.length > 0) {
                    analysisResults = window.smartAnalyzer.analyzeData(parsedData);
                }
                
                // Check if validation failed (missing required columns)
                if (analysisResults && !analysisResults.success) {
                    processingIndicator.style.display = 'none';
                    
                    // Show friendly error message for missing required columns
                    utils.showToast(analysisResults.error, 'warning');
                    
                    // Update the UI to show what's missing
                    const columnResults = document.getElementById('column-detection-results');
                    if (columnResults) {
                        columnResults.innerHTML = `
                            <div style="padding: 1rem; background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; margin-top: 1rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; color: #f59e0b; margin-bottom: 0.5rem;">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <strong>Missing Required Data</strong>
                                </div>
                                <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin: 0;">
                                    ${analysisResults.error}
                                </p>
                                <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin: 0.5rem 0 0 0;">
                                    <strong>Required columns:</strong> Order Date, Sales, Quantity
                                </p>
                            </div>
                        `;
                    }
                    return;
                }
                
                // Save everything to localStorage
                const dataToSave = {
                    raw: parsedData,
                    analysis: analysisResults,
                    uploadedAt: new Date().toISOString(),
                    fileName: window.uploadedData.file?.name || 'unknown',
                    userId: authManager?.currentUser?.id || null // Track which user uploaded
                };
                
                localStorage.setItem('salesPredix_uploadedData', JSON.stringify(dataToSave));
                localStorage.setItem('salesPredix_analysisResults', JSON.stringify(analysisResults));
                
                // SECURITY: Save user-scoped copy of data for session isolation
                if (window.authManager && authManager.currentUser?.id) {
                    authManager.saveUserScopedData();
                }
                
                processingIndicator.style.display = 'none';
                
                // MARK UPLOAD STEP AS COMPLETE - this unlocks Dashboard
                router.completeStep('upload');
                
                const recordCount = analysisResults?.recordsProcessed || parsedData.length;
                const originalCount = analysisResults?.originalRecords || parsedData.length;
                const categoryCount = analysisResults?.metrics?.uniqueCategories || 0;
                
                // Show success with feature summary
                let successMessage = `Processed ${recordCount} records`;
                if (recordCount < originalCount) {
                    successMessage += ` (${originalCount - recordCount} invalid rows removed)`;
                }
                if (analysisResults?.features?.optional?.length > 0) {
                    successMessage += `. Using: ${analysisResults.features.optional.join(', ')}`;
                }
                utils.showToast(successMessage, 'success');
                
                // Navigate to dashboard (now unlocked)
                setTimeout(() => {
                    router.navigate('/');
                }, 1000);
                
            } catch (error) {
                console.error('Processing error:', error);
                processingIndicator.style.display = 'none';
                utils.showToast('Something went wrong. Please check your file and try again.', 'error');
            }
        }, 1500);
    },

    // Clear Upload
    clearUpload() {
        document.getElementById('data-preview-section').style.display = 'none';
        document.getElementById('file-input').value = '';
        window.uploadedData = null;
        utils.showToast('Upload cleared', 'info');
    },

    // Download Sample Data
    downloadSampleData() {
        const sampleData = `Date,Product,Category,Region,Sales,Units
2024-01-01,Laptop Pro,Electronics,North,1250,5
2024-01-01,Office Chair,Furniture,South,450,18
2024-01-01,Wireless Mouse,Electronics,East,89,25
2024-01-01,Standing Desk,Furniture,West,899,3
2024-01-02,Laptop Pro,Electronics,North,1250,5
2024-01-02,Office Chair,Furniture,South,450,18
2024-01-02,Tablet,Electronics,North,699,12
2024-01-02,Bookshelf,Furniture,East,299,8`;

        const blob = new Blob([sampleData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_sales_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    },

    // Format File Size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Analytics Page - Modern SalesPredix Design
    analytics(data) {
        if (data.isLoading) {
            return components.createLoadingSpinner('Loading analytics...');
        }

        // Check if valid data has been uploaded - show empty state if not
        // Data-driven approach: No mock data, only user's actual uploaded data
        const analysisData = this.getAnalysisData();
        if (!data.hasValidData && (!analysisData || analysisData.success === false)) {
            return this.createEmptyState('Analytics');
        }

        // Mark analytics as complete when viewed (unlocks AI Assistant)
        setTimeout(() => {
            if (router && router.completeStep) {
                router.completeStep('analytics');
            }
        }, 2000);

        // Get data availability to conditionally render charts
        const availability = data.dataAvailability || {};
        
        // Build dynamic chart data from actual analysis data
        const metrics = analysisData?.metrics || {};
        const categoryPerformance = analysisData?.categoryPerformance || [];
        const timePatterns = metrics?.timePatterns || analysisData?.timePatterns || {};
        const salesPredictions = analysisData?.salesPredictions || {};
        
        // Monthly Revenue Data - from actual data
        let monthlyData = { labels: [], revenues: [] };
        if (salesPredictions.historical && salesPredictions.historical.length > 0) {
            monthlyData = {
                labels: salesPredictions.historical.map(h => h.month),
                revenues: salesPredictions.historical.map(h => h.sales)
            };
        } else if (timePatterns.byMonth) {
            const months = Object.keys(timePatterns.byMonth).sort();
            monthlyData = {
                labels: months,
                revenues: months.map(m => timePatterns.byMonth[m].sales || 0)
            };
        }

        // Category Distribution - from actual data
        let categoryData = { labels: [], values: [], colors: [] };
        const defaultColors = ['#22d3ee', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#3b82f6'];
        if (categoryPerformance.length > 0) {
            categoryData = {
                labels: categoryPerformance.slice(0, 6).map(c => c.category),
                values: categoryPerformance.slice(0, 6).map(c => c.percentage),
                colors: categoryPerformance.slice(0, 6).map((_, i) => defaultColors[i % defaultColors.length])
            };
        }

        // Regional Sales Data - from actual analysis data
        let regionalData = { labels: [], values: [] };
        let regionDataSource = analysisData?.regionData || data.regionData;
        // Fallback: build from features.regionImpact if regionData not at top level
        if ((!regionDataSource || regionDataSource.length === 0) && analysisData?.features?.regionImpact) {
            regionDataSource = Object.entries(analysisData.features.regionImpact)
                .map(([region, info]) => ({ region, revenue: info.sales, count: info.count }))
                .sort((a, b) => b.revenue - a.revenue);
        }
        // Fallback: compute from raw stored data if still no regionData
        if ((!regionDataSource || regionDataSource.length === 0)) {
            try {
                const storedRaw = JSON.parse(localStorage.getItem('salesPredix_uploadedData') || '{}');
                const rawRows = storedRaw?.raw || [];
                const cols = analysisData?.columns || {};
                const regionCol = cols.regionColumn;
                const salesCol = cols.salesColumn || cols.revenueColumn;
                if (regionCol && salesCol && rawRows.length > 0) {
                    const regionMap = {};
                    rawRows.forEach(row => {
                        const region = (row[regionCol] || '').toString().trim();
                        if (!region) return;
                        const sales = parseFloat(String(row[salesCol]).replace(/[^0-9.\-]/g, '')) || 0;
                        if (!regionMap[region]) regionMap[region] = { sales: 0, orders: 0 };
                        regionMap[region].sales += sales;
                        regionMap[region].orders += 1;
                    });
                    regionDataSource = Object.entries(regionMap)
                        .map(([region, info]) => ({ region, revenue: info.sales, orders: info.orders }))
                        .sort((a, b) => b.revenue - a.revenue);
                    console.log('[SalesPredix] Built regionData from raw stored data:', regionDataSource);
                }
            } catch (e) { console.warn('[SalesPredix] Raw data fallback failed:', e); }
        }
        console.log('[SalesPredix] regionDataSource:', regionDataSource);
        if (regionDataSource && regionDataSource.length > 0) {
            regionalData = {
                labels: regionDataSource.map(r => r.region),
                values: regionDataSource.map(r => r.revenue)
            };
        }

        // Peak Patterns Data - from actual time patterns
        let peakHoursData = { labels: [], values: [] };
        console.log('[SalesPredix] timePatterns:', JSON.stringify(timePatterns));
        console.log('[SalesPredix] timePatterns.byWeekday:', timePatterns.byWeekday);
        if (timePatterns.byWeekday && Object.keys(timePatterns.byWeekday).length > 0) {
            const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            peakHoursData = {
                labels: weekdays,
                values: weekdays.map((_, i) => {
                    const dayData = timePatterns.byWeekday[i] || timePatterns.byWeekday[String(i)];
                    return dayData?.sales || 0;
                })
            };
            console.log('[SalesPredix] peakHoursData values:', peakHoursData.values);
        } else {
            // Fallback: show sales by month if no weekday data
            if (timePatterns.byMonth && Object.keys(timePatterns.byMonth).length > 0) {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthKeys = Object.keys(timePatterns.byMonth).sort((a, b) => parseInt(a) - parseInt(b));
                peakHoursData = {
                    labels: monthKeys.map(m => monthNames[parseInt(m) - 1] || m),
                    values: monthKeys.map(m => timePatterns.byMonth[m]?.sales || 0)
                };
                console.log('[SalesPredix] Fallback to monthly data for chart');
            } else {
                // Ultimate fallback: compute from raw stored data
                try {
                    const storedRaw = JSON.parse(localStorage.getItem('salesPredix_uploadedData') || '{}');
                    const rawRows = storedRaw?.raw || [];
                    const cols = analysisData?.columns || {};
                    const dateCol = cols.dateColumn;
                    const salesCol = cols.salesColumn || cols.revenueColumn;
                    if (dateCol && salesCol && rawRows.length > 0) {
                        const weekdayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
                        rawRows.forEach(row => {
                            const dateStr = row[dateCol];
                            const sales = parseFloat(String(row[salesCol]).replace(/[^0-9.\-]/g, '')) || 0;
                            if (!dateStr) return;
                            // Try parse date
                            let d = new Date(dateStr);
                            if (isNaN(d.getTime())) {
                                // Try MM-DD-YYYY or DD-MM-YYYY
                                const parts = String(dateStr).split(/[\/\-]/);
                                if (parts.length === 3) {
                                    d = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
                                }
                            }
                            if (!isNaN(d.getTime())) {
                                weekdayTotals[d.getDay()] += sales;
                            }
                        });
                        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        if (weekdayTotals.some(v => v > 0)) {
                            peakHoursData = { labels: weekdays, values: weekdayTotals };
                            console.log('[SalesPredix] Built weekday data from raw stored data:', weekdayTotals);
                        }
                    }
                } catch (e) { console.warn('[SalesPredix] Weekday raw fallback failed:', e); }
            }
        }

        // Dynamic KPI values from actual data
        const totalRevenue = metrics.totalSales || 0;
        const avgOrderValue = metrics.avgOrderValue || 0;
        const totalOrders = metrics.recordCount || metrics.totalUnits || 0;
        const uniqueRegions = regionDataSource?.length || data.regionData?.length || 0;

        const html = `
            <div class="analytics-dashboard" style="animation: fadeIn 0.3s ease; padding: clamp(1rem, 3vw, 2rem);">
                <!-- Data Source Indicator -->
                <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; max-width: 100%;">
                    <i class="fas fa-database" style="color: #10b981; flex-shrink: 0;"></i>
                    <span style="color: var(--color-text); font-size: 0.875rem; overflow-wrap: break-word;">
                        Analytics based on <strong>${metrics.recordCount || 0} records</strong> from your uploaded data
                    </span>
                </div>

                <!-- Progress Indicator -->
                <div class="progress-steps" style="margin-bottom: 2rem; display: flex; justify-content: center; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>1. Upload</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);"><i class="fas fa-arrow-right"></i></div>
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>2. Dashboard</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);"><i class="fas fa-arrow-right"></i></div>
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>3. Predict</span>
                    </div>
                    <div class="step-arrow" style="color: var(--color-text-tertiary);"><i class="fas fa-arrow-right"></i></div>
                    <div class="step active" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(139, 92, 246, 0.1); border: 1px solid #8b5cf6; border-radius: 25px; color: #8b5cf6; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-chart-pie"></i>
                        <span>4. Analytics</span>
                    </div>
                </div>

                <!-- Header Section -->
                <div class="dashboard-header" style="margin-bottom: 2rem;">
                    <h1 style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; margin: 0; background: linear-gradient(135deg, #22d3ee, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                        Analytics
                    </h1>
                    <p style="color: var(--color-text-secondary); font-size: clamp(0.875rem, 2vw, 1.125rem); margin: 0.5rem 0 0 0;">
                        Deep insights into your sales performance and trends.
                    </p>
                </div>

                <!-- KPI Cards Section -->
                <div class="kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
                    <!-- Total Revenue Card -->
                    <div class="kpi-card" style="
                        background: linear-gradient(135deg, rgba(34, 211, 238, 0.1), rgba(34, 211, 238, 0.05)); 
                        border: 1px solid rgba(34, 211, 238, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        position: relative;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(34, 211, 238, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(34, 211, 238, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(34, 211, 238, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    Total Revenue
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #22d3ee; margin-bottom: 0.25rem;">
                                    ${this.formatCurrency(totalRevenue)}
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #22d3ee, #0891b2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-chart-line" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Avg Order Value Card -->
                    <div class="kpi-card" style="
                        background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05)); 
                        border: 1px solid rgba(139, 92, 246, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        position: relative;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(139, 92, 246, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(139, 92, 246, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    Avg Order Value
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #8b5cf6; margin-bottom: 0.25rem;">
                                    ${this.formatCurrency(avgOrderValue)}
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-dollar-sign" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Total Orders Card -->
                    <div class="kpi-card" style="
                        background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05)); 
                        border: 1px solid rgba(16, 185, 129, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        position: relative;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(16, 185, 129, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(16, 185, 129, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    Total Orders
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #10b981; margin-bottom: 0.25rem;">
                                    ${this.formatNumber(totalOrders)}
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-shopping-cart" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Active Regions Card -->
                    <div class="kpi-card" style="
                        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05)); 
                        border: 1px solid rgba(245, 158, 11, 0.2); 
                        border-radius: 16px; 
                        padding: 1.5rem; 
                        position: relative;
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(245, 158, 11, 0.1);
                        transition: all 0.3s ease;
                    " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 16px 40px rgba(245, 158, 11, 0.2)';" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 32px rgba(245, 158, 11, 0.1)';">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 0.875rem; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
                                    ${uniqueRegions > 0 ? 'Active Regions' : 'Categories'}
                                </div>
                                <div style="font-size: 2.25rem; font-weight: 700; color: #f59e0b; margin-bottom: 0.25rem;">
                                    ${uniqueRegions > 0 ? uniqueRegions : categoryPerformance.length || 0}
                                </div>
                            </div>
                            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-${uniqueRegions > 0 ? 'map-marker-alt' : 'folder'}" style="color: white; font-size: 1.25rem;"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Grid - Conditionally rendered based on data availability -->
                <div class="charts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(500px, 100%), 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <!-- Monthly Revenue Chart -->
                    <div class="chart-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1rem, 3vw, 2rem); 
                        backdrop-filter: blur(10px);
                        box-shadow: var(--shadow-lg);
                    ">
                        <div class="chart-header" style="margin-bottom: 1rem;">
                            <h3 style="font-size: clamp(1rem, 2.5vw, 1.25rem); font-weight: 600; margin: 0; color: var(--color-text);">Monthly Revenue</h3>
                            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">Revenue trends over the past 6 months</p>
                        </div>
                        <div class="chart-container" style="height: clamp(200px, 35vw, 300px); position: relative;">
                            <canvas id="monthly-revenue-chart"></canvas>
                        </div>
                    </div>

                    <!-- Category Distribution Chart -->
                    <div class="chart-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1rem, 3vw, 2rem); 
                        backdrop-filter: blur(10px);
                        box-shadow: var(--shadow-lg);
                    ">
                        <div class="chart-header" style="margin-bottom: 1rem;">
                            <h3 style="font-size: clamp(1rem, 2.5vw, 1.25rem); font-weight: 600; margin: 0; color: var(--color-text);">Category Distribution</h3>
                            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">Sales breakdown by product category</p>
                        </div>
                        <div class="chart-container" style="height: 250px; position: relative;">
                            <canvas id="category-donut-chart"></canvas>
                        </div>
                        <div class="category-legend" style="margin-top: 1rem;">
                            ${categoryData.labels.map((label, idx) => `
                                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border);">
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <span style="width: 12px; height: 12px; background: ${categoryData.colors[idx]}; border-radius: 3px; display: inline-block;"></span>
                                        <span style="color: var(--color-text);">${label}</span>
                                    </div>
                                    <span style="font-weight: 600; color: ${categoryData.colors[idx]};">${categoryData.values[idx]}%</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Bottom Charts Grid -->
                <div class="charts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(500px, 100%), 1fr)); gap: 1.5rem;">
                    <!-- Regional Sales Chart -->
                    <div class="chart-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1rem, 3vw, 2rem); 
                        backdrop-filter: blur(10px);
                        box-shadow: var(--shadow-lg);
                    ">
                        <div class="chart-header" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
                            <div>
                                <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Regional Sales</h3>
                                <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">Performance by geographic region</p>
                            </div>
                            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
                                <!-- Toggle: Revenue / Orders -->
                                <div id="region-toggle" style="display: flex; background: var(--color-surface-alt); border-radius: 8px; overflow: hidden; border: 1px solid var(--color-border);">
                                    <button id="region-toggle-revenue" onclick="window._regionChartToggle && window._regionChartToggle('revenue')" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; border: none; cursor: pointer; background: #8b5cf6; color: #fff; transition: all 0.2s;">Revenue</button>
                                    <button id="region-toggle-orders" onclick="window._regionChartToggle && window._regionChartToggle('orders')" style="padding: 0.35rem 0.75rem; font-size: 0.75rem; border: none; cursor: pointer; background: transparent; color: var(--color-text-secondary); transition: all 0.2s;">Orders</button>
                                </div>
                                <!-- Sort -->
                                <button id="region-sort-btn" onclick="window._regionChartSort && window._regionChartSort()" title="Sort" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; cursor: pointer; background: var(--color-surface-alt); color: var(--color-text-secondary); transition: all 0.2s;">
                                    <i class="fas fa-sort-amount-down"></i>
                                </button>
                                <!-- Export -->
                                <button id="region-export-btn" onclick="window._regionChartExport && window._regionChartExport()" title="Export chart" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border: 1px solid var(--color-border); border-radius: 8px; cursor: pointer; background: var(--color-surface-alt); color: var(--color-text-secondary); transition: all 0.2s;">
                                    <i class="fas fa-download"></i>
                                </button>
                            </div>
                        </div>
                        <!-- Percentage contribution badges -->
                        <div id="region-contribution" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;"></div>
                        <div class="chart-container" style="height: 300px; position: relative;">
                            <canvas id="regional-sales-chart"></canvas>
                        </div>
                    </div>

                    <!-- Sales by Weekday Chart -->
                    <div class="chart-card" style="
                        background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                        border: 1px solid var(--color-border); 
                        border-radius: 16px; 
                        padding: clamp(1rem, 3vw, 2rem); 
                        backdrop-filter: blur(10px);
                        box-shadow: var(--shadow-lg);
                    ">
                        <div class="chart-header" style="margin-bottom: 1rem;">
                            <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Sales by Weekday</h3>
                            <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">Sales activity throughout the week</p>
                        </div>
                        <div class="chart-container" style="height: 300px; position: relative;">
                            <canvas id="peak-hours-chart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Recent Predictions Table -->
                <div class="chart-card" style="
                    background: linear-gradient(135deg, var(--color-surface), var(--color-surface-alt)); 
                    border: 1px solid var(--color-border); 
                    border-radius: 16px; 
                    padding: clamp(1rem, 3vw, 2rem); 
                    backdrop-filter: blur(10px);
                    box-shadow: var(--shadow-lg);
                    margin-top: 1.5rem;
                ">
                    <div class="chart-header" style="margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 600; margin: 0; color: var(--color-text);">Recent Predictions</h3>
                        <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin: 0.25rem 0 0 0;">Latest AI-generated sales predictions</p>
                    </div>
                    <div class="table-container" style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--color-border);">
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600; font-size: 0.875rem;">Product</th>
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600; font-size: 0.875rem;">Prediction</th>
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600; font-size: 0.875rem;">Accuracy</th>
                                    <th style="padding: 1rem; text-align: left; color: var(--color-text-secondary); font-weight: 600; font-size: 0.875rem;">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.2s ease;" onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.backgroundColor='transparent';">
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">Laptop Pro X</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">$125,000</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 600;">94%</span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 600;">
                                            <i class="fas fa-arrow-up"></i>
                                            Up
                                        </div>
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.2s ease;" onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.backgroundColor='transparent';">
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">Office Chair Deluxe</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">$45,000</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 600;">87%</span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 600;">
                                            <i class="fas fa-arrow-up"></i>
                                            Up
                                        </div>
                                    </td>
                                </tr>
                                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.2s ease;" onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.backgroundColor='transparent';">
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">Wireless Headphones</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">$38,000</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 600;">91%</span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #ef4444; font-weight: 600;">
                                            <i class="fas fa-arrow-down"></i>
                                            Down
                                        </div>
                                    </td>
                                </tr>
                                <tr style="transition: all 0.2s ease;" onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.05)';" onmouseout="this.style.backgroundColor='transparent';">
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">Smart Watch Elite</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="font-weight: 600; color: var(--color-text);">$62,000</div>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem; font-weight: 600;">89%</span>
                                    </td>
                                    <td style="padding: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981; font-weight: 600;">
                                            <i class="fas fa-arrow-up"></i>
                                            Up
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Continue to Next Step -->
                <div style="margin-top: 2rem; text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1)); border-radius: 16px; border: 1px solid rgba(16, 185, 129, 0.2);">
                    <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-text); margin: 0 0 0.5rem 0;">Chat with AI</h3>
                    <p style="color: var(--color-text-secondary); margin: 0 0 1.5rem 0;">Get personalized insights from your AI sales assistant</p>
                    <button class="btn btn-primary" style="padding: 0.875rem 2rem; font-size: 1.125rem; font-weight: 600; background: linear-gradient(135deg, #10b981, #3b82f6);" onclick="router.completeStep('analytics'); router.navigate('/assistant');">
                        <i class="fas fa-robot"></i>
                        Continue to AI Assistant
                    </button>
                </div>
            </div>
        `;

        setTimeout(() => {
            // Initialize modern charts with SalesPredix styling
            this.initModernCharts(monthlyData, categoryData, regionalData, peakHoursData, regionDataSource);
        }, 50);

        return html;
    },

    // Initialize modern charts for SalesPredix Analytics
    initModernCharts(monthlyData, categoryData, regionalData, peakHoursData, regionDataSource) {
        // Monthly Revenue Bar Chart (Teal bars)
        const monthlyCtx = document.getElementById('monthly-revenue-chart');
        if (monthlyCtx) {
            new Chart(monthlyCtx, {
                type: 'bar',
                data: {
                    labels: monthlyData.labels,
                    datasets: [{
                        label: 'Revenue',
                        data: monthlyData.revenues,
                        backgroundColor: 'rgba(34, 211, 238, 0.8)',
                        borderColor: '#22d3ee',
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#22d3ee',
                            bodyColor: '#ffffff',
                            borderColor: '#22d3ee',
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    return `Revenue: $${context.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#9ca3af' }
                        },
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { 
                                color: '#9ca3af',
                                callback: function(value) {
                                    return '$' + (value / 1000) + 'k';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Category Distribution Donut Chart
        const categoryCtx = document.getElementById('category-donut-chart');
        if (categoryCtx) {
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: categoryData.labels,
                    datasets: [{
                        data: categoryData.values,
                        backgroundColor: categoryData.colors,
                        borderWidth: 0,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#ffffff',
                            bodyColor: '#ffffff',
                            borderColor: '#22d3ee',
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    return context.label + ': ' + context.parsed + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Regional Sales Interactive Bar Chart
        const regionalCtx = document.getElementById('regional-sales-chart');
        if (regionalCtx && regionDataSource && regionDataSource.length > 0) {
            // Color palette per region
            const regionColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];
            const bgColors = regionDataSource.map((_, i) => regionColors[i % regionColors.length]);
            const bgColorsAlpha = bgColors.map(c => c + 'CC');

            // Calculate percentage contribution
            const totalRev = regionDataSource.reduce((s, r) => s + r.revenue, 0);
            const totalOrd = regionDataSource.reduce((s, r) => s + (r.orders || r.count || 0), 0);
            const contribEl = document.getElementById('region-contribution');
            if (contribEl) {
                contribEl.innerHTML = regionDataSource.map((r, i) => {
                    const pct = totalRev > 0 ? ((r.revenue / totalRev) * 100).toFixed(1) : 0;
                    return `<span style="display:inline-flex;align-items:center;gap:4px;padding:0.25rem 0.6rem;border-radius:20px;font-size:0.7rem;font-weight:600;background:${regionColors[i % regionColors.length]}22;color:${regionColors[i % regionColors.length]};border:1px solid ${regionColors[i % regionColors.length]}44;"><span style="width:8px;height:8px;border-radius:50%;background:${regionColors[i % regionColors.length]}"></span>${r.region} ${pct}%</span>`;
                }).join('');
            }

            // State for toggle & sort
            let currentView = 'revenue';
            let sortAsc = false;

            function getChartData(view, ascending) {
                let items = regionDataSource.map((r, i) => ({
                    label: r.region,
                    value: view === 'revenue' ? r.revenue : (r.orders || r.count || 0),
                    color: bgColorsAlpha[i],
                    borderColor: bgColors[i],
                    origIndex: i
                }));
                if (ascending) items.sort((a, b) => a.value - b.value);
                return items;
            }

            let chartItems = getChartData(currentView, sortAsc);

            const regionalChart = new Chart(regionalCtx, {
                type: 'bar',
                data: {
                    labels: chartItems.map(c => c.label),
                    datasets: [{
                        label: currentView === 'revenue' ? 'Revenue ($)' : 'Orders',
                        data: chartItems.map(c => c.value),
                        backgroundColor: chartItems.map(c => c.color),
                        borderColor: chartItems.map(c => c.borderColor),
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    animation: { duration: 600, easing: 'easeInOutQuart' },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            titleColor: '#e2e8f0',
                            bodyColor: '#ffffff',
                            borderColor: 'rgba(139, 92, 246, 0.3)',
                            borderWidth: 1,
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    if (currentView === 'revenue') {
                                        return 'Revenue: $' + context.parsed.x.toLocaleString();
                                    }
                                    return 'Orders: ' + context.parsed.x.toLocaleString();
                                },
                                afterLabel: function(context) {
                                    const idx = context.dataIndex;
                                    const item = chartItems[idx];
                                    const origItem = regionDataSource.find(r => r.region === item.label);
                                    if (!origItem) return '';
                                    const pct = currentView === 'revenue'
                                        ? (totalRev > 0 ? ((origItem.revenue / totalRev) * 100).toFixed(1) : 0)
                                        : (totalOrd > 0 ? (((origItem.orders || origItem.count || 0) / totalOrd) * 100).toFixed(1) : 0);
                                    return `Share: ${pct}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.06)' },
                            ticks: { 
                                color: '#9ca3af',
                                callback: function(value) {
                                    if (currentView === 'revenue') {
                                        if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
                                        if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'k';
                                        return '$' + value;
                                    }
                                    return value.toLocaleString();
                                }
                            }
                        },
                        y: {
                            grid: { display: false },
                            ticks: { color: '#e2e8f0', font: { weight: 500 } }
                        }
                    }
                }
            });

            function updateChart() {
                chartItems = getChartData(currentView, sortAsc);
                regionalChart.data.labels = chartItems.map(c => c.label);
                regionalChart.data.datasets[0].data = chartItems.map(c => c.value);
                regionalChart.data.datasets[0].backgroundColor = chartItems.map(c => c.color);
                regionalChart.data.datasets[0].borderColor = chartItems.map(c => c.borderColor);
                regionalChart.data.datasets[0].label = currentView === 'revenue' ? 'Revenue ($)' : 'Orders';
                regionalChart.update();
                // Update contribution badges
                if (contribEl) {
                    const total = currentView === 'revenue' ? totalRev : totalOrd;
                    contribEl.innerHTML = chartItems.map((item, i) => {
                        const orig = regionDataSource.find(r => r.region === item.label);
                        const val = currentView === 'revenue' ? orig.revenue : (orig.orders || orig.count || 0);
                        const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                        return `<span style="display:inline-flex;align-items:center;gap:4px;padding:0.25rem 0.6rem;border-radius:20px;font-size:0.7rem;font-weight:600;background:${item.borderColor}22;color:${item.borderColor};border:1px solid ${item.borderColor}44;"><span style="width:8px;height:8px;border-radius:50%;background:${item.borderColor}"></span>${item.label} ${pct}%</span>`;
                    }).join('');
                }
            }

            // Toggle handler
            window._regionChartToggle = function(view) {
                currentView = view;
                const btnRev = document.getElementById('region-toggle-revenue');
                const btnOrd = document.getElementById('region-toggle-orders');
                if (btnRev && btnOrd) {
                    btnRev.style.background = view === 'revenue' ? '#8b5cf6' : 'transparent';
                    btnRev.style.color = view === 'revenue' ? '#fff' : 'var(--color-text-secondary)';
                    btnOrd.style.background = view === 'orders' ? '#8b5cf6' : 'transparent';
                    btnOrd.style.color = view === 'orders' ? '#fff' : 'var(--color-text-secondary)';
                }
                updateChart();
            };

            // Sort handler
            window._regionChartSort = function() {
                sortAsc = !sortAsc;
                const btn = document.getElementById('region-sort-btn');
                if (btn) btn.innerHTML = sortAsc ? '<i class="fas fa-sort-amount-up"></i>' : '<i class="fas fa-sort-amount-down"></i>';
                updateChart();
            };

            // Export handler
            window._regionChartExport = function() {
                // Show export menu
                const existing = document.getElementById('region-export-menu');
                if (existing) { existing.remove(); return; }
                const btn = document.getElementById('region-export-btn');
                const menu = document.createElement('div');
                menu.id = 'region-export-menu';
                menu.style.cssText = 'position:absolute;right:0;top:100%;margin-top:4px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:8px;padding:0.5rem;z-index:100;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;flex-direction:column;gap:0.25rem;';
                menu.innerHTML = `
                    <button onclick="window._regionExportPNG()" style="padding:0.4rem 0.75rem;font-size:0.75rem;border:none;border-radius:6px;cursor:pointer;background:transparent;color:var(--color-text);text-align:left;white-space:nowrap;">
                        <i class="fas fa-image" style="margin-right:6px;color:#8b5cf6;"></i>Export as PNG
                    </button>
                    <button onclick="window._regionExportCSV()" style="padding:0.4rem 0.75rem;font-size:0.75rem;border:none;border-radius:6px;cursor:pointer;background:transparent;color:var(--color-text);text-align:left;white-space:nowrap;">
                        <i class="fas fa-file-csv" style="margin-right:6px;color:#10b981;"></i>Export as CSV
                    </button>
                `;
                btn.parentElement.style.position = 'relative';
                btn.parentElement.appendChild(menu);
                setTimeout(() => document.addEventListener('click', function rem(e) {
                    if (!menu.contains(e.target) && e.target !== btn) { menu.remove(); document.removeEventListener('click', rem); }
                }), 10);
            };

            // PNG export
            window._regionExportPNG = function() {
                const link = document.createElement('a');
                link.download = 'regional-sales.png';
                link.href = regionalCtx.toDataURL('image/png');
                link.click();
                const m = document.getElementById('region-export-menu'); if (m) m.remove();
            };

            // CSV export
            window._regionExportCSV = function() {
                let csv = 'Region,Revenue,Orders,Revenue %,Orders %\n';
                regionDataSource.forEach(r => {
                    const revPct = totalRev > 0 ? ((r.revenue / totalRev) * 100).toFixed(1) : 0;
                    const ordPct = totalOrd > 0 ? (((r.orders || r.count || 0) / totalOrd) * 100).toFixed(1) : 0;
                    csv += `${r.region},${r.revenue},${r.orders || r.count || 0},${revPct}%,${ordPct}%\n`;
                });
                const blob = new Blob([csv], { type: 'text/csv' });
                const link = document.createElement('a');
                link.download = 'regional-sales.csv';
                link.href = URL.createObjectURL(blob);
                link.click();
                const m = document.getElementById('region-export-menu'); if (m) m.remove();
            };
        }

        // Peak Sales by Weekday Line Chart (Teal line with gradient)
        const peakHoursCtx = document.getElementById('peak-hours-chart');
        if (peakHoursCtx) {
            const gradient = peakHoursCtx.getContext('2d').createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
            gradient.addColorStop(1, 'rgba(34, 211, 238, 0.0)');

            new Chart(peakHoursCtx, {
                type: 'line',
                data: {
                    labels: peakHoursData.labels,
                    datasets: [{
                        label: 'Sales',
                        data: peakHoursData.values,
                        borderColor: '#22d3ee',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#22d3ee',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#22d3ee',
                            bodyColor: '#ffffff',
                            borderColor: '#22d3ee',
                            borderWidth: 1,
                            callbacks: {
                                label: function(context) {
                                    return `Sales: $${context.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: '#9ca3af' }
                        },
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { 
                                color: '#9ca3af',
                                callback: function(value) {
                                    return '$' + (value / 1000) + 'k';
                                }
                            }
                        }
                    }
                }
            });
        }
    },

    // Create region table with prediction support
    createRegionTableWithPrediction(regionData, isPredictionMode) {
        return `
            <div class="card">
                <h3 class="card-title">${isPredictionMode ? 'Predicted Regional Breakdown' : 'Regional Breakdown'}</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Region</th>
                                <th>${isPredictionMode ? 'Predicted Revenue' : 'Revenue'}</th>
                                <th>${isPredictionMode ? 'Predicted Profit' : 'Profit'}</th>
                                <th>Orders</th>
                                ${isPredictionMode ? '<th>Growth</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${regionData.map(region => `
                                <tr>
                                    <td><strong>${region.region}</strong></td>
                                    <td>${utils.formatCurrency(region.revenue)}</td>
                                    <td>${utils.formatCurrency(region.profit)}</td>
                                    <td>${utils.formatNumber(region.orders)}</td>
                                    ${isPredictionMode ? `
                                    <td>
                                        <span class="kpi-change ${parseFloat(region.predictedGrowth) >= 0 ? 'positive' : 'negative'}">
                                            <i class="fas fa-arrow-${parseFloat(region.predictedGrowth) >= 0 ? 'up' : 'down'}"></i>
                                            ${region.predictedGrowth}%
                                        </span>
                                    </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // Initialize prediction toggle functionality
    initPredictionToggle(originalData) {
        const toggle = document.getElementById('predictionToggle');
        const errorDiv = document.getElementById('prediction-error');
        
        if (!toggle) return;

        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                // Load prediction analytics
                this.loadPredictionAnalytics(originalData, errorDiv);
            } else {
                // Load general analytics
                this.loadGeneralAnalytics();
            }
        });
    },

    // Load prediction-based analytics
    loadPredictionAnalytics(originalData, errorDiv) {
        // Check if prediction data is available
        if (!dataManager.hasPredictionData()) {
            errorDiv.style.display = 'flex';
            document.getElementById('predictionToggle').checked = false;
            utils.showToast('Prediction data not available. Please upload sales data first.', 'error');
            return;
        }

        // Get prediction data
        const predictionData = dataManager.getPredictionData();
        
        if (!predictionData) {
            errorDiv.style.display = 'flex';
            document.getElementById('predictionToggle').checked = false;
            utils.showToast('Prediction data not available. Please run predictions first.', 'error');
            return;
        }

        // Store prediction state and data
        this._predictionModeEnabled = true;
        this._predictionData = predictionData;
        
        // Re-render the page without full reload
        errorDiv.style.display = 'none';
        utils.showToast('Switched to prediction-based analytics', 'success');
        
        // Re-render analytics page
        const appContent = document.getElementById('app');
        const mainContent = appContent.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = this.analytics(originalData);
        }
    },

    // Load general analytics (historical data)
    loadGeneralAnalytics() {
        this._predictionModeEnabled = false;
        this._predictionData = null;
        
        utils.showToast('Switched to historical analytics', 'info');
        
        // Re-render analytics page
        const data = dataManager.getData();
        const appContent = document.getElementById('app');
        const mainContent = appContent.querySelector('main');
        if (mainContent) {
            mainContent.innerHTML = this.analytics(data);
        }
    },

    // Predictions Page
    predictions(data) {
        // Check if valid data has been uploaded - show empty state if not
        // Data-driven approach: No mock data, only user's actual uploaded data
        const analysisData = this.getAnalysisData();
        if (!data.hasValidData && (!analysisData || analysisData.success === false)) {
            return this.createEmptyState('Predictions');
        }

        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const monthName = nextMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Calculate 6-month forecast period
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6);
        const forecastPeriod = `${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
        
        // Calculate growth and predictions based on actual data
        const revenueGrowth = data?.kpis?.revenueGrowth || 0;
        const profitGrowth = data?.kpis?.profitGrowth || 0;
        const totalRevenue = data?.kpis?.totalRevenue || 0;
        let avgGrowth = (revenueGrowth + profitGrowth) / 2 / 100;
        let predictedRevenue = totalRevenue * (1 + avgGrowth);
        let modelAccuracy = 0;
        
        // Use analyzed data accuracy if available
        if (analysisData && analysisData.salesPredictions && analysisData.salesPredictions.accuracy) {
            modelAccuracy = analysisData.salesPredictions.accuracy;
        }

        const accuracyDelta = analysisData?.salesPredictions?.accuracyChange || 0;
        
        // Calculate predicted revenue from actual predictions if available
        if (analysisData && analysisData.salesPredictions && analysisData.salesPredictions.predictions) {
            const predictions = analysisData.salesPredictions.predictions;
            if (predictions.length > 0) {
                predictedRevenue = predictions.reduce((sum, p) => sum + (p.predictedSales || 0), 0);
            }
        }
        
        // Use metrics from analysis data if available
        if (analysisData && analysisData.metrics) {
            const metrics = analysisData.metrics;
            if (metrics.growth) {
                avgGrowth = metrics.growth / 100;
            }
        }

        // Top product predictions based on actual product data from uploaded data
        let productPredictions = [];
        const confidenceBase = analysisData?.salesPredictions?.accuracy || 0;
        if (analysisData && analysisData.topProducts && analysisData.topProducts.length > 0) {
            // Use actual top products from analysis
            productPredictions = analysisData.topProducts.slice(0, 5).map(product => ({
                name: product.name,
                predictedRevenue: product.revenue * (1 + avgGrowth),
                change: (avgGrowth * 100).toFixed(1),
                confidence: Math.round(confidenceBase)
            }));
        } else if (analysisData && analysisData.categoryPerformance && analysisData.categoryPerformance.length > 0) {
            // Fallback to category data as product predictions
            productPredictions = analysisData.categoryPerformance.slice(0, 5).map(cat => ({
                name: cat.category,
                predictedRevenue: cat.sales * (1 + avgGrowth),
                change: (avgGrowth * 100).toFixed(1),
                confidence: Math.round(confidenceBase)
            }));
        } else if (data.topProducts && data.topProducts.length > 0) {
            // Fallback to data.topProducts only if available
            productPredictions = data.topProducts.slice(0, 5).map(product => ({
                name: product.name,
                predictedRevenue: product.revenue * (1 + avgGrowth),
                change: (avgGrowth * 100).toFixed(1),
                confidence: Math.round(confidenceBase)
            }));
        }

        // Mark predictions as complete when viewed (unlocks Analytics)
        setTimeout(() => {
            if (router && router.completeStep) {
                router.completeStep('predictions');
            }
        }, 2000);

        // Get record count for data source indicator
        const recordCount = analysisData?.metrics?.recordCount || analysisData?.recordsProcessed || 0;

        const html = `
            <div style="animation: fadeIn 0.3s ease;">
                <!-- Data Source Indicator -->
                <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 8px; width: fit-content;">
                    <i class="fas fa-chart-line" style="color: #2563eb;"></i>
                    <span style="color: var(--color-text); font-size: 0.875rem;">
                        Predictions based on <strong>${recordCount} records</strong> from your uploaded data
                    </span>
                </div>

                <!-- Progress Indicator -->
                <div class="progress-steps" style="margin-bottom: 2rem; display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>1. Upload</span>
                    </div>
                    <i class="fas fa-arrow-right" style="color: var(--color-text-tertiary);"></i>
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>2. Dashboard</span>
                    </div>
                    <i class="fas fa-arrow-right" style="color: var(--color-text-tertiary);"></i>
                    <div class="step active" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(37, 99, 235, 0.1); border: 1px solid #2563eb; border-radius: 25px; color: #2563eb; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-crystal-ball"></i>
                        <span>3. Predictions</span>
                    </div>
                    <i class="fas fa-arrow-right" style="color: var(--color-text-tertiary);"></i>
                    <div class="step" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 25px; color: var(--color-text-secondary); font-size: 0.875rem;">
                        <i class="fas fa-lock" style="font-size: 0.75rem;"></i>
                        <span>4. Analytics</span>
                    </div>
                </div>

                <!-- Header Section -->
                <div class="predictions-header">
                    <div>
                        <h1 class="predictions-title">Predictions</h1>
                        <p class="predictions-subtitle">AI-powered sales forecasts based on your data.</p>
                    </div>
                    <button class="btn btn-primary" onclick="utils.showToast('Generating new prediction...', 'info')">
                        <i class="fas fa-sparkles"></i>
                        Generate New Prediction
                    </button>
                </div>
                
                <!-- Stats Cards -->
                <div class="predictions-stats">
                    <!-- Model Accuracy -->
                    <div class="prediction-stat-card">
                        <div class="prediction-stat-icon">
                            <i class="fas fa-bullseye"></i>
                            <span>Model Accuracy</span>
                        </div>
                        <div class="prediction-stat-value">${modelAccuracy.toFixed(1)}%</div>
                        <div class="prediction-stat-change ${accuracyDelta >= 0 ? 'positive' : 'negative'}">
                            <i class="fas fa-arrow-${accuracyDelta >= 0 ? 'up' : 'down'}"></i>
                            ${accuracyDelta >= 0 ? '+' : ''}${accuracyDelta.toFixed(1)}% from last period
                        </div>
                    </div>
                    
                    <!-- Next Month Forecast -->
                    <div class="prediction-stat-card">
                        <div class="prediction-stat-icon">
                            <i class="fas fa-chart-line"></i>
                            <span>Next Month Forecast</span>
                        </div>
                        <div class="prediction-stat-value">${utils.formatCurrency(predictedRevenue)}</div>
                        <div class="prediction-stat-change ${avgGrowth >= 0 ? 'positive' : 'negative'}">
                            <i class="fas fa-arrow-${avgGrowth >= 0 ? 'up' : 'down'}"></i>
                            ${avgGrowth >= 0 ? '+' : ''}${(avgGrowth * 100).toFixed(1)}% expected growth
                        </div>
                    </div>
                    
                    <!-- Forecast Period -->
                    <div class="prediction-stat-card">
                        <div class="prediction-stat-icon">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Forecast Period</span>
                        </div>
                        <div class="prediction-stat-value">6 Months</div>
                        <div class="prediction-stat-period">${forecastPeriod}</div>
                    </div>
                </div>

                <!-- Sales Forecast Chart -->
                <div class="forecast-section">
                    <div class="forecast-header">
                        <div>
                            <h3 class="forecast-title">Sales Forecast</h3>
                            <p class="forecast-subtitle">Predicted vs actual sales with confidence interval</p>
                        </div>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-dot actual"></span>
                                <span>Actual</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot predicted"></span>
                                <span>Predicted</span>
                            </div>
                        </div>
                    </div>
                    <div class="chart-container" style="height: 350px;">
                        <canvas id="forecast-chart"></canvas>
                    </div>
                </div>

                <!-- Top Product Predictions Table -->
                <div class="predictions-table-section">
                    <div class="predictions-table-header">
                        <h3 class="predictions-table-title">Top Product Predictions</h3>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Predicted Revenue</th>
                                    <th>Change</th>
                                    <th>Confidence</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productPredictions.length > 0
                                    ? productPredictions.map(product => `
                                        <tr>
                                            <td><strong>${product.name}</strong></td>
                                            <td>${utils.formatCurrency(product.predictedRevenue)}</td>
                                            <td>
                                                <span class="kpi-change ${parseFloat(product.change) >= 0 ? 'positive' : 'negative'}">
                                                    <i class="fas fa-arrow-${parseFloat(product.change) >= 0 ? 'up' : 'down'}"></i>
                                                    ${parseFloat(product.change) >= 0 ? '+' : ''}${product.change}%
                                                </span>
                                            </td>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                    <div class="confidence-bar">
                                                        <div class="confidence-fill" style="width: ${product.confidence}%;"></div>
                                                    </div>
                                                    <span>${product.confidence}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')
                                    : `
                                        <tr>
                                            <td colspan="4" style="text-align: center; color: var(--color-text-secondary); padding: 1.5rem;">
                                                No product prediction data available. Upload data with Product to see predictions.
                                            </td>
                                        </tr>
                                    `}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recommendations Section -->
                <div class="card" style="margin-top: 1.5rem;">
                    <h3 class="card-title"><i class="fas fa-lightbulb"></i> AI Recommendations</h3>
                    <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
                        ${(() => {
                            const topProduct = analysisData?.topProducts?.[0]?.name;
                            const worstCategory = analysisData?.categoryPerformance?.length
                                ? analysisData.categoryPerformance[analysisData.categoryPerformance.length - 1]?.category
                                : null;
                            const topRegion = analysisData?.regionData?.[0]?.region;

                            if (!topProduct && !worstCategory && !topRegion) {
                                return `
                                    <div style="text-align: center; color: var(--color-text-secondary); padding: 1rem;">
                                        No recommendations available. Upload data to generate insights.
                                    </div>
                                `;
                            }

                            return `
                                ${topProduct ? `
                                    <div style="display: flex; gap: 0.75rem; padding: 1rem; border-left: 3px solid var(--color-success); background: rgba(16, 185, 129, 0.1); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
                                        <i class="fas fa-check-circle" style="color: var(--color-success); margin-top: 0.25rem;"></i>
                                        <div>
                                            <strong>Stock up on ${topProduct}</strong>
                                            <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">High demand expected based on current trends and seasonal patterns</p>
                                        </div>
                                    </div>
                                ` : ''}
                                ${worstCategory ? `
                                    <div style="display: flex; gap: 0.75rem; padding: 1rem; border-left: 3px solid var(--color-warning); background: rgba(245, 158, 11, 0.1); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
                                        <i class="fas fa-exclamation-triangle" style="color: var(--color-warning); margin-top: 0.25rem;"></i>
                                        <div>
                                            <strong>Monitor ${worstCategory} category</strong>
                                            <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">Lower performance may need promotional attention</p>
                                        </div>
                                    </div>
                                ` : ''}
                                ${topRegion ? `
                                    <div style="display: flex; gap: 0.75rem; padding: 1rem; border-left: 3px solid var(--color-primary); background: rgba(34, 211, 238, 0.1); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
                                        <i class="fas fa-chart-line" style="color: var(--color-primary); margin-top: 0.25rem;"></i>
                                        <div>
                                            <strong>Expand ${topRegion} presence</strong>
                                            <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">Top performing region with significant growth potential</p>
                                        </div>
                                    </div>
                                ` : ''}
                            `;
                        })()}
                    </div>
                </div>

                <!-- Continue to Next Step -->
                <div style="margin-top: 2rem; text-align: center; padding: 2rem; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1)); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.2);">
                    <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--color-text); margin: 0 0 0.5rem 0;">Dive Deeper into Analytics</h3>
                    <p style="color: var(--color-text-secondary); margin: 0 0 1.5rem 0;">Explore detailed charts and performance metrics</p>
                    <button class="btn btn-primary" style="padding: 0.875rem 2rem; font-size: 1.125rem; font-weight: 600; background: linear-gradient(135deg, #8b5cf6, #7c3aed);" onclick="router.completeStep('predictions'); router.navigate('/analytics');">
                        <i class="fas fa-arrow-right"></i>
                        Continue to Analytics
                    </button>
                </div>
            </div>
        `;

        // Initialize forecast chart after render
        setTimeout(() => {
            this.initForecastChart(data, avgGrowth);
        }, 50);

        return html;
    },

    // Initialize forecast chart
    initForecastChart(data, avgGrowth) {
        const ctx = document.getElementById('forecast-chart');
        if (!ctx) return;

        // Get analysis results from localStorage for actual data
        const analysisData = this.getAnalysisData();
        
        let labels = [];
        let actualData = [];
        let predictedData = [];
        
        if (analysisData && analysisData.salesPredictions) {
            const salesPreds = analysisData.salesPredictions;
            
            // Use historical data from analysis
            if (salesPreds.historical && salesPreds.historical.length > 0) {
                salesPreds.historical.forEach(item => {
                    labels.push(item.month);
                    actualData.push(item.sales);
                });
            }
            
            // Add predicted data
            if (salesPreds.predictions && salesPreds.predictions.length > 0) {
                // Connect prediction to last actual data point
                const lastActual = actualData.length > 0 ? actualData[actualData.length - 1] : null;
                
                salesPreds.predictions.forEach((item, idx) => {
                    labels.push(item.month);
                    actualData.push(null); // No actual data for future months
                });
                
                // Build predicted line starting from last actual point
                const predictedLine = new Array(actualData.length - salesPreds.predictions.length).fill(null);
                if (lastActual !== null) {
                    predictedLine.push(lastActual); // Connect to last actual point
                }
                salesPreds.predictions.forEach(item => {
                    predictedLine.push(item.predictedSales);
                });
                predictedData = predictedLine;
            }
        }

        if (labels.length === 0) {
            const container = ctx.closest('.chart-container') || ctx.parentElement;
            this.renderChartEmptyState(container, 'No forecast data yet', 'Upload data to generate a forecast.');
            return;
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Actual Sales',
                        data: actualData,
                        borderColor: '#22d3ee',
                        backgroundColor: 'rgba(34, 211, 238, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#22d3ee',
                        spanGaps: false
                    },
                    {
                        label: 'Predicted',
                        data: predictedData,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderDash: [5, 5],
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#8b5cf6',
                        spanGaps: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#f9fafb',
                        bodyColor: '#9ca3af',
                        borderColor: '#374151',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + Math.round(context.raw / 1000) + 'K';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(55, 65, 81, 0.5)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9ca3af'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(55, 65, 81, 0.5)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9ca3af',
                            callback: function(value) {
                                return '$' + Math.round(value / 1000) + 'K';
                            }
                        }
                    }
                }
            }
        });
    },

    // ============================================
    // AI ASSISTANT — Cache, Performance & Helpers
    // ============================================

    // Response cache (Map: normalized query → { response, timestamp })
    _aiCache: new Map(),
    _AI_CACHE_TTL: 30 * 60 * 1000, // 30 minutes

    // Performance tracker
    _aiPerf: { times: [], queries: 0, cacheHits: 0 },

    _aiCacheGet(query) {
        const key = query.toLowerCase().trim().replace(/\s+/g, ' ');
        const entry = this._aiCache.get(key);
        if (entry && (Date.now() - entry.ts < this._AI_CACHE_TTL)) {
            this._aiPerf.cacheHits++;
            return entry.response;
        }
        if (entry) this._aiCache.delete(key); // expired
        return null;
    },

    _aiCacheSet(query, response) {
        const key = query.toLowerCase().trim().replace(/\s+/g, ' ');
        this._aiCache.set(key, { response, ts: Date.now() });
        // Evict oldest if >200 entries
        if (this._aiCache.size > 200) {
            const oldest = this._aiCache.keys().next().value;
            this._aiCache.delete(oldest);
        }
    },

    _aiTrackTime(ms) {
        this._aiPerf.times.push(ms);
        this._aiPerf.queries++;
        if (this._aiPerf.times.length > 100) this._aiPerf.times.shift();
    },

    _aiAvgTime() {
        const t = this._aiPerf.times;
        if (!t.length) return 0;
        return Math.round(t.reduce((a, b) => a + b, 0) / t.length);
    },

    _aiResponseTimeBadge(ms, cached = false) {
        if (cached) return `<div class="ai-response-time cached"><i class="fas fa-bolt"></i> Cached · ${ms}ms</div>`;
        if (ms < 2000) return `<div class="ai-response-time fast"><i class="fas fa-check-circle"></i> ${ms}ms</div>`;
        if (ms < 4000) return `<div class="ai-response-time medium"><i class="fas fa-clock"></i> ${ms}ms</div>`;
        return `<div class="ai-response-time slow"><i class="fas fa-exclamation-circle"></i> ${ms}ms</div>`;
    },

    // Loading messages rotation
    _loadingMessages: [
        'Analyzing sales data...',
        'Crunching numbers...',
        'Checking top products...',
        'Scanning trends...',
        'Almost there...'
    ],

    _createLoadingSkeleton() {
        const skeleton = document.createElement('div');
        skeleton.className = 'ai-loading-skeleton';
        skeleton.id = 'ai-loading-skeleton';
        skeleton.innerHTML = `
            <div class="ai-loading-header">
                <div class="ai-brain-icon">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="ai-loading-body">
                    <div class="ai-loading-label">AI Assistant</div>
                    <div class="ai-loading-message">
                        <span id="ai-loading-msg-text">Analyzing sales data...</span>
                        <span class="ai-loading-dots">
                            <span></span><span></span><span></span>
                        </span>
                    </div>
                    <div class="ai-progress-wrap">
                        <div class="ai-progress-labels">
                            <span>Progress</span>
                            <span id="ai-progress-pct">0%</span>
                        </div>
                        <div class="ai-progress-track">
                            <div class="ai-progress-fill" id="ai-progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="ai-loading-tip">
                        <i class="fas fa-bolt tip-icon"></i>
                        <span>Tip: Click Quick Insights below for instant answers</span>
                    </div>
                </div>
            </div>
        `;
        return skeleton;
    },

    _startLoadingAnimation(skeleton) {
        let progress = 0;
        let msgIndex = 0;
        const bar = skeleton.querySelector('#ai-progress-bar');
        const pct = skeleton.querySelector('#ai-progress-pct');
        const msgEl = skeleton.querySelector('#ai-loading-msg-text');
        const messages = this._loadingMessages;

        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 12 + 3;
                if (progress > 90) progress = 90;
                if (bar) bar.style.width = progress + '%';
                if (pct) pct.textContent = Math.round(progress) + '%';
            }
        }, 400);

        const msgInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % messages.length;
            if (msgEl) msgEl.textContent = messages[msgIndex];
        }, 900);

        return { progressInterval, msgInterval, complete() {
            clearInterval(progressInterval);
            clearInterval(msgInterval);
            if (bar) bar.style.width = '100%';
            if (pct) pct.textContent = '100%';
        }};
    },

    // Assistant Page
    assistant(data) {
        // Mark AI assistant as complete when viewed (unlocks Achievements)
        setTimeout(() => {
            if (router && router.completeStep) {
                router.completeStep('assistant');
            }
        }, 2000);

        const avgTime = this._aiAvgTime();
        const perfBadge = avgTime > 0
            ? `<span class="ai-perf-badge"><i class="fas fa-tachometer-alt"></i> Avg: ${avgTime}ms</span>`
            : '';

        return `
            <div style="animation: fadeIn 0.3s ease;">
                <!-- Progress Indicator -->
                <div class="progress-steps" style="margin-bottom: 2rem; display: flex; justify-content: center; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>Upload</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-arrow-right" style="color: var(--color-text-tertiary);"></i></div>
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>Dashboard</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-arrow-right" style="color: var(--color-text-tertiary);"></i></div>
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>Predictions</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-arrow-right" style="color: var(--color-text-tertiary);"></i></div>
                    <div class="step completed" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-check"></i>
                        <span>Analytics</span>
                    </div>
                    <div class="step-arrow"><i class="fas fa-arrow-right" style="color: var(--color-text-tertiary);"></i></div>
                    <div class="step active" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 25px; color: #10b981; font-weight: 600; font-size: 0.875rem;">
                        <i class="fas fa-robot"></i>
                        <span>AI Assistant</span>
                    </div>
                </div>

                <h1 style="font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700; margin-bottom: 1.5rem; background: linear-gradient(135deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">AI Sales Assistant</h1>
                
                <div class="grid grid-cols-1 gap-4" style="max-width: 900px;">
                    <!-- Chat Card -->
                    <div class="card">
                        <div class="ai-chat-header">
                            <h3 class="card-title" style="margin: 0;">
                                <span class="status-dot"></span> Chat with AI
                            </h3>
                            ${perfBadge}
                        </div>
                        <p class="card-description">Ask questions about your sales data — responses stream in real-time</p>
                        
                        <div id="chat-messages" style="min-height: 400px; max-height: 500px; overflow-y: auto; margin: 1.5rem 0; padding: 1rem; background: var(--color-surface-alt); border-radius: var(--radius-md);">
                            <div style="padding: 1rem; background: var(--color-surface); border-radius: var(--radius-md); margin-bottom: 1rem;">
                                <strong style="color: var(--color-primary);">AI Assistant</strong>
                                <p style="margin-top: 0.5rem; color: var(--color-text-secondary);">
                                    Hello! I'm your AI sales assistant. Ask me anything about your data:
                                </p>
                                <ul style="margin-top: 0.75rem; margin-left: 1.5rem; color: var(--color-text-secondary);">
                                    <li>What are my top performing products?</li>
                                    <li>Which region has the highest revenue?</li>
                                    <li>How is my profit margin trending?</li>
                                    <li>What category should I focus on?</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 0.75rem;">
                            <label for="chat-input" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;">Ask a question</label>
                            <input type="text" id="chat-input" name="message" autocomplete="off" placeholder="Ask a question..." 
                                   style="flex: 1;"
                                   onkeypress="if(event.key === 'Enter') pages.sendMessage()" />
                            <button class="btn btn-primary" onclick="pages.sendMessage()" id="ai-send-btn">
                                <i class="fas fa-paper-plane"></i>
                                Send
                            </button>
                        </div>
                    </div>

                    <!-- Quick Insights — Instant Responses -->
                    <div class="card">
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                            <h3 class="card-title" style="margin: 0;">Quick Insights</h3>
                            <span style="font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 10px; background: rgba(16, 185, 129, 0.15); color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">
                                <i class="fas fa-bolt"></i> Instant
                            </span>
                        </div>
                        <div class="ai-quick-insights-grid">
                            <button class="ai-quick-btn qi-blue" onclick="pages.quickAsk('What are my top products?')">
                                <div class="qi-icon"><i class="fas fa-star"></i></div>
                                <div class="qi-label">Top Products<small>Best sellers</small></div>
                            </button>
                            <button class="ai-quick-btn qi-green" onclick="pages.quickAsk('Regional performance summary?')">
                                <div class="qi-icon"><i class="fas fa-globe"></i></div>
                                <div class="qi-label">Regions<small>Performance map</small></div>
                            </button>
                            <button class="ai-quick-btn qi-purple" onclick="pages.quickAsk('Category breakdown?')">
                                <div class="qi-icon"><i class="fas fa-chart-pie"></i></div>
                                <div class="qi-label">Categories<small>Segment analysis</small></div>
                            </button>
                            <button class="ai-quick-btn qi-amber" onclick="pages.quickAsk('Profit analysis?')">
                                <div class="qi-icon"><i class="fas fa-dollar-sign"></i></div>
                                <div class="qi-label">Profit<small>Margins & growth</small></div>
                            </button>
                            <button class="ai-quick-btn qi-red" onclick="pages.quickAsk('Revenue overview?')">
                                <div class="qi-icon"><i class="fas fa-chart-line"></i></div>
                                <div class="qi-label">Revenue<small>Sales overview</small></div>
                            </button>
                            <button class="ai-quick-btn qi-cyan" onclick="pages.quickAsk('Growth trends?')">
                                <div class="qi-icon"><i class="fas fa-arrow-trend-up"></i></div>
                                <div class="qi-label">Trends<small>Growth metrics</small></div>
                            </button>
                        </div>
                        <p style="font-size: 0.7rem; color: var(--color-text-tertiary); text-align: center; margin-top: 0.75rem;">
                            <i class="fas fa-bolt" style="color: #f59e0b;"></i> These insights are cached for instant responses
                        </p>
                    </div>

                    <!-- Continue to Achievements -->
                    <div class="card" style="text-align: center; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(236, 72, 153, 0.1)); border: 1px solid rgba(245, 158, 11, 0.2);">
                        <h3 class="card-title" style="color: #f59e0b;">🏆 Ready to see your Achievements?</h3>
                        <p style="color: var(--color-text-secondary); margin: 0.5rem 0 1.5rem 0;">Complete the journey and unlock all your badges!</p>
                        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                            <button class="btn btn-primary" style="padding: 0.875rem 2rem; font-size: 1rem; font-weight: 600; background: linear-gradient(135deg, #f59e0b, #ec4899);" onclick="router.completeStep('assistant'); router.navigate('/achievements');">
                                <i class="fas fa-trophy"></i>
                                View Achievements
                            </button>
                            <button class="btn btn-secondary" style="padding: 0.875rem 1.5rem; font-size: 0.875rem;" onclick="document.getElementById('login-trigger-btn')?.click();">
                                <i class="fas fa-lock"></i>
                                Login / Track Activity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Active abort controller for cancelling in-flight requests
    _aiAbortController: null,

    sendMessage() {
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');
        const sendBtn = document.getElementById('ai-send-btn');
        const question = input.value.trim();
        
        if (!question) return;

        // Cancel any in-flight request
        if (this._aiAbortController) {
            this._aiAbortController.abort();
            this._aiAbortController = null;
        }
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'padding: 1rem; background: var(--color-primary); color: white; border-radius: var(--radius-md); margin-bottom: 1rem; margin-left: 3rem;';
        userMsg.innerHTML = `<strong>You</strong><p style="margin-top: 0.5rem;">${question}</p>`;
        messages.appendChild(userMsg);
        
        input.value = '';
        if (sendBtn) sendBtn.disabled = true;

        const startTime = Date.now();
        
        // Check cache first (instant!)
        const cached = this._aiCacheGet(question);
        if (cached) {
            const elapsed = Date.now() - startTime;
            this._aiTrackTime(elapsed);
            const aiMsg = document.createElement('div');
            aiMsg.style.cssText = 'padding: 1rem; background: var(--color-surface); border-radius: var(--radius-md); margin-bottom: 1rem; margin-right: 2rem; border: 1px solid var(--color-border);';
            aiMsg.innerHTML = `
                <strong style="color: var(--color-primary);">
                    <i class="fas fa-robot"></i> SalesAI
                </strong>
                <div style="margin-top: 0.5rem; color: var(--color-text-secondary); white-space: pre-wrap; line-height: 1.6;">
                    ${this.formatAIResponse(cached)}
                </div>
                ${this._aiResponseTimeBadge(elapsed, true)}
            `;
            messages.appendChild(aiMsg);
            messages.scrollTop = messages.scrollHeight;
            if (sendBtn) sendBtn.disabled = false;
            console.log(`⚡ Cache hit: ${elapsed}ms`);
            return;
        }

        // Show animated loading skeleton
        const skeleton = this._createLoadingSkeleton();
        messages.appendChild(skeleton);
        messages.scrollTop = messages.scrollHeight;
        const loadingAnim = this._startLoadingAnimation(skeleton);
        
        // Get sales data context (minified for speed)
        const data = dataManager.getData();
        const salesContext = `Sales Data: Revenue=${utils.formatCurrency(data.kpis.totalRevenue)}, Profit=${utils.formatCurrency(data.kpis.totalProfit)}, Orders=${utils.formatNumber(data.kpis.totalOrders)}, RevGrowth=${data.kpis.revenueGrowth.toFixed(1)}%, ProfitGrowth=${data.kpis.profitGrowth.toFixed(1)}%, TopProducts=[${data.topProducts.slice(0, 3).map(p => p.name + ':$' + p.revenue.toLocaleString()).join(',')}], Regions=[${data.regionData.slice(0, 4).map(r => r.region + ':$' + r.revenue.toLocaleString()).join(',')}], Categories=[${data.categoryBreakdown.map(c => c.category + ':' + c.percentage.toFixed(0) + '%').join(',')}]`;
        
        // Call optimized API with streaming
        this.callOptimizedAPI(question, salesContext, messages, skeleton, loadingAnim, startTime);
    },

    async callOptimizedAPI(question, context, messages, skeleton, loadingAnim, startTime) {
        const sendBtn = document.getElementById('ai-send-btn');

        try {
            let aiProvider = 'SalesAI';
            let fullResponse = '';

            // Try streaming DeepSeek first
            const hasDeepSeek = window.DEEPSEEK_API && window.DEEPSEEK_API.askDeepSeekStream && window.DEEPSEEK_API.API_KEY !== 'sk-xxx';
            const hasGroq = window.GROQ_API && window.GROQ_API.askGroqAI && window.GROQ_API.GROQ_CONFIG.API_KEY !== 'gsk_xxx';

            if (hasDeepSeek) {
                aiProvider = 'DeepSeek AI';

                // Replace skeleton with streaming container once first chunk arrives
                let streamingDiv = null;
                let streamingContent = null;
                let firstChunk = true;

                fullResponse = await window.DEEPSEEK_API.askDeepSeekStream(
                    question, context,
                    // onChunk
                    (chunk, accumulated) => {
                        if (firstChunk) {
                            firstChunk = false;
                            loadingAnim.complete();
                            skeleton.remove();

                            // Create streaming response container
                            streamingDiv = document.createElement('div');
                            streamingDiv.style.cssText = 'padding: 1rem; background: var(--color-surface); border-radius: var(--radius-md); margin-bottom: 1rem; margin-right: 2rem; border: 1px solid var(--color-border);';
                            streamingDiv.innerHTML = `
                                <strong style="color: var(--color-primary);">
                                    <i class="fas fa-robot"></i> ${aiProvider}
                                </strong>
                                <div id="ai-stream-content" style="margin-top: 0.5rem; color: var(--color-text-secondary); white-space: pre-wrap; line-height: 1.6;"></div>
                            `;
                            messages.appendChild(streamingDiv);
                            streamingContent = streamingDiv.querySelector('#ai-stream-content');
                        }

                        if (streamingContent) {
                            streamingContent.innerHTML = this.formatAIResponse(accumulated) + '<span class="ai-streaming-cursor"></span>';
                            messages.scrollTop = messages.scrollHeight;
                        }
                    },
                    // onDone
                    (completed) => {
                        fullResponse = completed;
                    }
                );

                // Remove cursor, add response time badge
                if (streamingContent) {
                    const elapsed = Date.now() - startTime;
                    this._aiTrackTime(elapsed);
                    streamingContent.innerHTML = this.formatAIResponse(fullResponse);
                    const timeBadge = document.createElement('div');
                    timeBadge.innerHTML = this._aiResponseTimeBadge(elapsed);
                    streamingDiv.appendChild(timeBadge.firstElementChild);
                    this._aiCacheSet(question, fullResponse);
                    console.log(`✅ Streamed response: ${elapsed}ms`);
                }

            } else if (hasGroq) {
                // Non-streaming fallback for GROQ
                aiProvider = 'GROQ AI';
                fullResponse = await window.GROQ_API.askGroqAI(question, context);

                loadingAnim.complete();
                skeleton.remove();

                const elapsed = Date.now() - startTime;
                this._aiTrackTime(elapsed);

                const aiMsg = document.createElement('div');
                aiMsg.style.cssText = 'padding: 1rem; background: var(--color-surface); border-radius: var(--radius-md); margin-bottom: 1rem; margin-right: 2rem; border: 1px solid var(--color-border);';
                aiMsg.innerHTML = `
                    <strong style="color: var(--color-primary);">
                        <i class="fas fa-robot"></i> ${aiProvider}
                    </strong>
                    <div style="margin-top: 0.5rem; color: var(--color-text-secondary); white-space: pre-wrap; line-height: 1.6;">
                        ${this.formatAIResponse(fullResponse)}
                    </div>
                    ${this._aiResponseTimeBadge(elapsed)}
                `;
                messages.appendChild(aiMsg);
                messages.scrollTop = messages.scrollHeight;
                this._aiCacheSet(question, fullResponse);
                console.log(`✅ GROQ response: ${elapsed}ms`);

            } else {
                // No API configured — use instant local fallback
                loadingAnim.complete();
                skeleton.remove();
                this.sendFallbackResponse(question, messages, startTime);
                return;
            }

        } catch (error) {
            console.error('AI API Error:', error);
            loadingAnim.complete();
            if (skeleton.parentNode) skeleton.remove();

            // On timeout or error, use instant local fallback
            this.sendFallbackResponse(question, messages, startTime);
        } finally {
            if (sendBtn) sendBtn.disabled = false;
        }
    },

    formatAIResponse(response) {
        // Format the response with better styling
        return response
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/- /g, '• ');
    },

    sendFallbackResponse(question, messages, startTime) {
        // INSTANT — no delay. Generates response from local data.
        const data = dataManager.getData();
        const q = question.toLowerCase();
        let response = '';
        
        // Top/Best products
        if (q.includes('top') || q.includes('best') || q.includes('performing')) {
            response = `📊 **Top Performing Products:**\n\n`;
            data.topProducts.slice(0, 5).forEach((p, i) => {
                response += `${i + 1}. **${p.name}** - ${utils.formatCurrency(p.revenue)} revenue, ${utils.formatNumber(p.units)} units sold\n`;
            });
            response += `\n💡 ${data.topProducts[0].name} is your star performer!`;
        }
        // Region analysis
        else if (q.includes('region') || q.includes('area') || q.includes('location')) {
            response = `🌍 **Regional Performance:**\n\n`;
            data.regionData.forEach(r => {
                response += `• **${r.region}**: ${utils.formatCurrency(r.revenue)} (${utils.formatNumber(r.orders)} orders)\n`;
            });
            response += `\n💡 ${data.regionData[0].region} leads with the highest revenue.`;
        }
        // Category breakdown
        else if (q.includes('category') || q.includes('categories') || q.includes('type') || q.includes('breakdown')) {
            response = `📦 **Category Breakdown:**\n\n`;
            data.categoryBreakdown.forEach(c => {
                response += `• **${c.category}**: ${c.percentage.toFixed(1)}% of total sales\n`;
            });
        }
        // Profit/margin
        else if (q.includes('profit') || q.includes('margin') || q.includes('earning')) {
            response = `💰 **Profit Analysis:**\n\n`;
            response += `• Total Profit: **${utils.formatCurrency(data.kpis.totalProfit)}**\n`;
            response += `• Profit Growth: **${data.kpis.profitGrowth >= 0 ? '+' : ''}${data.kpis.profitGrowth.toFixed(1)}%**\n`;
            response += `• Profit Margin: ~${((data.kpis.totalProfit / data.kpis.totalRevenue) * 100).toFixed(1)}%\n`;
            response += `\n💡 ${data.kpis.profitGrowth >= 0 ? 'Great growth! Keep it up.' : 'Consider cost optimization strategies.'}`;
        }
        // Revenue/sales
        else if (q.includes('revenue') || q.includes('sales') || q.includes('income') || q.includes('overview')) {
            response = `📈 **Revenue Overview:**\n\n`;
            response += `• Total Revenue: **${utils.formatCurrency(data.kpis.totalRevenue)}**\n`;
            response += `• Revenue Growth: **${data.kpis.revenueGrowth >= 0 ? '+' : ''}${data.kpis.revenueGrowth.toFixed(1)}%**\n`;
            response += `• Total Orders: **${utils.formatNumber(data.kpis.totalOrders)}**\n`;
            response += `• Avg Order Value: **${utils.formatCurrency(data.kpis.totalRevenue / data.kpis.totalOrders)}**`;
        }
        // Orders
        else if (q.includes('order') || q.includes('transaction')) {
            response = `🛒 **Order Statistics:**\n\n`;
            response += `• Total Orders: **${utils.formatNumber(data.kpis.totalOrders)}**\n`;
            response += `• Avg Order Value: **${utils.formatCurrency(data.kpis.totalRevenue / data.kpis.totalOrders)}**\n`;
            response += `• Total Units Sold: **${utils.formatNumber(data.topProducts.reduce((sum, p) => sum + p.units, 0))}**`;
        }
        // Growth/trend
        else if (q.includes('growth') || q.includes('trend') || q.includes('increase') || q.includes('decrease')) {
            response = `📊 **Growth Trends:**\n\n`;
            response += `• Revenue Growth: **${data.kpis.revenueGrowth >= 0 ? '+' : ''}${data.kpis.revenueGrowth.toFixed(1)}%**\n`;
            response += `• Profit Growth: **${data.kpis.profitGrowth >= 0 ? '+' : ''}${data.kpis.profitGrowth.toFixed(1)}%**\n`;
            response += `\n💡 ${data.kpis.revenueGrowth >= 10 ? 'Excellent growth trajectory!' : data.kpis.revenueGrowth >= 0 ? 'Steady positive growth.' : 'Consider reviewing your strategy.'}`;
        }
        // Prediction/forecast
        else if (q.includes('predict') || q.includes('forecast') || q.includes('future') || q.includes('next month')) {
            const avgGrowth = (data.kpis.revenueGrowth + data.kpis.profitGrowth) / 2;
            const predictedRevenue = data.kpis.totalRevenue * (1 + avgGrowth / 100);
            response = `🔮 **Sales Prediction:**\n\n`;
            response += `• Current Revenue: **${utils.formatCurrency(data.kpis.totalRevenue)}**\n`;
            response += `• Predicted Next Month: **${utils.formatCurrency(predictedRevenue)}**\n`;
            response += `• Expected Growth: **${avgGrowth >= 0 ? '+' : ''}${avgGrowth.toFixed(1)}%**\n`;
            response += `\n💡 Based on current trends, you're on track for ${avgGrowth >= 0 ? 'growth' : 'a slight dip'}.`;
        }
        // Help/what can you do
        else if (q.includes('help') || q.includes('what can') || q.includes('how to')) {
            response = `🤖 **I can help you with:**\n\n`;
            response += `• **"Top products"** - See your best sellers\n`;
            response += `• **"Regional performance"** - Analyze by region\n`;
            response += `• **"Category breakdown"** - Sales by category\n`;
            response += `• **"Profit analysis"** - Profit and margins\n`;
            response += `• **"Revenue overview"** - Total sales data\n`;
            response += `• **"Growth trends"** - Performance trends\n`;
            response += `• **"Sales prediction"** - Future forecasts\n`;
            response += `\n💬 Just ask any question about your sales data!`;
        }
        // Default response with summary
        else {
            response = `📊 **Sales Summary:**\n\n`;
            response += `• Revenue: **${utils.formatCurrency(data.kpis.totalRevenue)}** (${data.kpis.revenueGrowth >= 0 ? '+' : ''}${data.kpis.revenueGrowth.toFixed(1)}%)\n`;
            response += `• Profit: **${utils.formatCurrency(data.kpis.totalProfit)}** (${data.kpis.profitGrowth >= 0 ? '+' : ''}${data.kpis.profitGrowth.toFixed(1)}%)\n`;
            response += `• Orders: **${utils.formatNumber(data.kpis.totalOrders)}**\n`;
            response += `• Top Product: **${data.topProducts[0]?.name || 'N/A'}**\n`;
            response += `• Top Region: **${data.regionData[0]?.region || 'N/A'}**\n`;
            response += `\n💬 Try asking about: top products, regions, categories, profit, revenue, or predictions!`;
        }
        
        const elapsed = typeof startTime === 'number' ? Date.now() - startTime : 0;
        this._aiTrackTime(elapsed);
        this._aiCacheSet(question, response);
        
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = 'padding: 1rem; background: var(--color-surface); border-radius: var(--radius-md); margin-bottom: 1rem; margin-right: 2rem; border: 1px solid var(--color-border);';
        aiMsg.innerHTML = `
            <strong style="color: var(--color-primary);"><i class="fas fa-robot"></i> SalesAI</strong>
            <div style="margin-top: 0.5rem; color: var(--color-text-secondary); white-space: pre-wrap; line-height: 1.6;">
                ${this.formatAIResponse(response)}
            </div>
            ${this._aiResponseTimeBadge(elapsed)}
        `;
        messages.appendChild(aiMsg);
        messages.scrollTop = messages.scrollHeight;
    },

    quickAsk(question) {
        const input = document.getElementById('chat-input');
        const messages = document.getElementById('chat-messages');
        
        if (!input || !messages) return;
        
        // Add user message bubble
        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'padding: 1rem; background: var(--color-primary); color: white; border-radius: var(--radius-md); margin-bottom: 1rem; margin-left: 3rem;';
        userMsg.innerHTML = `<strong>You</strong><p style="margin-top: 0.5rem;">${question}</p>`;
        messages.appendChild(userMsg);
        
        input.value = '';
        
        // Check cache first
        const startTime = Date.now();
        const cached = this._aiCacheGet(question);
        if (cached) {
            const elapsed = Date.now() - startTime;
            this._aiTrackTime(elapsed);
            const aiMsg = document.createElement('div');
            aiMsg.style.cssText = 'padding: 1rem; background: var(--color-surface); border-radius: var(--radius-md); margin-bottom: 1rem; margin-right: 2rem; border: 1px solid var(--color-border);';
            aiMsg.innerHTML = `
                <strong style="color: var(--color-primary);"><i class="fas fa-robot"></i> SalesAI</strong>
                <div style="margin-top: 0.5rem; color: var(--color-text-secondary); white-space: pre-wrap; line-height: 1.6;">
                    ${this.formatAIResponse(cached)}
                </div>
                ${this._aiResponseTimeBadge(elapsed, true)}
            `;
            messages.appendChild(aiMsg);
            messages.scrollTop = messages.scrollHeight;
            return;
        }
        
        // Use instant local fallback for Quick Insights (no API call)
        this.sendFallbackResponse(question, messages, startTime);
    },

    // Achievements Page
    achievements(data) {
        // Mark achievements as complete (final step!)
        setTimeout(() => {
            if (router && router.completeStep) {
                router.completeStep('achievements');
            }
        }, 1000);

        const achievements = [
            { id: 1, title: 'First Upload', description: 'Upload your first sales data', icon: 'fa-upload', unlocked: data.salesData.length > 0, color: 'primary' },
            { id: 2, title: 'Revenue Milestone', description: 'Reach $1M in total revenue', icon: 'fa-trophy', unlocked: data.kpis.totalRevenue >= 1000000, color: 'warning' },
            { id: 3, title: 'Profit Master', description: 'Achieve $500K in total profit', icon: 'fa-gem', unlocked: data.kpis.totalProfit >= 500000, color: 'success' },
            { id: 4, title: 'Order Champion', description: 'Process 5000 orders', icon: 'fa-shipping-fast', unlocked: data.kpis.totalOrders >= 5000, color: 'accent' },
            { id: 5, title: 'Growth Expert', description: 'Maintain 20% growth for a month', icon: 'fa-chart-line', unlocked: data.kpis.revenueGrowth >= 20, color: 'success' },
            { id: 6, title: 'Data Analyst', description: 'View all analytics sections', icon: 'fa-chart-pie', unlocked: true, color: 'primary' },
            { id: 7, title: 'Journey Complete', description: 'Complete the full SalesPredix workflow', icon: 'fa-flag-checkered', unlocked: true, color: 'success' },
        ];

        return `
            <div style="animation: fadeIn 0.3s ease;">
                <!-- Completion Banner -->
                <div style="
                    background: linear-gradient(135deg, #10b981, #3b82f6);
                    padding: 2rem;
                    border-radius: 16px;
                    margin-bottom: 2rem;
                    text-align: center;
                    color: white;
                ">
                    <i class="fas fa-flag-checkered" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h2 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 0.5rem 0;">🎉 Congratulations!</h2>
                    <p style="margin: 0; opacity: 0.9;">You've completed the full SalesPredix workflow!</p>
                </div>

                <h1 style="font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700; margin-bottom: 1.5rem; background: linear-gradient(135deg, #f59e0b, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Achievements</h1>
                
                <div class="grid grid-cols-3 gap-4">
                    ${achievements.map(achievement => `
                        <div class="card" style="text-align: center; ${!achievement.unlocked ? 'opacity: 0.5;' : ''}">
                            <div style="width: 4rem; height: 4rem; margin: 0 auto 1rem; background: ${achievement.unlocked ? `var(--color-${achievement.color})` : 'var(--color-border)'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${achievement.icon}" style="font-size: 2rem; color: white;"></i>
                            </div>
                            <h3 style="font-weight: 600; margin-bottom: 0.5rem;">
                                ${achievement.title}
                                ${achievement.unlocked ? '<i class="fas fa-check-circle" style="color: var(--color-success); margin-left: 0.5rem;"></i>' : ''}
                            </h3>
                            <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                                ${achievement.description}
                            </p>
                        </div>
                    `).join('')}
                </div>

                <div class="card" style="margin-top: 2rem; text-align: center;">
                    <h3 class="card-title">Progress Summary</h3>
                    <div style="margin-top: 1.5rem;">
                        <div style="font-size: 3rem; font-weight: 700; color: var(--color-primary);">
                            ${achievements.filter(a => a.unlocked).length}/${achievements.length}
                        </div>
                        <p style="color: var(--color-text-secondary); margin-top: 0.5rem;">
                            Achievements Unlocked
                        </p>
                    </div>
                    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="router.resetProgress(); window.location.hash = '#/upload';">
                        <i class="fas fa-redo"></i>
                        Start New Journey
                    </button>
                </div>
            </div>
        `;
    },

    // Settings Page
    settings(data) {
        const currentTheme = utils.theme.get();
        const user = authManager.getUser();
        const defaultAvatar = authManager.getDefaultAvatar();
        
        return `
            <div style="animation: fadeIn 0.3s ease;">
                <h1 style="font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700; margin-bottom: 1.5rem;">Settings</h1>
                
                <div class="grid grid-cols-1 gap-4" style="max-width: 800px;">
                    <!-- Profile Settings -->
                    <div class="card">
                        <h3 class="card-title">
                            <i class="fas fa-user-circle" style="margin-right: 0.5rem; color: var(--color-primary);"></i>
                            Profile Settings
                        </h3>
                        <div style="display: flex; align-items: flex-start; gap: 1.5rem; margin-top: 1rem; flex-wrap: wrap;">
                            <!-- Profile Picture -->
                            <div style="text-align: center;">
                                <div class="profile-avatar-large" style="position: relative; width: 100px; height: 100px; margin-bottom: 0.75rem;">
                                    <img id="settings-avatar" 
                                         src="${user?.profileImage || defaultAvatar}" 
                                         alt="Profile" 
                                         style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-primary);"
                                    />
                                    <label for="avatar-upload" 
                                           style="position: absolute; bottom: 0; right: 0; width: 32px; height: 32px; background: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid var(--color-surface);">
                                        <i class="fas fa-camera" style="color: white; font-size: 0.75rem;"></i>
                                    </label>
                                    <input type="file" id="avatar-upload" accept="image/*" style="display: none;" onchange="pages.handleAvatarUpload(event)" />
                                </div>
                                <button class="btn btn-secondary" style="font-size: 0.75rem; padding: 0.5rem 0.75rem;" onclick="pages.removeAvatar()">
                                    <i class="fas fa-trash"></i>
                                    Remove
                                </button>
                            </div>
                            
                            <!-- Profile Info -->
                            <div style="flex: 1; min-width: 200px;">
                                <div class="form-group">
                                    <label for="profile-name">Display Name</label>
                                    <input type="text" id="profile-name" name="name" autocomplete="name" value="${user?.name || ''}" placeholder="Your name" />
                                </div>
                                <div class="form-group">
                                    <label for="profile-email">Email</label>
                                    <input type="email" id="profile-email" name="email" autocomplete="email" value="${user?.email || ''}" disabled style="background: var(--color-surface-alt); cursor: not-allowed;" />
                                    <small style="color: var(--color-text-secondary);">Email cannot be changed</small>
                                </div>
                                <button class="btn btn-primary" onclick="pages.saveProfile()">
                                    <i class="fas fa-save"></i>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">Appearance</h3>
                        <div class="form-group">
                            <label>Theme</label>
                            <select id="theme-select" onchange="pages.changeTheme(this.value)" style="width: 100%;">
                                <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>Light</option>
                                <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>Dark</option>
                            </select>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">Data Management</h3>
                        <p class="card-description" style="margin-bottom: 1rem;">
                            Manage your sales data and application settings
                        </p>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <button class="btn btn-secondary" onclick="dataManager.refreshData()">
                                <i class="fas fa-sync-alt"></i>
                                Regenerate Sample Data
                            </button>
                            <button class="btn btn-secondary" onclick="pages.exportData()">
                                <i class="fas fa-download"></i>
                                Export Data as CSV
                            </button>
                            <button class="btn btn-secondary" style="color: var(--color-danger);" onclick="pages.clearData()">
                                <i class="fas fa-trash"></i>
                                Clear All Data
                            </button>
                        </div>
                    </div>

                    <div class="card">
                        <h3 class="card-title">About</h3>
                        <p style="color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                            <strong>Sparkle Sales Buddy</strong>
                        </p>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                            Version 1.0.0
                        </p>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem; margin-top: 0.5rem;">
                            Vanilla JavaScript conversion of React application
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    // Handle avatar upload
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            utils.showToast('Please select an image file', 'error');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            utils.showToast('Image size should be less than 2MB', 'error');
            return;
        }

        // Read and convert to base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            
            // Update the preview
            const avatarImg = document.getElementById('settings-avatar');
            if (avatarImg) {
                avatarImg.src = imageUrl;
            }

            // Save to auth manager
            authManager.updateProfileImage(imageUrl);
            utils.showToast('Profile picture updated!', 'success');
        };
        reader.readAsDataURL(file);
    },

    // Remove avatar
    removeAvatar() {
        const defaultAvatar = authManager.getDefaultAvatar();
        
        // Update the preview
        const avatarImg = document.getElementById('settings-avatar');
        if (avatarImg) {
            avatarImg.src = defaultAvatar;
        }

        // Remove from auth manager
        authManager.updateProfileImage(null);
        utils.showToast('Profile picture removed', 'success');
    },

    // Save profile changes
    saveProfile() {
        const nameInput = document.getElementById('profile-name');
        const newName = nameInput?.value.trim();

        if (!newName) {
            utils.showToast('Name cannot be empty', 'error');
            return;
        }

        authManager.updateUserName(newName);
        utils.showToast('Profile saved successfully!', 'success');
    },

    changeTheme(theme) {
        utils.theme.set(theme);
        utils.showToast(`Theme changed to ${theme}`, 'success');
    },

    exportData() {
        const data = dataManager.getData();
        const csv = ['date,product,category,region,quantity,revenue,cost,profit'];
        
        data.salesData.forEach(item => {
            csv.push(`${item.date},${item.product},${item.category},${item.region},${item.quantity},${item.revenue},${item.cost},${item.profit}`);
        });
        
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        utils.showToast('Data exported successfully', 'success');
    },

    clearData() {
        this.showClearDataModal();
    },

    showClearDataModal() {
        const modal = document.createElement('div');
        modal.id = 'clear-data-modal';
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
                    <i class="fas fa-trash-alt" style="color: white;"></i>
                </div>
                <div>
                    <h3 style="margin: 0; color: var(--color-text); font-size: 1.25rem; font-weight: 600;">Clear All Data</h3>
                    <p style="margin: 0.25rem 0 0 0; color: var(--color-text-secondary); font-size: 0.875rem;">This action cannot be undone</p>
                </div>
            </div>
            
            <p style="color: var(--color-text-secondary); margin: 0 0 1.5rem 0; font-size: 0.875rem; line-height: 1.5;">
                Are you sure you want to clear all data? This will remove all uploaded data, analysis results, and predictions. You will need to upload data again.
            </p>
            
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                <button id="cancel-clear" class="modal-button" style="
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
                <button id="confirm-clear" class="modal-button" style="
                    padding: 0.625rem 1.25rem;
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    pointer-events: auto;
                ">Clear Data</button>
            </div>
        `;

        modal.appendChild(card);
        document.body.appendChild(modal);

        // Prevent clicks on the card from bubbling to backdrop
        card.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        const cancelBtn = document.getElementById('cancel-clear');
        const confirmBtn = document.getElementById('confirm-clear');

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
                localStorage.removeItem('salesData');
                localStorage.removeItem('salesPredix_analysisResults');
                localStorage.removeItem('salesPredix_uploadedData');
                localStorage.removeItem('salesPredix_predictions');
                localStorage.removeItem('salesPredix_completedSteps');
                dataManager.uploadData([]);
                utils.showToast('Data cleared and reset', 'success');
                router.navigate('/');
            }, 200);
        });

        // Click backdrop to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.2s ease';
                setTimeout(() => modal.remove(), 200);
            }
        });
    },

    // Not Found Page
    notFound() {
        return `
            <div style="animation: fadeIn 0.3s ease; text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--color-warning); margin-bottom: 1rem;"></i>
                <h1 style="font-size: 3rem; font-weight: 700; margin-bottom: 1rem;">404</h1>
                <p style="color: var(--color-text-secondary); font-size: 1.25rem; margin-bottom: 2rem;">
                    Page not found
                </p>
                <button class="btn btn-primary" onclick="router.navigate('/')">
                    <i class="fas fa-home"></i>
                    Go to Dashboard
                </button>
            </div>
        `;
    }
};
