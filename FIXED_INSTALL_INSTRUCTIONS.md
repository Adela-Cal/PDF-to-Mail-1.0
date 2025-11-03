# 🎯 FIXED INSTRUCTIONS - Follow These Exactly

## IMPORTANT: The Problem You Had

You were copying ALL commands on ONE line. Each command needs to run SEPARATELY.

❌ **WRONG**: `cmd cd C:\Program Files git clone...` (all together)
✅ **RIGHT**: Run each command separately, one at a time

---

## NEW SIMPLE METHOD - Just 3 Steps!

### Step 1: Install Prerequisites (One Time Only)

Install these if you haven't already:

**1. Python 3.11+**
- Go to: https://www.python.org/downloads/
- Download and run installer
- ✅ **CHECK THE BOX**: "Add Python to PATH"
- Click "Install Now"

**2. Node.js 18+**
- Go to: https://nodejs.org/
- Download "LTS" version
- Run installer, click Next, Next, Install

**3. Git**
- Go to: https://git-scm.com/
- Download and install with default settings

---

### Step 2: Download the Setup Script

**In Emergent (where you are now):**

1. Click "Save to GitHub" button (saves all your code)
2. Note your GitHub repository URL. It looks like:
   ```
   https://github.com/YOUR-USERNAME/YOUR-REPO-NAME
   ```

**On Your Windows PC:**

1. Create a folder: `C:\Setup`
2. Download `COMPLETE_SETUP.bat` from your GitHub repo
3. Save it to: `C:\Setup\COMPLETE_SETUP.bat`

---

### Step 3: Run the Setup Script

**1. Right-click on `COMPLETE_SETUP.bat`**
**2. Click "Run as administrator"**

The script will:
- Ask for your GitHub URL (paste it when asked)
- Clone your repository
- Build everything automatically
- Create the installer
- Open the folder with your installer

**That's it!** Just wait 15-20 minutes.

---

## ALTERNATIVE: Manual Step-by-Step

If the script doesn't work, do this manually:

### Open Command Prompt as Administrator

1. Press `Windows Key`
2. Type: `cmd`
3. Right-click "Command Prompt"  
4. Click "Run as administrator"

### Run These Commands ONE AT A TIME

**Command 1:**
```cmd
cd C:\Program Files
```
Press Enter. Wait for it to complete.

**Command 2:**
```cmd
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```
⚠️ Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub details!
Press Enter. Wait for it to download (2-5 minutes).

**Command 3:**
```cmd
cd YOUR-REPO-NAME
```
⚠️ Replace `YOUR-REPO-NAME` with your actual repo name!
Press Enter.

**Command 4:**
```cmd
SETUP_AND_BUILD.bat
```
Press Enter. Wait 15-20 minutes for build to complete.

---

## What Your GitHub URL Looks Like

Find your repository on GitHub. The URL should be:
```
https://github.com/callum123/speedy-statements
```
OR
```
https://github.com/callum123/pdf-mail-wizard
```
OR whatever your actual username and repo name are.

---

## Troubleshooting

### "Git is not recognized"
→ Install Git from: https://git-scm.com/
→ Restart Command Prompt
→ Try again

### "Python is not recognized"
→ Uninstall Python
→ Reinstall from: https://www.python.org/downloads/
→ ✅ CHECK "Add Python to PATH"
→ Restart Command Prompt
→ Try again

### "Access is denied" or "Permission denied"
→ You didn't run Command Prompt as Administrator
→ Close Command Prompt
→ Right-click → "Run as administrator"
→ Try again

### Script can't find files
→ Make sure you're in the correct directory
→ Run: `dir` to see what files are there
→ You should see `SETUP_AND_BUILD.bat` listed

---

## Quick Checklist

Before running commands:
- [ ] Python installed (check: `python --version`)
- [ ] Node.js installed (check: `node --version`)
- [ ] Git installed (check: `git --version`)
- [ ] Command Prompt opened as Administrator
- [ ] You have your actual GitHub repository URL

---

## Summary

**EASIEST WAY:**
1. Save `COMPLETE_SETUP.bat` to your computer
2. Right-click → "Run as administrator"
3. Enter your GitHub URL when asked
4. Wait 20 minutes
5. Done!

**MANUAL WAY:**
1. Open Command Prompt as Administrator
2. Run commands ONE AT A TIME
3. Each command, then press Enter, then wait
4. Don't copy multiple commands at once

---

## Need More Help?

Tell me:
1. Did you install Python, Node.js, and Git?
2. What is your actual GitHub repository URL?
3. What error message do you see?

I can give you EXACT commands with YOUR repository name! 🎯
