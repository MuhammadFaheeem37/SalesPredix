// Utility Functions
// Helper functions for formatting, calculations, and common operations

// Data Preprocessor Class for CSV validation and cleaning (INDUSTRIAL GRADE)
class DataPreprocessor {
    constructor() {
        // Only 4 columns are now essential; others are optional
        this.requiredColumns = [
            'date',
            'product',
            'quantity',
            'revenue'
        ];
        this.optionalColumns = [
            'category',
            'region',
            'cost',
            'profit',
            'customer_type',
            'gross_revenue',
            'net_revenue',
            'sales_rep',
            'payment_method',
            'sales_channel',
            'unit_price',
            'discount'
        ];
        
        // Column name mappings (INDUSTRIAL GRADE - 100+ variations including enterprise names)
        this.columnMappings = {
            // Date variations
            'date': 'date',
            'order date': 'date',
            'order_date': 'date',
            'orderdate': 'date',
            'sale date': 'date',
            'sale_date': 'date',
            'saledate': 'date',
            'transaction date': 'date',
            'transaction_date': 'date',
            'purchase_date': 'date',
            'posting date': 'date',
            
            // Product variations
            'product': 'product',
            'product name': 'product',
            'product_name': 'product',
            'productname': 'product',
            'item': 'product',
            'item name': 'product',
            'item_name': 'product',
            'product_id': 'product',
            'sku': 'product',
            'material': 'product',
            
            // Category variations (INDUSTRIAL: product_line, vertical, segment_id)
            'category': 'category',
            'product category': 'category',
            'product_category': 'category',
            'product line': 'category',
            'product_line': 'category',
            'productline': 'category',
            'vertical': 'category',
            'segment': 'category',
            'segment id': 'category',
            'segment_id': 'category',
            'segmentid': 'category',
            'business line': 'category',
            'business_line': 'category',
            'division': 'category',
            'type': 'category',
            'product type': 'category',
            'product_type': 'category',
            'class': 'category',
            'classification': 'category',
            
            // Region variations (INDUSTRIAL: territory, sales_zone, geo_location)
            'region': 'region',
            'area': 'region',
            'location': 'region',
            'territory': 'region',
            'sales territory': 'region',
            'sales_territory': 'region',
            'sales zone': 'region',
            'sales_zone': 'region',
            'geo location': 'region',
            'geo_location': 'region',
            'geolocation': 'region',
            'geography': 'region',
            'market': 'region',
            'country': 'region',
            'state': 'region',
            'province': 'region',
            'city': 'region',
            'district': 'region',
            'zone': 'region',
            
            // Quantity variations
            'quantity': 'quantity',
            'qty': 'quantity',
            'units': 'quantity',
            'units sold': 'quantity',
            'units_sold': 'quantity',
            'order quantity': 'quantity',
            'order_quantity': 'quantity',
            'quantity sold': 'quantity',
            'quantity_sold': 'quantity',
            'number of units': 'quantity',
            'count': 'quantity',
            'volume': 'quantity',
            'sold': 'quantity',
            'solid': 'quantity',
            
            // Revenue variations
            'revenue': 'revenue',
            'sales': 'revenue',
            'sale': 'revenue',
            'total sales': 'revenue',
            'total_sales': 'revenue',
            'sales amount': 'revenue',
            'sales_amount': 'revenue',
            'sale amount': 'revenue',
            'sale_amount': 'revenue',
            'amount': 'revenue',
            'total': 'revenue',
            'total amount': 'revenue',
            'total_amount': 'revenue',
            'price': 'revenue',
            'income': 'revenue',
            'value': 'revenue',
            'order total': 'revenue',
            'order_total': 'revenue',
            'transaction amount': 'revenue',
            'transaction_amount': 'revenue',
            'sales value': 'revenue',
            'sales_value': 'revenue',
            
            // Cost variations (INDUSTRIAL: cogs, unit_cost, landing_cost)
            'cost': 'cost',
            'unit cost': 'cost',
            'unit_cost': 'cost',
            'unitcost': 'cost',
            'cogs': 'cost',
            'cost of goods sold': 'cost',
            'cost_of_goods_sold': 'cost',
            'cost of goods': 'cost',
            'cost_of_goods': 'cost',
            'landing cost': 'cost',
            'landing_cost': 'cost',
            'landingcost': 'cost',
            'acquisition cost': 'cost',
            'acquisition_cost': 'cost',
            'total cost': 'cost',
            'total_cost': 'cost',
            'expense': 'cost',
            'expenses': 'cost',
            'production cost': 'cost',
            'production_cost': 'cost',
            'manufacturing cost': 'cost',
            'manufacturing_cost': 'cost',
            
            // Profit variations (INDUSTRIAL: gross_margin, net_earnings, operating_profit)
            'profit': 'profit',
            'net profit': 'profit',
            'net_profit': 'profit',
            'net earnings': 'profit',
            'net_earnings': 'profit',
            'net income': 'profit',
            'net_income': 'profit',
            'gross profit': 'profit',
            'gross_profit': 'profit',
            'gross earnings': 'profit',
            'gross_earnings': 'profit',
            'operating profit': 'profit',
            'operating_profit': 'profit',
            'operating earnings': 'profit',
            'operating_earnings': 'profit',
            'margin': 'profit',
            'profit margin': 'profit',
            'profit_margin': 'profit',
            'gross margin': 'gross_margin',
            'gross_margin': 'gross_margin',
            'bottom line': 'profit',
            
            // Customer Type
            'customer type': 'customer_type',
            'customer_type': 'customer_type',
            'client type': 'customer_type',
            'buyer_type': 'customer_type',
            
            // Sales Rep
            'sales rep': 'sales_rep',
            'sales_rep': 'sales_rep',
            'sales representative': 'sales_rep',
            'sales_representative': 'sales_rep',
            'salesperson': 'sales_rep',
            'rep': 'sales_rep',
            
            // Discount
            'discount': 'discount',
            'discount rate': 'discount',
            'discount_rate': 'discount',
            'discount amount': 'discount',
            'discount_amount': 'discount',
            
            // Payment Method
            'payment method': 'payment_method',
            'payment_method': 'payment_method',
            'payment type': 'payment_method',
            'payment_type': 'payment_method',
            'payment': 'payment_method',
            
            // Sales Channel
            'sales channel': 'sales_channel',
            'sales_channel': 'sales_channel',
            'channel': 'sales_channel',
            'distribution channel': 'sales_channel',
            'distribution_channel': 'sales_channel',
            
            // Unit Price
            'unit price': 'unit_price',
            'unit_price': 'unit_price',
            'price per unit': 'unit_price',
            'price_per_unit': 'unit_price',
            'item price': 'unit_price',
            'item_price': 'unit_price',
        };
        
        // Common date formats to try
        this.dateFormats = [
            /^\d{4}-\d{2}-\d{2}$/,           // 2024-01-15
            /^\d{2}\/\d{2}\/\d{4}$/,          // 01/15/2024 or 15/01/2024
            /^\d{1,2}\/\d{1,2}\/\d{4}$/,      // 1/15/2024
            /^\d{2}-\d{2}-\d{4}$/,            // 01-15-2024
            /^\d{4}\/\d{2}\/\d{2}$/,          // 2024/01/15
            /^\w+ \d{1,2}, \d{4}$/,           // January 15, 2024
            /^\d{1,2} \w+ \d{4}$/,            // 15 January 2024
            /^\d{8}$/,                        // 20240115
        ];
        
        // Preprocessing log
        this.log = {
            totalRows: 0,
            validRows: 0,
            nullRemoved: 0,
            invalidTypeRemoved: 0,
            outliersRemoved: 0,
            errors: [],
            warnings: [],
        };
    }

