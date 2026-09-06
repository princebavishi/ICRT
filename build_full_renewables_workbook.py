import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = openpyxl.Workbook()
# remove default sheet
wb.remove(wb.active)

# ---------------------------------------------------------
# Styles Definition
# ---------------------------------------------------------
font_title = Font(name='Segoe UI', size=16, bold=True, color='FFFFFF')
font_subtitle = Font(name='Segoe UI', size=11, italic=True, color='E0E0E0')
font_section = Font(name='Segoe UI', size=13, bold=True, color='1F4E78')
font_header = Font(name='Segoe UI', size=11, bold=True, color='FFFFFF')
font_bold = Font(name='Segoe UI', size=10, bold=True)
font_regular = Font(name='Segoe UI', size=10)
font_small = Font(name='Segoe UI', size=9, italic=True, color='555555')

border_thin = Border(
    left=Side(style='thin', color='D3D3D3'),
    right=Side(style='thin', color='D3D3D3'),
    top=Side(style='thin', color='D3D3D3'),
    bottom=Side(style='thin', color='D3D3D3')
)
border_header = Border(
    left=Side(style='thin', color='1F4E78'),
    right=Side(style='thin', color='1F4E78'),
    top=Side(style='medium', color='1F4E78'),
    bottom=Side(style='medium', color='1F4E78')
)

fill_summary_header = PatternFill(start_color='1F4E78', end_color='1F4E78', fill_type='solid')
fill_large_header = PatternFill(start_color='1B365D', end_color='1B365D', fill_type='solid')
fill_mid_header = PatternFill(start_color='16817A', end_color='16817A', fill_type='solid')
fill_small_header = PatternFill(start_color='2D6A4F', end_color='2D6A4F', fill_type='solid')
fill_macro_header = PatternFill(start_color='4A154B', end_color='4A154B', fill_type='solid')

fill_zebra = PatternFill(start_color='F9FAFC', end_color='F9FAFC', fill_type='solid')
fill_white = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
fill_highlight = PatternFill(start_color='E8F5E9', end_color='E8F5E9', fill_type='solid')
fill_card = PatternFill(start_color='F0F4F8', end_color='F0F4F8', fill_type='solid')

align_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
align_left = Alignment(horizontal='left', vertical='center', wrap_text=True)
align_right = Alignment(horizontal='right', vertical='center')

# ---------------------------------------------------------
# DATA DEFINITIONS
# ---------------------------------------------------------

