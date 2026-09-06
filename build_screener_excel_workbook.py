import sqlite3
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

DB_PATH = "renewables_stocks.db"
OUTPUT_EXCEL = "indias_all_screener_listed_companies_with_renewables.xlsx"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

wb = openpyxl.Workbook()
wb.remove(wb.active)

# Styles
font_title = Font(name='Segoe UI', size=15, bold=True, color='FFFFFF')
font_subtitle = Font(name='Segoe UI', size=10, italic=True, color='E0E0E0')
font_header = Font(name='Segoe UI', size=10, bold=True, color='FFFFFF')
font_bold = Font(name='Segoe UI', size=9, bold=True)
font_regular = Font(name='Segoe UI', size=9)

border_thin = Border(
    left=Side(style='thin', color='D3D3D3'), right=Side(style='thin', color='D3D3D3'),
    top=Side(style='thin', color='D3D3D3'), bottom=Side(style='thin', color='D3D3D3')
)
border_header = Border(
    left=Side(style='thin', color='1F4E78'), right=Side(style='thin', color='1F4E78'),
    top=Side(style='medium', color='1F4E78'), bottom=Side(style='medium', color='1F4E78')
)

fill_large = PatternFill(start_color='1B365D', end_color='1B365D', fill_type='solid')
fill_mid = PatternFill(start_color='16817A', end_color='16817A', fill_type='solid')
fill_small = PatternFill(start_color='2D6A4F', end_color='2D6A4F', fill_type='solid')
fill_oem = PatternFill(start_color='B22222', end_color='B22222', fill_type='solid')
fill_all = PatternFill(start_color='2C3E50', end_color='2C3E50', fill_type='solid')

fill_zebra = PatternFill(start_color='F9FAFC', end_color='F9FAFC', fill_type='solid')
fill_white = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
fill_card = PatternFill(start_color='F0F4F8', end_color='F0F4F8', fill_type='solid')

headers = [
    "Company Name", "Ticker", "Cap Tier", "Sector", "Sub Segment", "CMP (₹)",
    "RE Share (%)", "Green MW", "Annual Clean Units (MU)", "Grid Tariff (₹)", "Solar Cost (₹)",
    "Unit Shield (₹)", "Annual Cost Shielded (₹ Cr)",
    "1Y Ret (%)", "3Y Ret (%)", "5Y Ret (%)", "6Y Ret (%)",
    "Sourcing Model & Targets"
]

def add_sheet_data(ws, title, subtitle, header_fill, query, params=()):
    ws.merge_cells("A1:R1")
    ws["A1"] = title
    ws["A1"].font = font_title
    ws["A1"].fill = header_fill
    ws["A1"].alignment = Alignment(horizontal='center', vertical='center')
    ws.row_dimensions[1].height = 32

    ws.merge_cells("A2:R2")
    ws["A2"] = subtitle
    ws["A2"].font = font_subtitle
    ws["A2"].fill = header_fill
    ws["A2"].alignment = Alignment(horizontal='center', vertical='center')
    ws.row_dimensions[2].height = 20

    ws.row_dimensions[4].height = 26
    for c_idx, h in enumerate(headers, 1):
        c = ws.cell(row=4, column=c_idx, value=h)
        c.font = font_header
        c.fill = header_fill
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        c.border = border_header

    cursor.execute(query, params)
    rows = cursor.fetchall()

    for r_idx, row in enumerate(rows, 5):
        ws.row_dimensions[r_idx].height = 20
        c_fill = fill_zebra if r_idx % 2 == 0 else fill_white
        for c_idx, val in enumerate(row, 1):
            cell = ws.cell(row=r_idx, column=c_idx, value=val)
            cell.font = font_regular
            cell.fill = c_fill
            cell.border = border_thin

            if c_idx in [1, 5, 18]:
                cell.alignment = Alignment(horizontal='left', vertical='center')
            elif c_idx in [2, 3, 4]:
                cell.alignment = Alignment(horizontal='center', vertical='center')
            else:
                cell.alignment = Alignment(horizontal='right', vertical='center')

            # Formatting
            if c_idx == 6:
                cell.number_format = '"₹"#,##0.00'
            elif c_idx == 7:
                cell.number_format = '0.0"%"'
            elif c_idx in [8, 9]:
                cell.number_format = '#,##0.0'
            elif c_idx in [10, 11, 12]:
                cell.number_format = '"₹"#,##0.00'
            elif c_idx == 13:
                cell.number_format = '"₹"#,##0.0" Cr"'
                cell.font = font_bold
            elif c_idx in [14, 15, 16, 17]:
                cell.number_format = '+0.0"%";-0.0"%";0.0"%"'
                if isinstance(val, (int, float)) and val > 100.0:
                    cell.font = font_bold

    # Totals row
    tot_row = len(rows) + 5
    ws.row_dimensions[tot_row].height = 24
    ws.cell(row=tot_row, column=1, value="TOTAL / AVERAGE").font = font_bold
    ws.cell(row=tot_row, column=1).fill = fill_card
    ws.cell(row=tot_row, column=1).border = border_header

    for c in range(2, 19):
        cell = ws.cell(row=tot_row, column=c)
        cell.fill = fill_card
        cell.border = border_header
        cell.font = font_bold

    ws.cell(row=tot_row, column=7, value=f"=AVERAGE(G5:G{tot_row-1})").number_format = '0.0"%"'
    ws.cell(row=tot_row, column=8, value=f"=SUM(H5:H{tot_row-1})").number_format = '#,##0.0'
    ws.cell(row=tot_row, column=9, value=f"=SUM(I5:I{tot_row-1})").number_format = '#,##0.0'
    ws.cell(row=tot_row, column=13, value=f"=SUM(M5:M{tot_row-1})").number_format = '"₹"#,##0.0" Cr"'

    for c_i in [14, 15, 16, 17]:
        col_let = get_column_letter(c_i)
        ws.cell(row=tot_row, column=c_i, value=f"=AVERAGE({col_let}5:{col_let}{tot_row-1})").number_format = '+0.0"%";-0.0"%";0.0"%"'

    widths = {'A': 26, 'B': 14, 'C': 13, 'D': 25, 'E': 26, 'F': 12, 'G': 12, 'H': 14, 'I': 16, 'J': 12, 'K': 12, 'L': 12, 'M': 20, 'N': 12, 'O': 12, 'P': 12, 'Q': 12, 'R': 38}
    for col_l, w in widths.items():
        ws.column_dimensions[col_l].width = w

