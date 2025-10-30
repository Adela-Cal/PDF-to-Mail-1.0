# BUILD INSTRUCTIONS - Create Desktop Installer on Your Windows PC

## Important: Building Must Be Done on Windows

The desktop installer cannot be built on this Linux server. You need to build it on your Windows computer.

## Quick Start (On Your Windows PC)

### Step 1: Download the Complete Project

Download or copy the entire project folder to your Windows computer.

### Step 2: Install Prerequisites

Make sure you have:
- **Node.js 16+** - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/)
- **Git** (optional) - [Download](https://git-scm.com/)

### Step 3: Build the Installer

**Method A - Use the Batch File (Easiest):**

1. Double-click: `build-desktop.bat`
2. Wait 5-10 minutes
3. Find your installer in `electron/dist/`

**Method B - Manual Commands:**

Open Command Prompt in the project folder:

```cmd
REM Step 1: Build React frontend
cd frontend
npm install
npm run build

REM Step 2: Install Electron dependencies
cd ..\electron
npm install

REM Step 3: Build the installer
npm run build:win
```

### Step 4: Find Your Installer

Look in `electron/dist/` folder:

```
electron/dist/
├── PDF-Email-Manager-Setup.exe    ← This is your installer!
└── PDFEmailManager-Portable.exe   ← This is the portable version!
```

## What Each File Does

### PDF-Email-Manager-Setup.exe (~150-200 MB)
- Professional Windows installer
- Creates desktop shortcut
- Adds to Start Menu
- Includes uninstaller
- Best for: Permanent installation

### PDFEmailManager-Portable.exe (~150-200 MB)
- Single executable file
- No installation needed
- Run from anywhere (USB, Desktop, etc.)
- Best for: Temporary use, USB distribution

## First Time Setup on Windows

If this is your first time:

```cmd
REM Install all Node packages for frontend
cd frontend
npm install

REM Install all Node packages for Electron
cd ..\electron
npm install

REM Build frontend
cd ..\frontend
npm run build

REM Build desktop app
cd ..\electron
npm run build:win
```

## Troubleshooting

### Error: "npm is not recognized"

**Solution**: Install Node.js from https://nodejs.org/

### Error: "Cannot find module"

**Solution**: 
```cmd
cd electron
npm install
```

### Build Takes Too Long

**Normal**: First build takes 5-10 minutes
- Downloads dependencies
- Bundles everything
- Creates installer
- Subsequent builds are faster

### Error: "electron-builder failed"

**Solution**: Update electron-builder
```cmd
cd electron
npm install electron-builder@latest --save-dev
npm run build:win
```

### Not Enough Disk Space

**Need**: At least 2GB free space
- Frontend build: ~200MB
- Electron deps: ~500MB
- Built app: ~150-200MB

## After Building

### Test the Installer

1. Navigate to `electron/dist/`
2. Double-click `PDF-Email-Manager-Setup.exe`
3. Follow installation wizard
4. Run the installed app
5. Test all features

### Distribute to Users

**Simple Distribution:**
- Email the .exe file (if size allows)
- Upload to Google Drive / Dropbox
- Host on your website

**Professional Distribution:**
- Create download page
- Add SHA256 checksum
- Write release notes
- Consider code signing

## Build Configuration

### Change App Name

Edit `electron/package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Display Name",
  "version": "1.0.0"
}
```

### Change Icon

1. Create or download an `.ico` file (256x256 recommended)
2. Save as `electron/icon.ico`
3. Rebuild

### Reduce File Size

The app is large because it includes:
- Node.js runtime (~50MB)
- Chromium browser (~100MB)
- Your application code
- Python dependencies

**To reduce**:
- Remove unused npm packages
- Optimize images
- Use production mode (already enabled)

## Build Times

| Task | Time |
|------|------|
| Frontend build | 1-2 minutes |
| Electron install | 2-3 minutes (first time) |
| Electron build | 3-5 minutes |
| **Total** | **6-10 minutes** |

## Alternative: Download Pre-built Binaries

If you can't build on Windows, you have these options:

### Option 1: Use GitHub Actions

Create `.github/workflows/build.yml` to build automatically

### Option 2: Use AppVeyor

Free Windows build service for open source

### Option 3: Use a Windows VM

- VirtualBox with Windows 10
- Build inside the VM
- Export the .exe file

## Verification After Build

Check that the built files exist:

```cmd
dir electron\dist
```

Should see:
- `PDF-Email-Manager-Setup.exe` (installer)
- `PDFEmailManager-Portable.exe` (portable)
- `win-unpacked\` folder (unpacked files)

## Next Steps After Building

1. ✅ Test installer on clean Windows PC
2. ✅ Verify all features work
3. ✅ Test portable version
4. ✅ Create user documentation
5. ✅ Plan distribution method
6. ✅ Consider code signing (optional but recommended)

## Code Signing (Optional)

To remove "Windows protected your PC" warning:

1. **Purchase certificate** (~$200/year)
   - DigiCert
   - Sectigo
   - Others

2. **Sign the executable**:
```cmd
signtool sign /f certificate.pfx /p password /t http://timestamp.digicert.com electron\dist\PDF-Email-Manager-Setup.exe
```

3. **Benefits**:
   - No Windows warnings
   - Professional appearance
   - Trusted by Windows
   - Better for enterprise

## Support

**Build not working?**

1. Check Node.js version: `node --version` (needs 16+)
2. Check npm version: `npm --version` (needs 8+)
3. Delete `node_modules` and reinstall
4. Check `electron/dist` folder permissions
5. Run Command Prompt as Administrator

**Still stuck?**

- Check the build log in console
- Google the specific error message
- Check electron-builder documentation
- Ask in electron-builder GitHub discussions

## Quick Reference

```cmd
REM Build everything
build-desktop.bat

REM Or manually:
cd frontend && npm run build
cd ..\electron && npm install && npm run build:win

REM Test before building
cd electron && npm start

REM Clean build (if issues)
cd frontend && rmdir /s /q build node_modules
cd ..\electron && rmdir /s /q dist node_modules
npm install
npm run build:win
```

## Success Indicators

✅ No error messages in console
✅ `electron/dist/` folder created
✅ `.exe` files are ~150MB each
✅ Files have icons
✅ Double-clicking .exe launches app
✅ All features work in installed app

## You're Ready!

After building successfully, you'll have professional Windows installers ready to distribute!
