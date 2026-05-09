// Chart Management
// Handles all chart creation and updates using Chart.js

const chartManager = {
    charts: {},
    isPredictionMode: false,

    // Set prediction mode for chart styling
    setPredictionMode(enabled) {
        this.isPredictionMode = enabled;
    },

    // Get chart colors based on mode
    getChartColors() {
        if (this.isPredictionMode) {
            return {
                revenue: '#8b5cf6',          // Purple for predictions
                revenueLight: 'rgba(139, 92, 246, 0.2)',
                profit: '#06b6d4',           // Cyan for predicted profit
                profitLight: 'rgba(6, 182, 212, 0.2)',
            };
        }
        return {
            revenue: '#22d3ee',              // Cyan for actual
            revenueLight: 'rgba(34, 211, 238, 0.15)',
            profit: '#10b981',               // Green for actual profit
            profitLight: 'rgba(16, 185, 129, 0.15)',
        };
    },

    // Get dark theme chart options
    getDarkThemeOptions() {
        return {
            color: '#9ca3af',
            borderColor: 'rgba(55, 65, 81, 0.5)',
        };
    },

    // Create or update revenue chart
    createRevenueChart(containerId, data) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const colors = this.getChartColors();
        const themeOpts = this.getDarkThemeOptions();
        
        // Destroy existing chart
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        // Create new chart
        this.charts[containerId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.name),
                datasets: [
                    {
                        label: this.isPredictionMode ? 'Predicted Revenue' : 'Revenue',
                        data: data.map(d => d.revenue),
                        borderColor: colors.revenue,
                        backgroundColor: colors.revenueLight,
                        tension: 0.4,
                        fill: true,
                        borderDash: this.isPredictionMode ? [5, 5] : [],
                        pointRadius: 4,
                        pointBackgroundColor: colors.revenue,
                    },
                    {
                        label: this.isPredictionMode ? 'Predicted Profit' : 'Profit',
                        data: data.map(d => d.profit),
                        borderColor: colors.profit,
                        backgroundColor: colors.profitLight,
                        tension: 0.4,
                        fill: true,
                        borderDash: this.isPredictionMode ? [5, 5] : [],
                        pointRadius: 4,
                        pointBackgroundColor: colors.profit,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: themeOpts.color,
                            padding: 20,
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#f9fafb',
                        bodyColor: '#9ca3af',
                        borderColor: '#374151',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + utils.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: themeOpts.borderColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: themeOpts.color,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: themeOpts.borderColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: themeOpts.color,
                            callback: function(value) {
                                return utils.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    },

    // Create or update category chart (doughnut)
    createCategoryChart(containerId, data) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const themeOpts = this.getDarkThemeOptions();
        
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.category),
                datasets: [{
                    data: data.map(d => d.revenue),
                    backgroundColor: data.map(d => d.color),
                    borderWidth: 2,
                    borderColor: '#111827',
                    hoverBorderColor: '#22d3ee',
                    hoverOffset: 8,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: themeOpts.color,
                            padding: 20,
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#f9fafb',
                        bodyColor: '#9ca3af',
                        borderColor: '#374151',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = utils.formatCurrency(context.parsed);
                                const percentage = data[context.dataIndex].percentage.toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    },

    // Create bar chart for regions
    createRegionChart(containerId, data) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const colors = this.getChartColors();
        const themeOpts = this.getDarkThemeOptions();
        
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.region),
                datasets: [
                    {
                        label: this.isPredictionMode ? 'Predicted Revenue' : 'Revenue',
                        data: data.map(d => d.revenue),
                        backgroundColor: this.isPredictionMode 
                            ? 'rgba(139, 92, 246, 0.8)' 
                            : 'rgba(34, 211, 238, 0.8)',
                        borderColor: this.isPredictionMode ? '#8b5cf6' : '#22d3ee',
                        borderWidth: 1,
                        borderRadius: 6,
                    },
                    {
                        label: this.isPredictionMode ? 'Predicted Profit' : 'Profit',
                        data: data.map(d => d.profit),
                        backgroundColor: this.isPredictionMode 
                            ? 'rgba(6, 182, 212, 0.8)' 
                            : 'rgba(16, 185, 129, 0.8)',
                        borderColor: this.isPredictionMode ? '#06b6d4' : '#10b981',
                        borderWidth: 1,
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: themeOpts.color,
                            padding: 20,
                            usePointStyle: true,
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        titleColor: '#f9fafb',
                        bodyColor: '#9ca3af',
                        borderColor: '#374151',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + utils.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: themeOpts.borderColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: themeOpts.color,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: themeOpts.borderColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: themeOpts.color,
                            callback: function(value) {
                                return utils.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    },

    // Stacked bar for revenue vs cost by region
    createStackedBarChart(containerId, labels, revenueData, costData, options = {}) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenueData,
                        backgroundColor: options.revenueColor || '#4A90E2',
                        borderRadius: 6,
                    },
                    {
                        label: 'Cost',
                        data: costData,
                        backgroundColor: options.costColor || '#FF6B6B',
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${utils.formatCurrency(context.parsed.y)}`,
                        },
                    },
                },
                scales: {
                    x: { stacked: true },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: Boolean(options.yLabel),
                            text: options.yLabel || '',
                        },
                        ticks: {
                            callback: (value) => utils.formatCurrency(value),
                        },
                    },
                },
            },
        });
    },

    // Horizontal bar for margin percentages
    createHorizontalBarChart(containerId, labels, values, colors, maxValue = 100) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        this.charts[containerId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Profit Margin %',
                        data: values,
                        backgroundColor: colors,
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${context.parsed.x.toFixed(1)}%`,
                        },
                    },
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: maxValue,
                        ticks: {
                            callback: (value) => `${value}%`,
                        },
                    },
                    y: {
                        ticks: { color: 'var(--color-text)' },
                    },
                },
            },
        });
    },

    // Donut chart for channel distribution
    createDonutChart(containerId, labels, values, colors) {
        const canvas = document.getElementById(containerId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.charts[containerId]) {
            this.charts[containerId].destroy();
        }

        const total = values.reduce((sum, v) => sum + v, 0);

        this.charts[containerId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#ffffff',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const amount = utils.formatCurrency(context.parsed);
                                const pct = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${amount} (${pct}%)`;
                            },
                        },
                    },
                },
            },
        });
    },

    // Destroy all charts
    destroyAll() {
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.charts = {};
    },
};
