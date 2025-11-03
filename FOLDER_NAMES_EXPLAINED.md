# 📁 Understanding Folder Names

## The `/app` Confusion - EXPLAINED

### What is `/app`?

`/app` is just the **folder name in the cloud** (Emergent platform). It's NOT a special folder you need on Windows.

Think of it like this:
- **In Emergent Cloud**: Files are in `/app/`
- **On Your Windows PC**: Files will be in `C:\Program Files\YOUR-REPO-NAME\`

### Translation Table

| Documentation Says | Actually Means on Windows |
|-------------------|--------------------------|
| `/app/` | `C:\Program Files\YOUR-REPO-NAME\` |
| `/app/standalone-build/` | `C:\Program Files\YOUR-REPO-NAME\standalone-build\` |
| `/app/frontend/` | `C:\Program Files\YOUR-REPO-NAME\frontend\` |
| `/app/backend/` | `C:\Program Files\YOUR-REPO-NAME\backend\` |

### Example

**Documentation says:**
```
Navigate to /app and run build-complete.bat
```

**On Windows, you do:**
```cmd
cd C:\Program Files\YOUR-REPO-NAME
build-complete.bat
```

---

## Your Folder Structure on Windows

After cloning from GitHub:

```
C:\Program Files\YOUR-REPO-NAME\
├── backend/
├── frontend/
├── standalone-build/
├── SETUP_AND_BUILD.bat  ← The magic script!
├── SIMPLE_INSTALL.md
├── START_HERE.md
└── (all other files)
```

**That's it!** No special `/app` folder needed.

---

## Where to Extract/Clone on Windows

### Option 1: Program Files (Recommended)
```
C:\Program Files\YOUR-REPO-NAME\
```

### Option 2: Your Documents
```
C:\Users\YourName\Documents\SpeedyStatements\
```

### Option 3: Any folder you want
```
C:\Projects\SpeedyStatements\
D:\MyApps\SpeedyStatements\
```

**All work fine!** Choose wherever is convenient for you.

---

## When Following Instructions

Whenever you see:
- `/app` → Your repository folder on Windows
- `/app/standalone-build` → `YOUR-REPO-NAME\standalone-build`
- "Navigate to /app" → "Navigate to your repository folder"

---

## Summary

- `/app` = Cloud folder name, not Windows folder name ✅
- On Windows = `C:\Program Files\YOUR-REPO-NAME\` (or wherever you clone) ✅
- The important part = Run `SETUP_AND_BUILD.bat` from the root folder ✅

**Don't worry about `/app` - it's just documentation shorthand!** 🎯
