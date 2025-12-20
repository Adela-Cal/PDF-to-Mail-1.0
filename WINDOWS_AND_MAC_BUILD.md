# Building for Both Windows and Mac - Important Information

## ⚠️ Critical Requirement

**You CANNOT build for both platforms from one computer.**

To create standalone installers for both Windows and Mac, you need:
- ✅ A **Windows 10/11 PC** to build the Windows installer
- ✅ A **Mac computer** (macOS 10.13+) to build the Mac installer

This is because:
- Windows `.exe` files can only be built on Windows
- Mac `.app` and `.dmg` files can only be built on Mac
- Cross-compilation for desktop apps is unreliable and not recommended

---

## Your Options

### Option 1: Build for Windows First (Recommended)

Since most users are on Windows, start with Windows:

1. Use your Windows PC
2. Follow: `YOUR_EXACT_COMMANDS.md`
3. Run: `SETUP_AND_BUILD.bat`
4. Get: `Speedy Statements Setup 1.0.0.exe`

**Later**: If you need Mac version, use a Mac to build it separately.

### Option 2: Build for Both Platforms

If you have both a Windows PC and a Mac:

**On Windows:**
- Build Windows installer (see Windows instructions)

**On Mac:**
- Build Mac installer (see Mac instructions below)

You'll get two separate installers:
- `Speedy Statements Setup 1.0.0.exe` (Windows)
- `Speedy Statements-1.0.0.dmg` (Mac)

### Option 3: Build for Mac Only

If you only have a Mac:
- Follow Mac build instructions below
- Get: `Speedy Statements-1.0.0.dmg`

---

## Windows Build Instructions

### What You Need
- Windows 10 or 11
- Python 3.11+
- Node.js 18+
- Git

### Commands
```cmd
cd C:\Program Files
git clone https://github.com/Adela-Cal/PDF-to-Mail-1.0.git
cd PDF-to-Mail-1.0
SETUP_AND_BUILD.bat
```

**Output**: `standalone-build\dist\Speedy Statements Setup 1.0.0.exe`

**Detailed Guide**: See `YOUR_EXACT_COMMANDS.md`

---

## Mac Build Instructions

### What You Need
- macOS 10.13 or later
- Python 3.11+
- Node.js 18+
- Git
- Xcode Command Line Tools

### Step 1: Install Prerequisites

**Install Homebrew** (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Install Python**:
```bash
brew install python@3.11
```

**Install Node.js**:
```bash
brew install node
```

**Install Xcode Command Line Tools**:
```bash
xcode-select --install
```

### Step 2: Clone Repository

```bash
cd ~/Documents
git clone https://github.com/Adela-Cal/PDF-to-Mail-1.0.git
cd PDF-to-Mail-1.0
```

### Step 3: Run Build Script

I'll create a Mac-specific build script for you. For now, manual steps:

**Build Frontend:**
```bash
cd frontend
cp ../standalone-build/.env.production .env.production
npm install
npm run build
mkdir -p ../standalone-build/frontend
cp -R build/* ../standalone-build/frontend/
cd ..
```

**Build Backend:**
```bash
cd standalone-build
pip3 install -r requirements.txt
pip3 install pyinstaller
pyinstaller server_standalone.spec --clean
mkdir -p backend
cp dist/SpeedyStatementsServer backend/
cd ..
```

**Build Mac Installer:**
```bash
cd standalone-build
npm install
npm run build
cd ..
```

**Output**: `standalone-build/dist/Speedy Statements-1.0.0.dmg`

---

## Comparison

| Feature | Windows | Mac |
|---------|---------|-----|
| **Build Environment** | Windows 10/11 | macOS 10.13+ |
| **Output File** | `.exe` installer | `.dmg` installer |
| **File Size** | ~150-200 MB | ~150-200 MB |
| **Build Time** | 15-20 minutes | 15-20 minutes |
| **Prerequisites** | Python, Node.js, Git | Python, Node.js, Git, Xcode CLI |
| **Automated Script** | ✅ `SETUP_AND_BUILD.bat` | ⚠️ Manual steps |

---

## Distribution

After building on both platforms, you can distribute:

**Windows Users**:
- Download: `Speedy Statements Setup 1.0.0.exe`
- Double-click to install
- Works on Windows 10 and 11

**Mac Users**:
- Download: `Speedy Statements-1.0.0.dmg`
- Double-click, drag to Applications folder
- Works on macOS 10.13+

---

## Recommended Approach

### If you're just starting:

1. **Start with Windows** (you have a Windows PC)
   - Use `SETUP_AND_BUILD.bat`
   - Test the installer
   - Distribute to Windows users

2. **Add Mac later** (when needed)
   - Borrow/rent a Mac
   - Build Mac version
   - Distribute to Mac users

### If you need both immediately:

- Build Windows version on your Windows PC
- Find a Mac to build Mac version:
  - Friend's Mac
  - Apple Store (use their Macs)
  - Mac rental service
  - macOS virtual machine (complex)

---

## Important Notes

### Code Signing

**Windows:**
- Unsigned apps show security warnings
- Users can bypass by clicking "More info" → "Run anyway"
- To remove warnings: Purchase code signing certificate ($300-500/year)

**Mac:**
- macOS Gatekeeper blocks unsigned apps
- Users must: Right-click → Open → "Open" to bypass
- To remove warnings: Apple Developer account ($99/year) + notarization

### Testing

**Always test on the target platform:**
- Windows build → Test on Windows
- Mac build → Test on Mac

---

## Summary

**To build for BOTH Windows and Mac:**
- ✅ Build Windows version on Windows PC (ready to go!)
- ✅ Build Mac version on Mac computer (need a Mac)
- ❌ Cannot build both from one computer

**Your current status:**
- ✅ Windows build scripts ready
- ✅ Can build Windows installer now
- ⏳ Mac build requires access to a Mac

**Recommendation:**
Build Windows version first using your PC. Add Mac version later when needed!
