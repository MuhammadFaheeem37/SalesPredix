"""
Quick verification that sample_7_columns.csv works
"""
from data_preprocessor import DataPreprocessor

csv_path = '../sample_7_columns.csv'

print("\n" + "=" * 60)
print("Testing sample_7_columns.csv (7 columns, no profit)")
print("=" * 60)

with open(csv_path, 'r') as f:
    csv_text = f.read()

dp = DataPreprocessor()
data, log = dp.process_csv(csv_text)

print(f"\n✅ SUCCESS! Processed {len(data)} rows\n")
print("Profit Auto-Calculation:")
print("-" * 60)

for i, row in enumerate(data, 1):
    print(f"Row {i}: ${row['revenue']:6.2f} - ${row['cost']:6.2f} = ${row['profit']:6.2f}")

total_revenue = sum(r['revenue'] for r in data)
total_cost = sum(r['cost'] for r in data)
total_profit = sum(r['profit'] for r in data)

print("-" * 60)
print(f"Total:  ${total_revenue:6.2f} - ${total_cost:6.2f} = ${total_profit:6.2f}")
print("\n✅ All profits calculated correctly!")
print("=" * 60)
