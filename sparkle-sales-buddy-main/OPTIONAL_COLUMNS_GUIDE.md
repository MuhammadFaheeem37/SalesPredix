# Optional Columns Guide

## Overview

The Sparkle Sales Buddy system now supports **11 optional columns** for enhanced enterprise/ERP analytics. These columns are automatically recognized from various naming conventions and preserved through the data pipeline.

## Optional Columns List

| Standard Name | Purpose | Default Value |
|--------------|---------|---------------|
| `customer_type` | Customer segmentation | "Unknown" |
| `sales_rep` | Sales representative tracking | "Unknown" |
| `payment_method` | Payment type tracking | "Unknown" |
| `sales_channel` | Distribution channel analytics | "Unknown" |
| `discount` | Discount amount/rate | 0 |
| `unit_price` | Price per unit | null |
| `unit_cost` | Cost per unit | null |
| `gross_revenue` | Revenue before deductions | null |
| `net_revenue` | Revenue after deductions | null |
| `profit_margin` | Profit margin percentage | null |
| `tax` | Tax amount | null |

## Supported Column Name Variations

### 1. Customer Type
- `customer type`, `customer_type`, `customertype`
- `client type`, `client_type`
- `customer segment`, `customer_segment`
- `buyer type`, `buyer_type`

**Example values:** "Retail", "Wholesale", "Enterprise", "Consumer"

---

### 2. Sales Rep
- `sales rep`, `sales_rep`, `salesrep`
- `sales representative`, `sales_representative`
- `salesperson`, `sales person`
- `rep`, `representative`
- `agent`, `sales agent`, `sales_agent`

**Example values:** "John Smith", "Jane Doe", "Team A"

---

### 3. Payment Method
- `payment method`, `payment_method`, `paymentmethod`
- `payment type`, `payment_type`, `paymenttype`
- `payment`
- `pay method`, `pay_method`
- `payment mode`, `payment_mode`
- `pay type`, `pay_type`

**Example values:** "Credit Card", "Cash", "Wire Transfer", "PayPal"

---

### 4. Sales Channel
- `sales channel`, `sales_channel`, `saleschannel`
- `channel`
- `distribution channel`, `distribution_channel`
- `sales source`, `sales_source`
- `source`
- `channel type`, `channel_type`

**Example values:** "Online", "Direct", "Partner", "Retail Store"

---

### 5. Discount
- `discount`
- `discount amount`, `discount_amount`
- `discount rate`, `discount_rate`
- `rebate`, `rebate amount`, `rebate_amount`
- `coupon`, `promo`, `promotion`
- `markdown`

**Example values:** 10, 15.5, 20.00 (numeric)

---

### 6. Unit Price
- `unit price`, `unit_price`
- `unit sale price`, `unit_sale_price`
- `price per unit`
- `selling price`, `sell price`
- `unit selling price`
- `item price`, `item_price`
- `price_per_unit`

**Example values:** 99.99, 150.00, 25.50 (numeric)

---

### 7. Tax
- `tax`
- `tax amount`, `tax_amount`
- `vat`, `gst`, `iva`
- `sales tax`, `sales_tax`

**Example values:** 15.00, 7.5 (numeric)

---

### 8. Gross Revenue
- `gross sales`, `gross_sales`
- `gross revenue`, `gross_revenue`
- `gmv`, `g.m.v`

**Example values:** 1000.00 (numeric - before discounts)

---

### 9. Net Revenue
- `net revenue`, `net_revenue`
- `net sales`, `net_sales`
- `net amount`, `net_amount`

**Example values:** 850.00 (numeric - after discounts/deductions)

---

### 10. Profit Margin
- `profit margin`, `profit_margin`
- `margin percentage`, `margin_percentage`
- `gross margin`, `gross_margin`
- `gross_margin %`, `gross_margin_pct`
- `gm %`, `margin %`

**Example values:** 25.5, 40.0 (numeric percentage)

---