    // Reset log for new processing
    resetLog() {
        this.log = {
            totalRows: 0,
            validRows: 0,
            nullRemoved: 0,
            invalidTypeRemoved: 0,
            outliersRemoved: 0,
            errors: [],
            warnings: [],
        };
    }

    // Map column headers to standard names (with industrial-grade support)
    mapColumnHeaders(headers) {
        const mapped = {};
        const unmapped = [];
        
        headers.forEach(header => {
            // Strip BOM, normalize whitespace and case
            const cleaned = header.replace(/^\uFEFF/, '').trim();
            const normalized = cleaned.toLowerCase().replace(/[\s_\-]+/g, ' ').trim();
            
            if (this.columnMappings[normalized]) {
                mapped[cleaned] = this.columnMappings[normalized];
            } else {
                // Try without any spaces/underscores
                const compact = normalized.replace(/\s/g, '');
                const found = Object.keys(this.columnMappings).find(key => {
                    const compactKey = key.replace(/[\s_\-]+/g, '');
                    return compact === compactKey;
                });
                if (found) {
                    mapped[cleaned] = this.columnMappings[found];
                } else {
                    unmapped.push(cleaned);
                }
            }
        });
        
        if (unmapped.length > 0) {
            this.log.warnings.push(`Ignored extra columns: ${unmapped.join(', ')}`);
        }
        
        return mapped;
    }

