"""
Data Preprocessor Module
Handles CSV validation, cleaning, and preprocessing for sales data.
"""

import csv
import re
from datetime import datetime
from io import StringIO
from typing import List, Dict, Any, Optional, Tuple
import statistics
from difflib import SequenceMatcher


class DataPreprocessor:
    """
    Comprehensive data preprocessing for sales data.
    Handles column mapping, validation, null handling, and outlier detection.
    """
    
    # Only 4 columns are now essential; others are optional
    REQUIRED_COLUMNS = ['date', 'product', 'quantity', 'revenue']
    OPTIONAL_COLUMNS = [
        'category',
        'region',
        'cost',
        'profit',  # Calculated from revenue - cost if not provided
        'customer_type',
        'gross_revenue',
        'net_revenue',
        'profit_margin',
        'unit_price',
        'unit_cost',
        'tax',
        'discount',
        'sales_rep',
        'payment_method',
        'sales_channel',
    ]
    
    # Column name mappings (flexible naming support)
    COLUMN_MAPPINGS = {
        # Date variations
        'date': 'date',
        'order date': 'date',
        'order_date': 'date',
        'orderdate': 'date',
        'sale date': 'date',
        'sale_date': 'date',
        'saledate': 'date',
        'transaction date': 'date',
        'transaction_date': 'date',
        'transaction time': 'date',
        'transaction_time': 'date',
        'purchase date': 'date',
        'purchase_date': 'date',
        'posting date': 'date',
        'posting_date': 'date',
        'created_at': 'date',
        
        # Product variations
        'product': 'product',
        'product name': 'product',
        'product_name': 'product',
        'productname': 'product',
        'item': 'product',
        'item name': 'product',
        'item_name': 'product',
        'product_id': 'product',
        'productid': 'product',
        'material no': 'product',
        'material_no': 'product',
        'material number': 'product',
        'materialnumber': 'product',
        'sku': 'product',
        'goods': 'product',
        
        # Category variations (INDUSTRIAL: product_line, vertical, segment_id)
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
        'businessline': 'category',
        'type': 'category',
        'product type': 'category',
        'product_type': 'category',
        'class': 'category',
        'classification': 'category',
        'division': 'category',
        
        # Region variations (INDUSTRIAL: territory, sales_zone, geo_location)
        'region': 'region',
        'area': 'region',
        'location': 'region',
        'territory': 'region',
        'sales territory': 'region',
        'sales_territory': 'region',
        'salesterritory': 'region',
        'sales zone': 'region',
        'sales_zone': 'region',
        'saleszone': 'region',
        'geo location': 'region',
        'geo_location': 'region',
        'geolocation': 'region',
        'geography': 'region',
        'geographic': 'region',
        'market': 'region',
        'country': 'region',
        'state': 'region',
        'province': 'region',
        'city': 'region',
        'district': 'region',
        'zone': 'region',
        'subregion': 'region',
        'sub_region': 'region',
        
        # Quantity variations
        'quantity': 'quantity',
        'qty': 'quantity',
        'units': 'quantity',
        'units sold': 'quantity',
        'units_sold': 'quantity',
        'order quantity': 'quantity',
        'order_quantity': 'quantity',
        'quantity sold': 'quantity',
        'quantity_sold': 'quantity',
        'quantitysold': 'quantity',
        'quantity billed': 'quantity',
        'quantity_billed': 'quantity',
        'billed quantity': 'quantity',
        'billed_quantity': 'quantity',
        'qty sold': 'quantity',
        'qty_sold': 'quantity',
        'number of units': 'quantity',
        'count': 'quantity',
        'volume': 'quantity',
        'sold': 'quantity',
        'solid': 'quantity',
        
        # Revenue variations - EXPANDED for intelligent detection
        'revenue': 'revenue',
        'sales': 'revenue',
        'sale': 'revenue',
        'total sales': 'revenue',
        'total_sales': 'revenue',
        'totalsales': 'revenue',
        'sales amount': 'revenue',
        'sales_amount': 'revenue',
        'salesamount': 'revenue',
        'sale amount': 'revenue',
        'sale_amount': 'revenue',
        'saleamount': 'revenue',
        'sales value': 'revenue',
        'sales_value': 'revenue',
        'salesamountvalue': 'revenue',
        'amount': 'revenue',
        'total': 'revenue',
        'total amount': 'revenue',
        'total_amount': 'revenue',
        'totalamount': 'revenue',
        'price': 'revenue',
        'total price': 'revenue',
        'total_price': 'revenue',
        'totalprice': 'revenue',
        'income': 'revenue',
        'total income': 'revenue',
        'total_income': 'revenue',
        'earnings': 'revenue',
        'proceeds': 'revenue',
        'value': 'revenue',
        'order total': 'revenue',
        'order_total': 'revenue',
        'transaction amount': 'revenue',
        'transaction_amount': 'revenue',
        'sales_amount': 'revenue',
        'total_sales_amount': 'revenue',

        # Gross revenue variants
        'gross sales': 'gross_revenue',
        'gross_sales': 'gross_revenue',
        'gross revenue': 'gross_revenue',
        'gross_revenue': 'gross_revenue',
        'gmv': 'gross_revenue',
        'g.m.v': 'gross_revenue',

        # Net revenue variants
        'net revenue': 'net_revenue',
        'net_revenue': 'net_revenue',
        'net sales': 'net_revenue',
        'net_sales': 'net_revenue',
        'net amount': 'net_revenue',
        'net_amount': 'net_revenue',
        
        # Cost variations (INDUSTRIAL: cogs, unit_cost, landing_cost)
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
        'total costs': 'cost',
        'totalcost': 'cost',
        'expense': 'cost',
        'expenses': 'cost',
        'direct cost': 'cost',
        'direct_cost': 'cost',
        'production cost': 'cost',
        'production_cost': 'cost',
        'manufacturing cost': 'cost',
        'manufacturing_cost': 'cost',

        # Unit price variations (used to derive revenue)
        'unit price': 'unit_price',
        'unit_price': 'unit_price',
        'unit sale price': 'unit_price',
        'unit_sale_price': 'unit_price',
        'price per unit': 'unit_price',
        'selling price': 'unit_price',
        'sell price': 'unit_price',
        'unit selling price': 'unit_price',

        # Tax variations
        'tax': 'tax',
        'tax amount': 'tax',
        'tax_amount': 'tax',
        'vat': 'tax',
        'gst': 'tax',
        'iva': 'tax',
        'sales tax': 'tax',
        'sales_tax': 'tax',

        # Discount variations
        'discount': 'discount',
        'discount amount': 'discount',
        'discount_amount': 'discount',
        'rebate': 'discount',
        'rebate amount': 'discount',
        'rebate_amount': 'discount',
        'coupon': 'discount',
        'promo': 'discount',
        'promotion': 'discount',
        'markdown': 'discount',
        
        # Profit variations (INDUSTRIAL: gross_margin, net_earnings, operating_profit)
        'profit': 'profit',
        'net profit': 'profit',
        'net_profit': 'profit',
        'net earnings': 'profit',
        'net_earnings': 'profit',
        'earnings': 'profit',
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
        'margin percentage': 'profit',
        'margin_percentage': 'profit',
        'net income': 'profit',
        'net_income': 'profit',
        'bottom line': 'profit',
        
        # Customer Type variations (for customer segmentation)
        'customer type': 'customer_type',
        'customer_type': 'customer_type',
        'customertype': 'customer_type',
        'client type': 'customer_type',
        'client_type': 'client_type',
        'customer segment': 'customer_type',
        'customer_segment': 'customer_type',
        'buyer type': 'customer_type',
        'buyer_type': 'buyer_type',
        
        # Gross margin mappings
        'gross margin': 'gross_margin',
        'gross_margin': 'gross_margin',
        'gross_margin %': 'gross_margin',
        'gross_margin_pct': 'gross_margin',
        'gm %': 'gross_margin',
        'margin %': 'gross_margin',
        
        # Sales Rep variations (OPTIONAL - ERP/Enterprise support)
        'sales rep': 'sales_rep',
        'sales_rep': 'sales_rep',
        'salesrep': 'sales_rep',
        'sales representative': 'sales_rep',
        'sales_representative': 'sales_rep',
        'salesperson': 'sales_rep',
        'sales person': 'sales_rep',
        'rep': 'sales_rep',
        'representative': 'sales_rep',
        'agent': 'sales_rep',
        'sales agent': 'sales_rep',
        'sales_agent': 'sales_rep',
        
        # Payment Method variations (OPTIONAL - ERP/Enterprise support)
        'payment method': 'payment_method',
        'payment_method': 'payment_method',
        'paymentmethod': 'payment_method',
        'payment type': 'payment_method',
        'payment_type': 'payment_method',
        'paymenttype': 'payment_method',
        'payment': 'payment_method',
        'pay method': 'payment_method',
        'pay_method': 'payment_method',
        'payment mode': 'payment_method',
        'payment_mode': 'payment_method',
        'pay type': 'payment_method',
        'pay_type': 'payment_method',
        
        # Sales Channel variations (OPTIONAL - ERP/Enterprise support)
        'sales channel': 'sales_channel',
        'sales_channel': 'sales_channel',
        'saleschannel': 'sales_channel',
        'channel': 'sales_channel',
        'distribution channel': 'sales_channel',
        'distribution_channel': 'sales_channel',
        'distributiondownload': 'sales_channel',
        'sales source': 'sales_channel',
        'sales_source': 'sales_channel',
        'source': 'sales_channel',
        'channel type': 'sales_channel',
        'channel_type': 'sales_channel',
    }
    
    def __init__(self):
        self.reset_log()
    
    def reset_log(self):
        """Reset preprocessing log for new processing."""
        self.log = {
            'total_rows': 0,
            'valid_rows': 0,
            'null_removed': 0,
            'invalid_type_removed': 0,
            'outliers_removed': 0,
            'errors': [],
            'warnings': [],
        }

    def _best_fuzzy_match(self, header: str) -> Tuple[Optional[str], float]:
        """Return best fuzzy match among known columns using SequenceMatcher."""
        best_key = None
        best_score = 0.0
        for candidate in self.COLUMN_MAPPINGS.keys():
            score = SequenceMatcher(None, header, candidate).ratio()
            if score > best_score:
                best_score = score
                best_key = candidate
        return best_key, best_score
    
    def map_column_headers(self, headers: List[str]) -> Dict[str, str]:
        """
        Intelligently map column headers to standard names using:
        1. Exact match from COLUMN_MAPPINGS
        2. Special ERP/Business system handling (e.g., Product_Category → product)
        3. Keyword-based fuzzy matching for sales-related columns
        """
        mapped = {}
        unmapped = []
        
        # Define keyword groups for intelligent detection
        sales_keywords = ['sale', 'sales', 'revenue', 'amount', 'total', 'income', 'earnings', 'proceeds']
        date_keywords = ['date', 'day', 'time', 'when', 'order', 'transaction']
        product_keywords = ['product', 'item', 'sku', 'goods', 'merchandise']
        quantity_keywords = ['quantity', 'qty', 'units', 'count', 'number', 'volume']
        category_keywords = ['category', 'type', 'class', 'group', 'segment']
        region_keywords = ['region', 'area', 'location', 'territory', 'market', 'country', 'state', 'city', 'zone']
        cost_keywords = ['cost', 'expense', 'cogs', 'spend', 'expenditure']
        profit_keywords = ['profit', 'margin', 'gain', 'earnings']
        customer_keywords = ['customer', 'client', 'buyer']
        gross_keywords = ['gross', 'gmv']
        net_keywords = ['net']
        price_keywords = ['unit', 'price', 'selling']
        tax_keywords = ['tax', 'vat', 'gst', 'iva']
        discount_keywords = ['discount', 'rebate', 'coupon', 'promo', 'markdown']
        
        # Check if Product_Category exists without a Product column (ERP system pattern)
        has_product_category = any('product' in h.lower() and 'category' in h.lower() for h in headers)
        has_product_column = any(h.lower().strip() in ['product', 'product_name', 'product_id', 'item'] for h in headers)
        
        for header in headers:
            normalized = header.lower().strip().replace('-', '_').replace(' ', '_')
            original_normalized = header.lower().strip()
            
            # Special handling for ERP systems: Product_Category → product when no other product column
            if has_product_category and not has_product_column:
                if 'product' in original_normalized and 'category' in original_normalized:
                    mapped[header] = 'product'
                    self.log['warnings'].append(f"ERP Mode: Mapped '{header}' to product (primary identifier)")
                    continue
            
            # Try exact match first
            if original_normalized in self.COLUMN_MAPPINGS:
                mapped[header] = self.COLUMN_MAPPINGS[original_normalized]
                continue
            
            # Keyword-based fuzzy matching
            matched = False
            
            # Explicit gross revenue detection (SAP/GMV naming)
            if any(keyword in normalized for keyword in gross_keywords) and (
                'rev' in normalized or any(keyword in normalized for keyword in sales_keywords)
            ):
                mapped[header] = 'gross_revenue'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as gross_revenue column")

            # Explicit net revenue detection
            elif any(keyword in normalized for keyword in net_keywords) and (
                'rev' in normalized or any(keyword in normalized for keyword in sales_keywords)
            ):
                mapped[header] = 'net_revenue'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as net_revenue column")

            # Unit price detection
            elif 'price' in normalized and 'unit' in normalized:
                mapped[header] = 'unit_price'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as unit_price column")

            # Tax detection
            elif any(keyword in normalized for keyword in tax_keywords):
                mapped[header] = 'tax'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as tax column")

            # Discount detection
            elif any(keyword in normalized for keyword in discount_keywords):
                mapped[header] = 'discount'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as discount column")

            # Check for sales/revenue keywords
            elif any(keyword in normalized for keyword in sales_keywords):
                mapped[header] = 'revenue'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as revenue column")
            
            # Check for date keywords
            elif any(keyword in normalized for keyword in date_keywords):
                mapped[header] = 'date'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as date column")
            
            # Check for product keywords
            elif any(keyword in normalized for keyword in product_keywords):
                mapped[header] = 'product'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as product column")
            
            # Check for quantity keywords
            elif any(keyword in normalized for keyword in quantity_keywords):
                mapped[header] = 'quantity'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as quantity column")
            
            # Check for category keywords
            elif any(keyword in normalized for keyword in category_keywords):
                mapped[header] = 'category'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as category column")
            
            # Check for region keywords
            elif any(keyword in normalized for keyword in region_keywords):
                mapped[header] = 'region'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as region column")
            
            # Check for cost keywords
            elif any(keyword in normalized for keyword in cost_keywords):
                mapped[header] = 'cost'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as cost column")
            
            # Check for profit keywords
            elif any(keyword in normalized for keyword in profit_keywords):
                mapped[header] = 'profit'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as profit column")
            
            # Check for customer type keywords (new for ERP systems)
            elif any(keyword in normalized for keyword in customer_keywords) and 'type' in normalized:
                mapped[header] = 'customer_type'
                matched = True
                self.log['warnings'].append(f"Auto-detected '{header}' as customer_type column")
            
            # Fuzzy fallback
            if not matched:
                best_key, score = self._best_fuzzy_match(normalized)
                if best_key and score >= 0.82:
                    mapped[header] = self.COLUMN_MAPPINGS[best_key]
                    matched = True
                    self.log['warnings'].append(
                        f"Fuzzy-mapped '{header}' to {self.COLUMN_MAPPINGS[best_key]} (score {score:.2f})"
                    )

            if not matched:
                unmapped.append(header)
        
        if unmapped:
            self.log['warnings'].append(f"Ignored extra columns: {', '.join(unmapped)}")
        
        return mapped
    
    def validate_required_columns(self, mapped_headers: Dict[str, str]) -> bool:
        """
        Validate only 4 required columns exist (date, product, quantity, revenue).
        """
        mapped_values = set(mapped_headers.values())
        missing_columns = [col for col in self.REQUIRED_COLUMNS if col not in mapped_values]
        if missing_columns:
            raise ValueError(
                f"❌ Missing essential columns: {', '.join(missing_columns)}\n"
                f"\n📋 **ESSENTIAL COLUMNS REQUIRED:**\n"
                f"- date (or: order date, sale date, transaction date)\n"
                f"- product (or: product name, item, product description)\n"
                f"- quantity (or: qty, units, sold, number sold)\n"
                f"- revenue (or: sales, amount, total, price)\n"
                f"\n📌 **OPTIONAL (Not Required):**\n"
                f"- category, region, cost, profit\n"
                f"\n🚀 **Upload will succeed with just the 4 essential columns!**"
            )
        return True
    
    def parse_date(self, date_str: str) -> Optional[str]:
        """Parse date string to standard YYYY-MM-DD format."""
        if not date_str or not date_str.strip():
            return None
        
        clean_date = date_str.strip()
        
        # Date format patterns to try
        date_formats = [
            '%Y-%m-%d',      # 2024-01-15
            '%m/%d/%Y',      # 01/15/2024
            '%d/%m/%Y',      # 15/01/2024
            '%m-%d-%Y',      # 01-15-2024
            '%d-%m-%Y',      # 15-01-2024
            '%Y/%m/%d',      # 2024/01/15
            '%B %d, %Y',     # January 15, 2024
            '%b %d, %Y',     # Jan 15, 2024
            '%d %B %Y',      # 15 January 2024
            '%d %b %Y',      # 15 Jan 2024
            '%Y%m%d',        # 20240115
        ]
        
        for fmt in date_formats:
            try:
                parsed = datetime.strptime(clean_date, fmt)
                return parsed.strftime('%Y-%m-%d')
            except ValueError:
                continue
        
        # Try Python's general parsing as fallback
        try:
            # Handle various ISO formats
            parsed = datetime.fromisoformat(clean_date.replace('Z', '+00:00'))
            return parsed.strftime('%Y-%m-%d')
        except ValueError:
            pass
        
        return None
    
    def parse_number(self, value: Any, allow_negative: bool = False) -> Optional[float]:
        """Parse numeric value, removing currency symbols and commas."""
        if value is None or value == '':
            return None
        
        # Remove currency symbols and commas
        clean_value = re.sub(r'[$€£¥,\s]', '', str(value)).strip()
        
        if clean_value == '' or clean_value == '-':
            return None
        
        try:
            num = float(clean_value)
            if not allow_negative and num < 0:
                return None
            return num
        except ValueError:
            return None
    
    def calculate_stats(self, values: List[float]) -> Optional[Dict[str, float]]:
        """Calculate statistics for outlier detection using IQR method."""
        if not values:
            return None
        
        sorted_values = sorted(values)
        n = len(sorted_values)
        
        q1_index = int(n * 0.25)
        q3_index = int(n * 0.75)
        
        q1 = sorted_values[q1_index]
        q3 = sorted_values[q3_index]
        iqr = q3 - q1
        
        mean = statistics.mean(values)
        median = statistics.median(values)
        std_dev = statistics.stdev(values) if len(values) > 1 else 0
        
        return {
            'q1': q1,
            'q3': q3,
            'iqr': iqr,
            'lower_bound': q1 - 1.5 * iqr,
            'upper_bound': q3 + 1.5 * iqr,
            'mean': mean,
            'median': median,
            'std_dev': std_dev,
        }
    
    def is_outlier(self, value: float, stats: Optional[Dict[str, float]]) -> bool:
        """Check if value is an outlier using IQR method."""
        if stats is None:
            return False
        return value < stats['lower_bound'] or value > stats['upper_bound']
    
    def clean_row(self, row: Dict[str, str], header_map: Dict[str, str]) -> Optional[Dict[str, Any]]:
        """
        Clean and validate a single row.
        Handles missing optional columns gracefully.
        """
        cleaned = {}
        
        # Map values to standard column names
        for original_header, standard_name in header_map.items():
            cleaned[standard_name] = row.get(original_header, '')
        
        # Parse and validate date (or create default if missing)
        if 'date' in cleaned:
            parsed_date = self.parse_date(cleaned.get('date', ''))
            if not parsed_date:
                # Use current date if no valid date found
                parsed_date = datetime.now().strftime('%Y-%m-%d')
                self.log['warnings'].append('Using current date for row with missing date')
            cleaned['date'] = parsed_date
        else:
            # No date column at all - use current date
            cleaned['date'] = datetime.now().strftime('%Y-%m-%d')
        
        # Validate product name (or create placeholder if missing)
        if 'product' in cleaned:
            product = cleaned.get('product', '').strip()
            if not product:
                product = 'Unknown Product'
            cleaned['product'] = product
        else:
            cleaned['product'] = 'Unknown Product'
        
        # Parse and validate quantity (or default to 1 if missing)
        if 'quantity' in cleaned:
            quantity = self.parse_number(cleaned.get('quantity'))
            if quantity is None or quantity <= 0:
                quantity = 1  # Default to 1 unit
            cleaned['quantity'] = int(round(quantity))
        else:
            cleaned['quantity'] = 1
        
        # Parse financial fields
        revenue = self.parse_number(cleaned.get('revenue'))
        gross_revenue = self.parse_number(cleaned.get('gross_revenue')) if 'gross_revenue' in cleaned else None
        net_revenue = self.parse_number(cleaned.get('net_revenue')) if 'net_revenue' in cleaned else None
        unit_price = self.parse_number(cleaned.get('unit_price')) if 'unit_price' in cleaned else None
        unit_cost = self.parse_number(cleaned.get('unit_cost')) if 'unit_cost' in cleaned else None
        tax = self.parse_number(cleaned.get('tax'), allow_negative=True) if 'tax' in cleaned else None
        discount = self.parse_number(cleaned.get('discount'), allow_negative=True) if 'discount' in cleaned else None

        # Derive revenue when possible (Value dimension)
        base_revenue = revenue if revenue is not None else gross_revenue
        if base_revenue is None and net_revenue is not None:
            base_revenue = net_revenue
        if base_revenue is None and unit_price is not None:
            base_revenue = unit_price * cleaned['quantity']
            self.log['warnings'].append('Derived revenue from unit_price × quantity')

        if base_revenue is None or base_revenue < 0:
            self.log['null_removed'] += 1
            return None  # Skip row if no valid value dimension

        # Establish gross and net revenue values
        if gross_revenue is None:
            gross_revenue = base_revenue
        if net_revenue is None:
            net_revenue = gross_revenue
            if discount is not None:
                net_revenue -= abs(discount)
            if tax is not None:
                net_revenue += tax

        cleaned['gross_revenue'] = round(gross_revenue, 2)
        cleaned['net_revenue'] = round(net_revenue, 2)
        cleaned['revenue'] = round(net_revenue, 2)  # Persist net as canonical revenue
        cleaned['unit_price'] = unit_price
        cleaned['unit_cost'] = unit_cost
        cleaned['tax'] = tax
        cleaned['discount'] = discount

        # Parse or derive cost (optional)
        cost = self.parse_number(cleaned.get('cost')) if 'cost' in cleaned else None
        if cost is None and unit_cost is not None:
            cost = round(unit_cost * cleaned['quantity'], 2)
        cleaned['cost'] = cost

        # Parse or calculate profit (optional, auto-calculate if possible)
        profit = self.parse_number(cleaned.get('profit')) if 'profit' in cleaned else None
        if profit is None and cost is not None:
            profit = net_revenue - cost
            self.log['warnings'].append(f'Calculated profit from revenue - cost for row')
        cleaned['profit'] = round(profit, 2) if profit is not None else None
        
        # Profit margin calculation
        profit_margin = None
        gross_profit = None
        if unit_cost is not None and unit_price is not None:
            gross_profit = (unit_price - unit_cost) * cleaned['quantity']
            denominator = max(unit_price * cleaned['quantity'], 0.0001)
            profit_margin = (gross_profit / denominator) * 100
        
        cleaned['profit_margin'] = round(profit_margin, 2) if profit_margin is not None else None
        
        # Handle category (optional)
        category = cleaned.get('category', '').strip() if 'category' in cleaned else ''
        if not category:
            self.log['warnings'].append('Missing optional column: category')
        cleaned['category'] = category

        # Handle region (optional)
        region = cleaned.get('region', '').strip() if 'region' in cleaned else ''
        if not region:
            self.log['warnings'].append('Missing optional column: region')
        cleaned['region'] = region

        # Handle optional columns - preserve them if present (ERP/enterprise support)
        # Customer Type
        customer_type = cleaned.get('customer_type', '').strip() if 'customer_type' in cleaned else ''
        cleaned['customer_type'] = customer_type if customer_type else 'Unknown'

        # Sales Rep
        sales_rep = cleaned.get('sales_rep', '').strip() if 'sales_rep' in cleaned else ''
        cleaned['sales_rep'] = sales_rep if sales_rep else 'Unknown'

        # Payment Method
        payment_method = cleaned.get('payment_method', '').strip() if 'payment_method' in cleaned else ''
        cleaned['payment_method'] = payment_method if payment_method else 'Unknown'

        # Sales Channel
        sales_channel = cleaned.get('sales_channel', '').strip() if 'sales_channel' in cleaned else ''
        cleaned['sales_channel'] = sales_channel if sales_channel else 'Unknown'
        
        return cleaned
    
    def fill_missing_values(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Fill missing optional values using mean/median."""
        # Calculate cost ratio from valid values
        valid_costs = [d['cost'] for d in data if d['cost'] is not None]
        valid_revenues = [d['revenue'] for d in data if d['revenue'] > 0]
        
        cost_ratio = 0.6  # Default cost as 60% of revenue
        
        if valid_costs and valid_revenues:
            avg_cost = statistics.mean(valid_costs)
            avg_revenue = statistics.mean(valid_revenues)
            if avg_revenue > 0:
                cost_ratio = avg_cost / avg_revenue
        
        # Fill missing costs and calculate profit
        for row in data:
            if row.get('cost') is None:
                row['cost'] = round(row['revenue'] * cost_ratio, 2)
            
            # Calculate profit
            row['profit'] = round(row['revenue'] - row['cost'], 2)

            # Calculate profit margin (%) if missing
            if row.get('profit_margin') is None:
                if row['revenue'] != 0:
                    row['profit_margin'] = round((row['profit'] / row['revenue']) * 100, 2)
                else:
                    row['profit_margin'] = 0.0
        
        return data
    
    def remove_outliers(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove outliers using IQR method."""
        if len(data) < 10:
            self.log['warnings'].append('Skipped outlier detection: insufficient data (< 10 rows)')
            return data
        
        # Calculate stats for numeric columns
        quantity_stats = self.calculate_stats([d['quantity'] for d in data])
        revenue_stats = self.calculate_stats([d['revenue'] for d in data])
        cost_stats = self.calculate_stats([d['cost'] for d in data if d['cost'] is not None])
        
        filtered = []
        for row in data:
            quantity_outlier = self.is_outlier(row['quantity'], quantity_stats)
            revenue_outlier = self.is_outlier(row['revenue'], revenue_stats)
            cost_outlier = row['cost'] is not None and self.is_outlier(row['cost'], cost_stats)
            
            if quantity_outlier or revenue_outlier or cost_outlier:
                self.log['outliers_removed'] += 1
            else:
                filtered.append(row)
        
        return filtered
    
    def process_csv(self, csv_content: str) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
        """
        Main preprocessing function for CSV content.
        
        Returns:
            Tuple of (cleaned_data, log)
        """
        self.reset_log()
        
        # Parse CSV
        stream = StringIO(csv_content)
        reader = csv.DictReader(stream)
        
        # Get headers
        headers = reader.fieldnames
        if not headers:
            raise ValueError('CSV file is empty or has no headers')
        
        # Map headers
        header_map = self.map_column_headers(headers)
        
        # Validate required columns
        self.validate_required_columns(header_map)
        
        # Process rows
        raw_data = list(reader)
        self.log['total_rows'] = len(raw_data)
        
        if not raw_data:
            raise ValueError('CSV file has no data rows')
        
        # Clean and validate rows
        cleaned_data = []
        for row in raw_data:
            cleaned = self.clean_row(row, header_map)
            if cleaned:
                cleaned_data.append(cleaned)
        
        if not cleaned_data:
            raise ValueError(
                'No valid data found after preprocessing. '
                'Check your CSV format and ensure required columns '
                '(date, product, quantity, revenue) have valid values.'
            )
        
        # Fill missing optional values
        cleaned_data = self.fill_missing_values(cleaned_data)
        
        # Remove outliers
        cleaned_data = self.remove_outliers(cleaned_data)
        
        if not cleaned_data:
            raise ValueError(
                'No valid data found after preprocessing. '
                'All rows were removed due to null values or outliers.'
            )
        
        self.log['valid_rows'] = len(cleaned_data)
        
        return cleaned_data, self.log
    
    def get_summary(self) -> List[str]:
        """Get summary of preprocessing."""
        summary = [
            f"Total rows processed: {self.log['total_rows']}",
            f"Valid rows: {self.log['valid_rows']}",
        ]
        
        if self.log['null_removed'] > 0:
            summary.append(f"Rows removed (null/invalid values): {self.log['null_removed']}")
        if self.log['outliers_removed'] > 0:
            summary.append(f"Rows removed (outliers): {self.log['outliers_removed']}")
        if self.log['warnings']:
            summary.append(f"Warnings: {len(self.log['warnings'])}")
        
        return summary


# Global preprocessor instance
preprocessor = DataPreprocessor()
