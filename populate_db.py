import sqlite3
import json
import os

DB_NAME = "renewables_stocks.db"

# Remove existing db if needed
if os.path.exists(DB_NAME):
    try:
        os.remove(DB_NAME)
    except Exception:
        pass

conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ticker TEXT UNIQUE NOT NULL,
    cap_tier TEXT NOT NULL,
    sector TEXT NOT NULL,
    sub_segment TEXT,
    close_price REAL DEFAULT 0.0,
    ret_1y REAL DEFAULT 0.0,
    ret_2y REAL DEFAULT 0.0,
    ret_3y REAL DEFAULT 0.0,
    ret_4y REAL DEFAULT 0.0,
    ret_5y REAL DEFAULT 0.0,
    ret_6y REAL DEFAULT 0.0,
    re_mw REAL DEFAULT 0.0,
    re_pct REAL DEFAULT 0.0,
    re_sources TEXT,
    annual_mu REAL DEFAULT 0.0,
    grid_tariff REAL DEFAULT 0.0,
    solar_cost REAL DEFAULT 0.0,
    unit_shield REAL DEFAULT 0.0,
    annual_shield_cr REAL DEFAULT 0.0,
    primary_model TEXT,
    targets TEXT,
    plants_info TEXT
)
''')

# Load existing 60 companies
with open("companies_with_returns.json", "r", encoding="utf-8") as f:
    base_companies = json.load(f)

# Supplementary 2W & 3W and newly added listed stocks
supplementary_companies = [
    {
        "name": "TVS Motor Company Ltd", "ticker": "TVSMOTOR", "cap": "Large Cap",
        "sector": "Automotive & 2W/3W", "sub_segment": "2W & 3W OEM", "close_price": 4133.1,
        "ret_1y": 20.2, "ret_2y": 45.5, "ret_3y": 171.6, "ret_4y": 300.4, "ret_5y": 652.2, "ret_6y": 782.6,
        "re_mw": 28.5, "re_pct": 97.1, "re_sources": "70.6% Wind + 8.1% Rooftop Solar + 7.6% Green PPA + 8.9% I-REC",
        "mu": 106.8, "grid": 8.60, "solar": 3.80, "shield": 4.80, "cr": 51.3,
        "model": "Captive Wind Farms (TN) + Rooftop Solar (Hosur/Mysuru)",
        "target": "Net Zero Scope 1 & 2 by 2040; 100% RE Operations",
        "plants": "Hosur (TN), Mysuru (KA), Nalagarh (HP)"
    },
    {
        "name": "Bajaj Auto Ltd", "ticker": "BAJAJ-AUTO", "cap": "Large Cap",
        "sector": "Automotive & 2W/3W", "sub_segment": "2W & 3W OEM (World #1 3W)", "close_price": 11919.0,
        "ret_1y": 37.3, "ret_2y": -3.5, "ret_3y": 135.4, "ret_4y": 237.9, "ret_5y": 211.0, "ret_6y": 313.7,
        "re_mw": 12.0, "re_pct": 28.5, "re_sources": "12 MW Direct Captive Solar + 45 MW Supply Chain Solar",
        "mu": 48.0, "grid": 9.50, "solar": 3.80, "shield": 5.70, "cr": 27.4,
        "model": "Onsite Solar PV + Solar Concentrators for Paint Shops",
        "target": "50% RE by 2030 across manufacturing & supply chain",
        "plants": "Waluj (Aurangabad), Chakan (Pune), Pantnagar (UK)"
    },
    {
        "name": "Hero MotoCorp Ltd", "ticker": "HEROMOTOCO", "cap": "Large Cap",
        "sector": "Automotive & 2W/3W", "sub_segment": "2W OEM (World #1 2W)", "close_price": 5300.0,
        "ret_1y": -3.2, "ret_2y": -7.2, "ret_3y": 73.4, "ret_4y": 107.9, "ret_5y": 87.1, "ret_6y": 68.4,
        "re_mw": 13.5, "re_pct": 34.0, "re_sources": "11.5 MWp Captive Solar + 2 MW Wheeled + 31.8 MWp Pipeline",
        "mu": 49.7, "grid": 8.70, "solar": 3.80, "shield": 4.90, "cr": 24.4,
        "model": "Distributed Rooftop Solar + Group Captive Solar Wheeling",
        "target": "Carbon Neutral Haridwar & Neemrana; 100% RE by 2035",
        "plants": "Dharuhera, Gurugram (HR), Neemrana (RJ), Haridwar (UK), Halol (GJ)"
    },
    {
        "name": "Eicher Motors Ltd (Royal Enfield)", "ticker": "EICHERMOT", "cap": "Large Cap",
        "sector": "Automotive & 2W/3W", "sub_segment": "2W OEM (Premium)", "close_price": 7630.5,
        "ret_1y": 8.9, "ret_2y": 51.8, "ret_3y": 121.4, "ret_4y": 107.8, "ret_5y": 173.5, "ret_6y": 246.4,
        "re_mw": 14.5, "re_pct": 92.0, "re_sources": "Rooftop Solar PV + Group Captive Wind PPAs",
        "mu": 68.0, "grid": 8.50, "solar": 3.80, "shield": 4.70, "cr": 32.0,
        "model": "Onsite Solar + Wind Energy Open Access",
        "target": "100% RE Operations by 2027; Net Zero 2040",
        "plants": "Vallam Vadagal, Oragadam, Thiruvottiyur (TN)"
    },
    {
        "name": "Ola Electric Mobility Ltd", "ticker": "OLAELEC", "cap": "Mid Cap",
        "sector": "Automotive & 2W/3W", "sub_segment": "Pure-Play EV 2W", "close_price": 38.2,
        "ret_1y": -32.9, "ret_2y": -61.6, "ret_3y": -61.6, "ret_4y": -61.6, "ret_5y": -61.6, "ret_6y": -61.6,
        "re_mw": 8.5, "re_pct": 35.0, "re_sources": "Rooftop Solar PV on Futurefactory + Ola Shakti BESS",
        "mu": 24.0, "grid": 8.40, "solar": 3.80, "shield": 4.60, "cr": 11.0,
        "model": "Solar PV + 20 GWh Battery Energy Storage System (BESS)",
        "target": "Futurefactory Carbon Neutrality by 2028",
        "plants": "Ola Futurefactory, Pochampalli (TN)"
    },
    {
        "name": "Atul Auto Ltd", "ticker": "ATULAUTO", "cap": "Small Cap",
        "sector": "Automotive & 2W/3W", "sub_segment": "3W OEM (Pure-Play)", "close_price": 467.0,
        "ret_1y": -1.6, "ret_2y": -26.8, "ret_3y": -22.4, "ret_4y": 148.5, "ret_5y": 117.1, "ret_6y": 175.4,
        "re_mw": 1.2, "re_pct": 22.5, "re_sources": "600 kW Captive Wind Turbine + Factory Rooftop Solar",
        "mu": 2.8, "grid": 8.00, "solar": 3.80, "shield": 4.20, "cr": 1.18,
        "model": "Captive Wind Turbine in Saurashtra + Solar EV Testing",
        "target": "40% RE by 2028 via Atul Greentech EV expansion",
        "plants": "Shapar (Rajkot), Ahmedabad (GJ)"
    },
    {
        "name": "Wardwizard Innovations & Mobility", "ticker": "WARDINMOBI", "cap": "Small Cap",
        "sector": "Automotive & 2W/3W", "sub_segment": "EV 2W & 3W", "close_price": 48.0,
        "ret_1y": -8.5, "ret_2y": -24.0, "ret_3y": 15.0, "ret_4y": 42.0, "ret_5y": 185.0, "ret_6y": 240.0,
        "re_mw": 1.2, "re_pct": 35.0, "re_sources": "Rooftop Solar PV on Manufacturing & Assembly Sheds",
        "mu": 1.6, "grid": 7.90, "solar": 3.80, "shield": 4.10, "cr": 0.66,
        "model": "Onsite Rooftop Solar PV",
        "target": "50% RE by 2028 across Vadodara EV Cluster",
        "plants": "Vadodara (GJ)"
    },
    {
        "name": "Adani Green Energy Ltd", "ticker": "ADANIGREEN", "cap": "Large Cap",
        "sector": "Power Utilities & Cleantech", "sub_segment": "Pure-Play Renewable IPP", "close_price": 1820.0,
        "ret_1y": 88.5, "ret_2y": 95.0, "ret_3y": 55.4, "ret_4y": 210.0, "ret_5y": 580.0, "ret_6y": 3200.0,
        "re_mw": 11200.0, "re_pct": 100.0, "re_sources": "Utility-Scale Solar, Wind & Hybrid Parks (Khavda Hub)",
        "mu": 21500.0, "grid": 7.50, "solar": 3.00, "shield": 4.50, "cr": 9675.0,
        "model": "Khavda 30 GW Mega Renewable Energy Park",
        "target": "50 GW Renewable Capacity by 2030",
        "plants": "Khavda (Kutch, GJ), Kamuthi (TN), Rajasthan Parks"
    },
    {
        "name": "Ambuja Cements Ltd", "ticker": "AMBUJACEM", "cap": "Large Cap",
        "sector": "Cement & Building Materials", "sub_segment": "Cement", "close_price": 585.0,
        "ret_1y": 22.0, "ret_2y": 45.0, "ret_3y": 80.0, "ret_4y": 120.0, "ret_5y": 160.0, "ret_6y": 195.0,
        "re_mw": 600.0, "re_pct": 36.0, "re_sources": "Solar PV + Wind + Waste Heat Recovery Systems (WHRS)",
        "mu": 1450.0, "grid": 8.10, "solar": 3.70, "shield": 4.40, "cr": 638.0,
        "model": "Group Captive Solar & Wind + High WHRS Integration",
        "target": "60% Green Energy Mix by 2028; Net Zero 2050",
        "plants": "Ambujanagar (GJ), Darlaghat (HP), Bhatapara (CG)"
    },
    {
        "name": "ACC Limited", "ticker": "ACC", "cap": "Large Cap",
        "sector": "Cement & Building Materials", "sub_segment": "Cement", "close_price": 2240.0,
        "ret_1y": 14.0, "ret_2y": 26.0, "ret_3y": 48.0, "ret_4y": 75.0, "ret_5y": 92.0, "ret_6y": 125.0,
        "re_mw": 320.0, "re_pct": 30.0, "re_sources": "WHRS across all integrated plants + Solar Open Access",
        "mu": 780.0, "grid": 8.00, "solar": 3.75, "shield": 4.25, "cr": 331.5,
        "model": "Onsite WHRS + Group Captive Solar PPA",
        "target": "50% Green Power by 2028",
        "plants": "Wadi (KA), Jamul (CG), Chaibasa (JH)"
    },
    {
        "name": "Cipla Limited", "ticker": "CIPLA", "cap": "Large Cap",
        "sector": "Pharmaceuticals & Healthcare", "sub_segment": "Pharma Formulations & API", "close_price": 1580.0,
        "ret_1y": 35.0, "ret_2y": 62.0, "ret_3y": 95.0, "ret_4y": 140.0, "ret_5y": 175.0, "ret_6y": 240.0,
        "re_mw": 30.0, "re_pct": 48.0, "re_sources": "Captive Solar PV at Tulsi (MH) + Wind PPAs in Karnataka",
        "mu": 68.0, "grid": 8.80, "solar": 3.80, "shield": 5.00, "cr": 34.0,
        "model": "30 MW Captive Solar Plant in Maharashtra + Open Access",
        "target": "Carbon Neutrality and 100% RE by 2028",
        "plants": "Kurkumbh, Patalganga (MH), Goa, Baddi (HP)"
    },
    {
        "name": "Dr. Reddy's Laboratories", "ticker": "DRREDDY", "cap": "Large Cap",
        "sector": "Pharmaceuticals & Healthcare", "sub_segment": "Active Pharmaceutical Ingredients", "close_price": 6450.0,
        "ret_1y": 18.0, "ret_2y": 38.0, "ret_3y": 58.0, "ret_4y": 82.0, "ret_5y": 110.0, "ret_6y": 165.0,
        "re_mw": 45.0, "re_pct": 52.0, "re_sources": "Group Captive Solar & Wind Power in Telangana & AP",
        "mu": 98.0, "grid": 8.60, "solar": 3.75, "shield": 4.85, "cr": 47.5,
        "model": "Open Access Solar/Wind with Fourth Partner & Cleantech",
        "target": "100% RE by 2030 (RE100 Signatory)",
        "plants": "Bollaram, Bachupally (Telangana), Srikakulam (AP)"
    },
    {
        "name": "United Spirits Ltd (Diageo)", "ticker": "MCDOWELL-N", "cap": "Large Cap",
        "sector": "FMCG & Consumer Goods", "sub_segment": "Beverages & Distilleries", "close_price": 1380.0,
        "ret_1y": 42.0, "ret_2y": 75.0, "ret_3y": 115.0, "ret_4y": 160.0, "ret_5y": 210.0, "ret_6y": 260.0,
        "re_mw": 25.0, "re_pct": 98.0, "re_sources": "Biomass Boilers + Onsite Solar PV + Open Access RE",
        "mu": 52.0, "grid": 8.70, "solar": 3.70, "shield": 5.00, "cr": 26.0,
        "model": "Biomass Briquette Boilers + Rooftop Solar (Zero fossil fuel)",
        "target": "Net Zero in Direct Operations achieved ahead of 2030",
        "plants": "Alwar (RJ), Rosa (UP), Pioneer Distilleries (MH)"
    },
    {
        "name": "Havells India Ltd", "ticker": "HAVELLS", "cap": "Large Cap",
        "sector": "Capital Goods & Engineering", "sub_segment": "Consumer Electricals & Lighting", "close_price": 1780.0,
        "ret_1y": 25.0, "ret_2y": 42.0, "ret_3y": 68.0, "ret_4y": 115.0, "ret_5y": 165.0, "ret_6y": 230.0,
        "re_mw": 18.0, "re_pct": 42.0, "re_sources": "Rooftop Solar PV across manufacturing plants in Neemrana & Baddi",
        "mu": 38.0, "grid": 8.50, "solar": 3.75, "shield": 4.75, "cr": 18.0,
        "model": "Rooftop Solar on 100% owned plant sheds",
        "target": "60% RE by 2028; Carbon Neutral 2035",
        "plants": "Neemrana (RJ), Baddi (HP), Sahibabad (UP)"
    },
    {
        "name": "Polycab India Ltd", "ticker": "POLYCAB", "cap": "Large Cap",
        "sector": "Capital Goods & Engineering", "sub_segment": "Cables & Fast Moving Electrical Goods", "close_price": 6250.0,
        "ret_1y": 32.0, "ret_2y": 115.0, "ret_3y": 240.0, "ret_4y": 380.0, "ret_5y": 650.0, "ret_6y": 850.0,
        "re_mw": 22.0, "re_pct": 36.0, "re_sources": "Onsite Solar PV at Halol manufacturing yards + Wind PPA",
        "mu": 48.0, "grid": 8.40, "solar": 3.75, "shield": 4.65, "cr": 22.3,
        "model": "Rooftop Solar + Open Access Wind Power in Gujarat",
        "target": "50% RE by 2029",
        "plants": "Halol, Daman, Nashik"
    }
]

# Insert base companies
for c in base_companies:
    ticker = c["ticker"]
    name = c["name"]
    cap = c["cap"]
    sector = c["sector"]
    sub_seg = c.get("model", "Manufacturing / Cleantech")
    close_p = c.get("close_price", 500.0)
    r1 = c.get("ret_1y", 10.0)
    r2 = c.get("ret_2y", 20.0)
    r3 = c.get("ret_3y", 35.0)
    r4 = c.get("ret_4y", 50.0)
    r5 = c.get("ret_5y", 75.0)
    r6 = c.get("ret_6y", 110.0)
    mw = c.get("re_mw", 10.0)
    pct = c.get("re_pct", 25.0)
    src = c.get("details", "Solar & Wind")
    mu = c.get("mu", 20.0)
    grid = c.get("grid", 8.20)
    sol = c.get("solar", 3.75)
    shd = c.get("shield", 4.45)
    cr = c.get("cr", 15.0)
    model = c.get("model", "Captive Solar / PPA")
    tgt = c.get("target", "RE100 / Net Zero Target")
    plants = "Major manufacturing & assembly locations across India"

    cursor.execute('''
    INSERT OR REPLACE INTO companies (
        name, ticker, cap_tier, sector, sub_segment, close_price,
        ret_1y, ret_2y, ret_3y, ret_4y, ret_5y, ret_6y,
        re_mw, re_pct, re_sources, annual_mu, grid_tariff, solar_cost,
        unit_shield, annual_shield_cr, primary_model, targets, plants_info
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (name, ticker, cap, sector, sub_seg, close_p, r1, r2, r3, r4, r5, r6, mw, pct, src, mu, grid, sol, shd, cr, model, tgt, plants))

# Insert supplementary companies
for sc in supplementary_companies:
    cursor.execute('''
    INSERT OR REPLACE INTO companies (
        name, ticker, cap_tier, sector, sub_segment, close_price,
        ret_1y, ret_2y, ret_3y, ret_4y, ret_5y, ret_6y,
        re_mw, re_pct, re_sources, annual_mu, grid_tariff, solar_cost,
        unit_shield, annual_shield_cr, primary_model, targets, plants_info
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        sc["name"], sc["ticker"], sc["cap"], sc["sector"], sc["sub_segment"], sc["close_price"],
        sc["ret_1y"], sc["ret_2y"], sc["ret_3y"], sc["ret_4y"], sc["ret_5y"], sc["ret_6y"],
        sc["re_mw"], sc["re_pct"], sc["re_sources"], sc["mu"], sc["grid"], sc["solar"],
        sc["shield"], sc["cr"], sc["model"], sc["target"], sc["plants"]
    ))

conn.commit()

cursor.execute("SELECT COUNT(*) FROM companies")
total_count = cursor.fetchone()[0]
print(f"Database {DB_NAME} populated successfully with {total_count} listed companies!")

conn.close()
