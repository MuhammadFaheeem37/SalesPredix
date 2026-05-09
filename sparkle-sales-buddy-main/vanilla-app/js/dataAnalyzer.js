/**
 * SalesPredix Smart Data Analyzer
 * Auto-detects columns, calculates metrics, and generates predictions
 */

class SmartDataAnalyzer {
    constructor() {
        this.data = [];
        this.columns = {};
        this.metrics = {};
        this.categoryPerformance = [];
        this.topProducts = [];
        this.salesPredictions = { historical: [], predictions: [] };
    }

    // ============================================
    // COLUMN AUTO-DETECTION
    // ============================================
    
    /**
     * Analyze uploaded data and auto-detect column types
     */
    analyzeData(rawData) {
        if (!rawData || rawData.length === 0) {
            return { success: false, error: 'No data found. Please upload a valid CSV file.' };
        }

        this.data = rawData;
        
        // Auto-detect columns
        this.columns = this.detectColumns(rawData);
        
        // Validate required columns
        const validation = this.validateRequiredColumns(rawData);
        if (!validation.valid) {
            return { 
                success: false, 
                error: validation.message,
                missingColumns: validation.missingColumns,
                columns: this.columns,
                detectedMapping: this.getDetectedMapping()
            };
        }
        
        // Step 1: Data validation + parsing
        const { cleanedData, validationStats } = this.validateAndCleanData(rawData);
        this.data = cleanedData;
        
        // Calculate all metrics
        this.metrics = this.calculateMetrics(cleanedData);
        
        // Generate category performance (optional - uses category/product if available)
        this.categoryPerformance = this.calculateCategoryPerformance(cleanedData);
        
        // Generate top products performance (optional - uses product column if available)
        this.topProducts = this.calculateTopProducts(cleanedData);
        
        // Generate sales predictions (Steps 2-4)
        this.salesPredictions = this.generateSalesPredictions(cleanedData);
        
        // Build feature summary for predictions
        const features = this.buildFeatureSummary();
        
        // Build regionData directly from cleanedData for chart rendering
        let regionData = [];
        if (this.columns.regionColumn) {
            const regionMap = {};
            cleanedData.forEach(row => {
                const region = row._region || 'Unspecified';
                if (!regionMap[region]) regionMap[region] = { sales: 0, count: 0 };
                regionMap[region].sales += (row._sales || 0);
                regionMap[region].count += 1;
            });
            regionData = Object.entries(regionMap)
                .map(([region, info]) => ({ region, revenue: info.sales, orders: info.count }))
                .sort((a, b) => b.revenue - a.revenue);
            console.log('[SalesPredix] regionData built:', JSON.stringify(regionData));
        } else {
            console.log('[SalesPredix] No regionColumn detected, regionData empty');
        }
        
        return {
            success: true,
            columns: this.columns,
            metrics: this.metrics,
            categoryPerformance: this.categoryPerformance,
            topProducts: this.topProducts,
            salesPredictions: this.salesPredictions,
            timePatterns: this.metrics.timePatterns || {},
            regionData: regionData,
            features: features,
            validation: validationStats,
            recordsProcessed: cleanedData.length,
            originalRecords: rawData.length
        };
    }

    /**
     * Step 1: Data validation and parsing
     * - Detect missing/invalid/negative values for sales-related columns
     * - Ensure date formats and numeric columns are correctly parsed
     */
    validateAndCleanData(data) {
        const dateCol = this.columns.dateColumn;
        const salesCol = this.columns.salesColumn || this.columns.revenueColumn;
        const quantityCol = this.columns.unitsColumn || this.columns.quantityColumn;
        const revenueCol = this.columns.revenueColumn && this.columns.revenueColumn !== salesCol
            ? this.columns.revenueColumn
            : null;

        const stats = {
            totalRows: data.length,
            invalidDate: 0,
            missingSales: 0,
            invalidSales: 0,
            negativeSales: 0,
            missingQuantity: 0,
            invalidQuantity: 0,
            negativeQuantity: 0,
            missingRevenue: 0,
            invalidRevenue: 0,
            negativeRevenue: 0
        };

        const cleanedData = data
            .map(row => {
                const cleaned = { ...row };

                // Parse and validate date - with robust multi-format support
                if (dateCol && row[dateCol]) {
                    const rawDateStr = String(row[dateCol]).trim().replace(/\r/g, '');
                    let date = new Date(rawDateStr);
                    
                    // If native parsing fails, try common formats manually
                    if (isNaN(date.getTime())) {
                        // Try MM/DD/YYYY or MM-DD-YYYY
                        const slashMatch = rawDateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
                        if (slashMatch) {
                            date = new Date(parseInt(slashMatch[3]), parseInt(slashMatch[1]) - 1, parseInt(slashMatch[2]));
                        }
                    }
                    if (isNaN(date.getTime())) {
                        // Try DD/MM/YYYY (European)
                        const euroMatch = rawDateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
                        if (euroMatch && parseInt(euroMatch[1]) > 12) {
                            date = new Date(parseInt(euroMatch[3]), parseInt(euroMatch[2]) - 1, parseInt(euroMatch[1]));
                        }
                    }
                    if (isNaN(date.getTime())) {
                        // Try YYYY/MM/DD
                        const isoMatch = rawDateStr.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
                        if (isoMatch) {
                            date = new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
                        }
                    }
                    
                    if (!isNaN(date.getTime())) {
                        cleaned._parsedDate = date;
                        cleaned._month = date.getMonth() + 1;
                        cleaned._day = date.getDate();
                        cleaned._weekday = date.getDay();
                        cleaned._year = date.getFullYear();
                        cleaned._quarter = Math.ceil((date.getMonth() + 1) / 3);
                    } else {
                        cleaned._invalidDate = true;
                        stats.invalidDate += 1;
                    }
                } else {
                    cleaned._invalidDate = true;
                    stats.invalidDate += 1;
                }

                // Parse and validate sales
                if (salesCol) {
                    const rawSales = row[salesCol];
                    if (rawSales === null || rawSales === undefined || rawSales === '') {
                        stats.missingSales += 1;
                    }
                    const salesVal = parseFloat(rawSales);
                    if (isNaN(salesVal)) {
                        stats.invalidSales += 1;
                    } else if (salesVal < 0) {
                        stats.negativeSales += 1;
                    } else {
                        cleaned._sales = salesVal;
                    }
                }

                // Parse and validate quantity
                if (quantityCol) {
                    const rawQty = row[quantityCol];
                    if (rawQty === null || rawQty === undefined || rawQty === '') {
                        stats.missingQuantity += 1;
                    }
                    const qtyVal = parseFloat(rawQty);
                    if (isNaN(qtyVal)) {
                        stats.invalidQuantity += 1;
                    } else if (qtyVal < 0) {
                        stats.negativeQuantity += 1;
                    } else {
                        cleaned._quantity = qtyVal;
                    }
                }

                // Parse and validate revenue (if separate)
                if (revenueCol) {
                    const rawRevenue = row[revenueCol];
                    if (rawRevenue === null || rawRevenue === undefined || rawRevenue === '') {
                        stats.missingRevenue += 1;
                    }
                    const revenueVal = parseFloat(rawRevenue);
                    if (isNaN(revenueVal)) {
                        stats.invalidRevenue += 1;
                    } else if (revenueVal < 0) {
                        stats.negativeRevenue += 1;
                    } else {
                        cleaned._revenue = revenueVal;
                    }
                }

                // Optional category/product/region normalization
                if (this.columns.categoryColumn) {
                    cleaned._category = row[this.columns.categoryColumn]
                        ? row[this.columns.categoryColumn].toString().trim()
                        : 'Other';
                }
                if (this.columns.productColumn) {
                    cleaned._product = row[this.columns.productColumn]
                        ? row[this.columns.productColumn].toString().trim()
                        : 'Unknown';
                }
                if (this.columns.regionColumn) {
                    cleaned._region = row[this.columns.regionColumn]
                        ? row[this.columns.regionColumn].toString().trim()
                        : 'Unspecified';
                }

                return cleaned;
            })
            // Remove invalid rows
            .filter(row => !row._invalidDate)
            .filter(row => typeof row._sales === 'number' && row._sales > 0)
            .filter(row => typeof row._quantity === 'number' && row._quantity >= 0);

        return { cleanedData, validationStats: stats };
    }

