import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('renewables_stocks.db')
cursor = conn.cursor()

cursor.execute('SELECT COUNT(*), SUM(re_mw), SUM(annual_shield_cr) FROM companies')
row = cursor.fetchone()
print(f'DB Check: Total Companies = {row[0]}, Total Green MW = {row[1]:.1f} MW, Total Shielded = ₹{row[2]:.1f} Cr')

cursor.execute('SELECT name, ticker, cap_tier, re_pct, annual_shield_cr, ret_5y FROM companies WHERE sector = "Automotive & 2W/3W"')
oems = cursor.fetchall()
print(f'\n2W & 3W OEMs in DB ({len(oems)}):')
for o in oems:
    print(f'  - {o[0]} ({o[1]} - {o[2]}): RE {o[3]}% | Shield ₹{o[4]} Cr | 5Y Ret {o[5]}%')

conn.close()
