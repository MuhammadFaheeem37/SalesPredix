// Data Management System
// Handles all sales data processing, KPI calculations, and data persistence

class DataManager {
    constructor() {
        this.salesData = [];
        this.listeners = [];
        this.isLoading = false;
        this.dataValidated = false;
        this.init();
    }

    init() {
        // Load data from localStorage - NO sample data generation
        // Data-driven approach: only show insights from user's actual uploaded data
        const stored = localStorage.getItem('salesData');
        const analysisResults = localStorage.getItem('salesPredix_analysisResults');
        
        // SECURITY: Verify data belongs to current user before loading
        if (!this.verifyDataOwnershipOnInit()) {
            console.log('[Security] Data cleared - ownership verification failed');
            this.salesData = [];
            this.dataValidated = false;
            return;
        }
        
        if (stored && analysisResults) {
            try {
                const parsed = JSON.parse(stored);
                const analysis = JSON.parse(analysisResults);
                // Only use stored data if it was successfully validated
                if (analysis && analysis.success !== false && parsed.length > 0) {
                    this.salesData = parsed;
                    this.dataValidated = true;
                }
            } catch (e) {
                console.warn('Error loading stored data:', e);
                this.salesData = [];
                this.dataValidated = false;
            }
        }
        // If no valid data, keep salesData empty - no mock data generation
    }
    
    // Verify data ownership on initialization (before authManager may be fully loaded)
    verifyDataOwnershipOnInit() {
        const uploadedData = localStorage.getItem('salesPredix_uploadedData');
        const currentUser = localStorage.getItem('currentUser');
        
        if (!uploadedData) return true; // No data to verify
        if (!currentUser) {
            // No user logged in - clear any existing data
            this.clearDataSilent();
            return false;
        }
        
        try {
            const data = JSON.parse(uploadedData);
            const user = JSON.parse(currentUser);
            
            // If data has userId and it doesn't match current user, clear it
            if (data.userId && data.userId !== user.id) {
                console.warn('[Security] Data belongs to different user - clearing');
                this.clearDataSilent();
                return false;
            }
        } catch (e) {
            console.warn('[Security] Error in ownership check:', e);
        }
        
        return true;
    }
    
    // Clear data without triggering notifications (for init phase)
    clearDataSilent() {
        localStorage.removeItem('salesData');
        localStorage.removeItem('salesPredix_analysisResults');
        localStorage.removeItem('salesPredix_uploadedData');
        localStorage.removeItem('salesPredix_predictions');
        localStorage.removeItem('salesPredix_completedSteps');
    }

    // Check if valid data has been uploaded and validated
    hasValidData() {
        // Check both salesData and analysis results
        const analysisResults = localStorage.getItem('salesPredix_analysisResults');
        if (analysisResults) {
            try {
                const analysis = JSON.parse(analysisResults);
                // Must have successful analysis with required columns
                if (analysis && analysis.success !== false && analysis.metrics) {
                    return this.salesData.length > 0 || (analysis.recordsProcessed && analysis.recordsProcessed > 0);
                }
            } catch (e) {
                console.warn('Error checking analysis results:', e);
            }
        }
        return this.salesData.length > 0 && this.dataValidated;
    }

    // Get data availability status for conditional chart rendering
    getDataAvailability() {
        const analysisResults = localStorage.getItem('salesPredix_analysisResults');
        let availability = {
            hasData: false,
            hasDateColumn: false,
            hasSalesColumn: false,
            hasQuantityColumn: false,
            hasCategoryColumn: false,
            hasProductColumn: false,
            hasRegionColumn: false,
            recordCount: 0
        };
        
        if (analysisResults) {
            try {
                const analysis = JSON.parse(analysisResults);
                if (analysis && analysis.columns) {
                    availability.hasData = analysis.success !== false;
                    availability.hasDateColumn = !!analysis.columns.dateColumn;
                    availability.hasSalesColumn = !!(analysis.columns.salesColumn || analysis.columns.revenueColumn);
                    availability.hasQuantityColumn = !!(analysis.columns.unitsColumn || analysis.columns.quantityColumn);
                    availability.hasCategoryColumn = !!analysis.columns.categoryColumn;
                    availability.hasProductColumn = !!analysis.columns.productColumn;
                    availability.hasRegionColumn = !!analysis.columns.regionColumn;
                    availability.recordCount = analysis.recordsProcessed || analysis.originalRecords || 0;
                }
            } catch (e) {
                console.warn('Error getting data availability:', e);
            }
        }
        
        return availability;
    }

