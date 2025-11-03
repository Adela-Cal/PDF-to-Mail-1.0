@echo off
echo ========================================
echo Speedy Statements - Complete Setup
echo ========================================
echo.
echo This will:
echo 1. Ask for your GitHub repository URL
echo 2. Clone the repository
echo 3. Install dependencies
echo 4. Build the application
echo 5. Create the installer
echo.
echo IMPORTANT: Make sure you have installed:
echo - Python 3.11+ (with "Add to PATH" checked)
echo - Node.js 18+
echo.
pause
echo.

REM Get GitHub URL from user
set /p GITHUB_URL="Enter your GitHub repository URL (e.g., https://github.com/username/repo-name): "
echo.
echo Using repository: %GITHUB_URL%
echo.
pause

REM Extract repository name from URL
for %%a in ("%GITHUB_URL:/= %") do set REPO_NAME=%%a
set REPO_NAME=%REPO_NAME:.git=%
echo Repository name: %REPO_NAME%
echo.

REM Check if Python is installed
echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Python is not installed or not in PATH!
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation!
    echo.
    pause
    exit /b 1
)
echo Python OK
echo.

REM Check if Node.js is installed
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo Node.js OK
echo.

REM Check if Git is installed
echo Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/
    echo.
    pause
    exit /b 1
)
echo Git OK
echo.

REM Navigate to Program Files
echo Navigating to C:\Program Files...
cd "C:\Program Files"
if errorlevel 1 (
    echo ERROR: Cannot access C:\Program Files
    echo Are you running as Administrator?
    pause
    exit /b 1
)
echo.

REM Clone repository
echo Cloning repository...
echo This may take a few minutes...
git clone %GITHUB_URL%
if errorlevel 1 (
    echo.
    echo ERROR: Failed to clone repository!
    echo Please check:
    echo 1. The URL is correct
    echo 2. You have access to the repository
    echo 3. Your internet connection is working
    echo.
    pause
    exit /b 1
)
echo Repository cloned!
echo.

REM Enter repository directory
echo Entering repository directory...
cd %REPO_NAME%
if errorlevel 1 (
    echo ERROR: Repository directory not found!
    pause
    exit /b 1
)
echo Current directory: %CD%
echo.
pause

REM Install Yarn if needed
echo Checking Yarn...
yarn --version >nul 2>&1
if errorlevel 1 (
    echo Installing Yarn...
    npm install -g yarn
)
echo Yarn OK
echo.

REM Clean previous builds
echo Cleaning previous builds...
if exist "standalone-build\backend" rmdir /s /q "standalone-build\backend" >nul 2>&1
if exist "standalone-build\frontend" rmdir /s /q "standalone-build\frontend" >nul 2>&1
if exist "standalone-build\dist" rmdir /s /q "standalone-build\dist" >nul 2>&1
echo Done
echo.

REM Build frontend
echo ========================================
echo Building Frontend (5-10 minutes)
echo ========================================
echo.
cd frontend
if errorlevel 1 (
    echo ERROR: Frontend directory not found!
    pause
    exit /b 1
)

copy /Y ..\standalone-build\.env.production .env.production >nul 2>&1

echo Installing frontend dependencies...
call yarn install
if errorlevel 1 (
    echo ERROR: Frontend dependency installation failed!
    pause
    exit /b 1
)

echo Building frontend...
call yarn build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

mkdir ..\standalone-build\frontend >nul 2>&1
xcopy /E /I /Y build\* ..\standalone-build\frontend >nul 2>&1

cd ..
echo Frontend build complete!
echo.

REM Build backend
echo ========================================
echo Building Backend (5-10 minutes)
echo ========================================
echo.
cd standalone-build
if errorlevel 1 (
    echo ERROR: standalone-build directory not found!
    pause
    exit /b 1
)

echo Installing Python dependencies...
pip install -r requirements.txt --quiet
pip install pyinstaller --quiet

echo Building backend executable...
echo This may take several minutes...
pyinstaller server_standalone.spec --clean
if errorlevel 1 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)

mkdir backend >nul 2>&1
copy dist\SpeedyStatementsServer.exe backend\ >nul 2>&1
echo Backend build complete!
echo.

REM Build installer
echo ========================================
echo Building Installer (3-5 minutes)
echo ========================================
echo.
echo Installing Electron dependencies...
call yarn install
if errorlevel 1 (
    echo ERROR: Electron dependency installation failed!
    pause
    exit /b 1
)

echo Building installer...
call yarn build
if errorlevel 1 (
    echo ERROR: Installer build failed!
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo SUCCESS! BUILD COMPLETE!
echo ========================================
echo.
echo Your installer is ready at:
echo %CD%\standalone-build\dist\Speedy Statements Setup 1.0.0.exe
echo.
echo You can now:
echo 1. Navigate to: %CD%\standalone-build\dist\
echo 2. Double-click: Speedy Statements Setup 1.0.0.exe
echo 3. Install and enjoy!
echo.
echo Opening the dist folder for you...
explorer "%CD%\standalone-build\dist"
echo.
pause
