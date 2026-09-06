import csv

data = [
    {
        'Company Name': 'UltraTech Cement Ltd',
        'Sector': 'Cement & Building Materials',
        'Ticker': 'ULTRACEMCO',
        'Total Green Capacity (MW)': '1,363 MW (1,021 MW RE + 342 MW WHRS)',
        'Solar / Wind Installed (MW)': '1,021 MW',
        'Renewable Power Share (%)': '32% (Target: 85% by 2030, 100% by 2050)',
        'Annual Green Power Consumed (MU / Million kWh)': '3,600 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.20',
        'Green Power Landed Cost (Rs/kWh)': '3.80',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.40',
        'Est Annual Cost Shielded (Rs Crore)': '1,584 Cr',
        'Key RE Sourcing Model': 'Group Captive Solar/Wind + Onsite WHRS + RE100'
    },
    {
        'Company Name': 'Reliance Industries Ltd (RIL)',
        'Sector': 'Conglomerate (Oil, Retail, Telecom)',
        'Ticker': 'RELIANCE',
        'Total Green Capacity (MW)': 'Target 100 GW RE by 2030 (Kutch RE Hub + Jamnagar Giga Complex)',
        'Solar / Wind Installed (MW)': '247+ MW captive solar (Jio cell sites + 35 MWp Bidar plant)',
        'Renewable Power Share (%)': '~10% currently (Target: 40 Billion units/yr green electricity by 2026)',
        'Annual Green Power Consumed (MU / Million kWh)': '1,200 MU (Scaling towards 40,000 MU)',
        'Avg Grid Tariff (Rs/kWh)': '7.80',
        'Green Power Landed Cost (Rs/kWh)': '3.40',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.40',
        'Est Annual Cost Shielded (Rs Crore)': '528 Cr (Scaling to >16,000 Cr by 2030)',
        'Key RE Sourcing Model': 'Captive Solar Giga Complex + Tower Solarization + Green H2'
    },
    {
        'Company Name': 'Tata Steel Ltd',
        'Sector': 'Steel & Heavy Metals',
        'Ticker': 'TATASTEEL',
        'Total Green Capacity (MW)': '1,036 MW captive RE pipeline/installed',
        'Solar / Wind Installed (MW)': '451.5 MW Solar + 587 MW Wind (incl. 72.5 MW Kalasar solar)',
        'Renewable Power Share (%)': '16% (Target: 50% by 2030)',
        'Annual Green Power Consumed (MU / Million kWh)': '2,100 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.00',
        'Green Power Landed Cost (Rs/kWh)': '3.90',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.10',
        'Est Annual Cost Shielded (Rs Crore)': '861 Cr',
        'Key RE Sourcing Model': 'Group Captive with Tata Power Renewable (TPREL) - Sprint to Zero'
    },
    {
        'Company Name': 'JSW Steel Ltd',
        'Sector': 'Steel & Metals',
        'Ticker': 'JSWSTEEL',
        'Total Green Capacity (MW)': '782 MW commissioned (Target: 1,000 MW Phase 1 + 1,500 MW Phase 2)',
        'Solar / Wind Installed (MW)': '782 MW (Solar & Wind at Vijayanagar & Salem)',
        'Renewable Power Share (%)': '14% (Target: 100% captive green by 2050)',
        'Annual Green Power Consumed (MU / Million kWh)': '1,750 MU',
        'Avg Grid Tariff (Rs/kWh)': '7.90',
        'Green Power Landed Cost (Rs/kWh)': '3.85',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.05',
        'Est Annual Cost Shielded (Rs Crore)': '708 Cr',
        'Key RE Sourcing Model': 'Group Captive PPA with JSW Energy'
    },
    {
        'Company Name': 'Shree Cement Ltd',
        'Sector': 'Cement & Materials',
        'Ticker': 'SHREECEM',
        'Total Green Capacity (MW)': '666.5 MW green power (350 MW Solar & Wind + 274 MW WHRS)',
        'Solar / Wind Installed (MW)': '350 MW Solar & Wind',
        'Renewable Power Share (%)': '55% - 63% (Top green power consumer in Indian heavy industry)',
        'Annual Green Power Consumed (MU / Million kWh)': '1,950 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.10',
        'Green Power Landed Cost (Rs/kWh)': '3.60',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.50',
        'Est Annual Cost Shielded (Rs Crore)': '877 Cr',
        'Key RE Sourcing Model': 'Captive Solar/Wind parks + extensive WHRS'
    },
    {
        'Company Name': 'Dalmia Bharat Ltd',
        'Sector': 'Cement',
        'Ticker': 'DALBHARAT',
        'Total Green Capacity (MW)': '410 MW green power (136 MW Solar + Wind + WHRS)',
        'Solar / Wind Installed (MW)': '136 MW Solar + Wind',
        'Renewable Power Share (%)': '46% - 48% (Target: 100% by 2030, RE100)',
        'Annual Green Power Consumed (MU / Million kWh)': '850 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.00',
        'Green Power Landed Cost (Rs/kWh)': '3.70',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.30',
        'Est Annual Cost Shielded (Rs Crore)': '365 Cr',
        'Key RE Sourcing Model': 'Onsite Solar + Offsite Open Access + Carbon Negative by 2040'
    },
    {
        'Company Name': 'Infosys Ltd',
        'Sector': 'Information Technology',
        'Ticker': 'INFY',
        'Total Green Capacity (MW)': '60 MW captive PV + offsite PPAs',
        'Solar / Wind Installed (MW)': '60 MW captive rooftop & ground solar PV',
        'Renewable Power Share (%)': '77.7% of India electricity (RE100 Signatory)',
        'Annual Green Power Consumed (MU / Million kWh)': '285 MU',
        'Avg Grid Tariff (Rs/kWh)': '9.20',
        'Green Power Landed Cost (Rs/kWh)': '3.50',
        'Cost Shielded / Unit Saved (Rs/kWh)': '5.70',
        'Est Annual Cost Shielded (Rs Crore)': '162 Cr',
        'Key RE Sourcing Model': 'Campus Rooftop PV + Offsite Green PPA + Carbon Neutrality'
    },
    {
        'Company Name': 'ITC Limited',
        'Sector': 'FMCG, Paper & Packaging, Hotels',
        'Ticker': 'ITC',
        'Total Green Capacity (MW)': '177 MW - 205 MW Solar & Wind',
        'Solar / Wind Installed (MW)': '177 MW dedicated solar & wind assets',
        'Renewable Power Share (%)': '>50% of total energy consumption',
        'Annual Green Power Consumed (MU / Million kWh)': '420 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.50',
        'Green Power Landed Cost (Rs/kWh)': '3.75',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.75',
        'Est Annual Cost Shielded (Rs Crore)': '199 Cr',
        'Key RE Sourcing Model': 'Open Access Solar/Wind + Rooftop Solar + Biomass substitution'
    },
    {
        'Company Name': 'Hindalco Industries Ltd',
        'Sector': 'Aluminium & Copper (Metals)',
        'Ticker': 'HINDALCO',
        'Total Green Capacity (MW)': '190 MW operational (expanding to 470 MW; 100-350 MW RTC Greenko tie-up)',
        'Solar / Wind Installed (MW)': '190 MW Solar & Wind',
        'Renewable Power Share (%)': '~8% (scaling rapidly for smelter decarbonization)',
        'Annual Green Power Consumed (MU / Million kWh)': '650 MU',
        'Avg Grid Tariff (Rs/kWh)': '7.50',
        'Green Power Landed Cost (Rs/kWh)': '3.80',
        'Cost Shielded / Unit Saved (Rs/kWh)': '3.70',
        'Est Annual Cost Shielded (Rs Crore)': '240 Cr',
        'Key RE Sourcing Model': 'Round-the-Clock (RTC) Renewable PPA + Hydro storage'
    },
    {
        'Company Name': 'Tata Motors Ltd',
        'Sector': 'Automotive',
        'Ticker': 'TATAMOTORS',
        'Total Green Capacity (MW)': '131 MW Hybrid PPA + 21 MW Rooftop Solar (~152 MW)',
        'Solar / Wind Installed (MW)': '152 MW equivalent captive/PPA',
        'Renewable Power Share (%)': '51% of India operations (FY25-26)',
        'Annual Green Power Consumed (MU / Million kWh)': '220 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.80',
        'Green Power Landed Cost (Rs/kWh)': '3.80',
        'Cost Shielded / Unit Saved (Rs/kWh)': '5.00',
        'Est Annual Cost Shielded (Rs Crore)': '110 Cr',
        'Key RE Sourcing Model': 'Rooftop Solar on Pune/Sanand + 131 MW Hybrid PPA with TPREL'
    },
    {
        'Company Name': 'Bharti Airtel Ltd (incl. Nxtra)',
        'Sector': 'Telecom & Data Centers',
        'Ticker': 'BHARTIARTL',
        'Total Green Capacity (MW)': '482,800 MWh contracted green power + 28,000 solarized cell sites',
        'Solar / Wind Installed (MW)': '~120 MW equivalent solar/hybrid PPAs + onsite rooftop',
        'Renewable Power Share (%)': '49% in Nxtra Data Centers (RE100 member)',
        'Annual Green Power Consumed (MU / Million kWh)': '483 MU',
        'Avg Grid Tariff (Rs/kWh)': '9.50',
        'Green Power Landed Cost (Rs/kWh)': '4.20',
        'Cost Shielded / Unit Saved (Rs/kWh)': '5.30',
        'Est Annual Cost Shielded (Rs Crore)': '256 Cr',
        'Key RE Sourcing Model': 'Open Access Solar/Wind for Data Centers + Telecom Tower solar'
    },
    {
        'Company Name': 'Larsen & Toubro Ltd (L&T)',
        'Sector': 'Engineering & Construction',
        'Ticker': 'LT',
        'Total Green Capacity (MW)': '65 MW captive solar/wind installations across manufacturing hubs',
        'Solar / Wind Installed (MW)': '65 MW',
        'Renewable Power Share (%)': '38% across major campuses (Hazira, Chennai, etc.)',
        'Annual Green Power Consumed (MU / Million kWh)': '145 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.40',
        'Green Power Landed Cost (Rs/kWh)': '3.90',
        'Cost Shielded / Unit Saved (Rs/kWh)': '4.50',
        'Est Annual Cost Shielded (Rs Crore)': '65 Cr',
        'Key RE Sourcing Model': 'Rooftop & Ground Solar at Heavy Engineering Facilities'
    },
    {
        'Company Name': 'Mahindra & Mahindra Ltd',
        'Sector': 'Automotive & Farm Equipment',
        'Ticker': 'M&M',
        'Total Green Capacity (MW)': '78 MW (Solar & Wind PPAs + Rooftop)',
        'Solar / Wind Installed (MW)': '78 MW',
        'Renewable Power Share (%)': '45% (EP100 & RE100 participant)',
        'Annual Green Power Consumed (MU / Million kWh)': '160 MU',
        'Avg Grid Tariff (Rs/kWh)': '8.90',
        'Green Power Landed Cost (Rs/kWh)': '3.80',
        'Cost Shielded / Unit Saved (Rs/kWh)': '5.10',
        'Est Annual Cost Shielded (Rs Crore)': '81 Cr',
        'Key RE Sourcing Model': 'Group Captive Solar with Mahindra Susten + Factory Rooftops'
    }
]

headers = list(data[0].keys())

with open('indias_listed_companies_renewables_data.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(data)

print(f"Successfully generated indias_listed_companies_renewables_data.csv with {len(data)} companies.")