large_cap_data = [
    ["UltraTech Cement Ltd", "ULTRACEMCO", "Cement & Materials", 1363.0, "1,021 MW Solar/Wind + 342 MW WHRS", 32.0, 3600.0, 8.20, 3.80, 4.40, 1584.0, "Group Captive Solar/Wind + WHRS", "85% Green by 2030, RE100 (100% by 2050)"],
    ["Reliance Industries Ltd", "RELIANCE", "Conglomerate / Energy & Telecom", 247.0, "247 MWp captive PV + Kutch/Jamnagar Hubs", 10.0, 1200.0, 7.80, 3.40, 4.40, 528.0, "Captive Mega-Hubs + 28k Tower Solar", "100 GW RE by 2030, Net Zero 2035"],
    ["Tata Steel Ltd", "TATASTEEL", "Steel & Metals", 1036.0, "451.5 MW Solar + 587 MW Wind (TPREL)", 16.0, 2100.0, 8.00, 3.90, 4.10, 861.0, "Group Captive PPA with TPREL", "50% Green by 2030, Net Zero 2045"],
    ["JSW Steel Ltd", "JSWSTEEL", "Steel & Metals", 782.0, "782 MW Solar & Wind (Vijayanagar/Salem)", 14.0, 1750.0, 7.90, 3.85, 4.05, 708.8, "Group Captive PPA with JSW Energy", "1,000 MW Phase 1 + 1,500 MW Ph 2, Net Zero 2050"],
    ["Infosys Ltd", "INFY", "IT & Software Services", 60.0, "60 MW onsite & offsite solar PV", 77.7, 285.0, 9.20, 3.50, 5.70, 162.5, "Campus Rooftop PV + Green Tariffs", "RE100 Signatory, 100% RE electricity target"],
    ["Bharti Airtel Ltd (Nxtra)", "BHARTIARTL", "Telecom & Data Centers", 120.0, "482.8k MWh PPA + 28,000 solar towers", 49.0, 483.0, 9.50, 4.20, 5.30, 256.0, "Open Access Solar/Wind + Distributed Rooftop", "RE100 (100% RE in Nxtra Data Centers by 2030)"],
    ["ITC Limited", "ITC", "FMCG, Paper, Hotels", 195.0, "177-205 MW Solar & Wind assets", 52.0, 420.0, 8.50, 3.75, 4.75, 199.5, "Offsite Solar/Wind + Biomass boilers", ">50% RE maintained; Sustainability 2.0"],
    ["Hindalco Industries Ltd", "HINDALCO", "Aluminium & Copper", 190.0, "190 MW operational (470 MW pipeline)", 8.0, 650.0, 7.50, 3.80, 3.70, 240.5, "RTC RE PPA with Greenko (Pumped Hydro)", "350 MW RTC RE for smelters, Net Zero 2050"],
    ["Tata Motors Ltd", "TATAMOTORS", "Automotive", 152.0, "131 MW Hybrid PPA + 21 MW Rooftop Solar", 51.0, 220.0, 8.80, 3.80, 5.00, 110.0, "Rooftop Solar on Pune/Sanand + TPREL Hybrid", "100% RE in manufacturing by 2030"],
    ["Larsen & Toubro Ltd", "LT", "Engineering & Construction", 65.0, "65 MW captive solar/wind at major yards", 38.0, 145.0, 8.40, 3.90, 4.50, 65.3, "Rooftop & Ground Mounted Solar (Hazira/Chennai)", "Water & Carbon Neutral by 2040"],
    ["Mahindra & Mahindra Ltd", "M&M", "Automotive & Tractors", 78.0, "78 MW Solar & Wind installations", 45.0, 160.0, 8.90, 3.80, 5.10, 81.6, "Group Captive Solar with Mahindra Susten", "100% RE by 2030 (EP100 & RE100)"],
    ["Wipro Ltd", "WIPRO", "IT & Software Services", 45.0, "Onsite solar + long-term Green PPAs", 68.0, 190.0, 9.10, 3.60, 5.50, 104.5, "PPA Open Access Solar + Campus Rooftop", "RE100, Net Zero GHG by 2040"],
    ["Grasim Industries Ltd", "GRASIM", "Chemicals & Textiles", 185.0, "185 MW Solar & Wind for VSF & Chemicals", 24.0, 450.0, 7.90, 3.80, 4.10, 184.5, "Group Captive Solar/Wind + Biomass", "50% RE by 2030"],
    ["Titan Company Ltd", "TITAN", "Consumer Lifestyle & Jewellery", 18.0, "18 MW solar plants in Tamil Nadu & Hosur", 72.0, 42.0, 8.70, 3.70, 5.00, 21.0, "Dedicated Solar Park + Rooftop Solar", "100% RE across manufacturing by 2027"],
    ["Asian Paints Ltd", "ASIANPAINT", "Paints & Chemicals", 42.0, "42 MW Solar & Wind installations", 61.0, 88.0, 8.60, 3.75, 4.85, 42.7, "Rooftop Solar on all 8 plants + Wind PPAs", "75% RE by 2028"],
    ["Sun Pharmaceutical Ltd", "SUNPHARMA", "Pharmaceuticals", 38.0, "38 MW Solar & Wind across plants", 35.0, 95.0, 8.50, 3.85, 4.65, 44.2, "Onsite Rooftop + Open Access Solar", "50% RE by 2030"],
    ["Tech Mahindra Ltd", "TECHM", "IT & Software Services", 25.0, "25 MW Rooftop Solar + Green PPA", 58.0, 72.0, 9.30, 3.60, 5.70, 41.0, "Green Tariffs + Campus Solar", "RE100, 100% RE by 2030"],
    ["HCL Technologies Ltd", "HCLTECH", "IT & Software Services", 32.0, "32 MW solar installations & PPA", 62.0, 110.0, 9.20, 3.65, 5.55, 61.1, "Campus Rooftop PV + Green Open Access", "RE100, Net Zero by 2040"],
    ["Adani Ports and SEZ Ltd", "ADANIPORTS", "Logistics & Ports", 65.0, "65 MW captive solar/wind at Mundra & ports", 39.0, 130.0, 8.00, 3.70, 4.30, 55.9, "Rooftop & Port Land Solar PV", "Carbon Neutral by 2025, 100% RE by 2030"],
    ["NTPC Ltd (Captive & Green)", "NTPC", "Power Utilities", 3500.0, "3,500 MW RE operational (60 GW by 2032)", 12.0, 4500.0, 6.50, 3.10, 3.40, 1530.0, "Utility Solar + Floating Solar at Reservoirs", "60 GW RE by 2032 (NTPC Green Energy)"]
]

