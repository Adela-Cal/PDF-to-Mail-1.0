@echo off
setlocal enabledelayedexpansion

echo.
echo ================================================================
echo     PDF EMAIL MANAGER - STANDALONE BUILDER (FIXED)
echo ================================================================
echo.
echo This will create a SINGLE INSTALLER with NO dependencies!
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
python -m pip install -r requirements.txt --user
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install Python requirements
    echo Make sure Python is installed correctly
    pause
    exit /b 1
)

echo.
echo Installing PyInstaller...
python -m pip install pyinstaller --user
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install PyInstaller
    pause
    exit /b 1
)

echo.
echo Building backend executable (this may take 3-5 minutes)...
echo Please wait...
python -m PyInstaller server_standalone.spec
if errorlevel 1 (
    echo.
    echo ERROR: Backend build failed
    echo.
    echo Common fixes:
    echo 1. Make sure Python 3.8+ is installed
    echo 2. Try running as Administrator
    echo 3. Check that server_standalone.py exists
    echo.
    pause
    exit /b 1
)

if not exist "dist\PDFEmailManagerBackend.exe" (
    echo.
    echo ERROR: Backend executable was not created
    echo The build completed but the .exe file is missing
    pause
    exit /b 1
)

echo.
echo ✓ Backend executable created successfully!
echo   Location: standalone\dist\PDFEmailManagerBackend.exe
for %%A in (dist\PDFEmailManagerBackend.exe) do (
    set size=%%~zA
    set /a sizemb=!size!/1024/1024
    echo   Size: !sizemb! MB
)

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
        echo Make sure Node.js is installed from nodejs.org
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
echo Please be patient...
echo.
call npm run build:win
if errorlevel 1 (
    echo.
    echo ERROR: Final packaging failed
    echo.
    echo This might be because:
    echo 1. Previous steps didn't complete successfully
    echo 2. Not enough disk space
    echo 3. Antivirus blocking the build
    echo.
    pause
    exit /b 1
)

if not exist "dist\PDF-Email-Manager-Setup.exe" (
    echo.
    echo ERROR: Installer was not created
    echo Check the messages above for clues
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
echo FOR END USERS (ZERO DEPENDENCIES):
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
echo 1. Test the installer on another PC (or VM)
echo 2. Verify all features work
echo 3. Distribute to users!
echo.
pause

REM Open the dist folder
cd dist
start .
