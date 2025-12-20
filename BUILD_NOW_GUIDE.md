# BUILD NOW - Windows Installation Guide

## Before You Start - Check Prerequisites

### Step 1: Verify Python is Installed

Open Command Prompt and type:
```cmd
python --version
```

**Should show**: `Python 3.11.x` or higher

**If it says "not recognized":**
1. Go to: https://www.python.org/downloads/
2. Download Python 3.11 or newer
3. Run installer
4. ✅ **CHECK THE BOX**: "Add Python to PATH"
5. Click "Install Now"
6. Restart Command Prompt and try again

---

### Step 2: Verify Node.js is Installed

In Command Prompt, type:
```cmd
node --version
```

**Should show**: `v18.x.x` or higher

**If it says "not recognized":**
1. Go to: https://nodejs.org/
2. Download LTS version (green button)
3. Install with default settings
4. Restart Command Prompt and try again

---

### Step 3: Verify Git is Installed

In Command Prompt, type:
```cmd
git --version
```

**Should show**: `git version 2.x.x`

**If it says "not recognized":**
1. Go to: https://git-scm.com/
2. Download and install
3. Restart Command Prompt and try again

---

## Ready to Build!

### Step 1: Open Command Prompt as Administrator

1. Press `Windows Key`
2. Type: `cmd`
3. **RIGHT-CLICK** on "Command Prompt"
4. Click **"Run as administrator"**
5. Click "Yes" if Windows asks for permission

---

### Step 2: Navigate to Program Files

Copy and paste this command, then press Enter:
```cmd
cd C:\Program Files
```

You should see:
```
C:\Program Files>
```

---

### Step 3: Clone the Repository

Copy and paste this command, then press Enter:
```cmd
git clone https://github.com/Adela-Cal/PDF-to-Mail-1.0.git
```

**What you'll see:**
```
Cloning into 'PDF-to-Mail-1.0'...
remote: Enumerating objects: ...
remote: Counting objects: 100% ...
Receiving objects: 100% ...
Resolving deltas: 100% ...
```

This takes 1-3 minutes. Wait for it to finish!

---

### Step 4: Enter the Directory

Copy and paste this command, then press Enter:
```cmd
cd PDF-to-Mail-1.0
```

You should see:
```
C:\Program Files\PDF-to-Mail-1.0>
```

---

### Step 5: Start the Build Process

Copy and paste this command, then press Enter:
```cmd
SETUP_AND_BUILD.bat
```

**What you'll see:**
```
========================================
Speedy Statements - Automated Setup
========================================

This will:
1. Check prerequisites (Python, Node.js)
2. Install all dependencies
3. Build the application
4. Create the installer
5. Create the installer

Press any key to continue...
```

Press Enter to continue.

---

## What Happens During Build

The script will run through 6 stages:

### [1/6] Checking Python
```
✅ Python installed
```

### [2/6] Checking Node.js
```
✅ Node.js installed
```

### [3/6] Checking Yarn
```
✅ Yarn ready
```

### [4/6] Cleaning
```
✅ Cleaned
```

### [5/6] Building Frontend (5-10 minutes)
```
Installing dependencies...
Building...
✅ Frontend built
```
**This is the longest step - be patient!**

### [6/6] Building Backend and Installer (5-10 minutes)
```
Building backend executable...
Building installer...
✅ Complete!
```

---

## Success!

When finished, you'll see:
```
========================================
🎉 BUILD COMPLETE!
========================================

Your installer is ready at:
standalone-build\dist\Speedy Statements Setup 1.0.0.exe

You can now:
1. Install it on this computer
2. Copy it to other computers
3. Distribute it to users

Press any key to continue...
```

---

## Find Your Installer

Your installer is at:
```
C:\Program Files\PDF-to-Mail-1.0\standalone-build\dist\Speedy Statements Setup 1.0.0.exe
```

**To find it:**
1. Open File Explorer
2. Go to: `C:\Program Files\PDF-to-Mail-1.0\standalone-build\dist\`
3. You'll see: `Speedy Statements Setup 1.0.0.exe`

---

## Test Your Installer

1. **Double-click** `Speedy Statements Setup 1.0.0.exe`
2. Windows might show a warning:
   - Click "More info"
   - Click "Run anyway"
3. Follow the installation wizard
4. Click "Install"
5. Find "Speedy Statements" on your Desktop
6. **Double-click** to launch
7. ✅ **It should open as a desktop app** (no browser!)

---

## Troubleshooting

### "Python is not recognized"
→ Install Python (see Step 1 above)
→ **MUST check "Add Python to PATH"**
→ Restart Command Prompt

### "Node is not recognized"
→ Install Node.js (see Step 2 above)
→ Restart Command Prompt

### "git is not recognized"
→ Install Git (see Step 3 above)
→ Restart Command Prompt

### "Access is denied"
→ You didn't run Command Prompt as Administrator
→ Close it and run as Administrator (right-click)

### Build stops with error
→ Read the error message
→ Usually tells you what's missing
→ Install the missing item
→ Try running `SETUP_AND_BUILD.bat` again

### "Already exists" error
→ The folder was already downloaded
→ Just do:
```cmd
cd C:\Program Files\PDF-to-Mail-1.0
SETUP_AND_BUILD.bat
```

---

## Timeline

- Prerequisites check: 1 minute
- Download repository: 2-3 minutes
- Build process: 15-20 minutes
- **Total: ~20-25 minutes**

---

## What to Expect

✅ Lots of text scrolling (this is normal)
✅ Downloading packages
✅ Compiling code
✅ Creating installer

❌ Don't close the window!
❌ Don't interrupt the process!

---

## After Building

Your installer can be:
- ✅ Installed on any Windows 10/11 PC
- ✅ Copied to USB drive
- ✅ Sent via email
- ✅ Uploaded to cloud storage
- ✅ Distributed to anyone

---

**Ready? Start with Step 1!** 🚀

Let me know if you run into any issues!