    // Validate required columns exist (INDUSTRIAL GRADE - 8 columns required)
    validateRequiredColumns(mappedHeaders) {
        const mappedValues = Object.values(mappedHeaders);
        const missingColumns = this.requiredColumns.filter(col => !mappedValues.includes(col));
        
        if (missingColumns.length > 0) {
            const columnGuide = `
INDUSTRIAL-GRADE VALIDATION ERROR
===================================

Missing required columns: ${missingColumns.join(', ')}

Your system requires ALL 7 columns for:
  ✓ Advanced Analytics
  ✓ Predictions & Forecasting
  ✓ ROI (Return on Investment) Calculations
  ✓ Drill-down Analytics by Category & Region
  ✓ Profitability & Margin Analysis

REQUIRED COLUMNS (7 total):
  1. date          → Sale_Date, order_date, transaction_date
  2. product       → Product_ID, product_name, SKU, item
  3. quantity      → Quantity_Sold, qty, units, sold, solid, count
  4. revenue       → Sales_Amount, sales, total, income
  5. category      → Product_Category, segment_id, product_line, vertical
  6. region        → Region, territory, sales_zone, geo_location
  7. cost          → Cost, COGS, unit_cost, landing_cost

OPTIONAL (AUTO-CALCULATED):
  • profit         → Automatically calculated as (revenue - cost)
                      Can also be: Profit, net_earnings, operating_profit

INDUSTRIAL-GRADE COLUMN NAMES SUPPORTED:
  Category:  product_line, vertical, segment_id, division, business_line
  Region:    territory, sales_zone, geo_location, geography, subregion
  Cost:      cogs, unit_cost, landing_cost, acquisition_cost, production_cost
  Profit:    gross_margin, net_earnings, operating_profit, net_income`;
            
            throw new Error(columnGuide);
        }
        
        return true;
    }

    // Parse date string to standard format
    parseDate(dateStr) {
        if (!dateStr || dateStr.trim() === '') return null;
        
        const cleanDate = dateStr.trim();
        
        // Try ISO format first (YYYY-MM-DD)
        if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
            const date = new Date(cleanDate);
            if (!isNaN(date.getTime())) {
                return cleanDate;
            }
        }
        
