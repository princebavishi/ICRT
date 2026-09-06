import csv
import openpyxl

wb = openpyxl.load_workbook('indias_listed_companies_renewables_by_market_cap.xlsx', data_only=True)

all_rows = []
fieldnames = [
    "Market Cap Segment",
    "Company Name",
    "Ticker",
    "Sector / Industry",
    "Installed / Contracted RE (MW)",
    "Solar / Wind / Green Tech Details",
    "RE Electricity Share (%)",
    "Annual Green Units (MU / MWh M)",
    "Avg. Grid Tariff (₹/kWh)",
    "Green Landed Cost (₹/kWh)",
    "Cost Shielded / Unit Saved (₹/kWh)",
    "Est. Annual Cost Shielded (₹ Crore)",
    "Primary Sourcing Model",
    "Key Targets / Commitments"
]

for sheet_name in ["Large Cap Companies", "Mid Cap Companies", "Small & Micro Cap Companies"]:
    ws = wb[sheet_name]
    cap_tag = sheet_name.replace(" Companies", "")
    for row in range(5, 25): # data rows
        row_vals = [ws.cell(row=row, column=col).value for col in range(1, 14)]
        if row_vals[0] is not None:
            record = [cap_tag] + row_vals
            all_rows.append(record)

with open('all_listed_companies_renewables_by_cap.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(fieldnames)
    writer.writerows(all_rows)

print(f"Exported {len(all_rows)} companies across Large, Mid, and Small caps to all_listed_companies_renewables_by_cap.csv")
