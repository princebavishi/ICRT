import csv
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

data_2w_3w = [
    {
        "name": "TVS Motor Company Ltd",
        "ticker": "TVSMOTOR",
        "segment": "2W & 3W (ICE & EV)",
        "flagship_products": "Jupiter, Apache, Raider, iQube EV, TVS King 3W",
        "plants": "Hosur (TN), Mysuru (KA), Nalagarh (HP)",
        "re_pct": 97.1,
        "re_sources": "70.6% Wind, 8.1% Rooftop Solar, 7.6% Green PPA/IEX, 8.9% I-REC",
        "installed_mw": 28.5,
        "annual_mu": 106.8, # 384,355 GJ
        "grid_tariff": 8.60,
        "solar_cost": 3.80,
        "unit_shield": 4.80,
        "annual_shield_cr": 51.3,
        "ret_1y": 20.2, "ret_2y": 45.5, "ret_3y": 171.6, "ret_4y": 300.4, "ret_5y": 652.2, "ret_6y": 782.6,
        "strategy": "Pioneer in captive wind farms in TN + rooftop solar at Hosur/Mysuru. Net Zero Scope 1 & 2 by 2040."
    },
    {
        "name": "Eicher Motors Ltd (Royal Enfield)",
        "ticker": "EICHERMOT",
        "segment": "2W (Mid-Weight Premium)",
        "flagship_products": "Classic 350, Bullet, Hunter, Himalayan, Continental GT",
        "plants": "Vallam Vadagal, Oragadam, Thiruvottiyur (TN)",
        "re_pct": 92.0,
        "re_sources": "Onsite Solar PV + Long-term Group Captive Wind PPAs",
        "installed_mw": 14.5,
        "annual_mu": 68.0,
        "grid_tariff": 8.50,
        "solar_cost": 3.80,
        "unit_shield": 4.70,
        "annual_shield_cr": 32.0,
        "ret_1y": 8.9, "ret_2y": 51.8, "ret_3y": 121.4, "ret_4y": 107.8, "ret_5y": 173.5, "ret_6y": 246.4,
        "strategy": "Increased RE share from 84% (FY25) to 92% (FY26). Focus on green supply chain & water positivity."
    },
    {
        "name": "Bajaj Auto Ltd",
        "ticker": "BAJAJ-AUTO",
        "segment": "2W & 3W (World's #1 3W Maker)",
        "flagship_products": "Pulsar, Platina, Chetak EV; Bajaj RE, Maxima, Chetak 3W EV",
        "plants": "Waluj (Aurangabad), Chakan (Pune), Pantnagar (UK)",
        "re_pct": 28.5,
        "re_sources": "12 MW Captive Solar + Solar Concentrators + 45 MW Vendor Solar",
        "installed_mw": 12.0,
        "annual_mu": 48.0,
        "grid_tariff": 9.50,
        "solar_cost": 3.80,
        "unit_shield": 5.70,
        "annual_shield_cr": 27.4,
        "ret_1y": 37.3, "ret_2y": -3.5, "ret_3y": 135.4, "ret_4y": 237.9, "ret_5y": 211.0, "ret_6y": 313.7,
        "strategy": "12 MW onsite solar PV + solar concentrators for paint pre-treatment. Spearheaded 45 MW solar across 50 vendors."
    },
    {
        "name": "Hero MotoCorp Ltd",
        "ticker": "HEROMOTOCO",
        "segment": "2W (World's Largest 2W Maker)",
        "flagship_products": "Splendor, HF Deluxe, Glamour, Passion, Xpulse, Vida V1 EV",
        "plants": "Dharuhera, Gurugram (HR), Neemrana (RJ), Haridwar (UK), Halol (GJ), Chittoor (AP)",
        "re_pct": 34.0,
        "re_sources": "11.5 MWp Captive Solar + 2 MW Wheeled Solar + 31.8 MWp Pipeline",
        "installed_mw": 13.5,
        "annual_mu": 49.7,
        "grid_tariff": 8.70,
        "solar_cost": 3.80,
        "unit_shield": 4.90,
        "annual_shield_cr": 24.4,
        "ret_1y": -3.2, "ret_2y": -7.2, "ret_3y": 73.4, "ret_4y": 107.9, "ret_5y": 87.1, "ret_6y": 68.4,
        "strategy": "49.7 MU green power consumed in FY25. Neemrana Garden Factory powered by solar; Haridwar plant 90% carbon neutral."
    },
    {
        "name": "Mahindra & Mahindra (3W / Last Mile)",
        "ticker": "M&M",
        "segment": "3W & LCV (India's #1 EV 3W)",
        "flagship_products": "Mahindra Treo, Zor Grand, Alfa Electric Auto, E-Alfa Super",
        "plants": "Zaheerabad (TG), Haridwar (UK), Chakan (MH)",
        "re_pct": 45.0,
        "re_sources": "78 MW Group Captive Solar & Wind with Mahindra Susten",
        "installed_mw": 78.0,
        "annual_mu": 160.0,
        "grid_tariff": 8.90,
        "solar_cost": 3.80,
        "unit_shield": 5.10,
        "annual_shield_cr": 81.6, # Across automotive (~22 Cr for 3W/Last Mile)
        "ret_1y": -7.5, "ret_2y": 48.0, "ret_3y": 104.0, "ret_4y": 185.0, "ret_5y": 294.7, "ret_6y": 450.0,
        "strategy": "Dedicated EV 3-wheeler plant at Zaheerabad backed by solar PPAs. Committed to 100% RE by 2030 (EP100/RE100)."
    },
    {
        "name": "Ola Electric Mobility Ltd",
        "ticker": "OLAELEC",
        "segment": "2W Pure-Play EV",
        "flagship_products": "Ola S1 Pro, S1 Air, S1 X, Roadster Electric Motorcycles",
        "plants": "Ola Futurefactory, Pochampalli (TN)",
        "re_pct": 35.0,
        "re_sources": "Onsite Rooftop Solar PV + Ola Shakti Battery Energy Storage (BESS)",
        "installed_mw": 8.5,
        "annual_mu": 24.0,
        "grid_tariff": 8.40,
        "solar_cost": 3.80,
        "unit_shield": 4.60,
        "annual_shield_cr": 11.0,
        "ret_1y": -32.9, "ret_2y": -61.6, "ret_3y": -61.6, "ret_4y": -61.6, "ret_5y": -61.6, "ret_6y": -61.6,
        "strategy": "500-acre Futurefactory designed with extensive rooftop solar array; deploying BESS storage with 20 GWh pipeline."
    },
    {
        "name": "Atul Auto Ltd",
        "ticker": "ATULAUTO",
        "segment": "3W (Pure-Play ICE & EV)",
        "flagship_products": "Atul RIK, Atul Gem, Atul Elite, Atul Mobili EV",
        "plants": "Shapar (Rajkot), Ahmedabad (GJ)",
        "re_pct": 22.5,
        "re_sources": "600 kW Captive Wind Turbine + Rooftop Solar Arrays",
        "installed_mw": 1.2,
        "annual_mu": 2.8,
        "grid_tariff": 8.00,
        "solar_cost": 3.80,
        "unit_shield": 4.20,
        "annual_shield_cr": 1.18,
        "ret_1y": -1.6, "ret_2y": -26.8, "ret_3y": -22.4, "ret_4y": 148.5, "ret_5y": 117.1, "ret_6y": 175.4,
        "strategy": "Operates 600 kW captive wind turbine in Gujarat; subsidiary Atul Greentech solarizing EV battery pack testing."
    },
    {
        "name": "Wardwizard Innovations & Mobility",
        "ticker": "WARDINMOBI",
        "segment": "2W & 3W Pure-Play EV",
        "flagship_products": "Joy e-bike (Wolf, Mihos), Joy e-rik (Electric Passenger & Cargo 3W)",
        "plants": "Vadodara (GJ)",
        "re_pct": 35.0,
        "re_sources": "Rooftop Solar PV on Manufacturing & Assembly Sheds",
        "installed_mw": 1.2,
        "annual_mu": 1.6,
        "grid_tariff": 7.90,
        "solar_cost": 3.80,
        "unit_shield": 4.10,
        "annual_shield_cr": 0.66,
        "ret_1y": -8.5, "ret_2y": -24.0, "ret_3y": 15.0, "ret_4y": 42.0, "ret_5y": 185.0, "ret_6y": 240.0,
        "strategy": "EV ancillary cluster in Vadodara with rooftop solar covering body shop and cell assembly lines."
    }
]