    // Clear all data (reset to empty state)
    // SECURITY: Completely removes all user data for session isolation
    clearData() {
        this.salesData = [];
        this.dataValidated = false;
        
        // Clear all data storage keys
        localStorage.removeItem('salesData');
        localStorage.removeItem('salesPredix_analysisResults');
        localStorage.removeItem('salesPredix_uploadedData');
        localStorage.removeItem('salesPredix_predictions');
        localStorage.removeItem('salesPredix_dashboardState');
        localStorage.removeItem('salesPredix_chartData');
        localStorage.removeItem('salesPredix_completedSteps');
        
        this.notify();
        console.log('[Security] All data cleared from DataManager');
    }
    
    // Check if data belongs to current logged-in user
    // Prevents cross-user data leakage
    verifyDataOwnership() {
        if (!window.authManager || !authManager.currentUser) {
            return false;
        }
        
        const uploadedData = localStorage.getItem('salesPredix_uploadedData');
        if (!uploadedData) return true; // No data to verify
        
        try {
            const parsed = JSON.parse(uploadedData);
            // If userId is stored, verify it matches current user
            if (parsed.userId && parsed.userId !== authManager.currentUser.id) {
                console.warn('[Security] Data ownership mismatch - clearing data');
                this.clearData();
                return false;
            }
        } catch (e) {
            console.warn('[Security] Error verifying data ownership:', e);
        }
        
        return true;
    }

    // Subscribe to data changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    // Notify all listeners of data changes
    notify() {
        this.listeners.forEach(callback => callback(this.getData()));
    }

    // Generate sample sales data
    generateSampleData() {
        const products = [
            { name: 'Premium Laptop Pro', category: 'Electronics', basePrice: 1299 },
            { name: 'Wireless Headphones', category: 'Electronics', basePrice: 249 },
            { name: 'Smart Watch Elite', category: 'Electronics', basePrice: 399 },
            { name: 'Office Chair Deluxe', category: 'Furniture', basePrice: 549 },
            { name: 'Standing Desk Pro', category: 'Furniture', basePrice: 899 },
            { name: 'Ergonomic Keyboard', category: 'Accessories', basePrice: 179 },
            { name: '4K Monitor Ultra', category: 'Electronics', basePrice: 699 },
            { name: 'Desk Organizer Set', category: 'Accessories', basePrice: 79 },
            { name: 'Executive Desk Mat', category: 'Accessories', basePrice: 59 },
            { name: 'Bookshelf Modern', category: 'Furniture', basePrice: 349 },
        ];

        const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
        const data = [];
        
        // Generate 6 months of data
        for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
            const date = new Date();
            date.setMonth(date.getMonth() - monthOffset);
            
            const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            
            for (let day = 1; day <= daysInMonth; day++) {
                const numTransactions = Math.floor(Math.random() * 15) + 5;
                
                for (let t = 0; t < numTransactions; t++) {
                    const product = products[Math.floor(Math.random() * products.length)];
                    const region = regions[Math.floor(Math.random() * regions.length)];
                    const quantity = Math.floor(Math.random() * 5) + 1;
                    const priceVariation = 0.9 + Math.random() * 0.2;
                    const revenue = Math.round(product.basePrice * quantity * priceVariation);
                    const cost = Math.round(revenue * (0.55 + Math.random() * 0.15));
                    
                    data.push({
                        id: `${date.getFullYear()}-${date.getMonth()}-${day}-${t}`,
                        date: new Date(date.getFullYear(), date.getMonth(), day).toISOString().split('T')[0],
                        product: product.name,
                        category: product.category,
                        region,
                        quantity,
                        revenue,
                        cost,
                        profit: revenue - cost,
                    });
                }
            }
        }

