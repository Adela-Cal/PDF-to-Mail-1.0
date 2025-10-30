@echo off
echo ============================================
echo PDF Email Manager - Desktop Version
echo ============================================
echo.
echo Starting in DESKTOP MODE...
echo This will open a standalone window, NOT a browser.
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if errorlevel 1 (
    echo WARNING: MongoDB does not appear to be running
    echo Please start MongoDB before continuing
    pause
)

REM Check if Electron dependencies are installed
if not exist "electron\node_modules\" (
    echo Installing Electron dependencies...
    cd electron
    call npm install
    cd ..
)

REM Check if frontend build exists
if not exist "frontend\build\" (
    echo Building frontend for desktop...
    cd frontend
    call npm run build
    cd ..
)

echo.
echo Starting PDF Email Manager Desktop Application...
cd electron
npm start