# Write dedicated CSV
csv_file = "india_2w_3w_companies_renewables_details.csv"
fieldnames = list(data_2w_3w[0].keys())
try:
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data_2w_3w)
    print(f"Saved dedicated CSV: {csv_file}")
except PermissionError:
    alt_csv = "india_2w_3w_companies_renewables_details_v2.csv"
    with open(alt_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data_2w_3w)
    print(f"Saved dedicated CSV: {alt_csv}")

# Load Excel workbook and add 2W & 3W sheet
excel_path = "indias_listed_companies_sector_and_cap_renewables_returns.xlsx"
wb = openpyxl.load_workbook(excel_path)

sheet_title = "2W & 3W OEMs Renewables"
if sheet_title in wb.sheetnames:
    wb.remove(wb[sheet_title])

ws = wb.create_sheet(title=sheet_title, index=2) # Place right after Executive Summary & Sector view

font_title = Font(name='Segoe UI', size=15, bold=True, color='FFFFFF')
font_subtitle = Font(name='Segoe UI', size=10, italic=True, color='E0E0E0')
font_header = Font(name='Segoe UI', size=10, bold=True, color='FFFFFF')
font_bold = Font(name='Segoe UI', size=9, bold=True)
font_regular = Font(name='Segoe UI', size=9)

