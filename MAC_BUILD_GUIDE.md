# 🍎 Speedy Statements - Mac Build Guide

## Prerequisites

Before you start, install these on your Mac:

### 1. Install Homebrew (if not already installed)
Open **Terminal** and paste:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Python 3
```bash
brew install python@3.11
```

### 3. Install Node.js
```bash
brew install node
```

### 4. Install Yarn
```bash
npm install -g yarn
```

---

## Build Steps

### Step 1: Download the Code
1. In Emergent, click **"Save to GitHub"** to save your code
2. On your Mac, clone or download the repository

### Step 2: Open Terminal in the Project Folder
```bash
cd /path/to/your/downloaded/project
```

### Step 3: Run the Build Script
```bash
chmod +x SETUP_AND_BUILD_MAC.sh
./SETUP_AND_BUILD_MAC.sh
```

This will:
- ✅ Check your Python and Node.js installation
- ✅ Install all dependencies
- ✅ Build the frontend
- ✅ Build the backend
- ✅ Create the Mac app (.dmg file)

**⏱️ Total time: ~15-20 minutes**

---

## After Build Completes

1. Open **Finder** and navigate to: `standalone-build/dist/`
2. Double-click: `Speedy Statements-1.0.0.dmg`
3. Drag "Speedy Statements" to your **Applications** folder
4. Launch from Applications!

---

## First Launch Security Note

Mac may block the app on first launch because it's not from the App Store.

**To allow it:**
1. Go to **System Preferences** → **Security & Privacy** → **General**
2. Click **"Open Anyway"** next to the blocked app message
3. Or: Right-click the app and select **"Open"**

---

## Troubleshooting

### "Command not found: python3"
```bash
brew install python@3.11
```

### "Command not found: node"
```bash
brew install node
```

### "Command not found: yarn"
```bash
npm install -g yarn
```

### Build fails with PyInstaller error
```bash
pip3 install --upgrade pyinstaller
```

### Electron build fails
```bash
cd standalone-build
rm -rf node_modules
yarn install
```

---

## Alternative: Manual Build Steps

If the script doesn't work, follow these manual steps:

### 1. Build Frontend
```bash
cd frontend
yarn install
yarn build
mkdir -p ../standalone-build/frontend
cp -R build/* ../standalone-build/frontend/
cd ..
```

### 2. Build Backend
```bash
cd standalone-build
pip3 install -r requirements.txt
pip3 install pyinstaller
pyinstaller server_standalone.spec --clean
mkdir -p backend
cp dist/SpeedyStatementsServer backend/
```

### 3. Build Mac App
```bash
yarn install
yarn build:mac
```

### 4. Find Your App
```bash
open dist/
```

---

## Need Help?

If you encounter issues:
1. Copy the error message from Terminal
2. Share it and I'll help you fix it!
