# Speedy Statements - Standalone Desktop Application

## Quick Start for Developers

This folder contains everything needed to build the **Speedy Statements** standalone Windows installer.

### What You Need

- **Windows 10/11** build machine
- **Python 3.11+** installed
- **Node.js 18+** installed

### Build the Installer (One Command)

From the `/app` directory, run:

```cmd
build-complete.bat
```

This automated script will:
1. Clean previous builds
2. Build the React frontend
3. Build the Python backend executable
4. Package everything into an installer

**Output**: `standalone-build/dist/Speedy Statements Setup 1.0.0.exe`

### What Gets Built

The build process creates a **single installer file** that contains:
- Electron-wrapped frontend (React app)
- PyInstaller-bundled backend (FastAPI server)
- All dependencies included
- No MongoDB required (uses JSON file storage)

### Architecture

```
Speedy Statements.exe (Main App)
├── Electron Process (Desktop Window)
│   └── React Frontend (UI)
└── Backend Process (SpeedyStatementsServer.exe)
    └── FastAPI Server (API on localhost:8001)
```

**Data Storage**:
- Location: `%APPDATA%\SpeedyStatements\data\`
- Files: `templates.json`, `accounts.json`
- Each installation has isolated data

### Manual Build Steps

If you prefer manual control, see: [BUILD_INSTRUCTIONS.md](/app/BUILD_INSTRUCTIONS.md)

### Testing the Build

1. Run the installer: `standalone-build/dist/Speedy Statements Setup 1.0.0.exe`
2. Install to a test directory
3. Launch "Speedy Statements"
4. Test core features:
   - PDF folder selection
   - Email extraction
   - Template management
   - Account management
   - Draft generation

### Customization

#### Change App Name
Edit `standalone-build/package.json`:
```json
"name": "your-app-name",
"productName": "Your App Name"
```

#### Add Custom Icon
1. Create `icon.ico` (256x256 recommended)
2. Place in `standalone-build/` folder
3. Edit `package.json`:
   ```json
   "win": {
     "icon": "icon.ico"
   }
   ```
4. Edit `server_standalone.spec`:
   ```python
   icon='icon.ico'
   ```
5. Rebuild

#### Change Version
Edit `standalone-build/package.json`:
```json
"version": "1.0.1"
```

### Distribution

The installer is a single `.exe` file that can be:
- Shared via email
- Downloaded from a website
- Distributed on USB drives
- Deployed via IT systems

**Size**: Approximately 150-200 MB

### Troubleshooting

See [BUILD_INSTRUCTIONS.md](/app/BUILD_INSTRUCTIONS.md) for detailed troubleshooting.

Common issues:
- **PyInstaller fails**: `pip install --upgrade pyinstaller`
- **Electron build fails**: Delete `node_modules`, run `yarn install`
- **Frontend missing**: Ensure `yarn build` completed successfully

### What's Different from Web Version

| Feature | Web Version | Standalone Version |
|---------|------------|-------------------|
| Database | MongoDB | JSON files |
| Backend Port | 8001 (public) | 127.0.0.1:8001 (local) |
| Frontend | Browser | Desktop window |
| Dependencies | Requires MongoDB | 100% self-contained |
| Data | Shared database | Per-installation |

### Key Files

- `server_standalone.py` - Standalone backend with embedded JSON storage
- `server_standalone.spec` - PyInstaller build configuration
- `electron-main.js` - Electron main process
- `package.json` - Electron builder configuration
- `requirements.txt` - Python dependencies

### Development vs Production

**Development Mode**:
- Frontend: `http://localhost:3000` (React dev server)
- Backend: Runs separately on port 8001
- Hot reload enabled

**Production Mode**:
- Frontend: Bundled with Electron
- Backend: Single executable (SpeedyStatementsServer.exe)
- No console windows
- Desktop application

---

For end-user documentation, see: [USER_GUIDE.md](/app/USER_GUIDE.md)