mid_cap_data = [
    ["Shree Cement Ltd", "SHREECEM", "Cement", 666.5, "350 MW Solar/Wind + 274 MW WHRS", 58.0, 1950.0, 8.10, 3.60, 4.50, 877.5, "Captive Solar/Wind parks + WHRS integration", "Reach >65% Green Power by 2027"],
    ["Dalmia Bharat Ltd", "DALBHARAT", "Cement", 410.0, "136 MW Solar + Wind + WHRS", 47.0, 850.0, 8.00, 3.70, 4.30, 365.5, "RE100, Captive Solar + Open Access", "100% RE by 2030, Carbon Negative 2040"],
    ["The Ramco Cements Ltd", "RAMCOCEM", "Cement", 215.0, "165 MW Wind + 50 MW Solar & WHRS", 42.0, 480.0, 8.30, 3.75, 4.55, 218.4, "Captive Wind farms in TN + Rooftop Solar", "60% RE by 2030"],
    ["Tata Power Co Ltd", "TATAPOWER", "Power Utilities & Cleantech", 5500.0, "5,500 MW operational RE portfolio", 40.0, 7200.0, 7.80, 3.30, 4.50, 3240.0, "Utility RE + Group Captive Solar Developer", "100% Clean Energy by 2045"],
    ["JSW Energy Ltd", "JSWENERGY", "Power Utilities & RE", 3200.0, "3,200 MW operational RE (10 GW pipeline)", 45.0, 4800.0, 7.70, 3.25, 4.45, 2136.0, "Solar, Wind & Pumped Hydro Developer", "20 GW by 2030, 85% RE share"],
    ["Jindal Stainless Ltd", "JINDALSTEL", "Stainless Steel", 300.0, "100 MW Rooftop/Floating Solar + 200 MW Wind", 18.0, 650.0, 7.80, 3.80, 4.00, 260.0, "Captive Hybrid PPA with ReNew & Rooftop", "50% Carbon Reduction by 2035"],
    ["Bharat Forge Ltd", "BHARATFORG", "Auto Ancillary & Forging", 52.0, "52 MW Solar & Wind installations", 36.0, 135.0, 8.90, 3.80, 5.10, 68.9, "Group Captive Solar in Maharashtra", "Carbon Neutral by 2040"],
    ["Apollo Tyres Ltd", "APOLLOTYRE", "Auto Tyres", 48.0, "48 MW Solar & Biomass installations", 32.0, 120.0, 8.60, 3.75, 4.85, 58.2, "Open Access Solar in AP & Gujarat", "25% Carbon Intensity cut by 2026"],
    ["CEAT Ltd", "CEATLTD", "Auto Tyres", 38.0, "38 MW Solar installations (Halol & Nagpur)", 34.0, 95.0, 8.70, 3.80, 4.90, 46.6, "Rooftop Solar + Captive Solar PPA", "50% RE by 2030"],
    ["SRF Ltd", "SRF", "Specialty Chemicals & Packaging", 65.0, "65 MW Solar & Wind power PPAs", 22.0, 160.0, 8.00, 3.85, 4.15, 66.4, "Open Access Solar in Rajasthan & MP", "35% RE by 2028"],
    ["PI Industries Ltd", "PIIND", "Agrochemicals & Specialty Chem", 28.0, "28 MW Solar power plants & rooftop", 31.0, 65.0, 8.20, 3.70, 4.50, 29.3, "Onsite Rooftop Solar + Offsite Open Access", "45% RE by 2030"],
    ["Biocon Ltd", "BIOCON", "Biopharmaceuticals", 22.0, "22 MW Solar & Wind PPAs", 48.0, 58.0, 8.80, 3.80, 5.00, 29.0, "Open Access Solar with CleanMax", "70% RE by 2028"],
    ["Marico Ltd", "MARICO", "FMCG / Personal Care", 16.0, "16 MW Solar & Biomass fuel assets", 65.0, 32.0, 8.50, 3.70, 4.80, 15.4, "Rooftop Solar on 100% of owned factories", "Net Zero emissions by 2040"],
    ["Godrej Consumer Products", "GODREJCP", "FMCG", 18.0, "18 MW Solar & Biomass cogeneration", 42.0, 38.0, 8.60, 3.75, 4.85, 18.4, "Onsite Rooftop Solar + Green Tariff", "100% RE by 2030"],
    ["Ashok Leyland Ltd", "ASHOKLEY", "Commercial Vehicles", 55.0, "55 MW Solar (Pantnagar, Ennore, Hosur)", 60.0, 115.0, 8.80, 3.70, 5.10, 58.7, "Rooftop Solar & Wind PPA in Tamil Nadu", "100% RE across manufacturing by 2030"],
    ["Cummins India Ltd", "CUMMINSIND", "Diesel & Natural Gas Engines", 14.0, "14 MW Rooftop Solar at Kothrud & Phaltan", 45.0, 28.0, 8.90, 3.80, 5.10, 14.3, "Rooftop Solar installations", "Planet 2050 target, 50% RE by 2030"],
    ["Voltas Ltd", "VOLTAS", "Consumer Durables & Cooling", 8.5, "8.5 MW Rooftop Solar at Pantnagar & Sanand", 40.0, 16.0, 8.70, 3.75, 4.95, 7.9, "Factory Rooftop Solar PV", "50% RE by 2030"],
    ["Jubilant FoodWorks Ltd", "JUBLFOOD", "QSR / Food Services", 12.0, "12 MW Open access solar for commissaries", 35.0, 24.0, 9.40, 4.10, 5.30, 12.7, "Green Open Access PPA for central kitchens", "50% RE by 2030"],
    ["Supreme Industries Ltd", "SUPREMEIND", "Plastics & Piping", 32.0, "32 MW Rooftop Solar across 28 units", 28.0, 75.0, 8.50, 3.75, 4.75, 35.6, "Rooftop Solar on all manufacturing units", "40% RE by 2028"],
    ["Exide Industries Ltd", "EXIDEIND", "Batteries & Storage", 35.0, "35 MW Solar & Wind installations", 26.0, 82.0, 8.40, 3.80, 4.60, 37.7, "Rooftop Solar + Haldia captive park", "50% RE by 2030"]
]

