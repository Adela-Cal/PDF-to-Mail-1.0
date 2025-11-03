# 🎯 EXACT COMMANDS FOR YOUR REPOSITORY

## Your GitHub Repository
```
https://github.com/Adela-Cal/PDF-to-Mail-1.0.git
```

---

## METHOD 1: Automatic Setup (RECOMMENDED)

### Step 1: Download the Setup Script

1. Go to: https://github.com/Adela-Cal/PDF-to-Mail-1.0
2. Find the file: `COMPLETE_SETUP.bat`
3. Click on it
4. Click "Download" or "Raw" button
5. Save to your Desktop

### Step 2: Run the Setup Script

1. Go to your Desktop
2. Find `COMPLETE_SETUP.bat`
3. **Right-click** on it
4. Click **"Run as administrator"**
5. When it asks for GitHub URL, paste:
   ```
   https://github.com/Adela-Cal/PDF-to-Mail-1.0.git
   ```
6. Press Enter
7. Wait 20 minutes
8. Done!

---

## METHOD 2: Manual Commands (Copy These EXACTLY)

### Step 1: Open Command Prompt as Administrator

1. Press `Windows Key`
2. Type: `cmd`
3. **Right-click** on "Command Prompt"
4. Click **"Run as administrator"**

### Step 2: Copy and Paste These Commands ONE AT A TIME

**Command 1:**
```cmd
cd C:\Program Files
```
✅ Press Enter. You should see: `C:\Program Files>`

**Command 2:**
```cmd
git clone https://github.com/Adela-Cal/PDF-to-Mail-1.0.git
```
✅ Press Enter. Wait 2-5 minutes while it downloads.

**Command 3:**
```cmd
cd PDF-to-Mail-1.0
```
✅ Press Enter. You should see: `C:\Program Files\PDF-to-Mail-1.0>`

**Command 4:**
```cmd
SETUP_AND_BUILD.bat
```
✅ Press Enter. Wait 15-20 minutes for the build to complete.

---

## What You'll See

### After Command 1:
```
C:\Program Files>
```

### After Command 2:
```
Cloning into 'PDF-to-Mail-1.0'...
remote: Enumerating objects: 245, done.
remote: Counting objects: 100% (245/245), done.
...
Resolving deltas: 100% (98/98), done.
```

### After Command 3:
```
C:\Program Files\PDF-to-Mail-1.0>
```

### After Command 4:
```
========================================
Speedy Statements - Automated Setup
========================================
[1/6] Checking Python installation...
✅ Python installed
[2/6] Checking Node.js installation...
✅ Node.js installed
...
```

---

## Final Result

Your installer will be at:
```
C:\Program Files\PDF-to-Mail-1.0\standalone-build\dist\Speedy Statements Setup 1.0.0.exe
```

---

## Prerequisites Check

Before running commands, verify these are installed:

**Check Python:**
```cmd
python --version
```
Should show: `Python 3.11.x` or higher

**Check Node.js:**
```cmd
node --version
```
Should show: `v18.x.x` or higher

**Check Git:**
```cmd
git --version
```
Should show: `git version 2.x.x`

If any command says "not recognized":
- **Python**: https://www.python.org/downloads/ (CHECK "Add to PATH")
- **Node.js**: https://nodejs.org/
- **Git**: https://git-scm.com/

---

## Common Errors and Fixes

### "git is not recognized"
**Fix:**
1. Install Git: https://git-scm.com/
2. Close and reopen Command Prompt
3. Try again

### "fatal: destination path 'PDF-to-Mail-1.0' already exists"
**Fix:**
This means you already downloaded it. Just do:
```cmd
cd PDF-to-Mail-1.0
SETUP_AND_BUILD.bat
```

### "Access is denied"
**Fix:**
You didn't run Command Prompt as Administrator. Close it and:
1. Press Windows Key
2. Type `cmd`
3. **Right-click** "Command Prompt"
4. Click **"Run as administrator"**

---

## Summary

**EASIEST:**
1. Download `COMPLETE_SETUP.bat` from GitHub
2. Right-click → "Run as administrator"
3. Enter: `https://github.com/Adela-Cal/PDF-to-Mail-1.0.git`
4. Wait
5. Done!

**MANUAL:**
Run these 4 commands, one at a time:
```cmd
cd C:\Program Files
git clone https://github.com/Adela-Cal/PDF-to-Mail-1.0.git
cd PDF-to-Mail-1.0
SETUP_AND_BUILD.bat
```

**After 20 minutes:**
Your installer is ready at:
`C:\Program Files\PDF-to-Mail-1.0\standalone-build\dist\Speedy Statements Setup 1.0.0.exe`

🎉 That's it!
