@echo off
call backend\venv\Scripts\activate

start python realtime_pipeline\inventory_tracker.py
start python realtime_pipeline\driver_monitor.py
start python realtime_pipeline\sentiment_stream.py

pause
