# Creating a Windows Executable for PDF Email Manager

This guide explains how to create a standalone Windows executable (.exe) that bundles the entire PDF Email Manager application.

## Method 1: Using PyInstaller (Recommended for Launcher)

### Step 1: Install PyInstaller
```bash
pip install pyinstaller
```

### Step 2: Create the Executable
```bash
pyinstaller --onefile --windowed --icon=icon.ico --name="PDF-Email-Manager" launcher.py
```

**Options explained:**
- `--onefile`: Creates a single executable file
- `--windowed`: No console window (use `--console` if you want to see output)
- `--icon=icon.ico`: Custom icon (optional)
- `--name`: Name of the executable

The executable will be in the `dist` folder.

### Step 3: Bundle Everything
Create a folder structure:
```
PDF-Email-Manager/
├── PDF-Email-Manager.exe  (from dist folder)
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
└── README.txt
```

## Method 2: Creating an Installer with Inno Setup

### Prerequisites
1. Download and install Inno Setup: https://jrsoftware.org/isinfo.php
2. Have your application ready in a folder

### Step 1: Create Inno Setup Script

Create a file called `installer.iss`:

```iss
[Setup]
AppName=PDF Email Manager
AppVersion=1.0
DefaultDirName={autopf}\PDF Email Manager
DefaultGroupName=PDF Email Manager
OutputBaseFilename=PDFEmailManager-Setup
Compression=lzma2
SolidCompression=yes
OutputDir=output

[Files]
Source: "launcher.py"; DestDir: "{app}"; Flags: ignoreversion
Source: "backend\*"; DestDir: "{app}\backend"; Flags: ignoreversion recursesubdirs
Source: "frontend\*"; DestDir: "{app}\frontend"; Flags: ignoreversion recursesubdirs
Source: "start.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "stop.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "setup.bat"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\PDF Email Manager"; Filename: "{app}\start.bat"; IconFilename: "{app}\icon.ico"
Name: "{group}\Stop PDF Email Manager"; Filename: "{app}\stop.bat"
Name: "{commondesktop}\PDF Email Manager"; Filename: "{app}\start.bat"; IconFilename: "{app}\icon.ico"

[Run]
Filename: "{app}\setup.bat"; Description: "Install dependencies"; Flags: postinstall runascurrentuser

[Code]
function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  Result := True;
  // Check if Python is installed
  if not Exec('python', '--version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    MsgBox('Python is not installed. Please install Python 3.8+ from https://www.python.org/downloads/', mbError, MB_OK);
    Result := False;
  end;
  // Check if Node.js is installed
  if not Exec('node', '--version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    MsgBox('Node.js is not installed. Please install Node.js from https://nodejs.org/', mbError, MB_OK);
    Result := False;
  end;
end;
```

### Step 2: Compile the Installer
1. Open Inno Setup Compiler
2. Open `installer.iss`
3. Click "Compile" (or press Ctrl+F9)
4. The installer will be created in the `output` folder

## Method 3: Portable ZIP Package

### Create a Portable Version

1. **Create folder structure:**
```
PDF-Email-Manager-Portable/
├── START_HERE.bat
├── STOP.bat
├── SETUP.bat
├── README.txt
├── backend/
├── frontend/
└── tools/
    ├── mongodb-portable/  (optional)
    └── python-embedded/   (optional)
```

2. **Create START_HERE.bat:**
```batch
@echo off
echo Starting PDF Email Manager...
echo.
echo First time? Run SETUP.bat first!
echo.
start.bat
```

3. **Bundle with 7-Zip:**
```bash
# Install 7-Zip, then:
7z a -tzip PDF-Email-Manager-Portable.zip PDF-Email-Manager-Portable\*
```

## Method 4: Using Electron (Full Standalone App)

This method creates a true desktop application with everything bundled.

### Step 1: Install Electron Forge
```bash
npm install -g @electron-forge/cli
```

