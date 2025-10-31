@echo off
echo ============================================
echo PDF Email Manager - Icon Updater
echo ============================================
echo.
echo This script helps you update the application icon.
echo.

REM Check if icon.ico exists
if not exist "icon.ico" (
    echo ERROR: icon.ico not found in current directory
    echo.
    echo Please:
    echo 1. Place your icon.ico file in this folder
    echo 2. Run this script again
    echo.
    echo Or use: create_icon.py to generate a default icon
    pause
    exit /b 1
)

echo Found icon.ico in current directory
echo.
echo Copying to all required locations...
echo.

REM Copy to standalone folder
if exist "standalone\" (
    copy /Y icon.ico standalone\icon.ico >nul
    echo ✓ Copied to standalone\icon.ico
) else (
    echo ⚠ standalone folder not found
)

REM Copy to electron folder
if exist "electron\" (
    copy /Y icon.ico electron\icon.ico >nul
    echo ✓ Copied to electron\icon.ico
) else (
    echo ⚠ electron folder not found
)

REM Copy to standalone-electron folder
if exist "standalone-electron\" (
    copy /Y icon.ico standalone-electron\icon.ico >nul
    echo ✓ Copied to standalone-electron\icon.ico
) else (
    echo ⚠ standalone-electron folder not found
)

echo.
echo ============================================
echo Icon Updated Successfully!
echo ============================================
echo.
echo Next steps:
echo 1. Rebuild the application: build-standalone-fixed.bat
echo 2. Your new icon will appear in the installer
echo.
pause
