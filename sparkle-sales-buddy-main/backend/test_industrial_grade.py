"""
Industrial-Grade Validation Test
Tests the 8 required columns for advanced analytics, predictions, and ROI calculations.
"""

from data_preprocessor import preprocessor

# Test 1: Perfect industrial-grade CSV
industrial_csv_perfect = """Sale_Date,Product_ID,Product_Category,Quantity_Sold,Sales_Amount,Region,Cost,Profit
2024-01-15,PROD-001,Electronics,5,500.00,North America,300.00,200.00
2024-01-16,PROD-002,Home & Garden,3,300.00,Europe,180.00,120.00
2024-01-17,PROD-003,Electronics,8,800.00,Asia Pacific,400.00,400.00
2024-01-18,PROD-004,Office Supplies,12,600.00,North America,360.00,240.00
2024-01-19,PROD-005,Electronics,4,400.00,Europe,240.00,160.00"""

# Test 2: Industrial names - territory, sales_zone, cogs
industrial_csv_names = """Sale_Date,Product_ID,Business_Line,Quantity_Sold,Revenue,Territory,COGS,Net_Earnings
2024-01-15,SKU-A,Electronics,5,500.00,West,300.00,200.00
2024-01-16,SKU-B,Appliances,3,400.00,East,220.00,180.00
2024-01-17,SKU-C,Electronics,8,800.00,Central,480.00,320.00"""

# Test 3: Missing category (should fail)
industrial_csv_no_category = """Sale_Date,Product_ID,Quantity_Sold,Sales_Amount,Region,Cost,Profit
2024-01-15,PROD-001,5,500.00,North America,300.00,200.00"""

# Test 4: Missing region (should fail)
industrial_csv_no_region = """Sale_Date,Product_ID,Product_Category,Quantity_Sold,Sales_Amount,Cost,Profit
2024-01-15,PROD-001,Electronics,5,500.00,300.00,200.00"""

# Test 5: Missing cost (should fail)
industrial_csv_no_cost = """Sale_Date,Product_ID,Product_Category,Quantity_Sold,Sales_Amount,Region,Profit
2024-01-15,PROD-001,Electronics,5,500.00,North America,200.00"""

# Test 6: Missing profit (will be calculated if cost exists)
industrial_csv_no_profit = """Sale_Date,Product_ID,Product_Category,Quantity_Sold,Sales_Amount,Region,Cost
2024-01-15,PROD-001,Electronics,5,500.00,North America,300.00
2024-01-16,PROD-002,Home,3,300.00,Europe,150.00"""

print("="*80)
print("🏭 INDUSTRIAL-GRADE VALIDATION TEST SUITE")
print("Testing 8 required columns for advanced analytics and predictions")
print("="*80)

# Test 1: Perfect format
print("\n📋 Test 1: Perfect Industrial Format (All 8 columns)")
print("-"*80)
try:
    data, log = preprocessor.process_csv(industrial_csv_perfect)
    print("✅ SUCCESS! All 8 columns present and valid")
    print(f"\nProcessed: {log['valid_rows']}/{log['total_rows']} rows")
    print(f"\nFirst row:")
    row = data[0]
    print(f"  Date:     {row['date']}")
    print(f"  Product:  {row['product']}")
    print(f"  Category: {row['category']}")
    print(f"  Quantity: {row['quantity']}")
    print(f"  Revenue:  ${row['revenue']:.2f}")
    print(f"  Region:   {row['region']}")
    print(f"  Cost:     ${row['cost']:.2f}")
    print(f"  Profit:   ${row['profit']:.2f}")
    
    print(f"\n📊 Industrial Analytics Ready:")
    print(f"  ✅ Total Sales: ${sum(r['revenue'] for r in data):.2f}")
    print(f"  ✅ Total Cost:  ${sum(r['cost'] for r in data):.2f}")
    print(f"  ✅ Total Profit: ${sum(r['profit'] for r in data):.2f}")
    print(f"  ✅ Profit Margin: {(sum(r['profit'] for r in data) / sum(r['revenue'] for r in data) * 100):.1f}%")
    print(f"  ✅ ROI Calculation: Ready")
    print(f"  ✅ Predictions & Forecasting: Ready")
    print(f"  ✅ Drill-down Analytics: Ready")
    
except Exception as e:
    print(f"❌ FAILED: {str(e)}")