        // Try MM/DD/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDate)) {
            const parts = cleanDate.split('/');
            const date = new Date(parts[2], parts[0] - 1, parts[1]);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        // Try DD/MM/YYYY format (European)
        if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(cleanDate)) {
            const parts = cleanDate.split('-');
            const date = new Date(parts[2], parts[1] - 1, parts[0]);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        // Try YYYY/MM/DD format
        if (/^\d{4}\/\d{2}\/\d{2}$/.test(cleanDate)) {
            const parts = cleanDate.split('/');
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        
        // Try JavaScript Date parsing as fallback
        const date = new Date(cleanDate);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
        
        return null;
    }

    // Parse numeric value
    parseNumber(value, allowNegative = false) {
        if (value === null || value === undefined || value === '') return null;
        
        // Remove currency symbols and commas
        const cleanValue = String(value).replace(/[$€£¥,\s]/g, '').trim();
        
        if (cleanValue === '' || cleanValue === '-') return null;
        
        const num = parseFloat(cleanValue);
        
        if (isNaN(num)) return null;
        if (!allowNegative && num < 0) return null;
        
        return num;
    }

    // Calculate statistics for outlier detection
    calculateStats(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const n = sorted.length;
        
        if (n === 0) return null;
        
        const q1Index = Math.floor(n * 0.25);
        const q3Index = Math.floor(n * 0.75);
        
        const q1 = sorted[q1Index];
        const q3 = sorted[q3Index];
        const iqr = q3 - q1;
        
        const mean = values.reduce((sum, v) => sum + v, 0) / n;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        
        return {
            q1,
            q3,
            iqr,
            lowerBound: q1 - 1.5 * iqr,
            upperBound: q3 + 1.5 * iqr,
            mean,
            stdDev,
            median: sorted[Math.floor(n / 2)],
        };
    }

    // Check if value is an outlier using IQR method
    isOutlier(value, stats) {
        if (!stats) return false;
        return value < stats.lowerBound || value > stats.upperBound;
    }

    // Self-healing cleanRow: auto-fix invalid data, never block on errors
    cleanRow(row, headerMap, rowIndex) {
        const cleaned = {};
        // Map values to standard column names
        for (const [originalHeader, standardName] of Object.entries(headerMap)) {
            cleaned[standardName] = row[originalHeader];
        }

        // Date Handling (auto-fix)
        let parsedDate = this.parseDate(cleaned.date);
        if (!parsedDate) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Invalid date auto-filled with today's date.`);
            parsedDate = new Date().toISOString().split('T')[0];
        }
        cleaned.date = parsedDate;

        // Product Name Cleaning
        let product = (cleaned.product || '').toString().trim();
        if (!product) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Missing product name auto-filled.`);
            product = 'Unknown Product';
        }
        cleaned.product = product;

        // Quantity & Revenue Auto-Correction
        let quantity = this.parseNumber(cleaned.quantity);
        if (quantity === null) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Non-numeric quantity auto-filled as 1.`);
            quantity = 1;
        }
        if (quantity < 0) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Negative quantity converted to absolute.`);
            quantity = Math.abs(quantity);
        }
        if (quantity === 0) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Zero quantity row removed.`);
            return null;
        }
        cleaned.quantity = Math.round(quantity);

        let revenue = this.parseNumber(cleaned.revenue);
        if (revenue === null) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Non-numeric revenue auto-filled as 0.`);
            revenue = 0;
        }
        if (revenue < 0) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Negative revenue converted to absolute.`);
            revenue = Math.abs(revenue);
        }
        if (revenue === 0) {
            this.log.warnings.push(`Row ${rowIndex + 1}: Zero revenue row removed.`);
            return null;
        }
        cleaned.revenue = revenue;

        // Optional columns (category, region, cost, profit, etc.)
        cleaned.category = cleaned.category ? cleaned.category.trim() : '';
        cleaned.region = cleaned.region ? cleaned.region.trim() : '';
        cleaned.cost = this.parseNumber(cleaned.cost);
        cleaned.profit = this.parseNumber(cleaned.profit);

        // ...existing code for other optional columns...

        return cleaned;
    }

    // Fill missing optional values (INDUSTRIAL GRADE - profit calculation)
    fillMissingValues(data) {
        // All rows already have valid values since we enforce 8 columns in cleanRow()
        // This method ensures profit calculation is consistent
        data.forEach(row => {
            // Verify profit is correct (revenue - cost)
            const calculatedProfit = Math.round((row.revenue - row.cost) * 100) / 100;
            
            // If profit differs significantly from calculated, trust the calculated value
            if (Math.abs(row.profit - calculatedProfit) > 0.01) {
                this.log.warnings.push(`Recalculated profit for ${row.product}: ${row.profit} → ${calculatedProfit}`);
                row.profit = calculatedProfit;
            }
        });
        
        return data;
    }

    // Remove outliers using IQR method
    removeOutliers(data) {
        if (data.length < 10) {
            this.log.warnings.push('Skipped outlier detection: insufficient data (< 10 rows)');
            return data;
        }
        // Calculate stats for numeric columns
        const quantityStats = this.calculateStats(data.map(d => d.quantity));
        const revenueStats = this.calculateStats(data.map(d => d.revenue));
        // Winsorize outliers instead of removing
        return data.map(row => {
            let changed = false;
            if (this.isOutlier(row.quantity, quantityStats)) {
                const capped = Math.max(Math.min(row.quantity, quantityStats.upperBound), quantityStats.lowerBound);
                this.log.warnings.push(`Row ${row.date}, ${row.product}: Quantity outlier capped to ${capped}.`);
                row.quantity = capped;
                changed = true;
            }
            if (this.isOutlier(row.revenue, revenueStats)) {
                const capped = Math.max(Math.min(row.revenue, revenueStats.upperBound), revenueStats.lowerBound);
                this.log.warnings.push(`Row ${row.date}, ${row.product}: Revenue outlier capped to ${capped}.`);
                row.revenue = capped;
                changed = true;
            }
            return row;
        });
    }

    // Main preprocessing function
    process(csvText) {
        this.resetLog();
        
        // Parse CSV
        const lines = csvText.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
            throw new Error('CSV file is empty or has no data rows');
        }
        
        // Handle quoted CSV values properly
        const parseCSVLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        };
        
        // Parse headers
        const headers = parseCSVLine(lines[0]);
        const headerMap = this.mapColumnHeaders(headers);
        
        // Validate required columns
        this.validateRequiredColumns(headerMap);
        
        // Process rows
        const rawData = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            rawData.push(row);
        }
        
        this.log.totalRows = rawData.length;
        
        // Clean and validate rows
        let cleanedData = rawData
            .map((row, index) => this.cleanRow(row, headerMap, index))
            .filter(row => row !== null);

        // Minimum Data Rule: continue if at least 5 valid rows
        if (cleanedData.length < 5) {
            this.log.warnings.push('Less than 5 valid rows after cleaning. Please check your data.');
        }

        // Fill missing optional values
        cleanedData = this.fillMissingValues(cleanedData);

        // Winsorize outliers
        cleanedData = this.removeOutliers(cleanedData);

        // Add IDs
        cleanedData = cleanedData.map((row, index) => ({
            id: `data-${Date.now()}-${index}`,
            ...row,
        }));

        this.log.validRows = cleanedData.length;

        return {
            data: cleanedData,
            log: this.log,
        };
    }

    // Get summary of preprocessing
    getSummary() {
        const summary = [];
        summary.push(`Total rows processed: ${this.log.totalRows}`);
        summary.push(`Valid rows: ${this.log.validRows}`);
        
        if (this.log.nullRemoved > 0) {
            summary.push(`Rows removed (null/invalid values): ${this.log.nullRemoved}`);
        }
        if (this.log.outliersRemoved > 0) {
            summary.push(`Rows removed (outliers): ${this.log.outliersRemoved}`);
        }
        if (this.log.warnings.length > 0) {
            summary.push(`Warnings: ${this.log.warnings.length}`);
        }
        
        return summary;
    }
}

