@echo off
echo ============================================
echo Stopping PDF Email Manager...
echo ============================================
echo.

REM Kill Python processes (backend)
taskkill /F /IM python.exe /T >nul 2>&1
taskkill /F /IM pythonw.exe /T >nul 2>&1

REM Kill Node processes (frontend)
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo PDF Email Manager has been stopped.
echo All server processes have been terminated.
echo.
pause