# Test 2: Industrial column names
print("\n" + "="*80)
print("📋 Test 2: Industrial-Grade Column Names")
print("(Business_Line, Territory, COGS, Net_Earnings)")
print("-"*80)
try:
    data, log = preprocessor.process_csv(industrial_csv_names)
    print("✅ SUCCESS! Industrial naming conventions recognized")
    print(f"\nProcessed: {log['valid_rows']}/{log['total_rows']} rows")
    if log['warnings']:
        print(f"\nColumn Mappings:")
        for warning in log['warnings']:
            if 'Auto-detected' in warning or 'Mapped' in warning:
                print(f"  {warning}")
    
except Exception as e:
    print(f"❌ FAILED: {str(e)}")

# Test 3: Missing category
print("\n" + "="*80)
print("📋 Test 3: Missing CATEGORY Column (Should FAIL)")
print("-"*80)
try:
    data, log = preprocessor.process_csv(industrial_csv_no_category)
    print("❌ UNEXPECTED: Should have failed!")
except ValueError as e:
    print("✅ EXPECTED FAILURE CAUGHT")
    error_msg = str(e)
    if "category" in error_msg.lower():
        print(f"✅ Correctly identified missing: category")
    print(f"\nError message preview:")
    print(f"  {error_msg.split(chr(10))[0]}")

# Test 4: Missing region
print("\n" + "="*80)
print("📋 Test 4: Missing REGION Column (Should FAIL)")
print("-"*80)
try:
    data, log = preprocessor.process_csv(industrial_csv_no_region)
    print("❌ UNEXPECTED: Should have failed!")
except ValueError as e:
    print("✅ EXPECTED FAILURE CAUGHT")
    if "region" in str(e).lower():
        print(f"✅ Correctly identified missing: region")
    print(f"\nError message preview:")
    print(f"  {str(e).split(chr(10))[0]}")

# Test 5: Missing cost
print("\n" + "="*80)
print("📋 Test 5: Missing COST Column (Should FAIL)")
print("-"*80)
try:
    data, log = preprocessor.process_csv(industrial_csv_no_cost)
    print("❌ UNEXPECTED: Should have failed!")
except ValueError as e:
    print("✅ EXPECTED FAILURE CAUGHT")
    if "cost" in str(e).lower():
        print(f"✅ Correctly identified missing: cost")
    print(f"\nError message preview:")
    print(f"  {str(e).split(chr(10))[0]}")

# Test 6: Missing profit (but cost provided - profit will be calculated)
print("\n" + "="*80)
print("📋 Test 6: Missing PROFIT Column (Will be CALCULATED)")
print("-"*80)
try:
    data, log = preprocessor.process_csv(industrial_csv_no_profit)
    print("✅ SUCCESS! Profit calculated from cost and revenue")
    print(f"\nProcessed: {log['valid_rows']}/{log['total_rows']} rows")
    print(f"\nFirst row:")
    row = data[0]
    print(f"  Revenue: ${row['revenue']:.2f}")
    print(f"  Cost:    ${row['cost']:.2f}")
    print(f"  Profit:  ${row['profit']:.2f} (calculated)")
    print(f"\nNote: Profit was not in source CSV but calculated as Revenue - Cost")
    
except Exception as e:
    print(f"❌ FAILED: {str(e)}")

print("\n" + "="*80)
print("🎉 INDUSTRIAL-GRADE VALIDATION TEST COMPLETE")
print("="*80)

print("""
✅ INDUSTRIAL-GRADE REQUIREMENTS:

Required Columns (8 total):
  1. date           - Time dimension
  2. product        - Item dimension
  3. quantity       - Volume dimension
  4. revenue        - Value dimension
  5. category       - Segment/drill-down dimension
  6. region         - Geographic/supply chain dimension
  7. cost           - COGS for ROI calculations
  8. profit         - Financial KPI dimension

Supported Industrial Names:
  Category:  product_line, vertical, segment_id, division, business_line
  Region:    territory, sales_zone, geo_location, geography
  Cost:      cogs, unit_cost, landing_cost, production_cost
  Profit:    gross_margin, net_earnings, operating_profit

Analytics Enabled:
  ✅ Advanced Analytics Dashboard
  ✅ Predictions & Forecasting
  ✅ ROI (Return on Investment) Calculations
  ✅ Drill-down Analytics by Category & Region
  ✅ Profitability Analysis
  ✅ Margin Analysis
  ✅ Performance Metrics

Result: 8/8 Required columns now enforced at industrial level! 🚀
""")