fill_2w_header = PatternFill(start_color='B22222', end_color='B22222', fill_type='solid') # Crimson Red
fill_zebra = PatternFill(start_color='FDF6F6', end_color='FDF6F6', fill_type='solid')
fill_white = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
fill_card = PatternFill(start_color='F0F4F8', end_color='F0F4F8', fill_type='solid')

border_thin = Border(
    left=Side(style='thin', color='D3D3D3'), right=Side(style='thin', color='D3D3D3'),
    top=Side(style='thin', color='D3D3D3'), bottom=Side(style='thin', color='D3D3D3')
)
border_header = Border(
    left=Side(style='thin', color='8B0000'), right=Side(style='thin', color='8B0000'),
    top=Side(style='medium', color='8B0000'), bottom=Side(style='medium', color='8B0000')
)

ws.merge_cells("A1:S1")
ws["A1"] = "India Listed 2-Wheeler (2W) & 3-Wheeler (3W) Manufacturing OEMs: Renewable Adoption & Energy Shield"
ws["A1"].font = font_title
ws["A1"].fill = fill_2w_header
ws["A1"].alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[1].height = 34

ws.merge_cells("A2:S2")
ws["A2"] = "Detailed BRSR ESG Metrics: Clean Electricity Mix, Captive Solar/Wind MW, Shielded Power Costs & Multi-Year Returns"
ws["A2"].font = font_subtitle
ws["A2"].fill = fill_2w_header
ws["A2"].alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[2].height = 20

headers_2w = [
    "Company Name", "Ticker", "Segment", "Key Products (2W / 3W)",
    "RE Share (%)", "Clean Energy Sources Breakdown", "Installed RE (MW)", "Annual Green MU",
    "Grid Tariff (₹/kWh)", "Solar Cost (₹/kWh)", "Unit Shield (₹/kWh)", "Annual Cost Shielded (₹ Cr)",
    "1Y Ret (%)", "2Y Ret (%)", "3Y Ret (%)", "4Y Ret (%)", "5Y Ret (%)", "6Y Ret (%)",
    "Key Facilities & Decarbonization Roadmap"
]

ws.row_dimensions[4].height = 28
for c_idx, h in enumerate(headers_2w, 1):
    c = ws.cell(row=4, column=c_idx, value=h)
    c.font = font_header
    c.fill = fill_2w_header
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = border_header

