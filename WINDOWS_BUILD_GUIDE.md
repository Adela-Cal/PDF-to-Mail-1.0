# 🪟 Windows Build Guide - Speedy Statements

## IMPORTANT: This Must Be Done on Windows 10 or 11

This guide will walk you through building the standalone desktop application on your Windows computer.

---

## Step 1: Transfer Files to Windows

### Method A: Download from Current Location
If your files are hosted somewhere, download the entire `/app` folder to your Windows machine.

### Method B: Use Git (if available)
```cmd
git clone [your-repository-url]
cd app
```

### Method C: Direct Copy
Copy the entire `/app` folder to your Windows computer at:
```
C:\SpeedyStatements\
```

---

## Step 2: Install Prerequisites on Windows

### 2.1 Install Python 3.11+

1. Download Python from: https://www.python.org/downloads/
2. **IMPORTANT**: During installation, check ✅ "Add Python to PATH"
3. Click "Install Now"
4. Verify installation:
   ```cmd
   python --version
   ```
   Should show: `Python 3.11.x` or higher

### 2.2 Install Node.js 18+

1. Download Node.js from: https://nodejs.org/
2. Choose "LTS" version (Long Term Support)
3. Run installer with default settings
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```
   Should show versions for both

### 2.3 Install Yarn (Package Manager)

Open Command Prompt as Administrator and run:
```cmd
npm install -g yarn
```

Verify:
```cmd
yarn --version
```

---

## Step 3: Prepare the Build

### 3.1 Open Command Prompt as Administrator

1. Press `Windows Key`
2. Type: `cmd`
3. Right-click "Command Prompt"
4. Select "Run as administrator"

### 3.2 Navigate to the App Folder

```cmd
cd C:\SpeedyStatements\app
```
(Adjust path if you extracted to a different location)

### 3.3 Verify Files Are Present

```cmd
dir standalone-build
dir build-complete.bat
```

You should see the files listed.

---

## Step 4: Run the Build Script

### Simple Method (Automated)

Just run:
```cmd
build-complete.bat
```

This will:
- Clean previous builds
- Build the frontend (React)
- Build the backend (Python executable)
- Package everything into an installer
- Take 10-15 minutes depending on your computer

**Watch for any errors!** If the script stops, note the error message.

---

## Step 5: What Happens During Build

You'll see these stages:

```
[1/5] Cleaning previous builds...
[2/5] Building frontend...
[3/5] Building backend executable...
[4/5] Installing Electron dependencies...
[5/5] Building installer...
```

### Expected Output:
- Lots of text scrolling (this is normal)
- Download progress for packages
- Compilation messages
- Final success message

---

## Step 6: Find Your Installer

After successful build, your installer will be at:

```
C:\SpeedyStatements\app\standalone-build\dist\Speedy Statements Setup 1.0.0.exe
```

**File size**: Approximately 150-200 MB

---

## Step 7: Test the Installer

### 7.1 Install on Your Computer

1. Navigate to: `standalone-build\dist\`
2. Double-click: `Speedy Statements Setup 1.0.0.exe`
3. Windows may show a security warning:
   - Click "More info"
   - Click "Run anyway"
   - (This is normal for unsigned applications)
4. Follow installation wizard
5. Choose installation directory (or use default)
6. Click "Install"

### 7.2 Launch the Application

After installation:
- Find "Speedy Statements" on your Desktop (shortcut created automatically)
- OR search for it in Start Menu
- Double-click to launch

### 7.3 What You Should See

✅ **Correct Behavior**:
- A desktop window opens (looks like a desktop app)
- NO browser window visible
- NO terminal windows visible
- Application title: "Speedy Statements"
- Clean, professional interface

❌ **If You See**:
- Browser window → Something went wrong
- Terminal windows → Build issue
- Nothing happens → Check Windows Event Viewer

---

## Troubleshooting Common Issues

### Issue 1: "Python is not recognized"

**Solution**:
1. Uninstall Python
2. Reinstall Python
3. **Make sure** to check "Add Python to PATH" during installation
4. Restart Command Prompt
5. Try again

### Issue 2: "Node is not recognized"

**Solution**:
1. Restart Command Prompt after installing Node.js
2. OR add Node.js to PATH manually:
   - Control Panel → System → Advanced → Environment Variables
   - Add: `C:\Program Files\nodejs\` to PATH

### Issue 3: "yarn install" fails

**Solution**:
```cmd
npm install -g yarn --force
```

### Issue 4: PyInstaller fails

**Error**: `ModuleNotFoundError` or similar

**Solution**:
```cmd
cd standalone-build
pip install --upgrade pip
pip install -r requirements.txt --upgrade
pip install pyinstaller --upgrade
cd ..
```
Then run `build-complete.bat` again

### Issue 5: Frontend build fails

**Solution**:
```cmd
cd frontend
rmdir /s /q node_modules
yarn install
yarn build
cd ..
```

### Issue 6: Electron build fails

**Error**: "Cannot find backend/SpeedyStatementsServer.exe"

**Solution**:
- The backend build failed earlier
- Check Step 3 output for Python/PyInstaller errors
- Fix those first, then rebuild

### Issue 7: Build script stops immediately

**Solution**:
- You're not in the `/app` directory
- Navigate to the correct folder:
  ```cmd
  cd C:\SpeedyStatements\app
  ```

### Issue 8: Installed app won't start

**Solutions**:
1. **Check Antivirus**: Windows Defender may block unsigned .exe
   - Windows Security → Virus & threat protection → Allow app
2. **Run as Administrator**: Right-click shortcut → "Run as administrator"
3. **Check Event Viewer**: 
   - Windows Key → Event Viewer → Windows Logs → Application
   - Look for errors related to "Speedy Statements"

---

## Manual Build (If Automated Script Fails)

If `build-complete.bat` doesn't work, follow manual steps:

### 1. Build Frontend
```cmd
cd frontend
copy ..\standalone-build\.env.production .env.production
yarn install
yarn build
mkdir ..\standalone-build\frontend
xcopy /E /I /Y build\* ..\standalone-build\frontend
cd ..
```

### 2. Build Backend
```cmd
cd standalone-build
pip install -r requirements.txt
pip install pyinstaller
pyinstaller server_standalone.spec --clean
mkdir backend
copy dist\SpeedyStatementsServer.exe backend\
cd ..
```

### 3. Build Installer
```cmd
cd standalone-build
yarn install
yarn build
cd ..
```

---

## Verifying Success

### Check These Files Exist:

```cmd
dir standalone-build\backend\SpeedyStatementsServer.exe
dir standalone-build\frontend\index.html
dir "standalone-build\dist\Speedy Statements Setup 1.0.0.exe"
```

All should exist if build succeeded.

---

## After Successful Build

### What to Do Next:

1. **Test the installer** on your computer
2. **Test all features**:
   - PDF folder selection
   - Email extraction
   - Template management
   - Account management
   - Draft generation
   - Open .eml files in Outlook
3. **Distribute** the installer to users

### Distribution:

You can now share:
```
Speedy Statements Setup 1.0.0.exe
```

Via:
- Email attachment
- File sharing service (Google Drive, Dropbox)
- USB drive
- Company network share
- Website download

---

## Data Storage

After installation, user data is stored at:
```
C:\Users\[Username]\AppData\Roaming\SpeedyStatements\data\
```

Files:
- `templates.json` - Email templates
- `accounts.json` - Email accounts

Each installation has its own isolated data.

---

## Getting Help

If you encounter issues:

1. **Note the exact error message**
2. **Check which step failed** (1-5)
3. **Refer to Troubleshooting section above**
4. **Check logs**:
   - Frontend build: Look for "ERROR" in console output
   - Backend build: Check for Python import errors
   - Electron build: Look for missing file errors

---

## Next Steps After Successful Build

1. ✅ Install and test the application
2. ✅ Test PDF extraction
3. ✅ Test Outlook draft generation
4. ✅ Verify .eml files open as editable drafts
5. ✅ (Optional) Add custom icon
6. ✅ Distribute to users

---

## Summary

```
Prerequisites → Navigate to /app → Run build-complete.bat → Wait 10-15 mins → Installer ready!
```

**Output**: `standalone-build\dist\Speedy Statements Setup 1.0.0.exe`

**You're ready to build!** 🚀
