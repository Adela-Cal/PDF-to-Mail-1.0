# 🚀 SIMPLE INSTALLATION GUIDE - Speedy Statements

## What You Need

1. **Windows 10 or 11 PC**
2. **Python 3.11+** - Download from: https://www.python.org/downloads/
   - ⚠️ **CRITICAL**: Check ✅ "Add Python to PATH" during installation
3. **Node.js 18+** - Download from: https://nodejs.org/ (choose LTS version)

---

## Step 1: Save to GitHub

In Emergent (where you are now):
1. Click the **"Save to GitHub"** button
2. Your code will be pushed to your GitHub repository

---

## Step 2: Get Files on Windows

On your Windows computer:

### A. Open Command Prompt as Administrator
- Press `Windows Key`
- Type: `cmd`
- Right-click "Command Prompt"
- Click "Run as administrator"

### B. Navigate to Program Files
```cmd
cd C:\Program Files
```

### C. Clone Your Repository
```cmd
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```
(Replace with your actual GitHub username and repo name)

### D. Enter the Folder
```cmd
cd YOUR-REPO-NAME
```

Now all your files are at: `C:\Program Files\YOUR-REPO-NAME\`

---

## Step 3: Run the Automated Setup

Just run this ONE command:

```cmd
SETUP_AND_BUILD.bat
```

This script will:
- ✅ Check if Python and Node.js are installed
- ✅ Install all dependencies automatically
- ✅ Build the frontend
- ✅ Build the backend
- ✅ Create the installer
- ⏱️ Takes about 15-20 minutes

**Just wait and let it run!**

---

## Step 4: Find Your Installer

After the script finishes, your installer will be at:

```
C:\Program Files\YOUR-REPO-NAME\standalone-build\dist\Speedy Statements Setup 1.0.0.exe
```

---

## Step 5: Install and Use

1. Go to the `dist` folder
2. Double-click: `Speedy Statements Setup 1.0.0.exe`
3. Follow installation wizard
4. Launch from Desktop shortcut
5. Done! ✨

---

## If Something Goes Wrong

### Error: "Python is not recognized"
**Fix**: 
1. Uninstall Python
2. Reinstall from https://www.python.org/downloads/
3. **CHECK THE BOX** ✅ "Add Python to PATH"
4. Restart Command Prompt
5. Try again

### Error: "Node is not recognized"
**Fix**:
1. Install Node.js from https://nodejs.org/
2. Restart Command Prompt
3. Try again

### Error: Script stops or fails
**Fix**:
1. Make sure you're running Command Prompt **as Administrator**
2. Make sure you're inside the correct folder
3. Try running `SETUP_AND_BUILD.bat` again

---

## Summary (Super Quick Version)

```
1. Install Python (check "Add to PATH") ✅
2. Install Node.js ✅
3. Open Command Prompt as Admin ✅
4. cd C:\Program Files ✅
5. git clone [your-github-url] ✅
6. cd [your-repo-name] ✅
7. SETUP_AND_BUILD.bat ✅
8. Wait 15-20 minutes ✅
9. Install from: standalone-build\dist\Speedy Statements Setup 1.0.0.exe ✅
```

**That's it!** 🎉

---

## Where Are My Files?

- **Your code**: `C:\Program Files\YOUR-REPO-NAME\`
- **The installer**: `C:\Program Files\YOUR-REPO-NAME\standalone-build\dist\`
- **After installing**: `C:\Program Files\Speedy Statements\` (or wherever you choose)
- **User data**: `C:\Users\[Your Name]\AppData\Roaming\SpeedyStatements\data\`

---

## Questions?

- Script checks prerequisites automatically
- Script tells you what's missing
- Script builds everything in one go
- No manual steps needed after running the script!

**Ready? Save to GitHub and clone on Windows!** 🚀
