@echo off
setlocal
cd /d "%~dp0"
set "PREVIEW_URL=http://127.0.0.1:5173/#/C-01"

where node >nul 2>&1
if errorlevel 1 goto node_missing

rem If this mockup is already running, open it instead of starting a duplicate server.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try {$r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/' -TimeoutSec 1; if($r.Content -match 'RMA Delivery.{0,20}Mobile Mockup'){exit 0}; exit 2} catch {exit 1}" >nul 2>&1
if not errorlevel 1 goto already_running
if errorlevel 2 goto port_in_use

echo Starting RMA Delivery preview from this folder...
start "" /b node "%~dp0scripts\serve.mjs"
set /a attempts=0

:wait_for_server
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "try {$r=Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/' -TimeoutSec 1; if($r.Content -match 'RMA Delivery.{0,20}Mobile Mockup'){exit 0}; exit 1} catch {exit 1}" >nul 2>&1
if not errorlevel 1 goto preview_ready
set /a attempts+=1
if %attempts% GEQ 25 goto startup_failed
timeout /t 1 /nobreak >nul
goto wait_for_server

:already_running
echo RMA Delivery preview is already running.
start "" "%PREVIEW_URL%"
echo You can leave this window open.
pause >nul
exit /b 0

:preview_ready
echo Preview is ready. Opening C-01 in your browser...
start "" "%PREVIEW_URL%"
echo Keep this window open while you review the mockup.
echo Close this window or press Ctrl+C to stop the preview server.
pause >nul
exit /b 0

:node_missing
echo Node.js was not found. Install Node.js 20 or later, then run this file again.
pause
exit /b 1

:port_in_use
echo Port 5173 is already serving a different page.
echo Close that application, then double-click this file again.
pause
exit /b 2

:startup_failed
echo The preview did not become ready within 25 seconds.
echo Check the Node.js message above and make sure port 5173 is available.
pause
exit /b 1
