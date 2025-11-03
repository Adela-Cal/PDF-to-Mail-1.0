@echo off
echo ========================================
echo Speedy Statements - Automated Build
echo ========================================
echo.

REM Check if running from correct directory
if not exist "standalone-build" (
    echo ERROR: Please run this script from the /app directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [1/5] Cleaning previous builds...
if exist "standalone-build\backend" rmdir /s /q "standalone-build\backend"
if exist "standalone-build\frontend" rmdir /s /q "standalone-build\frontend"
if exist "standalone-build\dist" rmdir /s /q "standalone-build\dist"
echo Done!
echo.

echo [2/5] Building frontend...
cd frontend
call yarn install
if errorlevel 1 (
    echo ERROR: Frontend dependency installation failed
    pause
    exit /b 1
)

call yarn build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

mkdir ..\standalone-build\frontend
xcopy /E /I /Y build\* ..\standalone-build\frontend >nul
cd ..
echo Done!
echo.

echo [3/5] Building backend executable...
cd standalone-build

REM Install Python dependencies
pip install -r requirements.txt >nul
if errorlevel 1 (
    echo ERROR: Backend dependency installation failed
    pause
    exit /b 1
)

REM Install PyInstaller
pip install pyinstaller >nul

REM Build executable
pyinstaller server_standalone.spec --clean
if errorlevel 1 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)

REM Copy to backend folder
mkdir backend
copy dist\SpeedyStatementsServer.exe backend\ >nul
echo Done!
echo.

echo [4/5] Installing Electron dependencies...
call yarn install
if errorlevel 1 (
    echo ERROR: Electron dependency installation failed
    pause
    exit /b 1
)
echo Done!
echo.

echo [5/5] Building installer...
call yarn build
if errorlevel 1 (
    echo ERROR: Installer build failed
    pause
    exit /b 1
)
echo Done!
echo.

echo ========================================
echo BUILD COMPLETE!
echo ========================================
echo.
echo Your installer is ready at:
echo standalone-build\dist\Speedy Statements Setup 1.0.0.exe
echo.
echo You can now distribute this installer to users.
echo.
pause
