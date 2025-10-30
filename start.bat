@echo off
echo ============================================
echo PDF Email Manager - Windows Launcher
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if errorlevel 1 (
    echo WARNING: MongoDB does not appear to be running
    echo Please start MongoDB before continuing
    echo You can start it from Services or run: net start MongoDB
    echo.
    echo Press any key to continue anyway, or close this window to exit
    pause
)

echo.
echo Starting PDF Email Manager...
echo.

REM Start backend in a new window
start "PDF Email Manager - Backend" cmd /k "cd /d %~dp0backend && echo Starting Backend Server... && python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window  
start "PDF Email Manager - Frontend" cmd /k "cd /d %~dp0frontend && echo Starting Frontend... && set BROWSER=none && npm start"

REM Wait for frontend to start
timeout /t 5 /nobreak >nul

REM Open browser
echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ============================================
echo PDF Email Manager is now running!
echo.
echo Backend:  http://localhost:8001
echo Frontend: http://localhost:3000
echo.
echo Two command windows have opened:
echo - Backend Server (don't close this)
echo - Frontend Server (don't close this)
echo.
echo To stop the application:
echo - Close both command windows
echo - Or run stop.bat
echo ============================================
echo.
pause
