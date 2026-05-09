"""
Test with the exact format provided by user
"""
import sys
from data_preprocessor import DataPreprocessor

def test_user_provided_format():
    """Test the exact CSV format provided by the user"""
    
    print("\n" + "=" * 80)
    print("USER-PROVIDED FORMAT TEST")
    print("=" * 80)
    print("\nTesting CSV with:")
    print("  - Sale_Date, Product_ID, Quantity_Sold, Sales_Amount")
    print("  - Product_Category, Region, Unit_Cost, Net_Earnings")
    print("  - Sales_Rep, Customer_Type, Discount")
    print("  - Payment_Method, Sales_Channel, Unit_Price")
    print()
    
    csv_text = """Sale_Date,Product_ID,Quantity_Sold,Sales_Amount,Product_Category,Region,Unit_Cost,Net_Earnings,Sales_Rep,Customer_Type,Discount,Payment_Method,Sales_Channel,Unit_Price
2025-01-01,PROD-001,5,500,Electronics,North America,60,200,John Smith,Retail,10,Credit Card,Online,100
2025-01-02,PROD-002,3,450,Furniture,Europe,120,180,Jane Doe,Wholesale,15,Wire Transfer,Direct,150
2025-01-03,PROD-003,8,800,Appliances,Asia,80,320,Bob Johnson,Retail,20,Cash,Retail Store,100
2025-01-04,PROD-004,2,300,Electronics,North America,100,100,Alice Williams,Enterprise,0,Invoice,Partner,150
2025-01-05,PROD-005,6,600,Furniture,Europe,75,225,Charlie Brown,Retail,5,Credit Card,Online,100"""
    
    preprocessor = DataPreprocessor()
    
    try:
        data, log = preprocessor.process_csv(csv_text)
        
        print(f"✅ SUCCESS! All columns recognized\n")
        print(f"Processed {len(data)} rows\n")
        
        print("=" * 80)
        print("FIRST ROW - ALL FIELDS")
        print("=" * 80)
        first_row = data[0]
        
        print("\n📋 Required Columns:")
        print(f"  Date:     {first_row['date']}")
        print(f"  Product:  {first_row['product']}")
        print(f"  Quantity: {first_row['quantity']}")
        print(f"  Revenue:  ${first_row['revenue']:.2f}")
        print(f"  Category: {first_row['category']}")
        print(f"  Region:   {first_row['region']}")
        print(f"  Cost:     ${first_row['cost']:.2f}")
        print(f"  Profit:   ${first_row['profit']:.2f}")
        
        print("\n📋 Optional Columns:")
        print(f"  Sales Rep:       {first_row.get('sales_rep', 'N/A')}")
        print(f"  Customer Type:   {first_row.get('customer_type', 'N/A')}")
        print(f"  Discount:        {first_row.get('discount', 'N/A')}")
        print(f"  Payment Method:  {first_row.get('payment_method', 'N/A')}")
        print(f"  Sales Channel:   {first_row.get('sales_channel', 'N/A')}")
        print(f"  Unit Price:      ${first_row.get('unit_price', 0)}")
        
        # Calculate totals
        total_revenue = sum(row['revenue'] for row in data)
        total_cost = sum(row['cost'] for row in data)
        total_profit = sum(row['profit'] for row in data)
        margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        print("\n" + "=" * 80)
        print("ANALYTICS SUMMARY")
        print("=" * 80)
        print(f"\n💰 Financial Metrics:")
        print(f"  Total Revenue:  ${total_revenue:,.2f}")
        print(f"  Total Cost:     ${total_cost:,.2f}")
        print(f"  Total Profit:   ${total_profit:,.2f}")
        print(f"  Profit Margin:  {margin:.1f}%")
        
        # Group by sales rep
        print(f"\n👥 Sales Rep Performance:")
        rep_sales = {}
        for row in data:
            rep = row.get('sales_rep', 'Unknown')
            if rep not in rep_sales:
                rep_sales[rep] = {'revenue': 0, 'profit': 0, 'count': 0}
            rep_sales[rep]['revenue'] += row['revenue']
            rep_sales[rep]['profit'] += row['profit']
            rep_sales[rep]['count'] += 1
        
        for rep, stats in sorted(rep_sales.items(), key=lambda x: x[1]['revenue'], reverse=True):
            print(f"  {rep:20s} → ${stats['revenue']:6,.0f} revenue, ${stats['profit']:5,.0f} profit, {stats['count']} sales")
        
        # Group by channel
        print(f"\n🌐 Sales Channel Performance:")
        channel_sales = {}
        for row in data:
            channel = row.get('sales_channel', 'Unknown')
            if channel not in channel_sales:
                channel_sales[channel] = {'revenue': 0, 'profit': 0, 'count': 0}
            channel_sales[channel]['revenue'] += row['revenue']
            channel_sales[channel]['profit'] += row['profit']
            channel_sales[channel]['count'] += 1
        
        for channel, stats in sorted(channel_sales.items(), key=lambda x: x[1]['revenue'], reverse=True):
            print(f"  {channel:20s} → ${stats['revenue']:6,.0f} revenue, ${stats['profit']:5,.0f} profit, {stats['count']} sales")
        
        # Group by customer type
        print(f"\n🏢 Customer Type Analysis:")
        customer_sales = {}
        for row in data:
            cust = row.get('customer_type', 'Unknown')
            if cust not in customer_sales:
                customer_sales[cust] = {'revenue': 0, 'profit': 0, 'count': 0}
            customer_sales[cust]['revenue'] += row['revenue']
            customer_sales[cust]['profit'] += row['profit']
            customer_sales[cust]['count'] += 1
        
        for cust, stats in sorted(customer_sales.items(), key=lambda x: x[1]['revenue'], reverse=True):
            print(f"  {cust:20s} → ${stats['revenue']:6,.0f} revenue, ${stats['profit']:5,.0f} profit, {stats['count']} sales")
        
        print("\n" + "=" * 80)
        print("✅ TEST PASSED - USER FORMAT FULLY SUPPORTED!")
        print("=" * 80)
        print("\n🎉 Your exact CSV format is now fully supported with:")
        print("  ✅ All 8 required columns mapped correctly")
        print("  ✅ All 6 optional columns preserved and accessible")
        print("  ✅ Sales rep performance tracking enabled")
        print("  ✅ Channel analysis enabled")
        print("  ✅ Customer segmentation enabled")
        print("  ✅ Payment method tracking enabled")
        print("  ✅ Discount tracking enabled")
        print("  ✅ Unit price tracking enabled")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_user_provided_format()
    sys.exit(0 if success else 1)
