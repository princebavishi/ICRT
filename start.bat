@echo off
title India Corporate Renewables Terminal
echo ========================================================
echo  KICK-STARTING INDIA CORPORATE RENEWABLES TERMINAL
echo  Database: renewables_stocks.db (75 Listed Stocks)
echo  Server URL: http://127.0.0.1:8000
echo ========================================================
echo.
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8000"
python -m uvicorn server:app --host 127.0.0.1 --port 8000
pause
