"""
Test script to verify "solid" and "sold" are recognized as quantity columns
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from data_preprocessor import DataPreprocessor

def test_solid_column():
    """Test CSV with 'solid' as quantity column"""
    print("=" * 80)
    print("TEST: 'solid' Column Recognition")
    print("=" * 80)
    
    # CSV with "solid" instead of "quantity"
    csv_text = """order date,item,solid,sales,product_category,territory,cogs,net_earnings
2025-01-01,Product A,5,500,Electronics,North America,300,200
2025-01-02,Product B,10,1000,Furniture,Europe,600,400
2025-01-03,Product C,3,450,Electronics,Asia,250,200"""
    
    preprocessor = DataPreprocessor()
    
    try:
        data, log = preprocessor.process_csv(csv_text)
        
        print("\n✅ SUCCESS! 'solid' column recognized as 'quantity'")
        print(f"\nProcessed {len(data)} rows successfully")
        
        print("\nFirst row:")
        row = data[0]
        print(f"  Date:     {row['date']}")
        print(f"  Product:  {row['product']}")
        print(f"  Quantity: {row['quantity']} ← Mapped from 'solid'")
        print(f"  Revenue:  ${row['revenue']:.2f}")
        print(f"  Category: {row['category']}")
        print(f"  Region:   {row['region']}")
        print(f"  Cost:     ${row['cost']:.2f}")
        print(f"  Profit:   ${row['profit']:.2f}")
        
        print("\n✅ Test PASSED: 'solid' successfully mapped to 'quantity'")
        return True
        
    except Exception as e:
        print(f"\n❌ Test FAILED: {e}")
        return False

def test_sold_column():
    """Test CSV with 'sold' as quantity column"""
    print("\n" + "=" * 80)
    print("TEST: 'sold' Column Recognition")
    print("=" * 80)
    
    # CSV with "sold" instead of "quantity"
    csv_text = """sale_date,product_name,sold,amount,category,region,cost,profit
2025-01-01,Widget X,8,800,Hardware,South America,400,400
2025-01-02,Widget Y,12,1200,Software,Africa,500,700"""
    
    preprocessor = DataPreprocessor()
    
    try:
        data, log = preprocessor.process_csv(csv_text)
        
        print("\n✅ SUCCESS! 'sold' column recognized as 'quantity'")
        print(f"\nProcessed {len(data)} rows successfully")
        
        print("\nFirst row:")
        row = data[0]
        print(f"  Date:     {row['date']}")
        print(f"  Product:  {row['product']}")
        print(f"  Quantity: {row['quantity']} ← Mapped from 'sold'")
        print(f"  Revenue:  ${row['revenue']:.2f}")
        
        print("\n✅ Test PASSED: 'sold' successfully mapped to 'quantity'")
        return True
        
    except Exception as e:
        print(f"\n❌ Test FAILED: {e}")
        return False

def test_multiple_variations():
    """Test multiple quantity column variations"""
    print("\n" + "=" * 80)
    print("TEST: Multiple Quantity Column Variations")
    print("=" * 80)
    
    variations = [
        ("quantity", "Standard name"),
        ("qty", "Abbreviation"),
        ("units", "Units variation"),
        ("sold", "Sold variation"),
        ("solid", "Solid variation"),
        ("count", "Count variation"),
        ("volume", "Volume variation")
    ]
    
    print("\nTesting quantity column aliases:")
    passed = 0
    failed = 0
    
    for col_name, description in variations:
        csv_text = f"""date,product,{col_name},revenue,category,region,cost,profit
2025-01-01,Test Product,5,500,Test Category,Test Region,300,200"""
        
        preprocessor = DataPreprocessor()
        try:
            data, log = preprocessor.process_csv(csv_text)
            qty = data[0]['quantity']
            print(f"  ✅ '{col_name}' ({description}): Mapped successfully → quantity = {qty}")
            passed += 1
        except Exception as e:
            print(f"  ❌ '{col_name}' ({description}): Failed - {str(e)[:50]}...")
            failed += 1
    
    print(f"\n{'='*80}")
    print(f"Results: {passed} passed, {failed} failed")
    
    return failed == 0

if __name__ == "__main__":
    print("\n🧪 Testing Quantity Column Alias Recognition\n")
    
    test1 = test_solid_column()
    test2 = test_sold_column()
    test3 = test_multiple_variations()
    
    print("\n" + "=" * 80)
    print("FINAL RESULTS")
    print("=" * 80)
    
    if test1 and test2 and test3:
        print("✅ ALL TESTS PASSED!")
        print("\nThe system now recognizes these quantity column names:")
        print("  • quantity, qty")
        print("  • units, units_sold")
        print("  • sold, solid ← NEW")
        print("  • count, volume")
        print("  • And many more variations!")
    else:
        print("❌ SOME TESTS FAILED")
        if not test1:
            print("  • 'solid' column test failed")
        if not test2:
            print("  • 'sold' column test failed")
        if not test3:
            print("  • Multiple variations test failed")