### Step 2: Create Electron Wrapper

Create `electron-main.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backend, frontend;
let mainWindow;

function startBackend() {
  const pythonPath = path.join(__dirname, 'backend', 'venv', 'Scripts', 'python.exe');
  backend = spawn(pythonPath, ['-m', 'uvicorn', 'server:app', '--host', 'localhost', '--port', '8001'], {
    cwd: path.join(__dirname, 'backend')
  });
}

function startFrontend() {
  frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'frontend'),
    env: { ...process.env, BROWSER: 'none' }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Wait for servers to start
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000');
  }, 5000);
}

app.whenReady().then(() => {
  startBackend();
  startFrontend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backend) backend.kill();
  if (frontend) frontend.kill();
  app.quit();
});
```

### Step 3: Create package.json for Electron
```json
{
  "name": "pdf-email-manager",
  "version": "1.0.0",
  "main": "electron-main.js",
  "scripts": {
    "start": "electron .",
    "package": "electron-forge package",
    "make": "electron-forge make"
  },
  "devDependencies": {
    "@electron-forge/cli": "^6.0.0",
    "electron": "^28.0.0"
  }
}
```

### Step 4: Build Executable
```bash
npm run make
```

This creates a standalone .exe in the `out` folder.

## Method 5: Docker Desktop for Windows

### Create docker-compose.yml:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "8001:8001"
    depends_on:
      - mongodb
    environment:
      - MONGO_URL=mongodb://mongodb:27017

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Usage:
```bash
# Start everything
docker-compose up

# Access at http://localhost:3000
```

## Recommended Approach for Distribution

For easiest distribution to non-technical users:

1. **Create Inno Setup Installer** (Method 2)
   - Professional looking installer
   - Checks for prerequisites
   - Creates Start Menu shortcuts
   - Desktop icon
   - Automatic dependency setup

2. **Include Prerequisites Installers**
   - Bundle Python installer
   - Bundle Node.js installer
   - Bundle MongoDB installer
   - Or check and download during install

3. **Auto-configuration**
   - Setup.bat runs automatically after install
   - Creates necessary files and folders
   - Checks connectivity

## Testing Your Executable

Before distributing:

1. **Test on clean Windows install** (VM recommended)
2. **Verify all dependencies install**
3. **Test all features work**
4. **Check antivirus doesn't block it**
5. **Test with different Windows versions** (10, 11)
6. **Test with different user permissions** (admin vs regular)

## File Size Considerations

- **Portable ZIP**: ~500MB (includes all code)
- **Installer**: ~50MB (downloads dependencies)
- **Electron App**: ~200MB (bundles Node.js)
- **PyInstaller**: ~20MB (just launcher)

## Troubleshooting Common Issues

### Issue: Antivirus blocks executable
**Solution:** 
- Sign your code with a certificate
- Submit to antivirus vendors for whitelisting
- Provide checksums for verification

### Issue: Dependencies not found
**Solution:**
- Use `--hidden-import` in PyInstaller
- Bundle dependencies explicitly
- Use virtual environments

### Issue: MongoDB connection fails
**Solution:**
- Include MongoDB portable version
- Or require user to install MongoDB separately
- Use MongoDB Atlas (cloud) as alternative

## Distribution Checklist

- [ ] README.txt with instructions
- [ ] LICENSE file
- [ ] System requirements listed
- [ ] Startup guide for first-time users
- [ ] Troubleshooting guide included
- [ ] Contact/support information
- [ ] Version number clearly visible
- [ ] Changelog for updates

## Quick Start for Users

Include this in your README:

```
QUICK START GUIDE

1. Run the installer (PDFEmailManager-Setup.exe)
2. Follow installation wizard
3. Click "PDF Email Manager" desktop icon
4. Wait for app to open in browser
5. Start using!

Note: First launch may take 1-2 minutes as dependencies install.
```
