# ✅ Windows Build Checklist - Speedy Statements

Print this page and check off each step as you complete it.

---

## PRE-BUILD CHECKLIST

### Prerequisites
- [ ] Windows 10 or Windows 11 computer
- [ ] Administrator access
- [ ] Internet connection
- [ ] 2GB free disk space

### Software Installation
- [ ] Python 3.11+ installed
  - [ ] "Add Python to PATH" was checked during install
  - [ ] Verified: `python --version` works
- [ ] Node.js 18+ installed
  - [ ] Verified: `node --version` works
  - [ ] Verified: `npm --version` works
- [ ] Yarn installed
  - [ ] Run: `npm install -g yarn`
  - [ ] Verified: `yarn --version` works

### Files Ready
- [ ] `/app` folder copied to Windows computer
- [ ] Located at: `C:\SpeedyStatements\app\` (or your chosen path)
- [ ] Verified `build-complete.bat` exists
- [ ] Verified `standalone-build` folder exists

---

## BUILD PROCESS CHECKLIST

### Step 1: Open Command Prompt
- [ ] Opened Command Prompt **as Administrator**
- [ ] Navigated to `/app` folder: `cd C:\SpeedyStatements\app`

### Step 2: Run Build
- [ ] Executed: `build-complete.bat`
- [ ] Build started successfully

### Step 3: Monitor Build Progress
- [ ] [1/5] Cleaning - Completed
- [ ] [2/5] Frontend - Completed (no errors)
- [ ] [3/5] Backend - Completed (no errors)
- [ ] [4/5] Electron deps - Completed
- [ ] [5/5] Installer - Completed
- [ ] Saw "BUILD COMPLETE!" message

### Step 4: Verify Output
- [ ] File exists: `standalone-build\dist\Speedy Statements Setup 1.0.0.exe`
- [ ] File size: ~150-200 MB

---

## TESTING CHECKLIST

### Installation Test
- [ ] Double-clicked installer
- [ ] Handled Windows security warning (if shown)
- [ ] Completed installation wizard
- [ ] Desktop shortcut created
- [ ] Start Menu entry created

### Application Launch Test
- [ ] Launched from Desktop shortcut
- [ ] Application window opened
- [ ] ✅ NO browser window visible
- [ ] ✅ NO terminal windows visible
- [ ] Application looks professional

### Functionality Test
- [ ] **PDF Selection**: Browse folder works
- [ ] **Email Extraction**: PDFs processed successfully
- [ ] **Template Management**: 
  - [ ] Can create template
  - [ ] Can save template
  - [ ] Can load template
- [ ] **Account Management**:
  - [ ] Can add email account
  - [ ] Can select account
  - [ ] Can delete account
- [ ] **Draft Generation**:
  - [ ] Generate drafts button works
  - [ ] .eml files created
  - [ ] PDF attached to email
- [ ] **Outlook Integration**:
  - [ ] .eml file opens in Outlook
  - [ ] ✅ Opens as EDITABLE draft (not read-only)
  - [ ] Recipient pre-filled
  - [ ] Subject pre-filled
  - [ ] Body content present
  - [ ] PDF attachment present

---

## POST-BUILD CHECKLIST

### Quality Assurance
- [ ] Tested all features at least once
- [ ] No crashes encountered
- [ ] No error messages
- [ ] Data saves correctly (templates/accounts)

### Distribution Preparation
- [ ] Installer file backed up
- [ ] Installer renamed (if desired)
- [ ] USER_GUIDE.md ready for users
- [ ] Distribution method chosen

### Optional Enhancements
- [ ] Custom icon added (if desired)
- [ ] Application name customized (if desired)
- [ ] Version number updated (if desired)

---

## DISTRIBUTION CHECKLIST

### Files to Distribute
- [ ] `Speedy Statements Setup 1.0.0.exe` (installer)
- [ ] `USER_GUIDE.md` (for end users)

### Distribution Channels
- [ ] Email ready (if distributing via email)
- [ ] Cloud storage link ready (Google Drive, Dropbox, etc.)
- [ ] USB drive prepared (if distributing physically)
- [ ] Network share prepared (if internal distribution)

### User Instructions
- [ ] Installation guide shared with users
- [ ] Support contact information provided
- [ ] System requirements communicated

---

## TROUBLESHOOTING REFERENCE

If you checked "No" for any item, refer to:
- **WINDOWS_BUILD_GUIDE.md** - Detailed troubleshooting section
- **BUILD_INSTRUCTIONS.md** - Alternative build methods
- **DEPLOYMENT_SUMMARY.md** - Technical details

### Common Issues Quick Reference:

**"Python is not recognized"**
→ Reinstall Python, check "Add to PATH"

**"Node is not recognized"**
→ Restart Command Prompt after Node.js install

**Backend build fails**
→ `pip install --upgrade pyinstaller`

**Frontend build fails**
→ Delete `node_modules`, run `yarn install` again

**Installer won't run**
→ Right-click → "Run as administrator"

**App opens in browser**
→ You're running development version, not the built installer

**Terminal windows appear**
→ You're running development version, not the built installer

---

## SUCCESS CRITERIA

✅ **Build is successful if**:
1. `Speedy Statements Setup 1.0.0.exe` exists
2. Installer runs without errors
3. Application launches as desktop app
4. NO browser windows
5. NO terminal windows
6. All features work correctly
7. Outlook drafts open as editable

---

## FINAL NOTES

**Time Required**: 10-20 minutes (depending on computer speed)

**Disk Space**: Build requires ~2GB temporary space

**Internet**: Required for downloading dependencies

**Computer**: Can be used during build (but will be slower)

---

**Ready to build?** Start with the PRE-BUILD CHECKLIST! 🚀

For detailed instructions, see: **WINDOWS_BUILD_GUIDE.md**
