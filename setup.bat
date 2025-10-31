@echo off
echo ============================================
echo PDF Email Manager - First Time Setup
echo ============================================
echo.
echo This will install all required dependencies.
echo This may take several minutes...
echo.
pause

REM Check Python
echo [1/5] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH"
    pause
    exit /b 1
)
echo Python is installed: 
python --version

REM Check Node.js
echo.
echo [2/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js is installed:
node --version

REM Install Python dependencies
echo.
echo [3/5] Installing Python dependencies...
cd /d %~dp0backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)

REM Install Node dependencies
echo.
echo [4/5] Installing Node.js dependencies...
cd /d %~dp0frontend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)

REM Check MongoDB
echo.
echo [5/5] Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if errorlevel 1 (
    echo WARNING: MongoDB is not running
    echo Please make sure MongoDB is installed and running
    echo Download from: https://www.mongodb.com/try/download/community
) else (
    echo MongoDB is running!
)

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run start.bat to launch the application
echo 3. The app will open in your browser
echo.
echo Note: You only need to run setup.bat once.
echo After that, just use start.bat to launch the app.
echo.
pause