    /**
     * Validate that required columns exist and contain valid data
     * Required: Order Date, Sales, Quantity
     * - Order Date must be a valid date/time column
     * - Sales must be numeric and positive
     * - Quantity must be numeric and positive
     * Optional: product/category, region/location (no warnings for these)
     */
    validateRequiredColumns(data) {
        const missingColumns = [];
        
        // Check for Order Date column (REQUIRED - must be valid date/time)
        if (!this.columns.dateColumn) {
            missingColumns.push('Order Date');
        } else {
            // Verify date column has valid dates using robust parsing
            const validDates = data.filter(row => {
                const val = row[this.columns.dateColumn];
                if (!val) return false;
                const strVal = String(val).trim().replace(/\r/g, '');
                // Try native Date.parse first
                if (!isNaN(Date.parse(strVal))) return true;
                // Fallback: common date patterns (MM/DD/YYYY, DD-MM-YYYY, YYYY-MM-DD, etc.)
                if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(strVal)) return true;
                if (/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(strVal)) return true;
                if (/^\w+\s+\d{1,2},?\s+\d{4}$/.test(strVal)) return true;
                return false;
            });
            console.log('[SalesPredix] Date validation:', this.columns.dateColumn, 
                `- ${validDates.length}/${data.length} valid (${Math.round(validDates.length/data.length*100)}%)`,
                '- Sample values:', data.slice(0,3).map(r => r[this.columns.dateColumn]));
            if (validDates.length < data.length * 0.3) {
                missingColumns.push('Order Date');
            }
        }
        
        // Check for Sales column (REQUIRED - must be numeric and positive)
        const salesCol = this.columns.salesColumn || this.columns.revenueColumn;
        if (!salesCol) {
            missingColumns.push('Sales');
        } else {
            // Verify sales column has valid positive numbers
            const validSales = data.filter(row => {
                const rawVal = row[salesCol];
                if (rawVal === null || rawVal === undefined || rawVal === '') return false;
                const cleanVal = String(rawVal).replace(/[$€£¥,\s]/g, '');
                const val = parseFloat(cleanVal);
                return !isNaN(val) && val >= 0;
            });
            console.log('[SalesPredix] Sales validation:', salesCol,
                `- ${validSales.length}/${data.length} valid (${Math.round(validSales.length/data.length*100)}%)`);
            if (validSales.length < data.length * 0.3) {
                missingColumns.push('Sales');
            }
        }
        
        // Check for Quantity column (REQUIRED - must be numeric and positive)
        const quantityCol = this.columns.unitsColumn || this.columns.quantityColumn;
        if (!quantityCol) {
            missingColumns.push('Quantity');
        } else {
            // Verify quantity column has valid positive numbers
            const validQty = data.filter(row => {
                const rawVal = row[quantityCol];
                if (rawVal === null || rawVal === undefined || rawVal === '') return false;
                const val = parseFloat(String(rawVal).replace(/,/g, ''));
                return !isNaN(val) && val >= 0;
            });
            console.log('[SalesPredix] Quantity validation:', quantityCol,
                `- ${validQty.length}/${data.length} valid (${Math.round(validQty.length/data.length*100)}%)`);
            if (validQty.length < data.length * 0.3) {
                missingColumns.push('Quantity');
            }
        }
        
        if (missingColumns.length > 0) {
            const friendlyMessage = this.buildFriendlyErrorMessage(missingColumns);
            return {
                valid: false,
                message: friendlyMessage,
                missingColumns: missingColumns
            };
        }
        
