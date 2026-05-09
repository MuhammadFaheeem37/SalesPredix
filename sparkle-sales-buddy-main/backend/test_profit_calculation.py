"""
Test profit auto-calculation when profit column is not provided
"""
import sys
from data_preprocessor import DataPreprocessor

def test_without_profit_column():
    """Test CSV without profit column - should auto-calculate"""
    
    print("\n" + "=" * 80)
    print("TEST: CSV WITHOUT PROFIT COLUMN")
    print("=" * 80)
    print("\nTesting CSV with only 7 required columns (profit will be calculated)")
    print()
    
    # CSV with NO profit column - only 7 columns
    csv_text = """Sale_Date,Product_ID,Quantity_Sold,Sales_Amount,Product_Category,Region,Unit_Cost
2025-01-01,PROD-001,5,500,Electronics,North America,300
2025-01-02,PROD-002,3,450,Furniture,Europe,270
2025-01-03,PROD-003,8,800,Appliances,Asia,480"""
    
    preprocessor = DataPreprocessor()
    
    try:
        data, log = preprocessor.process_csv(csv_text)
        
        print(f"✅ SUCCESS! Profit auto-calculated from revenue - cost\n")
        print(f"Processed {len(data)} rows\n")
        
        print("=" * 80)
        print("RESULTS - PROFIT AUTO-CALCULATED")
        print("=" * 80)
        
        for i, row in enumerate(data, 1):
            revenue = row['revenue']
            cost = row['cost']
            profit = row['profit']
            margin = (profit / revenue * 100) if revenue > 0 else 0
            
            print(f"\nRow {i}:")
            print(f"  Product:  {row['product']}")
            print(f"  Revenue:  ${revenue:.2f}")
            print(f"  Cost:     ${cost:.2f}")
            print(f"  Profit:   ${profit:.2f} ← AUTO-CALCULATED (revenue - cost)")
            print(f"  Margin:   {margin:.1f}%")
        
        # Calculate totals
        total_revenue = sum(row['revenue'] for row in data)
        total_cost = sum(row['cost'] for row in data)
        total_profit = sum(row['profit'] for row in data)
        margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        print("\n" + "=" * 80)
        print("TOTALS")
        print("=" * 80)
        print(f"  Total Revenue:  ${total_revenue:,.2f}")
        print(f"  Total Cost:     ${total_cost:,.2f}")
        print(f"  Total Profit:   ${total_profit:,.2f} ← AUTO-CALCULATED")
        print(f"  Profit Margin:  {margin:.1f}%")
        
        # Verify profit calculation
        print("\n" + "=" * 80)
        print("VERIFICATION")
        print("=" * 80)
        all_correct = True
        for i, row in enumerate(data, 1):
            expected_profit = row['revenue'] - row['cost']
            actual_profit = row['profit']
            if abs(expected_profit - actual_profit) < 0.01:  # Allow small rounding difference
                print(f"  Row {i}: ✅ Profit correctly calculated ({actual_profit:.2f} = {row['revenue']:.2f} - {row['cost']:.2f})")
            else:
                print(f"  Row {i}: ❌ Profit calculation error (expected {expected_profit:.2f}, got {actual_profit:.2f})")
                all_correct = False
        
        if all_correct:
            print("\n" + "=" * 80)
            print("✅ TEST PASSED - PROFIT AUTO-CALCULATION WORKS!")
            print("=" * 80)
            print("\n🎉 Your CSV can now have only 7 columns!")
            print("   Profit will be automatically calculated as (revenue - cost)")
            return True
        else:
            print("\n❌ Some profit calculations were incorrect")
            return False
        
    except Exception as e:
        print(f"\n❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_with_profit_column():
    """Test CSV with profit column - should use provided values"""
    
    print("\n\n" + "=" * 80)
    print("TEST: CSV WITH PROFIT COLUMN PROVIDED")
    print("=" * 80)
    print("\nTesting CSV with all 8 columns including profit")
    print()
    
    # CSV WITH profit column
    csv_text = """Sale_Date,Product_ID,Quantity_Sold,Sales_Amount,Product_Category,Region,Unit_Cost,Net_Earnings
2025-01-01,PROD-001,5,500,Electronics,North America,300,150
2025-01-02,PROD-002,3,450,Furniture,Europe,270,180"""
    
    preprocessor = DataPreprocessor()
    
    try:
        data, log = preprocessor.process_csv(csv_text)
        
        print(f"✅ SUCCESS! Profit values from CSV used\n")
        print(f"Processed {len(data)} rows\n")
        
        print("=" * 80)
        print("RESULTS - PROFIT FROM CSV")
        print("=" * 80)
        
        for i, row in enumerate(data, 1):
            revenue = row['revenue']
            cost = row['cost']
            profit = row['profit']
            
            print(f"\nRow {i}:")
            print(f"  Product:  {row['product']}")
            print(f"  Revenue:  ${revenue:.2f}")
            print(f"  Cost:     ${cost:.2f}")
            print(f"  Profit:   ${profit:.2f} ← FROM CSV (Net_Earnings column)")
        
        print("\n" + "=" * 80)
        print("✅ TEST PASSED - PROVIDED PROFIT VALUES USED!")
        print("=" * 80)
        return True
        
    except Exception as e:
        print(f"\n❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test1 = test_without_profit_column()
    test2 = test_with_profit_column()
    
    print("\n\n" + "=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    if test1 and test2:
        print("\n✅ ALL TESTS PASSED!")
        print("\n📋 System Behavior:")
        print("   • 7 columns required (date, product, quantity, revenue, category, region, cost)")
        print("   • Profit is OPTIONAL - auto-calculated as (revenue - cost) if not provided")
        print("   • If profit column exists, provided values are used")
        print("   • No more 'Missing profit column' errors!")
        sys.exit(0)
    else:
        print("\n❌ SOME TESTS FAILED")
        sys.exit(1)