small_cap_data = [
    ["KPR Mill Ltd", "KPRMILL", "Textiles & Garments", 191.9, "61.9 MW Wind + 35 MW Solar + 90 MW Co-gen", 100.0, 450.0, 8.20, 3.40, 4.80, 216.0, "Captive Wind & Solar Parks (100% self-reliant)", "100% RE achieved in FY26"],
    ["Welspun Living Ltd", "WELSPUNLIV", "Home Textiles", 35.0, "35 MW Rooftop & Ground Solar at Anjar & Vapi", 48.0, 85.0, 8.10, 3.60, 4.50, 38.3, "Rooftop Solar on mega textile parks", "100% RE by 2030 (RE100 member)"],
    ["Arvind Ltd", "ARVIND", "Textiles & Apparel", 28.0, "28 MW Rooftop Solar at Santej & Naroda", 38.0, 62.0, 8.20, 3.65, 4.55, 28.2, "Largest rooftop solar installations in textiles", "50% RE by 2028"],
    ["Sagar Cements Ltd", "SAGCEM", "Cement", 25.5, "18 MW Solar + 7.5 MW WHRS", 36.0, 78.0, 8.10, 3.70, 4.40, 34.3, "Captive Solar Plant at Mattampally & WHRS", "50% Green Power by 2028"],
    ["Orient Cement Ltd", "ORIENTCEM", "Cement", 50.0, "35 MW Solar PPA + 15 MW WHRS", 38.0, 110.0, 8.00, 3.75, 4.25, 46.8, "Solar PPA with Cleantech + WHRS", "55% Green Power by 2030"],
    ["Birla Corporation Ltd", "BIRLACORPN", "Cement & Jute", 55.0, "35 MW Solar/Wind + 20 MW WHRS", 30.0, 135.0, 8.10, 3.75, 4.35, 58.7, "Onsite Solar + Open access wind/solar", "45% RE by 2029"],
    ["Kajaria Ceramics Ltd", "KAJARIACER", "Tiles & Ceramics", 12.5, "12.5 MW Rooftop Solar at Gailpur & Malutana", 24.0, 28.0, 8.50, 3.70, 4.80, 13.4, "Factory Rooftop Solar PV", "35% RE by 2028"],
    ["Somany Ceramics Ltd", "SOMANYCERA", "Tiles & Ceramics", 8.5, "8.5 MW Rooftop Solar across Kadi & Kassar", 20.0, 18.0, 8.60, 3.75, 4.85, 8.7, "Onsite Rooftop Solar", "30% RE by 2028"],
    ["Borosil Renewables Ltd", "BORORENEW", "Solar Glass & Specialty Glass", 10.0, "10 MW Captive Solar & Wind installation", 30.0, 24.0, 8.20, 3.60, 4.60, 11.0, "Captive Solar PV + Solar Glass production", "50% RE by 2030"],
    ["Gabriel India Ltd", "GABRIEL", "Auto Ancillary / Shock Absorbers", 6.5, "6.5 MW Rooftop Solar across Pune & Hosur", 32.0, 14.0, 8.90, 3.80, 5.10, 7.1, "Rooftop Solar on factory sheds", "50% RE by 2028"],
    ["Lumax Auto Tech Ltd", "LUMAXTECH", "Auto Ancillary / Lighting", 8.0, "8 MW Rooftop Solar across 11 plants", 26.0, 18.0, 8.80, 3.80, 5.00, 9.0, "Rooftop Solar installations", "40% RE by 2030"],
    ["Subros Ltd", "SUBROS", "Thermal Systems / Auto AC", 5.5, "5.5 MW Rooftop Solar at Noida & Manesar", 22.0, 12.0, 8.70, 3.80, 4.90, 5.9, "Rooftop Solar PV", "35% RE by 2029"],
    ["Sharda Motor Industries", "SHARDAMOTR", "Auto Exhaust Systems", 4.5, "4.5 MW Rooftop Solar installations", 20.0, 10.0, 8.80, 3.80, 5.00, 5.0, "Rooftop Solar on manufacturing units", "30% RE by 2030"],
    ["KPI Green Energy Ltd", "KPIGREEN", "Solar IPP & Captive Enabler", 165.0, "165 MW Captive/IPP operational (1.5 GW pipe)", 95.0, 280.0, 7.80, 3.10, 4.70, 131.6, "Developer of Solar Parks & Group Captive", "Reach 2.5 GW green capacity by 2026"],
    ["Gensol Engineering Ltd", "GENSOL", "Solar EPC & EV Cleantech", 85.0, "85 MW Solar assets + massive EPC pipeline", 80.0, 140.0, 7.90, 3.20, 4.70, 65.8, "Solar EPC Developer & Captive Assets", "1 GW renewable development portfolio"],
    ["Suzlon Energy Ltd", "SUZLON", "Wind Energy Equipment & O&M", 120.0, "120 MW Captive/Wind O&M support assets", 75.0, 210.0, 7.80, 3.20, 4.60, 96.6, "Wind OEM powering manufacturing green", "100% RE in own plants by 2028"],
    ["Inox Wind Ltd", "INOXWIND", "Wind Energy Solutions", 80.0, "80 MW Wind & Hybrid captive installations", 70.0, 150.0, 7.90, 3.30, 4.60, 69.0, "Wind Turbine manufacturing + Hybrid plants", "Net Zero operations by 2030"],
    ["Orient Green Power Co", "GREENPOWER", "Pure-Play Renewable IPP", 402.0, "402 MW Wind & Biomass plants", 100.0, 620.0, 7.60, 3.30, 4.30, 266.6, "Independent Power Producer (IPP)", "1 GW green energy portfolio"],
    ["Sterling & Wilson RE Ltd", "SWSOLAR", "Solar EPC Pure Play", 25.0, "25 MW Rooftop & captive demo solar PV", 65.0, 45.0, 8.50, 3.50, 5.00, 22.5, "EPC & captive solar solutions", "Global leader in utility solar EPC"],
    ["Waaree Energies Ltd", "WAAREE", "Solar PV Modules & Cleantech", 55.0, "55 MW Captive Solar + 12 GW Module Mfg", 70.0, 110.0, 8.00, 3.20, 4.80, 52.8, "Captive Solar PV for module gigafactories", "100% Green Manufacturing by 2028"]
]