### 11. Unit Cost
- `unit cost`, `unit_cost`, `unitcost`
- (Note: Part of cost calculations)

**Example values:** 50.00, 75.25 (numeric)

---

## Usage Examples

### Example 1: ERP Export with Optional Columns
```csv
Sale_Date,Product_ID,Quantity_Sold,Sales_Amount,Product_Category,Region,Unit_Cost,Net_Earnings,Sales_Rep,Customer_Type,Payment_Method,Sales_Channel
2025-01-01,PROD-001,5,500,Electronics,North America,60,200,John Smith,Retail,Credit Card,Online
2025-01-02,PROD-002,3,300,Furniture,Europe,80,100,Jane Doe,Wholesale,Wire Transfer,Direct
```

### Example 2: Minimal Required + Some Optional
```csv
date,product,quantity,revenue,category,region,cost,profit,discount,channel
2025-01-01,Widget A,10,1000,Widgets,US,600,400,50,Online
2025-01-02,Widget B,8,800,Widgets,Canada,480,320,0,Retail Store
```

### Example 3: Full Enterprise Format
```csv
transaction_date,product_name,units_sold,sales_amount,product_line,territory,cogs,operating_profit,sales_rep,customer_type,discount,payment_method,sales_channel,unit_price
2025-01-01,Enterprise Solution,2,5000,Software,EMEA,2000,3000,Alice Johnson,Enterprise,250,Wire Transfer,Direct,2500
```

---

## Data Processing Behavior

### 1. Optional Column Defaults
When optional columns are **not provided** or have **empty values**:
- **String columns** (sales_rep, payment_method, sales_channel, customer_type): Default to `"Unknown"`
- **Numeric columns** (discount, unit_price, tax): Default to `0` or `null`

### 2. Optional Column Retention
- All optional columns are **preserved** during data preprocessing
- They appear in the cleaned output data
- They can be used in analytics and filtering

### 3. Validation
- Optional columns **never cause row rejection**
- Invalid values are replaced with defaults
- System continues processing with or without optional columns

---

## Benefits of Optional Columns

### 1. Enhanced Analytics
- **Sales rep performance tracking**
- **Customer segmentation** by type
- **Channel effectiveness** analysis
- **Payment method trends**

### 2. Financial Insights
- **Discount impact** on profitability
- **Unit economics** with unit_price and unit_cost
- **Tax reporting** capabilities
- **Gross vs. Net revenue** analysis

### 3. ERP/Enterprise Integration
- Compatible with SAP, Oracle, Microsoft Dynamics exports
- Handles mixed case and underscore naming conventions
- Flexible field mapping reduces data transformation needs

---

## Testing

Run the comprehensive test suite:
```bash
python test_comprehensive_mapping.py
```

Expected output:
```
✅ ALL TESTS PASSED!

Your system now recognizes:
  • All ERP/Enterprise column name formats
  • Mixed case (Sale_Date, Product_ID, etc.)
  • 8 required columns with 100+ variations
  • 10+ optional columns for enhanced analytics
```

---

## Technical Implementation

### Backend (Python)
- **File:** `backend/data_preprocessor.py`
- **Mapping:** `COLUMN_MAPPINGS` dictionary (lines 39-350+)
- **Preservation:** `clean_row()` method (lines 750-780)
- **Optional list:** `OPTIONAL_COLUMNS` constant (lines 24-36)

### Frontend (JavaScript)
- **File:** `vanilla-app/js/utils.js`
- **Mapping:** `columnMappings` object (lines 23-320)
- **Preservation:** `cleanRow()` method (lines 425-550)
- **Optional list:** `optionalColumns` array (line 20)

---

## Summary

✅ **11 optional columns** supported  
✅ **50+ column name variations** recognized  
✅ **Automatic default values** for missing data  
✅ **ERP/Enterprise compatibility** built-in  
✅ **Zero configuration** required

Your Sparkle Sales Buddy system is now enterprise-ready! 🚀