        this.salesData = data;
        this.saveData();
    }

    // Save data to localStorage
    saveData() {
        localStorage.setItem('salesData', JSON.stringify(this.salesData));
    }

    // Upload new data
    uploadData(data) {
        this.isLoading = true;
        this.notify();
        
        setTimeout(() => {
            this.salesData = data;
            this.dataValidated = true;
            this.saveData();
            this.isLoading = false;
            this.notify();
        }, 500);
    }

    // Refresh data (regenerate sample data)
    refreshData() {
        this.isLoading = true;
        this.notify();
        
        setTimeout(() => {
            this.salesData = [];
            this.dataValidated = false;
            this.saveData();
            this.isLoading = false;
            this.notify();
        }, 800);
    }

    // Calculate KPIs
    calculateKPIs() {
        if (this.salesData.length === 0) {
            return {
                totalRevenue: 0,
                totalProfit: 0,
                totalOrders: 0,
                avgOrderValue: 0,
                revenueGrowth: 0,
                profitGrowth: 0,
                ordersGrowth: 0,
                aovGrowth: 0,
            };
        }

        const now = new Date();
        const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const currentData = this.salesData.filter(d => new Date(d.date) >= currentMonth);
        const lastMonthData = this.salesData.filter(d => {
            const date = new Date(d.date);
            return date >= lastMonth && date < currentMonth;
        });

        const totalRevenue = this.salesData.reduce((sum, d) => sum + d.revenue, 0);
        const totalProfit = this.salesData.reduce((sum, d) => sum + d.profit, 0);
        const totalOrders = this.salesData.length;

        const currentRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);
        const lastMonthRevenue = lastMonthData.reduce((sum, d) => sum + d.revenue, 0);
        
        const currentProfit = currentData.reduce((sum, d) => sum + d.profit, 0);
        const lastMonthProfit = lastMonthData.reduce((sum, d) => sum + d.profit, 0);
        
        const currentOrders = currentData.length;
        const lastMonthOrders = lastMonthData.length;

        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const currentAOV = currentOrders > 0 ? currentRevenue / currentOrders : 0;
        const lastMonthAOV = lastMonthOrders > 0 ? lastMonthRevenue / lastMonthOrders : 0;

        return {
            totalRevenue,
            totalProfit,
            totalOrders,
            avgOrderValue,
            revenueGrowth: this.calculateGrowth(lastMonthRevenue, currentRevenue),
            profitGrowth: this.calculateGrowth(lastMonthProfit, currentProfit),
            ordersGrowth: this.calculateGrowth(lastMonthOrders, currentOrders),
            aovGrowth: this.calculateGrowth(lastMonthAOV, currentAOV),
        };
    }

    calculateGrowth(oldValue, newValue) {
        if (oldValue === 0) return newValue > 0 ? 100 : 0;
        return ((newValue - oldValue) / oldValue) * 100;
    }

    // Get monthly trends
    getMonthlyTrends() {
        const monthlyData = new Map();
        
        this.salesData.forEach(item => {
            const date = new Date(item.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData.has(monthKey)) {
                monthlyData.set(monthKey, {
                    revenue: 0,
                    profit: 0,
                    orders: 0,
                });
            }
            
            const month = monthlyData.get(monthKey);
            month.revenue += item.revenue;
            month.profit += item.profit;
            month.orders += 1;
        });

        return Array.from(monthlyData.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, data]) => ({
                name: this.formatMonth(key),
                ...data,
            }));
    }

    formatMonth(monthKey) {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    // Get category breakdown
    getCategoryBreakdown() {
        const categories = new Map();
        let total = 0;

        this.salesData.forEach(item => {
            if (!categories.has(item.category)) {
                categories.set(item.category, 0);
            }
            categories.set(item.category, categories.get(item.category) + item.revenue);
            total += item.revenue;
        });

        const colors = {
            'Electronics': '#3b82f6',
            'Furniture': '#10b981',
            'Accessories': '#f59e0b',
            'Other': '#8b5cf6',
        };

        return Array.from(categories.entries())
            .map(([category, revenue]) => ({
                category,
                revenue,
                percentage: (revenue / total) * 100,
                color: colors[category] || colors['Other'],
            }))
            .sort((a, b) => b.revenue - a.revenue);
    }

    // Get top products
    getTopProducts() {
        const products = new Map();

        const datedData = this.salesData
            .filter(item => item.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        const midPoint = Math.floor(datedData.length / 2);
        const firstHalf = datedData.slice(0, midPoint);
        const secondHalf = datedData.slice(midPoint);

        const revenueByProduct = (rows) => {
            const map = new Map();
            rows.forEach(item => {
                if (!item.product) return;
                map.set(item.product, (map.get(item.product) || 0) + (item.revenue || 0));
            });
            return map;
        };

        const firstHalfRevenue = revenueByProduct(firstHalf);
        const secondHalfRevenue = revenueByProduct(secondHalf);

        this.salesData.forEach(item => {
            if (!products.has(item.product)) {
                products.set(item.product, {
                    revenue: 0,
                    quantity: 0,
                });
            }
            const product = products.get(item.product);
            product.revenue += item.revenue;
            product.quantity += item.quantity;
        });

        return Array.from(products.entries())
            .map(([name, data]) => ({
                name,
                revenue: data.revenue,
                quantity: data.quantity,
                growth: (() => {
                    const first = firstHalfRevenue.get(name) || 0;
                    const second = secondHalfRevenue.get(name) || 0;
                    if (!datedData.length) return 0;
                    if (first === 0) return second > 0 ? 100 : 0;
                    return ((second - first) / first) * 100;
                })(),
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }

    // Get region data
    getRegionData() {
        const regions = new Map();

        this.salesData.forEach(item => {
            if (!regions.has(item.region)) {
                regions.set(item.region, {
                    revenue: 0,
                    profit: 0,
                    orders: 0,
                });
            }
            const region = regions.get(item.region);
            region.revenue += item.revenue;
            region.profit += item.profit;
            region.orders += 1;
        });

        return Array.from(regions.entries())
            .map(([region, data]) => ({
                region,
                ...data,
            }))
            .sort((a, b) => b.revenue - a.revenue);
    }

    // Check if prediction data is available
    hasPredictionData() {
        return this.salesData.length > 0;
    }

    // Generate prediction data based on historical trends
    getPredictionData() {
        if (!this.hasPredictionData()) {
            return null;
        }

        const historicalData = this.getData();
        const avgGrowth = 1 + (historicalData.kpis.revenueGrowth / 100) * 0.5; // Conservative growth
        const profitGrowth = 1 + (historicalData.kpis.profitGrowth / 100) * 0.5;

        // Generate predicted region data
        const predictedRegionData = historicalData.regionData.map(region => ({
            region: region.region,
            revenue: Math.round(region.revenue * avgGrowth),
            profit: Math.round(region.profit * profitGrowth),
            orders: Math.round(region.orders * avgGrowth),
            predictedGrowth: ((avgGrowth - 1) * 100).toFixed(1),
        }));

        // Generate predicted category data
        const predictedCategoryData = historicalData.categoryBreakdown.map(cat => {
            const predictedRevenue = Math.round(cat.revenue * avgGrowth);
            return {
                category: cat.category,
                revenue: predictedRevenue,
                percentage: cat.percentage, // Will be recalculated
                color: cat.color,
                predictedGrowth: ((avgGrowth - 1) * 100).toFixed(1),
            };
        });

        // Recalculate percentages for categories
        const totalPredictedRevenue = predictedCategoryData.reduce((sum, c) => sum + c.revenue, 0);
        predictedCategoryData.forEach(cat => {
            cat.percentage = (cat.revenue / totalPredictedRevenue) * 100;
        });

        // Generate predicted monthly trends (future months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const currentYear = new Date().getFullYear();
        const baseRevenue = historicalData.kpis.totalRevenue / 6;
        const baseProfit = historicalData.kpis.totalProfit / 6;
        
        const predictedMonthlyTrends = months.map((month, index) => {
            const monthGrowth = Math.pow(avgGrowth, (index + 1) / 6);
            const seasonality = 1 + Math.sin((index + 3) * Math.PI / 6) * 0.15; // Seasonal factor
            return {
                name: `${month} ${currentYear}`,
                revenue: Math.round(baseRevenue * monthGrowth * seasonality),
                profit: Math.round(baseProfit * monthGrowth * seasonality),
                orders: Math.round((historicalData.kpis.totalOrders / 6) * monthGrowth * seasonality),
                isPrediction: true,
            };
        });

        // Generate predicted KPIs
        const recordCount = historicalData.salesData?.length || this.salesData.length || 0;
        const confidence = recordCount > 0
            ? Math.min(95, Math.max(50, 50 + Math.log10(recordCount + 1) * 15))
            : 0;
        const predictedKPIs = {
            totalRevenue: Math.round(historicalData.kpis.totalRevenue * avgGrowth),
            totalProfit: Math.round(historicalData.kpis.totalProfit * profitGrowth),
            totalOrders: Math.round(historicalData.kpis.totalOrders * avgGrowth),
            avgOrderValue: Math.round(historicalData.kpis.avgOrderValue),
            revenueGrowth: ((avgGrowth - 1) * 100),
            profitGrowth: ((profitGrowth - 1) * 100),
            ordersGrowth: ((avgGrowth - 1) * 100),
            aovGrowth: 0,
            confidence,
        };

        // Generate predicted top products
        const predictedTopProducts = historicalData.topProducts.map(product => ({
            name: product.name,
            revenue: Math.round(product.revenue * avgGrowth),
            quantity: Math.round(product.quantity * avgGrowth),
            growth: ((avgGrowth - 1) * 100),
        })).sort((a, b) => b.revenue - a.revenue);

        return {
            regionData: predictedRegionData,
            categoryBreakdown: predictedCategoryData,
            monthlyTrends: predictedMonthlyTrends,
            kpis: predictedKPIs,
            topProducts: predictedTopProducts,
            isPrediction: true,
            generatedAt: new Date().toISOString(),
        };
    }

    // Get all processed data
    getData() {
        return {
            salesData: this.salesData,
            kpis: this.calculateKPIs(),
            monthlyTrends: this.getMonthlyTrends(),
            categoryBreakdown: this.getCategoryBreakdown(),
            topProducts: this.getTopProducts(),
            regionData: this.getRegionData(),
            isLoading: this.isLoading,
            hasValidData: this.hasValidData(),
            dataAvailability: this.getDataAvailability(),
        };
    }
}

// Global data manager instance
const dataManager = new DataManager();