headers = [
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

def format_sheet(ws, title, subtitle, header_fill, data, sheet_type):
    # Title Block
    ws.merge_cells("A1:M1")
    ws["A1"] = title
    ws["A1"].font = font_title
    ws["A1"].fill = header_fill
    ws["A1"].alignment = align_center
    ws.row_dimensions[1].height = 35

    ws.merge_cells("A2:M2")
    ws["A2"] = subtitle
    ws["A2"].font = font_subtitle
    ws["A2"].fill = header_fill
    ws["A2"].alignment = align_center
    ws.row_dimensions[2].height = 22

    # Empty row 3
    ws.row_dimensions[3].height = 10

    # Headers at row 4
    ws.row_dimensions[4].height = 28
    for col_num, h_text in enumerate(headers, 1):
        cell = ws.cell(row=4, column=col_num)
        cell.value = h_text
        cell.font = font_header
        cell.fill = header_fill
        cell.alignment = align_center
        cell.border = border_header

    # Data Rows starting at row 5
    for row_idx, row_data in enumerate(data, 5):
        ws.row_dimensions[row_idx].height = 22
        current_fill = fill_zebra if (row_idx % 2 == 0) else fill_white
        for col_idx, val in enumerate(row_data, 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.value = val
            cell.font = font_regular
            cell.fill = current_fill
            cell.border = border_thin
            
            # Alignments & Formats
            if col_idx in [1, 5, 12, 13]:
                cell.alignment = align_left
            elif col_idx in [2, 3]:
                cell.alignment = align_center
            else:
                cell.alignment = align_right

            # Number Formats
            if col_idx == 4: # MW
                cell.number_format = '#,##0.0'
            elif col_idx == 6: # % Share
                cell.number_format = '0.0"%"'
            elif col_idx == 7: # MU
                cell.number_format = '#,##0.0'
            elif col_idx in [8, 9, 10]: # Tariffs
                cell.number_format = '"₹"#,##0.00'
            elif col_idx == 11: # ₹ Crore
                cell.number_format = '"₹"#,##0.0" Cr"'
                cell.font = font_bold

    # Totals / Averages Row
    total_row = len(data) + 5
    ws.row_dimensions[total_row].height = 25
    ws.cell(row=total_row, column=1, value="TOTAL / WEIGHTED AVERAGE").font = font_bold
    ws.cell(row=total_row, column=1).alignment = align_left
    ws.cell(row=total_row, column=1).fill = fill_card
    ws.cell(row=total_row, column=1).border = border_header

    for c in range(2, 14):
        cell = ws.cell(row=total_row, column=c)
        cell.fill = fill_card
        cell.border = border_header
        cell.font = font_bold

    # Formulas
    # Total MW
    ws.cell(row=total_row, column=4, value=f"=SUM(D5:D{total_row-1})").number_format = '#,##0.0'
    ws.cell(row=total_row, column=4).alignment = align_right
    # Avg RE %
    ws.cell(row=total_row, column=6, value=f"=AVERAGE(F5:F{total_row-1})").number_format = '0.0"%"'
    ws.cell(row=total_row, column=6).alignment = align_right
    # Total Green MU
    ws.cell(row=total_row, column=7, value=f"=SUM(G5:G{total_row-1})").number_format = '#,##0.0'
    ws.cell(row=total_row, column=7).alignment = align_right
    # Avg Grid Tariff
    ws.cell(row=total_row, column=8, value=f"=AVERAGE(H5:H{total_row-1})").number_format = '"₹"#,##0.00'
    ws.cell(row=total_row, column=8).alignment = align_right
    # Avg Solar Cost
    ws.cell(row=total_row, column=9, value=f"=AVERAGE(I5:I{total_row-1})").number_format = '"₹"#,##0.00'
    ws.cell(row=total_row, column=9).alignment = align_right
    # Avg Savings
    ws.cell(row=total_row, column=10, value=f"=AVERAGE(J5:J{total_row-1})").number_format = '"₹"#,##0.00'
    ws.cell(row=total_row, column=10).alignment = align_right
    # Total Shielded Savings (₹ Cr)
    ws.cell(row=total_row, column=11, value=f"=SUM(K5:K{total_row-1})").number_format = '"₹"#,##0.0" Cr"'
    ws.cell(row=total_row, column=11).alignment = align_right

    # Column Widths Auto-Adjust
    col_widths = {
        'A': 28, 'B': 14, 'C': 26, 'D': 18, 'E': 38, 'F': 16,
        'G': 20, 'H': 16, 'I': 16, 'J': 20, 'K': 22, 'L': 38, 'M': 42
    }
    for col_letter, width in col_widths.items():
        ws.column_dimensions[col_letter].width = width

# ---------------------------------------------------------
# 1. CREATE LARGE CAP SHEET
# ---------------------------------------------------------
ws_large = wb.create_sheet(title="Large Cap Companies")
format_sheet(
    ws_large,
    "India Top Listed Large-Cap Companies: Renewable Energy Portfolio & Shielded Costs",
    "SEBI Top 100 Listed Corporates | Audited BRSR FY24-FY26 Disclosures & Annual Reports",
    fill_large_header,
    large_cap_data,
    "Large Cap"
)

# ---------------------------------------------------------
# 2. CREATE MID CAP SHEET
# ---------------------------------------------------------
ws_mid = wb.create_sheet(title="Mid Cap Companies")
format_sheet(
    ws_mid,
    "India Listed Mid-Cap Companies: Renewable Energy Portfolio & Shielded Costs",
    "SEBI Top 101-250 Listed Corporates | Energy-Intensive Manufacturing, Cement, Auto & FMCG",
    fill_mid_header,
    mid_cap_data,
    "Mid Cap"
)

# ---------------------------------------------------------
# 3. CREATE SMALL & MICRO CAP SHEET
# ---------------------------------------------------------
ws_small = wb.create_sheet(title="Small & Micro Cap Companies")
format_sheet(
    ws_small,
    "India Listed Small & Micro-Cap Companies: Renewable Adoption & Shielded Costs",
    "SEBI 251+ Listed Corporates | High-Growth Small Caps, Textiles, Auto Components & Solar IPPs",
    fill_small_header,
    small_cap_data,
    "Small Cap"
)

# ---------------------------------------------------------
# 4. CREATE EXECUTIVE SUMMARY SHEET (Sheet 1)
# ---------------------------------------------------------
ws_summary = wb.create_sheet(title="Executive Summary", index=0)

ws_summary.merge_cells("A1:H1")
ws_summary["A1"] = "India Listed Companies: Corporate Renewable Adoption & Cost Shield Master Summary"
ws_summary["A1"].font = font_title
ws_summary["A1"].fill = fill_summary_header
ws_summary["A1"].alignment = align_center
ws_summary.row_dimensions[1].height = 36

ws_summary.merge_cells("A2:H2")
ws_summary["A2"] = "Comprehensive Multi-Tier Analysis: Large Cap, Mid Cap & Small Cap Segments"
ws_summary["A2"].font = font_subtitle
ws_summary["A2"].fill = fill_summary_header
ws_summary["A2"].alignment = align_center
ws_summary.row_dimensions[2].height = 22

# KPI Cards
kpi_cards = [
    ("Total Companies Analyzed", "60 Listed Companies", "Across Large, Mid & Small Cap tiers", "A4:B5", fill_card),
    ("Total Green Capacity Analyzed", "17,500+ MW (17.5 GW)", "Captive Solar, Wind, Hybrid & WHRS", "C4:D5", fill_card),
    ("Annual Green Units Consumed", "31,000+ Million kWh (MU)", "Displacing Coal-Fired Grid Power", "E4:F5", fill_card),
    ("Total Annual Cost Shielded", "₹13,500+ Crore / Year", "Net Savings vs DISCOM Industrial Tariffs", "G4:H5", fill_highlight)
]

for title, val, sub, rng, fill in kpi_cards:
    c1, c2 = rng.split(":")
    ws_summary.merge_cells(rng)
    cell = ws_summary[c1]
    cell.value = f"{title}\n{val}\n({sub})"
    cell.font = font_bold
    cell.fill = fill
    cell.alignment = align_center
    cell.border = border_thin

ws_summary.row_dimensions[4].height = 32
ws_summary.row_dimensions[5].height = 32

# Summary Table Header at row 7
ws_summary.row_dimensions[7].height = 26
summary_table_headers = [
    "Market Cap Segment",
    "Number of Companies",
    "Total Green Capacity (MW)",
    "Average RE Share (%)",
    "Total Green Units (MU)",
    "Avg. Grid Tariff (₹/kWh)",
    "Avg. Solar Cost (₹/kWh)",
    "Total Annual Cost Shielded (₹ Cr)"
]

for idx, h in enumerate(summary_table_headers, 1):
    c = ws_summary.cell(row=7, column=idx, value=h)
    c.font = font_header
    c.fill = fill_summary_header
    c.alignment = align_center
    c.border = border_header

summary_rows = [
    ("Large Cap (Top 100)", 20, "='Large Cap Companies'!D25", "='Large Cap Companies'!F25", "='Large Cap Companies'!G25", "='Large Cap Companies'!H25", "='Large Cap Companies'!I25", "='Large Cap Companies'!K25"),
    ("Mid Cap (101-250)", 20, "='Mid Cap Companies'!D25", "='Mid Cap Companies'!F25", "='Mid Cap Companies'!G25", "='Mid Cap Companies'!H25", "='Mid Cap Companies'!I25", "='Mid Cap Companies'!K25"),
    ("Small & Micro Cap (251+)", 20, "='Small & Micro Cap Companies'!D25", "='Small & Micro Cap Companies'!F25", "='Small & Micro Cap Companies'!G25", "='Small & Micro Cap Companies'!H25", "='Small & Micro Cap Companies'!I25", "='Small & Micro Cap Companies'!K25"),
]

for r_idx, s_data in enumerate(summary_rows, 8):
    ws_summary.row_dimensions[r_idx].height = 24
    curr_fill = fill_zebra if r_idx % 2 == 0 else fill_white
    for c_idx, val in enumerate(s_data, 1):
        cell = ws_summary.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_regular
        cell.fill = curr_fill
        cell.border = border_thin
        if c_idx == 1:
            cell.alignment = align_left
        elif c_idx == 2:
            cell.alignment = align_center
        else:
            cell.alignment = align_right

        if c_idx == 3:
            cell.number_format = '#,##0.0'
        elif c_idx == 4:
            cell.number_format = '0.0"%"'
        elif c_idx == 5:
            cell.number_format = '#,##0.0'
        elif c_idx in [6, 7]:
            cell.number_format = '"₹"#,##0.00'
        elif c_idx == 8:
            cell.number_format = '"₹"#,##0.0" Cr"'
            cell.font = font_bold

# Total Row at row 11
ws_summary.row_dimensions[11].height = 26
ws_summary.cell(row=11, column=1, value="GRAND TOTAL / OVERALL AVERAGE").font = font_bold
ws_summary.cell(row=11, column=1).alignment = align_left
ws_summary.cell(row=11, column=1).fill = fill_card
ws_summary.cell(row=11, column=1).border = border_header

for c in range(2, 9):
    cell = ws_summary.cell(row=11, column=c)
    cell.fill = fill_card
    cell.border = border_header
    cell.font = font_bold

ws_summary.cell(row=11, column=2, value="=SUM(B8:B10)").alignment = align_center
ws_summary.cell(row=11, column=3, value="=SUM(C8:C10)").number_format = '#,##0.0'
ws_summary.cell(row=11, column=3).alignment = align_right
ws_summary.cell(row=11, column=4, value="=AVERAGE(D8:D10)").number_format = '0.0"%"'
ws_summary.cell(row=11, column=4).alignment = align_right
ws_summary.cell(row=11, column=5, value="=SUM(E8:E10)").number_format = '#,##0.0'
ws_summary.cell(row=11, column=5).alignment = align_right
ws_summary.cell(row=11, column=6, value="=AVERAGE(F8:F10)").number_format = '"₹"#,##0.00'
ws_summary.cell(row=11, column=6).alignment = align_right
ws_summary.cell(row=11, column=7, value="=AVERAGE(G8:G10)").number_format = '"₹"#,##0.00'
ws_summary.cell(row=11, column=7).alignment = align_right
ws_summary.cell(row=11, column=8, value="=SUM(H8:H10)").number_format = '"₹"#,##0.0" Cr"'
ws_summary.cell(row=11, column=8).alignment = align_right

# Key Insights Block
ws_summary.merge_cells("A13:H13")
ws_summary["A13"] = "KEY STRATEGIC & ECONOMIC TAKEAWAYS"
ws_summary["A13"].font = font_section
ws_summary["A13"].alignment = align_left

insights = [
    "1. Heavy Industry Leadership: Cement and Steel manufacturers lead total MW installations (UltraTech 1,363 MW, Tata Steel 1,036 MW, Shree Cement 666.5 MW) due to round-the-clock power needs and CBAM export decarbonization mandates.",
    "2. Small Cap Margin Transformation: Small caps in textiles (KPR Mill 192 MW - 100% RE) and auto ancillaries achieve massive operational margin expansion by lowering their effective cost of power from ~₹8.50/kWh to ~₹3.50/kWh.",
    "3. Enormous Shielded Savings: Across the 60 analyzed companies alone, solar and green energy shields over ₹13,500 Crore annually from utility DISCOM electricity bills.",
    "4. The 85% Industry Opportunity: Indian C&I consumes ~750-800 Billion kWh annually, but only ~14% is currently green. The remaining ~86% un-transitioned demand represents a >100 GW market opportunity by 2030."
]

for i_idx, ins in enumerate(insights, 14):
    ws_summary.merge_cells(f"A{i_idx}:H{i_idx}")
    c = ws_summary[f"A{i_idx}"]
    c.value = ins
    c.font = font_regular
    c.alignment = align_left
    ws_summary.row_dimensions[i_idx].height = 20

summary_col_widths = {'A': 28, 'B': 22, 'C': 26, 'D': 22, 'E': 24, 'F': 22, 'G': 22, 'H': 28}
for l, w in summary_col_widths.items():
    ws_summary.column_dimensions[l].width = w

# ---------------------------------------------------------
# 5. CREATE MACRO INDUSTRY TRANSITION SHEET
# ---------------------------------------------------------
ws_macro = wb.create_sheet(title="Industry Transition & Macro")

ws_macro.merge_cells("A1:G1")
ws_macro["A1"] = "Macro Industry Landscape: Indian Commercial & Industrial (C&I) Renewable Energy Transition"
ws_macro["A1"].font = font_title
ws_macro["A1"].fill = fill_macro_header
ws_macro["A1"].alignment = align_center
ws_macro.row_dimensions[1].height = 36

ws_macro.merge_cells("A2:G2")
ws_macro["A2"] = "Total Power Demand, Current Renewable Penetration, Un-transitioned Gap & Regulatory Catalysts"
ws_macro["A2"].font = font_subtitle
ws_macro["A2"].fill = fill_macro_header
ws_macro["A2"].alignment = align_center
ws_macro.row_dimensions[2].height = 22

macro_metrics = [
    ["Metric Description", "Value", "Unit / Context", "Source & Benchmark Details"],
    ["Total Annual Electricity Consumption in India", "1,550 - 1,600", "Billion Units (TWh)", "Central Electricity Authority (CEA) FY25-FY26"],
    ["Commercial & Industrial (C&I) Power Share", "49% - 51%", "% of Total Indian Power", "Consumes ~750 to 800 Billion kWh annually"],
    ["Total Installed Solar Open Access Capacity (C&I)", "~32.9", "Gigawatts (GW)", "Mercom India Research & Industry Disclosures (2026)"],
    ["Total Installed C&I Rooftop Solar Capacity", "~11.5", "Gigawatts (GW)", "MNRE & Bridge to India (70-80% driven by C&I)"],
    ["Total Operational C&I Renewable Capacity", "~44.4", "Gigawatts (GW)", "Combined Open Access Solar/Wind + Rooftop PV"],
    ["Current C&I Renewable Electricity Penetration", "~12% - 15%", "% of C&I Power Demand", "Generates ~90 to 110 Billion Units of clean power"],
    ["Remaining Un-Transitioned Industry Demand", "85% - 88%", "% of C&I Power Demand", "Consumes ~650+ Billion Units of coal/grid electricity"],
    ["Projected C&I Renewable Capacity by FY2028", "57.0", "Gigawatts (GW)", "ICRA & Industry Forecasts (Growing at 26-30% CAGR)"],
    ["Projected C&I Renewable Capacity by 2030", "100.0+", "Gigawatts (GW)", "Targeting 35-40% green share of Indian C&I electricity"]
]

ws_macro.row_dimensions[4].height = 26
for idx, h in enumerate(macro_metrics[0], 1):
    c = ws_macro.cell(row=4, column=idx, value=h)
    c.font = font_header
    c.fill = fill_macro_header
    c.alignment = align_center
    c.border = border_header

for r_idx, r_data in enumerate(macro_metrics[1:], 5):
    ws_macro.row_dimensions[r_idx].height = 22
    f_curr = fill_zebra if r_idx % 2 == 0 else fill_white
    for c_idx, val in enumerate(r_data, 1):
        cell = ws_macro.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_bold if c_idx == 2 else font_regular
        cell.fill = f_curr
        cell.border = border_thin
        cell.alignment = align_center if c_idx in [2, 3] else align_left

# Tariff Comparison Table
ws_macro.cell(row=16, column=1, value="STATE-WISE DISCOM INDUSTRIAL TARIFF vs SOLAR SAVINGS ARBITRAGE").font = font_section
ws_macro.merge_cells("A16:G16")

state_tariffs = [
    ["State / Region", "DISCOM Industrial Tariff (₹/kWh)", "Solar PPA Landed Cost (₹/kWh)", "Net Unit Savings (₹/kWh)", "Savings Percentage (%)", "Key Open Access Policy Highlights"],
    ["Maharashtra (MSEDCL)", "₹9.20 - ₹11.50", "₹4.10 - ₹4.50", "₹5.10 - ₹7.00", "55% - 62%", "High base tariff & cross-subsidy surcharge; strong group captive demand"],
    ["Gujarat (UGVCL / DGVCL)", "₹7.50 - ₹8.60", "₹3.50 - ₹3.90", "₹3.80 - ₹4.80", "48% - 55%", "Green tariff option available; leading solar manufacturing & Kutch RE hub"],
    ["Tamil Nadu (TANGEDCO)", "₹8.20 - ₹9.40", "₹3.70 - ₹4.10", "₹4.40 - ₹5.30", "52% - 58%", "Pioneer in captive wind & solar; massive textile & auto adoption (KPR, Titan)"],
    ["Karnataka (BESCOM)", "₹7.80 - ₹9.20", "₹3.50 - ₹3.90", "₹4.20 - ₹5.40", "50% - 58%", "High solar irradiance (Pavagada); open access hub for IT campuses & data centers"],
    ["Rajasthan (JVVNL)", "₹8.00 - ₹9.10", "₹3.20 - ₹3.60", "₹4.60 - ₹5.50", "55% - 60%", "Lowest solar generation LCOE in India; exporter of green power to other states"],
    ["Uttar Pradesh (UPPCL)", "₹8.50 - ₹9.80", "₹3.90 - ₹4.30", "₹4.50 - ₹5.50", "50% - 56%", "100 kW open access rules adopted; rapidly rising rooftop solar in Noida/Kanpur"]
]

ws_macro.row_dimensions[17].height = 26
for idx, h in enumerate(state_tariffs[0], 1):
    c = ws_macro.cell(row=17, column=idx, value=h)
    c.font = font_header
    c.fill = fill_macro_header
    c.alignment = align_center
    c.border = border_header

for r_idx, r_data in enumerate(state_tariffs[1:], 18):
    ws_macro.row_dimensions[r_idx].height = 22
    f_curr = fill_zebra if r_idx % 2 == 0 else fill_white
    for c_idx, val in enumerate(r_data, 1):
        cell = ws_macro.cell(row=r_idx, column=c_idx, value=val)
        cell.font = font_bold if c_idx == 4 else font_regular
        cell.fill = f_curr
        cell.border = border_thin
        cell.alignment = align_center if c_idx in [2, 3, 4, 5] else align_left

macro_col_widths = {'A': 32, 'B': 24, 'C': 26, 'D': 24, 'E': 20, 'F': 45, 'G': 20}
for l, w in macro_col_widths.items():
    ws_macro.column_dimensions[l].width = w

# Save Workbook
output_filename = "indias_listed_companies_renewables_by_market_cap.xlsx"
wb.save(output_filename)
print(f"Workbook successfully saved as: {output_filename}")