for r_idx, row_d in enumerate(data_2w_3w, 5):
    ws.row_dimensions[r_idx].height = 24
    c_fill = fill_zebra if r_idx % 2 == 0 else fill_white
    vals = [
        row_d["name"], row_d["ticker"], row_d["segment"], row_d["flagship_products"],
        row_d["re_pct"], row_d["re_sources"], row_d["installed_mw"], row_d["annual_mu"],
        row_d["grid_tariff"], row_d["solar_cost"], row_d["unit_shield"], row_d["annual_shield_cr"],
        row_d["ret_1y"], row_d["ret_2y"], row_d["ret_3y"], row_d["ret_4y"], row_d["ret_5y"], row_d["ret_6y"],
        row_d["strategy"]
    ]
    for col_idx, val in enumerate(vals, 1):
        cell = ws.cell(row=r_idx, column=col_idx, value=val)
        cell.font = font_regular
        cell.fill = c_fill
        cell.border = border_thin

        if col_idx in [1, 4, 6, 19]:
            cell.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
        elif col_idx in [2, 3]:
            cell.alignment = Alignment(horizontal='center', vertical='center')
        else:
            cell.alignment = Alignment(horizontal='right', vertical='center')

        # Formatting
        if col_idx == 5:
            cell.number_format = '0.0"%"'
            if val > 80.0:
                cell.font = font_bold
        elif col_idx in [7, 8]:
            cell.number_format = '#,##0.0'
        elif col_idx in [9, 10, 11]:
            cell.number_format = '"₹"#,##0.00'
        elif col_idx == 12:
            cell.number_format = '"₹"#,##0.0" Cr"'
            cell.font = font_bold
        elif col_idx in [13, 14, 15, 16, 17, 18]:
            cell.number_format = '+0.0"%";-0.0"%";0.0"%"'
            if isinstance(val, (int, float)) and val > 100.0:
                cell.font = font_bold

# Totals row
tot_row = len(data_2w_3w) + 5
ws.row_dimensions[tot_row].height = 24
ws.cell(row=tot_row, column=1, value="TOTAL / WEIGHTED AVERAGE").font = font_bold
ws.cell(row=tot_row, column=1).alignment = Alignment(horizontal='left', vertical='center')
ws.cell(row=tot_row, column=1).fill = fill_card
ws.cell(row=tot_row, column=1).border = border_header

for c in range(2, 20):
    cell = ws.cell(row=tot_row, column=c)
    cell.fill = fill_card
    cell.border = border_header
    cell.font = font_bold

ws.cell(row=tot_row, column=5, value=f"=AVERAGE(E5:E{tot_row-1})").number_format = '0.0"%"'
ws.cell(row=tot_row, column=7, value=f"=SUM(G5:G{tot_row-1})").number_format = '#,##0.0'
ws.cell(row=tot_row, column=8, value=f"=SUM(H5:H{tot_row-1})").number_format = '#,##0.0'
ws.cell(row=tot_row, column=12, value=f"=SUM(L5:L{tot_row-1})").number_format = '"₹"#,##0.0" Cr"'

for col_i in range(13, 19):
    col_let = get_column_letter(col_i)
    ws.cell(row=tot_row, column=col_i, value=f"=AVERAGE({col_let}5:{col_let}{tot_row-1})").number_format = '+0.0"%";-0.0"%";0.0"%"'

widths_2w = {
    'A': 25, 'B': 13, 'C': 20, 'D': 30,
    'E': 14, 'F': 34, 'G': 15, 'H': 16,
    'I': 14, 'J': 14, 'K': 14, 'L': 20,
    'M': 12, 'N': 12, 'O': 12, 'P': 12, 'Q': 12, 'R': 12,
    'S': 45
}
for col_l, w in widths_2w.items():
    ws.column_dimensions[col_l].width = w

output_path = "indias_listed_companies_with_2w_3w_and_returns.xlsx"
wb.save(output_path)
print(f"Updated Excel workbook saved at: {output_path}")
