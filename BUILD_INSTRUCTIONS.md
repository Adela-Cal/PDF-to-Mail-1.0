# Speedy Statements - Build Instructions

This guide will help you build the **Speedy Statements** desktop application installer for Windows 10/11.

## Prerequisites

You need the following installed on your Windows build machine:

1. **Python 3.11+** - [Download](https://www.python.org/downloads/)
2. **Node.js 18+** - [Download](https://nodejs.org/)
3. **Git** (optional) - [Download](https://git-scm.com/)

## Build Process Overview

The build process has 3 main steps:
1. Build the React frontend
2. Build the Python backend executable
3. Package everything into an installer

## Step-by-Step Build Instructions

### Step 1: Prepare the Build Environment

1. Open **Command Prompt** or **PowerShell** as Administrator

2. Navigate to the project folder:
   ```cmd
   cd /app/standalone-build
   ```

### Step 2: Build the Frontend

1. Navigate to the frontend folder:
   ```cmd
   cd ../frontend
   ```

2. Install dependencies (if not already installed):
   ```cmd
   yarn install
   ```

3. Build the production frontend:
   ```cmd
   yarn build
   ```

4. Copy the built frontend to the standalone-build folder:
   ```cmd
   mkdir ..\standalone-build\frontend
   xcopy /E /I /Y build\* ..\standalone-build\frontend
   ```

5. Go back to the standalone-build folder:
   ```cmd
   cd ..\standalone-build
   ```

### Step 3: Build the Backend Executable

1. Install Python dependencies:
   ```cmd
   pip install -r requirements.txt
   ```

2. Install PyInstaller:
   ```cmd
   pip install pyinstaller
   ```

3. Build the backend executable:
   ```cmd
   pyinstaller server_standalone.spec
   ```

4. The executable will be created at: `dist/SpeedyStatementsServer.exe`

5. Create backend folder and copy the executable:
   ```cmd
   mkdir backend
   copy dist\SpeedyStatementsServer.exe backend\
   ```

### Step 4: Build the Installer

1. Install Electron dependencies:
   ```cmd
   yarn install
   ```

2. Build the installer:
   ```cmd
   yarn build
   ```

3. The installer will be created at: `dist/Speedy Statements Setup X.X.X.exe`

## What Gets Created

After successful build, you'll have:
- **Installer**: `dist/Speedy Statements Setup 1.0.0.exe` (approx 150-200 MB)

## Testing the Installer

1. Double-click the installer: `Speedy Statements Setup 1.0.0.exe`
2. Follow the installation wizard
3. Launch "Speedy Statements" from Desktop or Start Menu
4. The application should open without any browser window

## Troubleshooting

### Backend Build Fails

**Problem**: PyInstaller fails to build
**Solution**: 
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Try running: `pip install pyinstaller --upgrade`

### Frontend Build Fails

**Problem**: `yarn build` fails
**Solution**:
- Delete `node_modules` folder
- Run: `yarn install` again
- Then: `yarn build`

### Installer Build Fails

**Problem**: `electron-builder` fails
**Solution**:
- Ensure backend executable exists at `backend/SpeedyStatementsServer.exe`
- Ensure frontend files exist in `frontend/` folder
- Run: `yarn install` to reinstall dependencies

### Application Won't Start

**Problem**: Installed app doesn't open
**Solution**:
- Check Windows Defender / Antivirus (may block unsigned .exe)
- Run as Administrator
- Check Event Viewer for errors

## Adding a Custom Icon

To add your own application icon:

1. Convert your icon to `.ico` format (256x256 recommended)
2. Save it as `icon.ico` in the `standalone-build` folder
3. Edit `package.json`, change:
   ```json
   "win": {
     "icon": "icon.ico"
   }
   ```
4. Edit `server_standalone.spec`, change:
   ```python
   icon='icon.ico'
   ```
5. Rebuild both backend and installer

## Data Storage Location

The application stores data locally at:
- **Windows**: `%APPDATA%\SpeedyStatements\data\`
- Files: `templates.json`, `accounts.json`

Each installation has its own data - data is never shared between installations.

## Support

For issues during build process:
- Check the Troubleshooting section above
- Review error messages carefully
- Ensure all prerequisites are installed correctly
