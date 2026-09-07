import sqlite3
import json
import os

DB_PATH = "renewables_stocks.db"
OUTPUT_DIR = os.path.join("frontend", "public", "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# 1. Export stocks.json
cursor.execute("SELECT * FROM companies ORDER BY market_cap_cr DESC")
rows = cursor.fetchall()
stocks_data = [dict(r) for r in rows]

stocks_payload = {
    "count": len(stocks_data),
    "data": stocks_data
}

with open(os.path.join(OUTPUT_DIR, "stocks.json"), "w", encoding="utf-8") as f:
    json.dump(stocks_payload, f, ensure_ascii=False)

print(f"Exported {len(stocks_data)} stocks to {OUTPUT_DIR}/stocks.json")

# 2. Export stats.json
cursor.execute('''
SELECT 
    COUNT(*) as total_companies,
    ROUND(SUM(re_mw), 1) as total_green_mw,
    ROUND(SUM(annual_mu), 1) as total_green_mu,
    ROUND(SUM(annual_shield_cr), 1) as total_shield_cr,
    ROUND(AVG(re_pct), 1) as avg_re_pct,
    ROUND(AVG(ret_1y), 1) as avg_1y_ret,
    ROUND(AVG(ret_3y), 1) as avg_3y_ret,
    ROUND(AVG(ret_5y), 1) as avg_5y_ret,
    ROUND(AVG(ret_6y), 1) as avg_6y_ret
FROM companies
''')
overall = dict(cursor.fetchone())

cursor.execute('''
SELECT 
    sector,
    COUNT(*) as count,
    ROUND(SUM(re_mw), 1) as total_mw,
    ROUND(AVG(re_pct), 1) as avg_re_pct,
    ROUND(SUM(annual_shield_cr), 1) as total_shield_cr,
    ROUND(AVG(ret_1y), 1) as avg_1y,
    ROUND(AVG(ret_3y), 1) as avg_3y,
    ROUND(AVG(ret_5y), 1) as avg_5y,
    ROUND(AVG(ret_6y), 1) as avg_6y
FROM companies
GROUP BY sector
ORDER BY total_shield_cr DESC
''')
sector_breakdown = [dict(r) for r in cursor.fetchall()]

cursor.execute('''
SELECT 
    cap_tier,
    COUNT(*) as count,
    ROUND(SUM(re_mw), 1) as total_mw,
    ROUND(AVG(re_pct), 1) as avg_re_pct,
    ROUND(SUM(annual_shield_cr), 1) as total_shield_cr,
    ROUND(AVG(ret_1y), 1) as avg_1y,
    ROUND(AVG(ret_3y), 1) as avg_3y,
    ROUND(AVG(ret_5y), 1) as avg_5y,
    ROUND(AVG(ret_6y), 1) as avg_6y
FROM companies
GROUP BY cap_tier
ORDER BY 
    CASE cap_tier 
        WHEN 'Large Cap' THEN 1 
        WHEN 'Mid Cap' THEN 2 
        WHEN 'Small Cap' THEN 3 
        ELSE 4 
    END
''')
cap_tier_breakdown = [dict(r) for r in cursor.fetchall()]

# Top 10 Cost Shielded
cursor.execute('''
SELECT name, ticker, cap_tier, sector, re_mw, re_pct, annual_shield_cr, ret_5y
FROM companies
ORDER BY annual_shield_cr DESC
LIMIT 10
''')
top_shielded = [dict(r) for r in cursor.fetchall()]

# Top 10 5-Year Returners
cursor.execute('''
SELECT name, ticker, cap_tier, sector, re_pct, annual_shield_cr, ret_5y, ret_6y
FROM companies
ORDER BY ret_5y DESC
LIMIT 10
''')
top_gainers = [dict(r) for r in cursor.fetchall()]

# 2W & 3W OEMs
cursor.execute('''
SELECT *
FROM companies
WHERE sector = 'Automotive & 2W/3W' OR sub_segment LIKE '%2W%' OR sub_segment LIKE '%3W%'
ORDER BY re_pct DESC
''')
two_w_three_w = [dict(r) for r in cursor.fetchall()]

stats_payload = {
    "overall": overall,
    "kpis": overall,
    "sector_breakdown": sector_breakdown,
    "sectors": sector_breakdown,
    "cap_breakdown": cap_tier_breakdown,
    "cap_tiers": cap_tier_breakdown,
    "top_shielded": top_shielded,
    "top_gainers": top_gainers,
    "two_w_three_w": two_w_three_w
}

with open(os.path.join(OUTPUT_DIR, "stats.json"), "w", encoding="utf-8") as f:
    json.dump(stats_payload, f, ensure_ascii=False)

print(f"Exported enriched stats to {OUTPUT_DIR}/stats.json")

# 3. Export sectors.json
cursor.execute("SELECT DISTINCT sector FROM companies WHERE sector IS NOT NULL AND sector != '' ORDER BY sector ASC")
sectors = [r["sector"] for r in cursor.fetchall()]

with open(os.path.join(OUTPUT_DIR, "sectors.json"), "w", encoding="utf-8") as f:
    json.dump(sectors, f, ensure_ascii=False)

print(f"Exported {len(sectors)} distinct sectors to {OUTPUT_DIR}/sectors.json")

conn.close()
print("All static JSON files regenerated successfully!")
