@echo off
echo ============================================
echo Building Desktop Application
echo ============================================
echo.

echo Step 1: Building React frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo Step 2: Installing Electron dependencies...
cd ..\electron
call npm install
if errorlevel 1 (
    echo ERROR: Electron install failed
    pause
    exit /b 1
)

echo.
echo Step 3: Building Windows executable...
call npm run build:win
if errorlevel 1 (
    echo ERROR: Desktop build failed
    pause
    exit /b 1
)

echo.
echo ============================================
echo Build Complete!
echo ============================================
echo.
echo Your executables are in: electron\dist\
echo.
echo Files created:
echo - PDF-Email-Manager-Setup.exe (Installer)
echo - PDFEmailManager-Portable.exe (Portable)
echo.
echo You can now distribute these files to users!
echo.
pause