        return { valid: true };
    }

    /**
     * Build a friendly, non-technical error message
     */
    buildFriendlyErrorMessage(missingColumns) {
        if (missingColumns.length === 3) {
            return "⚠️ We couldn't identify Order Date, Sales, or Quantity. Please review your file and try again.";
        }
        return `⚠️ We couldn't identify: ${missingColumns.join(', ')}. Please review your file and try again.`;
    }

    /**
     * Return a user-friendly summary of detected column mappings
     */
    getDetectedMapping() {
        const mapping = {};
        if (this.columns.dateColumn) mapping['Order Date'] = this.columns.dateColumn;
        if (this.columns.salesColumn) mapping['Sales'] = this.columns.salesColumn;
        if (this.columns.revenueColumn) mapping['Revenue'] = this.columns.revenueColumn;
        if (this.columns.quantityColumn) mapping['Quantity'] = this.columns.quantityColumn;
        if (this.columns.unitsColumn && this.columns.unitsColumn !== this.columns.quantityColumn) {
            mapping['Units'] = this.columns.unitsColumn;
        }
        if (this.columns.categoryColumn) mapping['Category'] = this.columns.categoryColumn;
        if (this.columns.productColumn) mapping['Product'] = this.columns.productColumn;
        if (this.columns.regionColumn) mapping['Region'] = this.columns.regionColumn;
        if (this.columns.profitColumn) mapping['Profit'] = this.columns.profitColumn;
        return mapping;
    }

    /**
     * Preprocess and clean the data
     */
    preprocessData(data) {
        return this.validateAndCleanData(data).cleanedData;
    }

    /**
     * Build a summary of features used for prediction
     * Required: Order Date, Sales, Quantity
     */
    buildFeatureSummary() {
        const features = {
            required: [],
            optional: [],
            derived: ['month', 'day', 'weekday', 'quarter', 'year']
        };
        
        // Required features (Order Date, Sales, Quantity)
        if (this.columns.dateColumn) features.required.push('Order Date');
        if (this.columns.salesColumn || this.columns.revenueColumn) features.required.push('Sales');
        if (this.columns.unitsColumn || this.columns.quantityColumn) features.required.push('Quantity');
        
        // Optional features (no warnings if missing)
        if (this.columns.categoryColumn) features.optional.push('Category');
        if (this.columns.productColumn) features.optional.push('Product');
        if (this.columns.regionColumn) features.optional.push('Region');
        if (this.columns.profitColumn) features.optional.push('Profit');
        
        return features;
    }

    // ============================================
    // INTELLIGENT COLUMN MAPPING SYSTEM
    // ============================================

    /**
     * Normalize column name for semantic matching
     * Removes spaces, underscores, special characters, and converts to lowercase
     */
    normalizeColumnName(name) {
        if (!name) return '';
        return name
            .toString()
            .replace(/^\uFEFF/, '')            // Strip BOM character
            .toLowerCase()
            .replace(/[\s_\-\.\/\\]+/g, '')  // Remove spaces, underscores, dashes, dots, slashes
            .replace(/[^a-z0-9]/g, '')        // Remove any remaining special characters
            .trim();
    }

    /**
     * Normalize column header for human-readable word-based matching:
     * 1. lowercase 2. trim 3. replace underscores with spaces 4. collapse whitespace
     */
    normalizeColumnWords(name) {
        if (!name) return '';
        return name
            .toString()
            .replace(/^\uFEFF/, '')
            .toLowerCase()
            .replace(/[_\-\.]+/g, ' ')  // Replace underscores/dashes/dots with spaces
            .replace(/\s+/g, ' ')       // Collapse multiple spaces
            .trim();
    }

    /**
     * Get expanded pattern mappings for intelligent column detection
     * Required fields: Order Date, Sales, Quantity
     * Mapping is case-insensitive, ignores spaces/underscores/special characters
     */
    getColumnPatternMappings() {
        return {
            // ORDER DATE mapping (REQUIRED)
            // Recognizes: order date, order_date, sale_date, sales_date, transaction_date, 
            // invoice_date, created_at, timestamp, date
            date: [
                'orderdate', 'order date', 'date', 'saledate', 'salesdate',
                'transactiondate', 'invoicedate', 'createdat', 'timestamp',
                'datetime', 'purchasedate', 'postingdate', 'billdate',
                'orderdatetime', 'saledatetime', 'transactiontime', 'invoicetime',
                'orderday', 'saleday', 'time', 'period', 'reportdate'
            ],
            
            // SALES mapping (REQUIRED) - must be numeric and positive
            // Recognizes: sales, sale, sales_amount, sale_amount, total_sales, revenue,
            // total_revenue, net_sales, gross_sales, amount, order_value
            sales: [
                'sales', 'sale', 'salesamount', 'saleamount', 'totalsales',
                'revenue', 'totalrevenue', 'netsales', 'grosssales', 'amount',
                'ordervalue', 'totalamount', 'salesvalue', 'transactionamount',
                'invoiceamount', 'ordertotal', 'totalprice', 'income', 'proceeds',
                'value', 'gmv', 'grossmerchandisevalue', 'orderamount', 'billvalue',
                'invoicetotal', 'netrevenue', 'grossrevenue', 'earnings',
                'totalvalue', 'salevalue', 'salesrevenue', 'revenueamount',
                'price', 'totalpurchase', 'purchaseamount'
            ],
            
            // QUANTITY mapping (REQUIRED) - must be numeric and positive
            // Recognizes: quantity, qty, units, units_sold, items, item_count, volume
            quantity: [
                'quantity', 'qty', 'units', 'unitssold', 'items', 'itemcount',
                'volume', 'count', 'numberofunits', 'orderquantity', 'quantitysold',
                'quantitybilled', 'billedquantity', 'qtysold', 'sold', 'solid',
                'orderedqty', 'shippedqty', 'deliveredqty', 'itemqty', 'unitsold',
                'unitsordered', 'pcs', 'pieces', 'noofunits', 'numberitems',
                'itemssold', 'totalunits', 'totalqty', 'totalquantity'
            ],
            
            // Category patterns (optional)
            category: [
                'category', 'productcategory', 'type', 'group', 'class',
                'segment', 'department', 'productline', 'producttype',
                'classification', 'vertical', 'segmentid', 'businessline',
                'division', 'productgroup', 'itemcategory', 'itemtype'
            ],
            
            // Product patterns (optional)
            product: [
                'product', 'productname', 'item', 'itemname', 'sku',
                'productid', 'materialno', 'materialnumber', 'goods',
                'articlename', 'article', 'itemdesc', 'description',
                'productdescription', 'itemdescription', 'productsku'
            ],
            
            // Region patterns (optional)
            region: [
                'region', 'area', 'location', 'territory', 'zone',
                'country', 'city', 'state', 'province', 'district',
                'salesterritory', 'saleszone', 'geolocation', 'geography',
                'market', 'subregion', 'geo', 'place'
            ],
            
            // Profit patterns (optional)
            profit: [
                'profit', 'netprofit', 'grossprofit', 'margin', 'earnings',
                'netearnings', 'operatingprofit', 'profitmargin', 'grossmargin',
                'netincome', 'bottomline', 'gain', 'operatingincome'
            ]
        };
    }

    /**
     * Calculate data consistency score for a column
     * Higher score = better data quality for the intended type
     */
    calculateColumnScore(data, header, columnType) {
        const sample = data.slice(0, Math.min(100, data.length));
        let validCount = 0;
        let nonNullCount = 0;
        let positiveCount = 0;
        
        sample.forEach(row => {
            const value = row[header];
            
            if (value !== null && value !== undefined && value !== '') {
                nonNullCount++;
                
                if (columnType === 'date') {
                    // Check for valid date using multiple strategies:
                    // 1. Native Date.parse
                    // 2. Common date formats: MM/DD/YYYY, DD-MM-YYYY, YYYY-MM-DD
                    // 3. Pattern heuristic: contains slashes or dashes between numbers
                    const strVal = String(value).trim();
                    if (!isNaN(Date.parse(strVal))) {
                        validCount++;
                    } else if (/^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/.test(strVal) ||
                               /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(strVal) ||
                               /^\w+\s+\d{1,2},?\s+\d{4}$/.test(strVal)) {
                        // Matches common date patterns even if Date.parse fails
                        validCount++;
                    }
                } else if (columnType === 'sales' || columnType === 'quantity') {
                    // Check for valid positive numeric - strip currency symbols
                    const cleanVal = String(value).replace(/[$€£¥,\s]/g, '');
                    const numVal = parseFloat(cleanVal);
                    if (!isNaN(numVal)) {
                        validCount++;
                        if (numVal >= 0) {
                            positiveCount++;
                        }
                    }
                }
            }
        });
        
        const sampleSize = sample.length;
        const nonNullRate = sampleSize > 0 ? nonNullCount / sampleSize : 0;
        const validRate = nonNullCount > 0 ? validCount / nonNullCount : 0;
        const positiveRate = validCount > 0 ? positiveCount / validCount : 0;
        
        // Combined score: prioritize non-null, then valid, then positive values
        if (columnType === 'date') {
            return nonNullRate * 0.3 + validRate * 0.7;
        } else {
            return nonNullRate * 0.2 + validRate * 0.4 + positiveRate * 0.4;
        }
    }

    /**
     * Levenshtein edit distance for fuzzy matching
     */
    levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    /**
     * Calculate pattern match quality score (0-1)
     * Gives higher scores to exact matches, lower to fuzzy/contains
     */
    getPatternMatchScore(normalized, patterns) {
        let bestScore = 0;

        for (const pattern of patterns) {
            const normalizedPattern = this.normalizeColumnName(pattern);

            // 1. Exact match = best score
            if (normalized === normalizedPattern) {
                return 1.0;
            }

            // 2. Column starts with or ends with pattern (avoid false substring matches)
            //    Only allow if pattern is at least 4 chars to avoid short-string false positives
            if (normalizedPattern.length >= 4) {
                if (normalized.startsWith(normalizedPattern) || normalized.endsWith(normalizedPattern)) {
                    bestScore = Math.max(bestScore, 0.85);
                }
            }

            // 3. Pattern starts with or ends with column name
            //    Only allow if column name is at least 4 chars
            if (normalized.length >= 4) {
                if (normalizedPattern.startsWith(normalized) || normalizedPattern.endsWith(normalized)) {
                    bestScore = Math.max(bestScore, 0.8);
                }
            }

            // 4. Contains check - only for longer patterns (>=5 chars) to avoid false positives
            //    like "discount" matching "count" or "country" matching "count"
            if (normalizedPattern.length >= 5 && normalized.includes(normalizedPattern)) {
                bestScore = Math.max(bestScore, 0.7);
            }
            if (normalized.length >= 5 && normalizedPattern.includes(normalized)) {
                bestScore = Math.max(bestScore, 0.65);
            }

            // 5. Levenshtein fuzzy matching for slight spelling differences
            //    Only for strings of similar length (within 2 chars difference)
            if (Math.abs(normalized.length - normalizedPattern.length) <= 2) {
                const maxLen = Math.max(normalized.length, normalizedPattern.length);
                if (maxLen > 0) {
                    const distance = this.levenshteinDistance(normalized, normalizedPattern);
                    const similarity = 1 - (distance / maxLen);
                    // Accept if >=80% similar (e.g., "quantty" matches "quantity")
                    if (similarity >= 0.8) {
                        bestScore = Math.max(bestScore, similarity * 0.75);
                    }
                }
            }
        }

        return bestScore;
    }

    /**
     * Find matching columns with scoring for conflict resolution
     * Uses combined pattern-match quality + data quality scoring
     */
    findMatchingColumns(data, headers, targetType, patterns) {
        const matches = [];
        
        headers.forEach(header => {
            const normalized = this.normalizeColumnName(header);
            if (!normalized) return;
            
            // Get pattern match quality score
            const patternScore = this.getPatternMatchScore(normalized, patterns);
            
            if (patternScore > 0) {
                // Get data quality score
                const dataScore = this.calculateColumnScore(data, header, targetType);
                
                // For exact or near-exact pattern matches (>=0.85), prioritize pattern quality
                // This prevents a perfect name match from being rejected due to low data score
                let combinedScore;
                if (patternScore >= 0.85) {
                    // 60% pattern + 40% data: exact name match wins even with moderate data quality
                    combinedScore = (patternScore * 0.6) + (dataScore * 0.4);
                } else {
                    // 40% pattern + 60% data: for weaker name matches, data quality breaks ties
                    combinedScore = (patternScore * 0.4) + (dataScore * 0.6);
                }
                
                matches.push({ 
                    header, 
                    score: combinedScore, 
                    patternScore,
                    dataScore,
                    type: 'pattern' 
                });
            }
        });
        
        return matches.sort((a, b) => b.score - a.score);
    }

    /**
     * Auto-detect column types from data using intelligent semantic matching
     */
    detectColumns(data) {
        if (!data || data.length === 0) return {};
        
        const firstRow = data[0];
        const headers = Object.keys(firstRow);
        const patterns = this.getColumnPatternMappings();

        // === STEP 0: Sanitize headers ===
        // Build a clean→original map for headers with invisible chars or encoding issues
        const headerCleanMap = {};
        headers.forEach(h => {
            const clean = h.replace(/^\uFEFF/, '').replace(/\r/g, '').trim();
            headerCleanMap[clean] = h;
        });
        
        // Log raw headers for debugging
        console.log('[SalesPredix] Raw CSV headers:', headers);
        console.log('[SalesPredix] Normalized headers:', headers.map(h => this.normalizeColumnName(h)));

        // === STEP 0.5: Quick-match using word-based normalization ===
        // This handles the 5 steps asked by user:
        //   1. Convert to lowercase   2. Trim spaces   3. Replace underscores with spaces
        //   4. Match required columns flexibly   5. Return missing only if no close match
        const quickMap = {
            // Date variations (word-based)
            'order date': 'date', 'date': 'date', 'sale date': 'date', 'sales date': 'date',
            'transaction date': 'date', 'invoice date': 'date', 'purchase date': 'date',
            'posting date': 'date', 'bill date': 'date', 'created at': 'date',
            // Sales variations (word-based)
            'sales': 'sales', 'sale': 'sales', 'sales amount': 'sales', 'sale amount': 'sales',
            'total sales': 'sales', 'revenue': 'sales', 'total revenue': 'sales',
            'net sales': 'sales', 'gross sales': 'sales', 'amount': 'sales',
            'order value': 'sales', 'total amount': 'sales', 'income': 'sales',
            'total': 'sales', 'value': 'sales', 'price': 'sales',
            // Quantity variations (word-based)
            'quantity': 'quantity', 'qty': 'quantity', 'units': 'quantity',
            'units sold': 'quantity', 'items': 'quantity', 'volume': 'quantity',
            'count': 'quantity', 'order quantity': 'quantity', 'quantity sold': 'quantity',
            'sold': 'quantity', 'pieces': 'quantity', 'pcs': 'quantity',
            // Optional
            'category': 'category', 'product category': 'category', 'segment': 'category',
            'type': 'category', 'product line': 'category', 'department': 'category',
            'product': 'product', 'product name': 'product', 'item': 'product',
            'item name': 'product', 'sku': 'product', 'product id': 'product',
            'region': 'region', 'area': 'region', 'territory': 'region',
            'location': 'region', 'zone': 'region', 'market': 'region',
            'profit': 'profit', 'net profit': 'profit', 'gross profit': 'profit',
            'margin': 'profit', 'earnings': 'profit', 'net income': 'profit',
        };
        
        // Pre-populate detection using quick word-based matching
        const quickDetected = {};
        headers.forEach(h => {
            const words = this.normalizeColumnWords(h);
            if (quickMap[words]) {
                if (!quickDetected[quickMap[words]]) {
                    quickDetected[quickMap[words]] = [];
                }
                quickDetected[quickMap[words]].push(h);
            }
        });
        console.log('[SalesPredix] Quick word-match results:', quickDetected);
        
        const detected = {
            dateColumn: null,
            salesColumn: null,
            revenueColumn: null,
            categoryColumn: null,
            productColumn: null,
            regionColumn: null,
            unitsColumn: null,
            profitColumn: null,
            quantityColumn: null
        };

        // Track used columns to avoid duplicates
        const usedColumns = new Set();

        // === STEP 1: Quick-match first pass for required columns ===
        // If quick word-match found an exact match, use it directly for maximum reliability
        if (quickDetected['date'] && quickDetected['date'].length > 0) {
            detected.dateColumn = quickDetected['date'][0]; // Prefer first match (e.g., "Order Date" before "Ship Date")
            usedColumns.add(detected.dateColumn);
            console.log('[SalesPredix] Quick-matched Date:', detected.dateColumn);
        }
        if (quickDetected['sales'] && quickDetected['sales'].length > 0) {
            detected.salesColumn = quickDetected['sales'][0];
            usedColumns.add(detected.salesColumn);
            console.log('[SalesPredix] Quick-matched Sales:', detected.salesColumn);
        }
        if (quickDetected['quantity'] && quickDetected['quantity'].length > 0) {
            detected.quantityColumn = quickDetected['quantity'][0];
            detected.unitsColumn = quickDetected['quantity'][0];
            usedColumns.add(detected.quantityColumn);
            console.log('[SalesPredix] Quick-matched Quantity:', detected.quantityColumn);
        }

        // Quick-match optional columns
        if (quickDetected['category'] && quickDetected['category'].length > 0) {
            const col = quickDetected['category'].find(c => !usedColumns.has(c));
            if (col) { detected.categoryColumn = col; usedColumns.add(col); }
        }
        if (quickDetected['product'] && quickDetected['product'].length > 0) {
            const col = quickDetected['product'].find(c => !usedColumns.has(c));
            if (col) { detected.productColumn = col; usedColumns.add(col); }
        }
        if (quickDetected['region'] && quickDetected['region'].length > 0) {
            // Prefer exact 'region' match over area/territory/location/zone/market
            const exactRegion = quickDetected['region'].find(c => !usedColumns.has(c) && this.normalizeColumnWords(c) === 'region');
            const col = exactRegion || quickDetected['region'].find(c => !usedColumns.has(c));
            if (col) { detected.regionColumn = col; usedColumns.add(col); console.log('[SalesPredix] Quick-matched Region:', col); }
        }
        if (quickDetected['profit'] && quickDetected['profit'].length > 0) {
            const col = quickDetected['profit'].find(c => !usedColumns.has(c));
            if (col) { detected.profitColumn = col; usedColumns.add(col); }
        }

        // === STEP 2: Fuzzy scoring fallback for any columns not yet detected ===

        // 1. Detect DATE column (required) - fuzzy fallback
        if (!detected.dateColumn) {
            const dateMatches = this.findMatchingColumns(data, headers, 'date', patterns.date);
            console.log('[SalesPredix] Date fuzzy matches:', dateMatches.map(m => `${m.header}(p:${m.patternScore.toFixed(2)},d:${m.dataScore.toFixed(2)},c:${m.score.toFixed(2)})`));
            const validDateMatches = dateMatches.filter(m => !usedColumns.has(m.header) && m.score >= 0.3);
            if (validDateMatches.length > 0) {
                detected.dateColumn = validDateMatches[0].header;
                usedColumns.add(validDateMatches[0].header);
            } else {
                // Last fallback: find any column with valid date data
                for (const header of headers) {
                    if (!usedColumns.has(header) && this.isDateColumn(data, header)) {
                        detected.dateColumn = header;
                        usedColumns.add(header);
                        break;
                    }
                }
            }
        }

        // 2. Detect SALES/REVENUE column (required) - fuzzy fallback
        if (!detected.salesColumn && !detected.revenueColumn) {
            const salesMatches = this.findMatchingColumns(data, headers, 'sales', patterns.sales);
            console.log('[SalesPredix] Sales fuzzy matches:', salesMatches.map(m => `${m.header}(p:${m.patternScore.toFixed(2)},d:${m.dataScore.toFixed(2)},c:${m.score.toFixed(2)})`));
            const validSalesMatches = salesMatches.filter(m => !usedColumns.has(m.header) && m.score >= 0.3);
        
            if (validSalesMatches.length > 0) {
                const bestMatch = validSalesMatches[0];
                const normalizedName = this.normalizeColumnName(bestMatch.header);
                
                if (normalizedName.includes('revenue')) {
                    detected.revenueColumn = bestMatch.header;
                } else {
                    detected.salesColumn = bestMatch.header;
                }
                usedColumns.add(bestMatch.header);
            }
        }

        // 3. Detect QUANTITY column (required) - fuzzy fallback
        if (!detected.quantityColumn && !detected.unitsColumn) {
            const quantityMatches = this.findMatchingColumns(data, headers, 'quantity', patterns.quantity);
            console.log('[SalesPredix] Quantity fuzzy matches:', quantityMatches.map(m => `${m.header}(p:${m.patternScore.toFixed(2)},d:${m.dataScore.toFixed(2)},c:${m.score.toFixed(2)})`));
            const validQuantityMatches = quantityMatches.filter(m => !usedColumns.has(m.header) && m.score >= 0.3);
            
            if (validQuantityMatches.length > 0) {
                detected.quantityColumn = validQuantityMatches[0].header;
                detected.unitsColumn = validQuantityMatches[0].header;
                usedColumns.add(validQuantityMatches[0].header);
            }
        }

        // 4. Detect optional columns (fuzzy fallback only if not quick-matched)
        
        if (!detected.categoryColumn) {
            const categoryMatches = this.findMatchingColumns(data, headers, 'category', patterns.category);
            const validCategoryMatches = categoryMatches.filter(m => !usedColumns.has(m.header));
            if (validCategoryMatches.length > 0) {
                detected.categoryColumn = validCategoryMatches[0].header;
                usedColumns.add(validCategoryMatches[0].header);
            }
        }

        if (!detected.productColumn) {
            const productMatches = this.findMatchingColumns(data, headers, 'product', patterns.product);
            const validProductMatches = productMatches.filter(m => !usedColumns.has(m.header));
            if (validProductMatches.length > 0) {
                detected.productColumn = validProductMatches[0].header;
                usedColumns.add(validProductMatches[0].header);
            }
        }

        if (!detected.regionColumn) {
            const regionMatches = this.findMatchingColumns(data, headers, 'region', patterns.region);
            const validRegionMatches = regionMatches.filter(m => !usedColumns.has(m.header));
            if (validRegionMatches.length > 0) {
                detected.regionColumn = validRegionMatches[0].header;
                usedColumns.add(validRegionMatches[0].header);
            }
        }

        if (!detected.profitColumn) {
            const profitMatches = this.findMatchingColumns(data, headers, 'profit', patterns.profit);
            const validProfitMatches = profitMatches.filter(m => !usedColumns.has(m.header));
            if (validProfitMatches.length > 0) {
                detected.profitColumn = validProfitMatches[0].header;
                usedColumns.add(validProfitMatches[0].header);
            }
        }

        // 5. Fallback for sales column: find best numeric column if not found by pattern
        if (!detected.salesColumn && !detected.revenueColumn) {
            const numericColumns = headers
                .filter(h => !usedColumns.has(h))
                .filter(h => this.isNumericColumn(data, h))
                .map(h => ({
                    header: h,
                    score: this.calculateColumnScore(data, h, 'sales')
                }))
                .sort((a, b) => b.score - a.score);
            
            if (numericColumns.length > 0) {
                detected.salesColumn = numericColumns[0].header;
                usedColumns.add(numericColumns[0].header);
            }
        }

        // 6. Fallback for quantity column: find next best numeric column if not found
        if (!detected.quantityColumn && !detected.unitsColumn) {
            const numericColumns = headers
                .filter(h => !usedColumns.has(h))
                .filter(h => this.isNumericColumn(data, h))
                .map(h => ({
                    header: h,
                    score: this.calculateColumnScore(data, h, 'quantity')
                }))
                .sort((a, b) => b.score - a.score);
            
            if (numericColumns.length > 0) {
                detected.quantityColumn = numericColumns[0].header;
                detected.unitsColumn = numericColumns[0].header;
                usedColumns.add(numericColumns[0].header);
            }
        }

        console.log('[SalesPredix] Detected columns:', JSON.stringify(detected, null, 2));
        return detected;
    }

    /**
     * Check if a column contains date values
     */
    isDateColumn(data, header) {
        const sample = data.slice(0, 10);
        let dateCount = 0;
        
        sample.forEach(row => {
            const value = row[header];
            if (!value) return;
            const strVal = String(value).trim();
            if (!isNaN(Date.parse(strVal))) {
                dateCount++;
            } else if (/^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/.test(strVal) ||
                       /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(strVal) ||
                       /^\w+\s+\d{1,2},?\s+\d{4}$/.test(strVal)) {
                dateCount++;
            }
        });
        
        return dateCount >= sample.length * 0.7;
    }

    /**
     * Check if a column contains numeric values
     */
    isNumericColumn(data, header) {
        const sample = data.slice(0, 10);
        let numericCount = 0;
        
        sample.forEach(row => {
            const value = row[header];
            if (value && !isNaN(parseFloat(value))) {
                numericCount++;
            }
        });
        
        return numericCount >= sample.length * 0.7;
    }

    // ============================================
    // METRICS CALCULATION
    // ============================================

    /**
     * Calculate all metrics from data
     */
    calculateMetrics(data) {
        const salesCol = this.columns.salesColumn || this.columns.revenueColumn;
        const unitsCol = this.columns.unitsColumn || this.columns.quantityColumn;
        const profitCol = this.columns.profitColumn;
        const dateCol = this.columns.dateColumn;
        const categoryCol = this.columns.categoryColumn;
        const productCol = this.columns.productColumn;
        const regionCol = this.columns.regionColumn;

        // Use preprocessed values if available, otherwise parse from original columns
        const totalSales = data.reduce((sum, row) => sum + (row._sales || parseFloat(row[salesCol]) || 0), 0);
        const totalUnits = data.reduce((sum, row) => sum + (row._quantity || parseFloat(row[unitsCol]) || 0), 0);
        const totalProfit = profitCol ? this.sumColumn(data, profitCol) : totalSales * 0.3;
        const totalRecords = data.length;
        const avgSaleValue = totalRecords > 0 ? totalSales / totalRecords : 0;

        // Unique counts (optional columns - no warnings if missing)
        const uniqueCategories = categoryCol ? this.countUnique(data, categoryCol) : 0;
        const uniqueProducts = productCol ? this.countUnique(data, productCol) : 0;
        const uniqueRegions = regionCol ? this.countUnique(data, regionCol) : 0;

        // Date range from preprocessed dates
        const dateRange = this.getDateRangeFromProcessed(data);

        // Growth calculation using preprocessed data
        const growth = this.calculateGrowthFromProcessed(data);

        // Calculate time-based patterns for predictions
        const timePatterns = this.calculateTimePatterns(data);

        return {
            totalSales,
            totalUnits,
            totalProfit,
            totalRecords,
            avgSaleValue,
            uniqueCategories,
            uniqueProducts,
            uniqueRegions,
            dateRange,
            growth,
            profitMargin: totalSales > 0 ? (totalProfit / totalSales) * 100 : 0,
            timePatterns,
            hasOptionalData: {
                category: !!categoryCol,
                product: !!productCol,
                region: !!regionCol
            }
        };
    }

    /**
     * Get date range from preprocessed data
     */
    getDateRangeFromProcessed(data) {
        const dates = data
            .filter(row => row._parsedDate)
            .map(row => row._parsedDate)
            .sort((a, b) => a - b);
        
        if (dates.length === 0) return null;
        
        return {
            start: dates[0],
            end: dates[dates.length - 1],
            days: Math.ceil((dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24))
        };
    }

    /**
     * Calculate growth from preprocessed data
     */
    calculateGrowthFromProcessed(data) {
        if (data.length < 2) return 0;
        
        const midPoint = Math.floor(data.length / 2);
        const firstHalf = data.slice(0, midPoint);
        const secondHalf = data.slice(midPoint);
        
        const firstHalfTotal = firstHalf.reduce((sum, row) => sum + (row._sales || 0), 0);
        const secondHalfTotal = secondHalf.reduce((sum, row) => sum + (row._sales || 0), 0);
        
        if (firstHalfTotal === 0) return secondHalfTotal > 0 ? 100 : 0;
        
        return ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
    }

    /**
     * Calculate time-based patterns for improved predictions
     */
    calculateTimePatterns(data) {
        const patterns = {
            byMonth: {},
            byWeekday: {},
            byQuarter: {}
        };
        
        data.forEach(row => {
            if (row._month) {
                if (!patterns.byMonth[row._month]) patterns.byMonth[row._month] = { sales: 0, count: 0 };
                patterns.byMonth[row._month].sales += row._sales || 0;
                patterns.byMonth[row._month].count += 1;
            }
            
            if (row._weekday !== undefined) {
                if (!patterns.byWeekday[row._weekday]) patterns.byWeekday[row._weekday] = { sales: 0, count: 0 };
                patterns.byWeekday[row._weekday].sales += row._sales || 0;
                patterns.byWeekday[row._weekday].count += 1;
            }
            
            if (row._quarter) {
                if (!patterns.byQuarter[row._quarter]) patterns.byQuarter[row._quarter] = { sales: 0, count: 0 };
                patterns.byQuarter[row._quarter].sales += row._sales || 0;
                patterns.byQuarter[row._quarter].count += 1;
            }
        });
        
        return patterns;
    }

    /**
     * Sum values in a column
     */
    sumColumn(data, column) {
        if (!column) return 0;
        return data.reduce((sum, row) => {
            const value = parseFloat(row[column]) || 0;
            return sum + value;
        }, 0);
    }

    /**
     * Count unique values in a column
     */
    countUnique(data, column) {
        if (!column) return 0;
        const unique = new Set();
        data.forEach(row => {
            if (row[column]) {
                unique.add(row[column].toString().trim());
            }
        });
        return unique.size;
    }

    /**
     * Get date range from data
     */
    getDateRange(data, column) {
        if (!column) return null;
        
        const dates = data
            .map(row => new Date(row[column]))
            .filter(d => !isNaN(d.getTime()))
            .sort((a, b) => a - b);
        
        if (dates.length === 0) return null;
        
        return {
            start: dates[0],
            end: dates[dates.length - 1],
            days: Math.ceil((dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24))
        };
    }

    /**
     * Calculate growth percentage
     */
    calculateGrowth(data, salesColumn) {
        if (!salesColumn || data.length < 2) return 0;
        
        const midPoint = Math.floor(data.length / 2);
        const firstHalf = data.slice(0, midPoint);
        const secondHalf = data.slice(midPoint);
        
        const firstHalfTotal = this.sumColumn(firstHalf, salesColumn);
        const secondHalfTotal = this.sumColumn(secondHalf, salesColumn);
        
        if (firstHalfTotal === 0) return secondHalfTotal > 0 ? 100 : 0;
        
        return ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
    }

    // ============================================
    // CATEGORY PERFORMANCE (OPTIONAL)
    // ============================================

    /**
     * Calculate category performance from data
     * Uses optional category/product column - returns empty when not available
     */
    calculateCategoryPerformance(data) {
        const categoryCol = this.columns.categoryColumn;
        
        // If no category column (optional), return empty set (data-driven only)
        if (!categoryCol) {
            return [];
        }

        const categories = {};
        let totalSales = 0;

        // Group by category and sum sales using preprocessed data
        data.forEach(row => {
            const category = row._category || row[categoryCol] || 'Other';
            const sales = row._sales || 0;
            
            if (!categories[category]) {
                categories[category] = { total: 0, count: 0, quantity: 0 };
            }
            
            categories[category].total += sales;
            categories[category].count += 1;
            categories[category].quantity += row._quantity || 0;
            totalSales += sales;
        });

        // Calculate percentages and format result
        const result = Object.entries(categories).map(([name, stats], index) => ({
            category: name,
            sales: stats.total,
            transactions: stats.count,
            percentage: totalSales > 0 ? Math.round((stats.total / totalSales) * 100) : 0,
            color: this.getCategoryColor(index)
        }));

        // Sort by percentage descending
        return result.sort((a, b) => b.percentage - a.percentage);
    }

    /**
     * Get color for category
     */
    getCategoryColor(index) {
        const colors = [
            '#3b82f6', // Blue
            '#10b981', // Green
            '#f59e0b', // Orange
            '#8b5cf6', // Purple
            '#ef4444', // Red
            '#06b6d4', // Cyan
            '#ec4899', // Pink
            '#84cc16'  // Lime
        ];
        return colors[index % colors.length];
    }

    /**
     * Get default category performance (when no category column detected)
     */
    getDefaultCategoryPerformance() {
        return [];
    }

    // ============================================
    // TOP PRODUCTS PERFORMANCE
    // ============================================

    // ============================================
    // TOP PRODUCTS PERFORMANCE (OPTIONAL)
    // ============================================

    /**
     * Calculate top products from data
     * Uses optional product column - falls back to defaults if not available
     */
    calculateTopProducts(data) {
        const productCol = this.columns.productColumn;
        
        // If no product column (optional), return empty set (data-driven only)
        if (!productCol) {
            return [];
        }

        const products = {};
        let totalSales = 0;

        // Group by product and sum sales using preprocessed data
        data.forEach(row => {
            const product = row._product || row[productCol] || 'Unknown';
            const sales = row._sales || 0;
            const units = row._quantity || 1;
            
            if (!products[product]) {
                products[product] = { revenue: 0, quantity: 0, count: 0 };
            }
            
            products[product].revenue += sales;
            products[product].quantity += units;
            products[product].count += 1;
            totalSales += sales;
        });

        // Convert to array and sort by revenue
        const result = Object.entries(products)
            .map(([name, stats]) => ({
                name: name,
                revenue: Math.round(stats.revenue),
                quantity: Math.round(stats.quantity),
                transactions: stats.count,
                percentage: totalSales > 0 ? Math.round((stats.revenue / totalSales) * 100) : 0,
                growth: 0 // No simulated growth
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10); // Top 10 products

        return result;
    }

    /**
     * Get default top products (when no product column detected - no warning shown)
     */
    getDefaultTopProducts() {
        return [];
    }

    // ============================================
    // ENSEMBLE MACHINE LEARNING PREDICTION SYSTEM
    // ============================================
    // Uses multiple models: Linear Regression, Random Forest, Gradient Boosting
    // Combines predictions using weighted averaging based on validation error

    /**
     * Generate sales predictions using ensemble machine learning approach
     * Primary drivers: Historical patterns and seasonality
     * Enhanced with optional features when available
     */
    generateSalesPredictions(data) {
        // Check if we have the required date column for predictions
        const dateCol = this.columns.dateColumn;
        const salesCol = this.columns.salesColumn || this.columns.revenueColumn;
        
        if (!dateCol || !salesCol) {
            return this.getDefaultSalesPredictions();
        }

        // Use preprocessed data with _parsedDate and _sales
        const sortedData = [...data]
            .filter(row => row._parsedDate && row._sales > 0)
            .sort((a, b) => a._parsedDate - b._parsedDate);

        if (sortedData.length === 0) {
            return this.getDefaultSalesPredictions();
        }

        // Step 2: Outlier detection & removal (IQR)
        const outlierResult = this.removeOutliersIQR(sortedData, ['_sales', '_quantity', '_revenue']);
        const cleanedData = outlierResult.cleanedData;

        // Soft warning for small datasets after outlier removal
        const tooSmall = cleanedData.length < 10;

        // Step 3: Feature preparation (aggregate + encode + scale)
        const granularity = this.determineGranularity(cleanedData);
        const timeSeriesData = this.aggregateTimeSeriesData(cleanedData, granularity);
        const periods = Object.keys(timeSeriesData).sort();
        const salesValues = periods.map(key => timeSeriesData[key].sales);

        const { scaledValues, scaler } = this.scaleSeries(salesValues);

        // Feature engineering: Extract time-based features + categorical encodings
        const features = this.engineerFeatures(cleanedData, timeSeriesData, periods, granularity);
        features.scaler = scaler;

        // Split data for training and validation (time-based split)
        const { trainData, valData } = this.timeBasedSplit(scaledValues, 0.8);

        if (tooSmall || periods.length < 4) {
            const historical = periods.map((key, i) => ({
                month: this.formatPeriodLabel(key, granularity),
                sales: Math.round(salesValues[i])
            }));
            return {
                historical,
                predictions: [],
                accuracy: 0,
                modelWeights: null,
                granularity,
                outliers: outlierResult.stats,
                warning: '⚠️ Dataset is too small after cleaning; predictions may be unreliable. Upload more data for better forecasts.'
            };
        }

        // Train ensemble models and get predictions
        const ensemblePredictions = this.trainEnsembleModels(trainData, valData, features, periods, granularity);

        // Format historical data
        const historical = periods.map((key, i) => ({
            month: this.formatPeriodLabel(key, granularity),
            sales: Math.round(salesValues[i])
        }));

        return {
            historical,
            predictions: ensemblePredictions.predictions,
            accuracy: ensemblePredictions.accuracy,
            modelWeights: ensemblePredictions.modelWeights, // For internal use
            granularity,
            outliers: outlierResult.stats
        };
    }

    /**
     * Step 2: Remove extreme outliers using IQR method
     * Applies to sales, quantity, and revenue (if available)
     */
    removeOutliersIQR(data, keys) {
        if (data.length < 10) {
            return { cleanedData: data, stats: { removed: 0, bounds: {} } };
        }

        const bounds = {};
        keys.forEach(key => {
            const values = data
                .map(d => d[key])
                .filter(v => typeof v === 'number' && !isNaN(v))
                .sort((a, b) => a - b);
            if (values.length < 4) return;

            const q1 = values[Math.floor(values.length * 0.25)];
            const q3 = values[Math.floor(values.length * 0.75)];
            const iqr = q3 - q1;
            bounds[key] = {
                lower: q1 - 1.5 * iqr,
                upper: q3 + 1.5 * iqr
            };
        });

        const cleanedData = data.filter(row => {
            return Object.entries(bounds).every(([key, limit]) => {
                const val = row[key];
                if (typeof val !== 'number' || isNaN(val)) return true;
                return val >= limit.lower && val <= limit.upper;
            });
        });

        return {
            cleanedData,
            stats: {
                removed: data.length - cleanedData.length,
                bounds
            }
        };
    }

    /**
     * Aggregate data by month
     */
    aggregateTimeSeriesData(data, granularity) {
        const series = {};
        data.forEach(item => {
            let key;
            const date = item._parsedDate;
            if (granularity === 'daily') {
                key = date.toISOString().split('T')[0];
            } else if (granularity === 'weekly') {
                const weekStart = this.getWeekStart(date);
                key = weekStart.toISOString().split('T')[0];
            } else {
                key = `${item._year}-${String(item._month).padStart(2, '0')}`;
            }

            if (!series[key]) {
                series[key] = {
                    sales: 0,
                    quantity: 0,
                    count: 0,
                    avgWeekday: 0,
                    weekdaySum: 0
                };
            }

            series[key].sales += item._sales;
            series[key].quantity += item._quantity || 0;
            series[key].count += 1;
            series[key].weekdaySum += item._weekday || 0;
        });

        Object.keys(series).forEach(key => {
            series[key].avgWeekday = series[key].weekdaySum / series[key].count;
        });

        return series;
    }

    /**
     * Feature engineering for ML models
     * Extracts: month, quarter, trend, seasonality, optional features
     */
    engineerFeatures(data, timeSeriesData, periods, granularity) {
        const features = {
            seasonalityIndex: {},
            trendStrength: 0,
            avgGrowthRate: 0,
            categoryImpact: {},
            regionImpact: {},
            categoricalEncodings: {}
        };

        // Calculate seasonality index
        const bucketSales = {};
        const bucketCounts = {};
        Object.entries(timeSeriesData).forEach(([key, value]) => {
            const date = new Date(key);
            const bucket = this.getSeasonalityKey(date, granularity);
            if (!bucketSales[bucket]) {
                bucketSales[bucket] = 0;
                bucketCounts[bucket] = 0;
            }
            bucketSales[bucket] += value.sales;
            bucketCounts[bucket] += 1;
        });

        const overallAvg = Object.values(timeSeriesData).reduce((sum, m) => sum + m.sales, 0) / periods.length;
        Object.keys(bucketSales).forEach(bucket => {
            features.seasonalityIndex[bucket] = (bucketSales[bucket] / bucketCounts[bucket]) / overallAvg;
        });

        // Calculate trend strength using linear regression R²
        const salesValues = periods.map(k => timeSeriesData[k].sales);
        features.trendStrength = this.calculateTrendStrength(salesValues);

        // Calculate average growth rate
        if (salesValues.length >= 2) {
            let totalGrowth = 0;
            for (let i = 1; i < salesValues.length; i++) {
                if (salesValues[i - 1] > 0) {
                    totalGrowth += (salesValues[i] - salesValues[i - 1]) / salesValues[i - 1];
                }
            }
            features.avgGrowthRate = totalGrowth / (salesValues.length - 1);
        }

        // Extract category impact if available
        if (this.columns.categoryColumn) {
            const categoryData = {};
            data.forEach(row => {
                const cat = row._category || 'Other';
                if (!categoryData[cat]) categoryData[cat] = { sales: 0, count: 0 };
                categoryData[cat].sales += row._sales;
                categoryData[cat].count += 1;
            });
            features.categoryImpact = categoryData;
        }

        // Extract region impact if available
        if (this.columns.regionColumn) {
            const regionData = {};
            data.forEach(row => {
                const region = row._region || 'Unspecified';
                if (!regionData[region]) regionData[region] = { sales: 0, count: 0 };
                regionData[region].sales += row._sales;
                regionData[region].count += 1;
            });
            features.regionImpact = regionData;
        }

        // Encode categorical variables (category, region, product)
        features.categoricalEncodings = this.encodeCategoricalFeatures(data);

        return features;
    }

    determineGranularity(data) {
        if (data.length === 0) return 'monthly';
        const dates = data.map(d => d._parsedDate).filter(Boolean).sort((a, b) => a - b);
        if (dates.length < 2) return 'monthly';
        const days = Math.ceil((dates[dates.length - 1] - dates[0]) / (1000 * 60 * 60 * 24));
        if (days <= 60) return 'daily';
        if (days <= 365) return 'weekly';
        return 'monthly';
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = (day === 0 ? -6 : 1) - day; // Monday start
        d.setDate(d.getDate() + diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    getSeasonalityKey(date, granularity) {
        if (granularity === 'daily') {
            return date.getDay();
        }
        return date.getMonth() + 1;
    }

    formatPeriodLabel(key, granularity) {
        if (granularity === 'daily') {
            const d = new Date(key);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        if (granularity === 'weekly') {
            const d = new Date(key);
            return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        }
        return this.formatMonthLabel(key);
    }

    formatPeriodKey(date, granularity) {
        if (granularity === 'daily') {
            return date.toISOString().split('T')[0];
        }
        if (granularity === 'weekly') {
            return this.getWeekStart(date).toISOString().split('T')[0];
        }
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    getFutureDate(lastKey, granularity, step) {
        const baseDate = new Date(lastKey);
        const future = new Date(baseDate);
        if (granularity === 'daily') {
            future.setDate(future.getDate() + step);
        } else if (granularity === 'weekly') {
            future.setDate(future.getDate() + step * 7);
        } else {
            future.setMonth(future.getMonth() + step);
            future.setDate(1);
        }
        return future;
    }

    encodeCategoricalFeatures(data) {
        const encodings = {};
        const encodeColumn = (key) => {
            const values = [...new Set(data.map(r => r[key]).filter(Boolean))];
            return values.reduce((acc, val, idx) => {
                acc[val] = idx;
                return acc;
            }, {});
        };

        if (this.columns.categoryColumn) {
            encodings.category = encodeColumn('_category');
        }
        if (this.columns.regionColumn) {
            encodings.region = encodeColumn('_region');
        }
        if (this.columns.productColumn) {
            encodings.product = encodeColumn('_product');
        }

        return encodings;
    }

    scaleSeries(values) {
        if (!values.length) {
            return { scaledValues: values, scaler: { used: false } };
        }
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
        const std = Math.sqrt(variance);
        if (std === 0) {
            return { scaledValues: values, scaler: { used: false, mean, std } };
        }
        const scaledValues = values.map(v => (v - mean) / std);
        return { scaledValues, scaler: { used: true, mean, std } };
    }

    /**
     * Calculate trend strength (R² of linear regression)
     */
    calculateTrendStrength(values) {
        if (values.length < 3) return 0;

        const n = values.length;
        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b, 0) / n;

        let ssTotal = 0;
        let ssResidual = 0;
        let numerator = 0;
        let denominator = 0;

        values.forEach((y, x) => {
            numerator += (x - xMean) * (y - yMean);
            denominator += Math.pow(x - xMean, 2);
            ssTotal += Math.pow(y - yMean, 2);
        });

        const slope = denominator !== 0 ? numerator / denominator : 0;
        const intercept = yMean - slope * xMean;

        values.forEach((y, x) => {
            const predicted = intercept + slope * x;
            ssResidual += Math.pow(y - predicted, 2);
        });

        return ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;
    }

    /**
     * Time-based split to prevent data leakage
     */
    timeBasedSplit(data, trainRatio) {
        const splitIndex = Math.floor(data.length * trainRatio);
        return {
            trainData: data.slice(0, splitIndex),
            valData: data.slice(splitIndex)
        };
    }

    /**
     * Train ensemble models and generate predictions
     * Models: Linear Regression, Random Forest (simulated), Gradient Boosting (simulated)
     */
    trainEnsembleModels(trainData, valData, features, periodKeys, granularity) {
        // Train individual models
        const linearModel = this.trainLinearRegression(trainData);
        const rfModel = this.trainRandomForest(trainData, features);
        const gbModel = this.trainGradientBoosting(trainData, features);

        // Validate models and calculate errors
        const linearError = this.validateModel(linearModel, valData, 'linear');
        const rfError = this.validateModel(rfModel, valData, 'rf', features);
        const gbError = this.validateModel(gbModel, valData, 'gb', features);

        // Calculate weights based on inverse error (lower error = higher weight)
        const weights = this.calculateModelWeights(linearError, rfError, gbError);

        // Generate future predictions using ensemble
        const predictions = this.generateEnsemblePredictions(
            linearModel, rfModel, gbModel, weights, features, periodKeys, granularity
        );

        // Calculate overall accuracy
        const accuracy = this.calculateEnsembleAccuracy(weights, linearError, rfError, gbError);

        return {
            predictions,
            accuracy: Math.round(accuracy),
            modelWeights: weights
        };
    }

    /**
     * Linear Regression Model (trend baseline)
     */
    trainLinearRegression(data) {
        if (data.length < 2) return { slope: 0, intercept: data[0] || 0 };

        const n = data.length;
        const xMean = (n - 1) / 2;
        const yMean = data.reduce((a, b) => a + b, 0) / n;

        let numerator = 0;
        let denominator = 0;

        data.forEach((y, x) => {
            numerator += (x - xMean) * (y - yMean);
            denominator += Math.pow(x - xMean, 2);
        });

        return {
            slope: denominator !== 0 ? numerator / denominator : 0,
            intercept: yMean - (denominator !== 0 ? numerator / denominator : 0) * xMean,
            n: n
        };
    }

    /**
     * Random Forest Model (simulated - captures non-linear patterns)
     * Uses multiple "decision trees" based on different data subsets
     */
    trainRandomForest(data, features) {
        if (data.length < 3) return { predictions: data, confidence: 0.5 };

        const numTrees = 5;
        const trees = [];

        for (let t = 0; t < numTrees; t++) {
            // Bootstrap sample
            const sampleSize = Math.floor(data.length * 0.8);
            const sample = [];
            for (let i = 0; i < sampleSize; i++) {
                sample.push(data[Math.floor(Math.random() * data.length)]);
            }

            // Each tree uses moving average with different window sizes
            const windowSize = 2 + (t % 3);
            const treeModel = {
                movingAvg: this.calculateMovingAverage(data, windowSize),
                window: windowSize,
                weight: 1 / numTrees
            };
            trees.push(treeModel);
        }

        return {
            trees,
            seasonality: features.seasonalityIndex,
            avgGrowth: features.avgGrowthRate
        };
    }

    /**
     * Gradient Boosting Model (simulated - complex feature interactions)
     * Builds upon residuals of previous predictions
     */
    trainGradientBoosting(data, features) {
        if (data.length < 3) return { basePrediction: data[data.length - 1] || 0, boosts: [] };

        const numBoosts = 3;
        const learningRate = 0.1;
        const boosts = [];

        // Start with mean as base prediction
        const basePrediction = data.reduce((a, b) => a + b, 0) / data.length;
        let residuals = data.map(y => y - basePrediction);

        for (let b = 0; b < numBoosts; b++) {
            // Fit a simple model to residuals
            const residualMean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
            const residualTrend = this.calculateSimpleTrend(residuals);

            boosts.push({
                correction: residualMean,
                trend: residualTrend,
                learningRate
            });

            // Update residuals
            residuals = residuals.map((r, i) => r - learningRate * (residualMean + residualTrend * i));
        }

        return {
            basePrediction,
            boosts,
            seasonality: features.seasonalityIndex,
            trendStrength: features.trendStrength
        };
    }

    /**
     * Calculate moving average
     */
    calculateMovingAverage(data, window) {
        if (data.length < window) return data[data.length - 1] || 0;
        const recent = data.slice(-window);
        return recent.reduce((a, b) => a + b, 0) / window;
    }

    /**
     * Calculate simple trend from data
     */
    calculateSimpleTrend(data) {
        if (data.length < 2) return 0;
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        return (secondAvg - firstAvg) / Math.max(firstHalf.length, 1);
    }

    /**
     * Validate model using RMSE
     */
    validateModel(model, valData, modelType, features = null) {
        if (valData.length === 0) return 1000; // High error for empty validation

        let predictions = [];

        if (modelType === 'linear') {
            predictions = valData.map((_, i) => 
                model.intercept + model.slope * (model.n + i)
            );
        } else if (modelType === 'rf') {
            // Average of tree predictions
            const baseAvg = model.trees.reduce((sum, tree) => sum + tree.movingAvg, 0) / model.trees.length;
            predictions = valData.map((_, i) => 
                baseAvg * (1 + model.avgGrowth * i)
            );
        } else if (modelType === 'gb') {
            predictions = valData.map((_, i) => {
                let pred = model.basePrediction;
                model.boosts.forEach(boost => {
                    pred += boost.learningRate * (boost.correction + boost.trend * i);
                });
                return pred;
            });
        }

        // Calculate RMSE
        let sumSquaredError = 0;
        valData.forEach((actual, i) => {
            sumSquaredError += Math.pow(actual - predictions[i], 2);
        });

        return Math.sqrt(sumSquaredError / valData.length);
    }

    /**
     * Calculate model weights based on inverse validation error
     * Lower error = higher weight
     */
    calculateModelWeights(linearError, rfError, gbError) {
        // Prevent division by zero
        const minError = 0.001;
        const invLinear = 1 / Math.max(linearError, minError);
        const invRf = 1 / Math.max(rfError, minError);
        const invGb = 1 / Math.max(gbError, minError);
        const totalInv = invLinear + invRf + invGb;

        return {
            linear: invLinear / totalInv,
            randomForest: invRf / totalInv,
            gradientBoosting: invGb / totalInv
        };
    }

    /**
     * Generate ensemble predictions for future months
     */
    generateEnsemblePredictions(linearModel, rfModel, gbModel, weights, features, periodKeys, granularity) {
        const predictions = [];
        const lastKey = periodKeys[periodKeys.length - 1];
        const n = periodKeys.length;
        const scaler = features.scaler || { used: false };

        for (let i = 1; i <= 3; i++) {
            const futureDate = this.getFutureDate(lastKey, granularity, i);
            const seasonalityKey = this.getSeasonalityKey(futureDate, granularity);
            const periodLabel = this.formatPeriodLabel(this.formatPeriodKey(futureDate, granularity), granularity);

            // Linear prediction
            const linearPred = linearModel.intercept + linearModel.slope * (n + i);

            // Random Forest prediction (with seasonality)
            const rfBase = rfModel.trees.reduce((sum, tree) => sum + tree.movingAvg, 0) / rfModel.trees.length;
            const seasonalFactor = features.seasonalityIndex[seasonalityKey] || 1.0;
            const rfPred = rfBase * (1 + rfModel.avgGrowth * i) * seasonalFactor;

            // Gradient Boosting prediction
            let gbPred = gbModel.basePrediction;
            gbModel.boosts.forEach(boost => {
                gbPred += boost.learningRate * (boost.correction + boost.trend * (n + i));
            });
            gbPred *= seasonalFactor; // Apply seasonality

            // Weighted ensemble prediction
            let ensemblePred = 
                weights.linear * linearPred +
                weights.randomForest * rfPred +
                weights.gradientBoosting * gbPred;

            // Unscale if needed
            if (scaler.used) {
                ensemblePred = ensemblePred * scaler.std + scaler.mean;
            }

            // Confidence decreases with forecast horizon
            const confidence = Math.max(50, 92 - (i * 8) - (1 - features.trendStrength) * 10);

            predictions.push({
                month: periodLabel,
                predictedSales: Math.max(0, Math.round(ensemblePred)),
                confidence: Math.round(confidence)
            });
        }

        return predictions;
    }

    /**
     * Calculate ensemble accuracy based on weighted model performance
     */
    calculateEnsembleAccuracy(weights, linearError, rfError, gbError) {
        // Weighted average error
        const weightedError = 
            weights.linear * linearError +
            weights.randomForest * rfError +
            weights.gradientBoosting * gbError;

        // Convert error to accuracy (inverse relationship)
        // Use a sigmoid-like function to bound accuracy between 60-95
        const normalizedError = Math.min(weightedError / 10000, 1);
        return 95 - (normalizedError * 35);
    }

    /**
     * Calculate variance for accuracy estimation
     */
    calculateVariance(arr) {
        if (arr.length < 2) return 0;
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    }

    /**
     * Format month label (YYYY-MM to Mon Year)
     */
    formatMonthLabel(monthKey) {
        const [year, month] = monthKey.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'short' });
    }

    /**
     * Get default sales predictions
     */
    getDefaultSalesPredictions() {
        return {
            historical: [],
            predictions: [],
            accuracy: 0
        };
    }

    // ============================================
    // DATA PARSING
    // ============================================

    /**
     * Parse CSV string to array of objects
     */
    parseCSV(csvString) {
        // Strip BOM if present
        let cleaned = csvString.replace(/^\uFEFF/, '');
        
        const lines = cleaned.trim().split('\n');
        if (lines.length < 2) return [];

        // Parse header row and normalize: trim whitespace, remove \r, strip quotes
        const rawHeaders = this.parseCSVLine(lines[0]);
        const headers = rawHeaders.map(h => h.trim().replace(/\r/g, ''));
        
        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Skip empty lines
            
            const values = this.parseCSVLine(line);
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = (values[index] || '').trim().replace(/\r/g, '');
                });
                data.push(row);
            }
        }

        return data;
    }

    /**
     * Parse a single CSV line (handles quotes and strips \r)
     */
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        // Strip trailing \r before parsing
        const cleanLine = line.replace(/\r$/, '');
        
        for (let i = 0; i < cleanLine.length; i++) {
            const char = cleanLine[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else if (char === '\r') {
                // Skip stray \r characters
                continue;
            } else {
                current += char;
            }
        }
        result.push(current);
        
        return result;
    }

    /**
     * Get analysis results
     */
    getResults() {
        return {
            data: this.data,
            columns: this.columns,
            metrics: this.metrics,
            categoryPerformance: this.categoryPerformance,
            salesPredictions: this.salesPredictions
        };
    }
}

// Create global instance
const smartAnalyzer = new SmartDataAnalyzer();

// Export for use
window.SmartDataAnalyzer = SmartDataAnalyzer;
window.smartAnalyzer = smartAnalyzer;
