# India Corporate Renewables & Stock Returns Terminal (ICRT)

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Motion](https://img.shields.io/badge/Motion-Framer-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An institutional-grade equity intelligence terminal tracking **5,461 Indian listed companies** (across Large, Mid, Small, and Micro Caps) on their captive clean energy adoption, grid tariff hedges (**annual power cost shielded**), and multi-year compounded stock returns.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprincebavishi%2FICRT-India-Corporate-Renewables-Terminal)

---

## ⚡ Executive Summary & Key KPIs

Extracted directly across **all 219 pages of Screener.in's Indian listed company universe**, ICRT bridges corporate decarbonization disclosures with capital market valuations:

- **Companies Ingested**: `5,448` actively traded listed equities
- **Total Operational Green Capacity**: `23,317 MW` (Captive Solar, Wind, WHRS, Utilities)
- **Total Annual Energy Cost Shielded**: `₹1,68,829 Crore / year` in avoided DISCOM power bills
- **Average 5-Year Compounded Return**: `+189.1%`
- **Specialized 2W & 3W OEM Sub-segment**: `41` automotive manufacturers analyzed for rooftop solar & group captive PPA adoption

---

## 🧮 Energy Economics & Cost Shielding Methodology

Indian industrial and commercial (C&I) enterprises face escalating grid power tariffs from state DISCOMs (₹7.50 to ₹9.50+ per kWh). By investing in captive rooftop solar, ground-mount installations, and open-access group captive PPAs (with levelized costs of electricity around ₹3.40 to ₹3.80 per kWh), companies create a permanent structural hedge against energy inflation.

$$\text{Avoided Tariff Spread (\rupee/kWh)} = \text{Grid Tariff} - \text{Solar LCOE}$$

$$\text{Annual Energy Cost Shielded (\rupee\text{ Crore})} = \frac{\text{Annual Generation (MU)} \times 10^6 \times \text{Avoided Tariff Spread (\rupee)}}{10^7}$$

*Example: A company generating 200 MU/year with a ₹4.85/kWh tariff advantage shields **₹97 Crore** in pre-tax operating cash flows annually.*

---

## 🖥️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 18 + Vite)               │
│    Tailwind CSS • Motion (Emil Kowalski Easing)        │
│    Chart.js Visualizations • Custom Select Dropdowns   │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
    [Local Development]          [Vercel Serverless]
   FastAPI REST Engine        Static Precomputed Cache
 (Python 3.11 + Uvicorn)      (/public/data/*.json)
              │
              ▼
    SQLite Ingestion DB
   (renewables_stocks.db)
```

---

## ✨ Features & Capabilities

- **Interactive Column Sorting**: Click any table header (Company Name, Ticker, Cap Tier, Sector, CMP, RE Share %, Green MW, Cost Shielded, 1Y–6Y Returns) with dynamic directional indicators (`▲` / `▼` / `⇅`).
- **Custom Animated Filter Menus**: Engineered with `motion` and custom cubic-bezier easings (`[0.16, 1, 0.3, 1]`) featuring checkmark indicators, keyboard accessibility, and outside-click dismissal.
- **Dynamic Correlation Chart**: Scatter plot correlating renewable electricity share (%) against 5-year stock performance. Hovering over any dot displays the **full company name**, ticker, market cap, and metrics; clicking inspects the complete company profile.
- **Deep Filter Toolbar**:
  - Instant search across 5,448 stocks by Name or Ticker symbol.
  - Market Cap selector (`All Caps`, `Large Cap`, `Mid Cap`, `Small Cap`, `Micro Cap`).
  - Sector filtering with live stock counts.
  - Renewable Electricity Share threshold ($\ge 20\%$, $\ge 40\%$, $\ge 60\%$, $\ge 80\%$, $\ge 90\%$).
  - Cost Shielded threshold ($\ge ₹10\text{ Cr}$ to $\ge ₹1,000\text{ Cr}$).
  - Installed Capacity threshold ($\ge 1\text{ MW}$ to $\ge 500\text{ MW}$).
  - 5-Year Return threshold (Doubles $>100\%$, Triples $>200\%$, Multibaggers $>500\%$).
  - Active filter chips with individual `✕` dismissal and one-click **Reset all**.
- **Specialized 2W & 3W OEMs Intelligence**: Dedicated toggle for automotive leaders (Hero MotoCorp, TVS Motor, Bajaj Auto, Eicher Motors, Atul Auto, Wardwizard Innovations, etc.).
- **Corporate Detail Profile Modal**: Inspect captive solar capacity, annual generation (MU), grid vs solar tariff spreads, and 6-year return trajectories.

---

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/princebavishi/ICRT-India-Corporate-Renewables-Terminal.git
cd ICRT-India-Corporate-Renewables-Terminal
```

### 2. Run the React Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
Terminal interface will open at `http://localhost:5173`.

### 3. Run the FastAPI Backend (Optional / Self-Hosted)
```bash
# In project root
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python server.py
```
API endpoints and SQLite server will run on `http://127.0.0.1:8000`.

---

## 📊 Deliverables & Export Files

| File | Format | Description |
| :--- | :--- | :--- |
| `indias_all_5461_listed_companies_master.xlsx` | Excel (1.04 MB) | Formatted multi-tab workbook categorized by Market Cap (Large, Mid, Small, Micro) and 2W/3W OEMs. |
| `indias_all_5461_listed_shares_screener.csv` | CSV (704 KB) | Master flat CSV containing all 5,461 companies. |
| `screener_all_5461_companies.json` | JSON (1.85 MB) | Complete raw JSON snapshot extracted across all 219 Screener.in pages. |
| `renewables_stocks.db` | SQLite (1.98 MB) | Indexed SQLite relational database storing 5,448 unique equities. |

---

## 🌐 Deploy to Vercel

The project is structured with dual deployment support:
1. Click the **Deploy with Vercel** button above.
2. Vercel automatically detects `frontend/` and executes `npm run build`.
3. The application runs serverlessly using optimized static datasets (`/public/data/`).

---

## 🤝 Contributing

Contributions are welcomed! Please review our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

---

## 📜 License

This project is open-source software licensed under the [MIT License](LICENSE).
Copyright (c) 2026 Prince Bavishi.