base_query = '''
SELECT 
    name, ticker, cap_tier, sector, sub_segment, close_price,
    re_pct, re_mw, annual_mu, grid_tariff, solar_cost, unit_shield, annual_shield_cr,
    ret_1y, ret_3y, ret_5y, ret_6y, primary_model
FROM companies
'''

# 1. 2W & 3W OEMs
ws_oem = wb.create_sheet(title="2W & 3W OEMs")
add_sheet_data(
    ws_oem,
    "India Listed 2-Wheeler & 3-Wheeler OEMs: Renewable Energy Adoption & Multi-Year Returns",
    "TVS Motor, Bajaj Auto, Royal Enfield, Hero MotoCorp, Ola Electric, Atul Auto & Pure-Play EV OEMs",
    fill_oem,
    base_query + " WHERE sector = 'Automotive & 2W/3W' OR sub_segment LIKE '%2W%' OR sub_segment LIKE '%3W%' ORDER BY re_pct DESC"
)

# 2. Large Cap
ws_large = wb.create_sheet(title="Large Cap (Top 100)")
add_sheet_data(
    ws_large,
    "India Listed Large-Cap Companies: Renewable Energy Portfolio & Returns",
    "SEBI Top 100 Listed Corporates (Market Cap > ₹50,000 Crore)",
    fill_large,
    base_query + " WHERE cap_tier = 'Large Cap' ORDER BY annual_shield_cr DESC"
)

# 3. Mid Cap
ws_mid = wb.create_sheet(title="Mid Cap (101-250)")
add_sheet_data(
    ws_mid,
    "India Listed Mid-Cap Companies: Renewable Energy Portfolio & Returns",
    "SEBI 101-250 Listed Corporates (Market Cap ₹15,000 - ₹50,000 Crore)",
    fill_mid,
    base_query + " WHERE cap_tier = 'Mid Cap' ORDER BY annual_shield_cr DESC"
)

# 4. Small Cap
ws_small = wb.create_sheet(title="Small & Micro Cap (251+)")
add_sheet_data(
    ws_small,
    "India Listed Small & Micro-Cap Companies: Renewable Adoption & Returns",
    "SEBI 251+ Listed Corporates (Textiles, Auto Components, Ceramics, Solar IPPs)",
    fill_small,
    base_query + " WHERE cap_tier = 'Small Cap' ORDER BY annual_shield_cr DESC"
)

# 5. Master All 1005 Listed Companies
ws_all = wb.create_sheet(title="All 1005 Listed Companies")
add_sheet_data(
    ws_all,
    "Complete Screener.in Screen: All 1,005 Indian Listed Companies with Renewable Metrics",
    "Ingested from https://www.screener.in/screens/357649/all-listed-companies/ (Pages 1 to 40)",
    fill_all,
    base_query + " ORDER BY annual_shield_cr DESC"
)

wb.save(OUTPUT_EXCEL)
print(f"Master workbook saved successfully: {OUTPUT_EXCEL}")
conn.close()
