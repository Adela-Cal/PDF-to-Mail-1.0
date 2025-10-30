# Building the Desktop Application

This guide explains how to create a standalone desktop application that runs WITHOUT a browser window.

## What's Different?

- **Before**: Application runs in Chrome/Edge browser window
- **After**: Application runs in its own desktop window (like Microsoft Word)

## Prerequisites

1. **Node.js 16+** - [Download](https://nodejs.org/)
2. **Python 3.8+** - [Download](https://www.python.org/)
3. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
4. **All dependencies installed** - Run `setup.bat` first

## Step 1: Build the Frontend for Production

The React app needs to be compiled into static files:

```bash
cd frontend
npm run build
```

This creates a `frontend/build` folder with optimized files.

## Step 2: Install Electron Dependencies

Navigate to the electron folder and install packages:

```bash
cd electron
npm install
```

This installs:
- `electron` - Desktop application framework
- `electron-builder` - Packaging tool
- `tree-kill` - Process management

## Step 3: Test the Desktop App (Development)

Run in development mode to test:

```bash
cd electron
npm start
```

What happens:
1. Backend starts automatically (FastAPI)
2. Frontend dev server starts (React)
3. Desktop window opens (instead of browser)
4. Application loads in the window

**Note**: First launch may take 10-15 seconds while servers start.

## Step 4: Build the Desktop Executable

Create the standalone Windows application:

```bash
cd electron
npm run build:win
```

This creates in `electron/dist`:
- **NSIS Installer** - `PDF-Email-Manager-Setup.exe` (installer)
- **Portable Version** - `PDFEmailManager-Portable.exe` (no install needed)

### Build Options:

**Full Installer:**
```bash
npm run build:win
```
Creates a Windows installer with:
- Desktop shortcut
- Start Menu entry
- Uninstaller
- ~150-200 MB

**Portable Executable:**
```bash
npm run build:portable
```
Creates a single .exe file:
- No installation required
- Run from USB drive
- ~150-200 MB

**Both:**
```bash
npm run build
```

## Step 5: Distribute to Users

### Option 1: Installer (Recommended)

Share `PDF-Email-Manager-Setup.exe`:

**User Steps:**
1. Double-click the installer
2. Choose installation folder
3. Click Install
4. Desktop shortcut created automatically
5. Double-click shortcut to run

### Option 2: Portable Version

Share `PDFEmailManager-Portable.exe`:

**User Steps:**
1. Copy .exe anywhere (desktop, USB drive, etc.)
2. Double-click to run
3. No installation needed

### Option 3: Complete Package

Create a ZIP with everything:

```
PDF-Email-Manager-Package.zip
├── PDFEmailManager-Portable.exe
├── README.txt
├── SETUP_GUIDE.txt
└── Prerequisites/
    ├── python-3.11.exe
    ├── node-v20.exe
    └── mongodb-installer.msi
```

## What Users Need

### Already Installed:
- Python 3.8+ (with pip)
- MongoDB (running as service)

### First Launch:
The app will install Python packages automatically.

### NOT Needed:
- ❌ Web browser
- ❌ Node.js (bundled in executable)
- ❌ React knowledge
- ❌ Terminal/Command prompt

## Troubleshooting Build Issues

### Error: electron-builder not found

```bash
cd electron
npm install electron-builder --save-dev
```

### Error: Frontend build folder not found

```bash
cd frontend
npm run build
```

Make sure `frontend/build` exists before building desktop app.

### Error: Python not found

Make sure Python is in PATH:
```bash
python --version
```

Should show Python 3.8+

### Build Too Large

The executable is large because it includes:
- Electron (~100MB)
- Node.js runtime (~30MB)
- Your application code
- Chromium browser engine

To reduce size:
- Remove unused dependencies
- Optimize images
- Use production builds only

### MongoDB Connection Error

Desktop app expects MongoDB at `mongodb://localhost:27017`

Edit `backend/.env` if using different settings.

## Advanced Configuration

### Custom Icon

1. Create or download an `.ico` file
2. Place it in `electron/` folder as `icon.ico`
3. Rebuild: `npm run build:win`

### App Name and Version

Edit `electron/package.json`:
```json
{
  "name": "pdf-email-manager-desktop",
  "version": "1.0.0",
  "description": "Your description",
  "build": {
    "productName": "PDF Email Manager"
  }
}
```

### Change Window Size

Edit `electron/electron-main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1400,  // Change width
  height: 900,  // Change height
  minWidth: 1024,
  minHeight: 768
});
```

### Auto-Update Support

Add to `package.json`:
```json
{
  "build": {
    "publish": [{
      "provider": "github",
      "owner": "your-username",
      "repo": "your-repo"
    }]
  }
}
```

## Testing Before Distribution

### Test on Clean Windows VM

1. Create Windows 10/11 VM
2. Fresh install - no dev tools
3. Install only prerequisites (Python, MongoDB)
4. Copy your .exe
5. Test complete workflow

### Test Checklist

- [ ] App launches without errors
- [ ] Loading screen appears
- [ ] Main window opens
- [ ] Can select PDFs
- [ ] Can extract emails
- [ ] Can create templates
- [ ] Can generate drafts
- [ ] Downloads work correctly
- [ ] App closes cleanly

## File Structure After Build

```
electron/dist/
├── win-unpacked/              # Unpacked files (for debugging)
│   ├── PDF Email Manager.exe
│   ├── resources/
│   └── locales/
├── PDF-Email-Manager-Setup.exe     # Installer
└── PDFEmailManager-Portable.exe    # Portable version
```

## Deployment Strategies

### Strategy 1: Direct Download

Host on your website:
```
https://yoursite.com/downloads/PDFEmailManager-Setup.exe
```

### Strategy 2: GitHub Releases

1. Create GitHub release
2. Upload .exe files
3. Users download from Releases page

### Strategy 3: Company Network

1. Place on shared network drive
2. Employees can install/run directly
3. IT can deploy via GPO

### Strategy 4: USB Distribution

1. Copy portable .exe to USB
2. Include README.txt
3. Distribute to users

## Code Signing (Optional but Recommended)

Without code signing, Windows SmartScreen will warn users.

### Get Code Signing Certificate:
1. Purchase from DigiCert, Sectigo, etc. (~$200/year)
2. Or use self-signed for internal use

### Sign the Executable:
```bash
npm run build:win
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com dist/PDF-Email-Manager-Setup.exe
```

## Updating the Application

### For Users:
1. Download new version
2. Run installer (overwrites old version)
3. Or replace portable .exe

### For Developers:
1. Update version in `package.json`
2. Make your changes
3. Build frontend: `cd frontend && npm run build`
4. Build desktop: `cd electron && npm run build:win`
5. Distribute new .exe

## Common User Issues

### "Windows protected your PC" Warning

**Cause**: Unsigned executable
**Solution**: 
- Click "More info" → "Run anyway"
- Or get code signing certificate

### App Won't Start

**Check**:
1. Python installed? `python --version`
2. MongoDB running? Check services
3. Port 8001 available?

### Slow First Launch

**Normal** - Installing Python packages
**Wait**: 30-60 seconds on first launch
**After**: Launches in 5-10 seconds

## Success!

You now have a true desktop application that:
- ✅ Runs in its own window
- ✅ No browser needed
- ✅ Starts with one double-click
- ✅ Looks professional
- ✅ Works offline
- ✅ Easy to distribute

## Next Steps

1. Test thoroughly on different Windows versions
2. Create user documentation
3. Set up update mechanism
4. Consider code signing
5. Create demo videos
6. Prepare support materials

## Support Resources

- Electron docs: https://www.electronjs.org/docs
- electron-builder: https://www.electron.build/
- Windows packaging: https://www.electron.build/configuration/win

## Quick Reference Commands

```bash
# Install dependencies
cd electron && npm install

# Development mode
npm start

# Build installer
npm run build:win

# Build portable only  
npm run build:portable

# Build both
npm run build
```
