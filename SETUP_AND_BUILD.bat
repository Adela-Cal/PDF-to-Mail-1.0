@echo off
echo ========================================
echo Speedy Statements - Automated Setup
echo ========================================
echo.
echo This script will:
echo 1. Check prerequisites (Python, Node.js)
echo 2. Install all dependencies
echo 3. Build the complete application
echo 4. Create the installer
echo.
pause
echo.

REM Check if Python is installed
echo [1/6] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Python is not installed!
    echo.
    echo Please install Python 3.11 or higher from:
    echo https://www.python.org/downloads/
    echo.
    echo ⚠️ IMPORTANT: Check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)
echo ✅ Python installed
echo.

REM Check if Node.js is installed
echo [2/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js 18 or higher from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js installed
echo.

REM Check if Yarn is installed, if not install it
echo [3/6] Checking Yarn...
yarn --version >nul 2>&1
if errorlevel 1 (
    echo Installing Yarn...
    npm install -g yarn
)
echo ✅ Yarn ready
echo.

REM Clean previous builds
echo [4/6] Cleaning previous builds...
if exist "standalone-build\backend" rmdir /s /q "standalone-build\backend" >nul 2>&1
if exist "standalone-build\frontend" rmdir /s /q "standalone-build\frontend" >nul 2>&1
if exist "standalone-build\dist" rmdir /s /q "standalone-build\dist" >nul 2>&1
echo ✅ Cleaned
echo.

REM Build frontend
echo [5/6] Building frontend (this may take 5-10 minutes)...
echo Please wait...
cd frontend
copy /Y ..\standalone-build\.env.production .env.production >nul 2>&1
call yarn install >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)
call yarn build >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
mkdir ..\standalone-build\frontend >nul 2>&1
xcopy /E /I /Y build\* ..\standalone-build\frontend >nul 2>&1
cd ..
echo ✅ Frontend built
echo.

REM Build backend executable
echo [6/6] Building backend and creating installer...
echo This is the longest step, please be patient...
cd standalone-build

REM Install Python dependencies
pip install -r requirements.txt --quiet
pip install pyinstaller --quiet

REM Build backend executable
pyinstaller server_standalone.spec --clean >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend build failed
    echo.
    echo Trying again with more details...
    pyinstaller server_standalone.spec --clean
    pause
    exit /b 1
)

REM Copy backend to folder
mkdir backend >nul 2>&1
copy dist\SpeedyStatementsServer.exe backend\ >nul 2>&1

REM Install Electron dependencies and build installer
call yarn install >nul 2>&1
call yarn build >nul 2>&1
if errorlevel 1 (
    echo ❌ Installer build failed
    pause
    exit /b 1
)

cd ..

echo ✅ Complete!
echo.
echo ========================================
echo 🎉 BUILD SUCCESSFUL!
echo ========================================
echo.
echo Your installer is ready at:
echo standalone-build\dist\Speedy Statements Setup 1.0.0.exe
echo.
echo You can now:
echo 1. Install it on this computer
echo 2. Copy it to other computers
echo 3. Distribute it to users
echo.
echo The installer is approximately 150-200 MB
echo.
pause