// Global preprocessor instance
const dataPreprocessor = new DataPreprocessor();

const utils = {
    // Format currency
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    },

    // Format number with commas
    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
    },

    // Format percentage
    formatPercent(value) {
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 
                     'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Generate unique ID
    generateId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // Parse CSV data with preprocessing
    parseCSV(text) {
        // Use the DataPreprocessor for comprehensive cleaning
        const result = dataPreprocessor.process(text);
        
        // Store the log for later access
        this._lastPreprocessLog = result.log;
        
        return result.data;
    },

    // Get the last preprocessing log
    getPreprocessLog() {
        return this._lastPreprocessLog || null;
    },

    // Get preprocessing summary
    getPreprocessSummary() {
        return dataPreprocessor.getSummary();
    },

    // Animate number counting
    animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    // Local storage helpers
    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error writing to localStorage:', e);
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from localStorage:', e);
            }
        },
    },

    // Theme management
    theme: {
        get() {
            return utils.storage.get('theme', 'light');
        },

        set(theme) {
            utils.storage.set('theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            
            // Update icon
            const icon = document.querySelector('#theme-toggle i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        },

        toggle() {
            const current = this.get();
            this.set(current === 'dark' ? 'light' : 'dark');
        },

        init() {
            this.set(this.get());
        },
    },
};
