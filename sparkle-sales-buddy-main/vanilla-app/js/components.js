// Reusable Components
// Common UI components that can be used across pages

const components = {
    // Create KPI Card
    createKPICard(title, value, change, icon, iconColor, prefix = '') {
        const isPositive = change >= 0;
        const changeIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
        const changeClass = isPositive ? 'positive' : 'negative';
        
        return `
            <div class="card kpi-card" style="animation: fadeIn 0.3s ease;">
                <div class="kpi-header">
                    <div class="kpi-content">
                        <div class="kpi-label">${title}</div>
                        <div class="kpi-value">${prefix}${utils.formatNumber(value)}</div>
                    </div>
                    <div class="kpi-icon ${iconColor}">
                        <i class="fas ${icon}"></i>
                    </div>
                </div>
                <div class="kpi-change ${changeClass}">
                    <i class="fas ${changeIcon}"></i>
                    <span>${utils.formatPercent(change)}</span>
                </div>
            </div>
        `;
    },

    // Create chart card
    createChartCard(title, description, chartId, height = '300px') {
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${title}</h3>
                        ${description ? `<p class="card-description">${description}</p>` : ''}
                    </div>
                </div>
                <div class="chart-container" style="height: ${height};">
                    <canvas id="${chartId}"></canvas>
                </div>
            </div>
        `;
    },

    // Create top products table
    createTopProductsTable(products) {
        const rows = products.map(product => {
            const isPositive = product.growth >= 0;
            const changeIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
            const changeClass = isPositive ? 'positive' : 'negative';
            
            return `
                <tr>
                    <td><strong>${product.name}</strong></td>
                    <td>${utils.formatCurrency(product.revenue)}</td>
                    <td>${utils.formatNumber(product.quantity)}</td>
                    <td>
                        <span class="kpi-change ${changeClass}">
                            <i class="fas ${changeIcon}"></i>
                            ${utils.formatPercent(product.growth)}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Top Products</h3>
                    <p class="card-description">Best performing items</p>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Revenue</th>
                                <th>Units Sold</th>
                                <th>Growth</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // Create loading spinner
    createLoadingSpinner(message = 'Loading...') {
        return `
            <div class="loading-container">
                <div class="spinner"></div>
                <p style="color: var(--color-text-secondary);">${message}</p>
            </div>
        `;
    },

    // Create quick actions
    createQuickActions() {
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Quick Actions</h3>
                </div>
                <div class="grid grid-cols-2 gap-2" style="margin-top: 1rem;">
                    <button class="btn btn-primary" onclick="router.navigate('/upload')">
                        <i class="fas fa-upload"></i>
                        Upload Data
                    </button>
                    <button class="btn btn-secondary" onclick="dataManager.refreshData()">
                        <i class="fas fa-sync-alt"></i>
                        Refresh Data
                    </button>
                    <button class="btn btn-secondary" onclick="router.navigate('/predictions')">
                        <i class="fas fa-chart-line"></i>
                        View Predictions
                    </button>
                    <button class="btn btn-secondary" onclick="router.navigate('/analytics')">
                        <i class="fas fa-chart-pie"></i>
                        Deep Analytics
                    </button>
                </div>
            </div>
        `;
    },

    // Create insights panel
    createInsightsPanel(data) {
        const topCategory = data.categoryBreakdown[0];
        const topProduct = data.topProducts[0];
        const avgGrowth = ((data.kpis.revenueGrowth + data.kpis.profitGrowth) / 2).toFixed(1);
        
        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">AI Insights</h3>
                    <p class="card-description">Key findings from your data</p>
                </div>
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
                    <div style="padding: 1rem; background: var(--color-surface-alt); border-radius: var(--radius-md);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-lightbulb" style="color: var(--color-warning);"></i>
                            <strong>Top Category</strong>
                        </div>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                            ${topCategory.category} leads with ${topCategory.percentage.toFixed(1)}% of total revenue (${utils.formatCurrency(topCategory.revenue)})
                        </p>
                    </div>
                    <div style="padding: 1rem; background: var(--color-surface-alt); border-radius: var(--radius-md);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-star" style="color: var(--color-success);"></i>
                            <strong>Best Seller</strong>
                        </div>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                            ${topProduct.name} generated ${utils.formatCurrency(topProduct.revenue)} with ${topProduct.quantity} units sold
                        </p>
                    </div>
                    <div style="padding: 1rem; background: var(--color-surface-alt); border-radius: var(--radius-md);">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-chart-line" style="color: var(--color-primary);"></i>
                            <strong>Growth Trend</strong>
                        </div>
                        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">
                            Average growth rate of ${avgGrowth}% indicates ${avgGrowth > 0 ? 'positive momentum' : 'need for attention'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    // Create region data table
    createRegionTable(regions) {
        const rows = regions.map(region => `
            <tr>
                <td><strong>${region.region}</strong></td>
                <td>${utils.formatCurrency(region.revenue)}</td>
                <td>${utils.formatCurrency(region.profit)}</td>
                <td>${utils.formatNumber(region.orders)}</td>
            </tr>
        `).join('');

        return `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Regional Performance</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Region</th>
                                <th>Revenue</th>
                                <th>Profit</th>
                                <th>Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
};
