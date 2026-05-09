"""
Test sample CSV files with 'solid' and 'sold' columns
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from data_preprocessor import DataPreprocessor

def test_csv_file(filename, description):
    """Test a CSV file"""
    print(f"\n{'='*80}")
    print(f"Testing: {description}")
    print(f"File: {filename}")
    print('='*80)
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            csv_content = f.read()
        
        # Show original headers
        headers = csv_content.split('\n')[0]
        print(f"\nOriginal headers:\n  {headers}")
        
        # Process
        preprocessor = DataPreprocessor()
        data, log = preprocessor.process_csv(csv_content)
        
        print(f"\n✅ SUCCESS!")
        print(f"Processed: {log['valid_rows']}/{log['total_rows']} rows")
        
        # Show first row
        print("\nFirst row after mapping:")
        row = data[0]
        print(f"  date:     {row['date']}")
        print(f"  product:  {row['product']}")
        print(f"  quantity: {row['quantity']} ← Mapped successfully!")
        print(f"  revenue:  ${row['revenue']:.2f}")
        print(f"  category: {row['category']}")
        print(f"  region:   {row['region']}")
        print(f"  cost:     ${row['cost']:.2f}")
        print(f"  profit:   ${row['profit']:.2f}")
        
        # Show totals
        total_quantity = sum(row['quantity'] for row in data)
        total_revenue = sum(row['revenue'] for row in data)
        total_profit = sum(row['profit'] for row in data)
        
        print(f"\n📊 Summary:")
        print(f"  Total Quantity: {total_quantity} units")
        print(f"  Total Revenue:  ${total_revenue:,.2f}")
        print(f"  Total Profit:   ${total_profit:,.2f}")
        print(f"  Profit Margin:  {(total_profit/total_revenue*100):.1f}%")
        
        return True
        
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return False

if __name__ == "__main__":
    print("\n🧪 Testing Sample CSV Files with 'solid' and 'sold' Columns")
    
    test1 = test_csv_file(
        'sample_with_solid_column.csv',
        'CSV with "solid" as quantity column'
    )
    
    test2 = test_csv_file(
        'sample_with_sold_column.csv',
        'CSV with "sold" as quantity column'
    )
    
    print(f"\n{'='*80}")
    print("FINAL RESULTS")
    print('='*80)
    
    if test1 and test2:
        print("✅ ALL TESTS PASSED!")
        print("\nBoth 'solid' and 'sold' are now recognized as quantity columns.")
        print("\nYour system can now handle CSV files where quantity is named:")
        print("  • quantity (standard)")
        print("  • qty, units, count")
        print("  • sold, solid ← NEW")
        print("  • And many more variations!")
    else:
        print("❌ Some tests failed")
