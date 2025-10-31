@echo off
setlocal enabledelayedexpansion

echo.
echo ================================================================
echo     PDF EMAIL MANAGER - STANDALONE BUILDER
echo ================================================================
echo.
echo This will create a SINGLE INSTALLER with NO dependencies!
echo.
echo What this means:
echo  - NO Python installation required
echo  - NO Node.js installation required
echo  - NO MongoDB installation required
echo  - Users just run ONE installer and it works!
echo.
echo Build time: Approximately 10-15 minutes
echo Final size: Approximately 80-120 MB
echo.
pause

echo.
echo ================================================================
echo PHASE 1: Building Python Backend Executable
echo ================================================================
echo.

cd standalone

echo Installing Python requirements...
pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Python requirements
    echo Make sure Python is installed and in PATH
    pause
    exit /b 1
)

echo.
echo Installing PyInstaller...
pip install pyinstaller
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install PyInstaller
    pause
    exit /b 1
)

echo.
echo Building backend executable (this may take 3-5 minutes)...
python -m PyInstaller server_standalone.spec
if errorlevel 1 (
    echo.
    echo ERROR: Backend build failed
    echo Check the error messages above
    pause
    exit /b 1
)

if not exist "dist\PDFEmailManagerBackend.exe" (
    echo.
    echo ERROR: Backend executable was not created
    pause
    exit /b 1
)

echo.
echo ✓ Backend executable created successfully!
echo   Location: standalone\dist\PDFEmailManagerBackend.exe
for %%A in (dist\PDFEmailManagerBackend.exe) do echo   Size: %%~zA bytes

echo.
echo ================================================================
echo PHASE 2: Building React Frontend
echo ================================================================
echo.

cd ..\frontend

if not exist "node_modules\" (
    echo Installing frontend dependencies (this may take 2-3 minutes)...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)

echo.
echo Building frontend production bundle...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

if not exist "build\" (
    echo.
    echo ERROR: Frontend build folder was not created
    pause
    exit /b 1
)

echo.
echo ✓ Frontend built successfully!
echo   Location: frontend\build\

echo.
echo ================================================================
echo PHASE 3: Packaging Everything with Electron
echo ================================================================
echo.

cd ..\standalone-electron

if not exist "node_modules\" (
    echo Installing Electron dependencies...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install Electron dependencies
        pause
        exit /b 1
    )
)

echo.
echo Creating final standalone installer...
echo (This is the longest step - may take 5-7 minutes)
echo.
call npm run build:win
if errorlevel 1 (
    echo.
    echo ERROR: Final packaging failed
    echo Check that all previous steps completed successfully
    pause
    exit /b 1
)

if not exist "dist\PDF-Email-Manager-Setup.exe" (
    echo.
    echo ERROR: Installer was not created
    pause
    exit /b 1
)

echo.
echo ================================================================
echo           BUILD COMPLETED SUCCESSFULLY! 
echo ================================================================
echo.
echo Your standalone installer is ready:
echo.
echo   📦 standalone-electron\dist\PDF-Email-Manager-Setup.exe
echo.
for %%A in (dist\PDF-Email-Manager-Setup.exe) do (
    set size=%%~zA
    set /a sizemb=!size!/1024/1024
    echo   Size: !sizemb! MB
)
echo.
echo ================================================================
echo WHAT THIS INSTALLER INCLUDES:
echo ================================================================
echo.
echo  ✓ Python backend (bundled as .exe)
echo  ✓ React frontend (pre-built)
echo  ✓ SQLite database (built-in)
echo  ✓ All dependencies
echo  ✓ Desktop shortcut creator
echo  ✓ Start menu entry
echo  ✓ Uninstaller
echo.
echo ================================================================
echo FOR USERS (NO INSTALLATION NEEDED):
echo ================================================================
echo.
echo Users just need to:
echo  1. Run PDF-Email-Manager-Setup.exe
echo  2. Follow installation wizard
echo  3. Double-click desktop icon
echo  4. Start using immediately!
echo.
echo NO Python, NO Node.js, NO MongoDB required!
echo.
echo ================================================================
echo NEXT STEPS:
echo ================================================================
echo.
echo 1. Test the installer on a clean Windows PC
echo 2. Verify all features work
echo 3. Consider code signing (removes Windows warning)
echo 4. Distribute to users!
echo.
echo See BUILD_STANDALONE_COMPLETE.md for more details.
echo.
pause

REM Open the dist folder
cd dist
explorer .
