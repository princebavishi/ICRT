import sqlite3
from typing import Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="India Corporate Renewables & Stock Returns Terminal",
    description="REST API and Real-time Dashboard for Indian Listed Companies Renewable Energy Adoption, Cost Shielding & Returns",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "renewables_stocks.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/stocks")
def get_stocks(
    search: Optional[str] = None,
    cap_tier: Optional[str] = None,
    sector: Optional[str] = None,
    sub_segment: Optional[str] = None,
    min_re_pct: Optional[float] = None,
    min_shield_cr: Optional[float] = None,
    min_mw: Optional[float] = None,
    min_ret_5y: Optional[float] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    is_2w_3w: Optional[bool] = None,
    sort_by: str = "annual_shield_cr",
    order: str = "desc"
):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM companies WHERE 1=1"
    params = []

    if search:
        query += " AND (name LIKE ? OR ticker LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    if cap_tier and cap_tier != "All":
        query += " AND cap_tier = ?"
        params.append(cap_tier)

    if sector and sector != "All":
        query += " AND sector = ?"
        params.append(sector)

    if sub_segment and sub_segment != "All":
        query += " AND sub_segment LIKE ?"
        params.append(f"%{sub_segment}%")

    if is_2w_3w:
        query += " AND (sub_segment LIKE '%2W%' OR sub_segment LIKE '%3W%' OR sector = 'Automotive & 2W/3W')"

    if min_re_pct is not None and min_re_pct > 0:
        query += " AND re_pct >= ?"
        params.append(min_re_pct)

    if min_shield_cr is not None and min_shield_cr > 0:
        query += " AND annual_shield_cr >= ?"
        params.append(min_shield_cr)

    if min_mw is not None and min_mw > 0:
        query += " AND re_mw >= ?"
        params.append(min_mw)

    if min_ret_5y is not None:
        query += " AND ret_5y >= ?"
        params.append(min_ret_5y)

    if min_price is not None and min_price > 0:
        query += " AND close_price >= ?"
        params.append(min_price)

    if max_price is not None and max_price > 0:
        query += " AND close_price <= ?"
        params.append(max_price)

    # Sorting whitelist
    valid_sort_columns = {
        "annual_shield_cr": "annual_shield_cr",
        "re_pct": "re_pct",
        "re_mw": "re_mw",
        "annual_mu": "annual_mu",
        "ret_1y": "ret_1y",
        "ret_2y": "ret_2y",
        "ret_3y": "ret_3y",
        "ret_4y": "ret_4y",
        "ret_5y": "ret_5y",
        "ret_6y": "ret_6y",
        "close_price": "close_price",
        "market_cap_cr": "market_cap_cr",
        "pe": "pe",
        "roce": "roce",
        "name": "name",
        "ticker": "ticker",
        "cap_tier": "cap_tier",
        "sector": "sector"
    }
    sort_col = valid_sort_columns.get(sort_by, "annual_shield_cr")
    sort_order = "ASC" if order.lower() == "asc" else "DESC"

    query += f" ORDER BY {sort_col} {sort_order}"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()

    return {
        "count": len(results),
        "data": results
    }

@app.get("/api/stats")
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Overall KPIs
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

    # Sector Breakdown
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

    # Cap Tier Breakdown
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
    cap_breakdown = [dict(r) for r in cursor.fetchall()]

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

    conn.close()

    return {
        "overall": overall,
        "kpis": overall,
        "sector_breakdown": sector_breakdown,
        "sectors": sector_breakdown,
        "cap_breakdown": cap_breakdown,
        "cap_tiers": cap_breakdown,
        "top_shielded": top_shielded,
        "top_gainers": top_gainers,
        "two_w_three_w": two_w_three_w
    }

@app.get("/api/sectors")
def get_sectors():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT sector FROM companies ORDER BY sector ASC")
    sectors = [r[0] for r in cursor.fetchall()]
    conn.close()
    return sectors

@app.get("/api/stocks/{ticker}")
def get_stock(ticker: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM companies WHERE ticker = ? OR ticker LIKE ?", (ticker, f"%{ticker}%"))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Stock not found")
    return dict(row)

DIST_DIR = os.path.join(os.path.dirname(__file__), "frontend", "dist")
if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# Serve dashboard HTML
@app.get("/", response_class=HTMLResponse)
def read_root():
    dist_index = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(dist_index):
        with open(dist_index, "r", encoding="utf-8") as f:
            return f.read()
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
