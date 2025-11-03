# 🚀 Quick Build Reference - Speedy Statements

## ONE-COMMAND BUILD
```cmd
cd /app
build-complete.bat
```
**Output**: `standalone-build/dist/Speedy Statements Setup 1.0.0.exe`

---

## PREREQUISITES
- Windows 10/11
- Python 3.11+
- Node.js 18+

---

## WHAT GETS BUILT
Single installer file (~150-200 MB) containing:
- Desktop application (Electron)
- Backend server (Python FastAPI)
- All dependencies
- No MongoDB needed!

---

## AFTER BUILDING

### Test It
1. Double-click: `Speedy Statements Setup 1.0.0.exe`
2. Install
3. Launch from Desktop
4. Test PDF extraction and draft generation

### Distribute It
- Email the installer file
- Upload to website
- Share via USB
- Deploy via IT systems

---

## END USER EXPERIENCE
1. Download installer
2. Run installer
3. Desktop shortcut created
4. Click to launch
5. Works like Microsoft Word (no browser!)
6. Data saved locally per installation

---

## TROUBLESHOOTING

**Build fails?**
- Ensure Python & Node.js installed
- Run from `/app` directory
- Check error messages

**Installer won't run?**
- Windows Defender may block
- Right-click → "Run as administrator"
- Click "More info" → "Run anyway"

**App won't start?**
- Check antivirus settings
- Try running as administrator
- Reinstall

---

## CUSTOMIZATION

### Add Icon
1. Create `icon.ico` (256x256)
2. Place in `standalone-build/`
3. Edit `package.json`: `"icon": "icon.ico"`
4. Edit `server_standalone.spec`: `icon='icon.ico'`
5. Rebuild

### Change Name
Edit `standalone-build/package.json`:
```json
"productName": "Your Name Here"
```

---

## FILE LOCATIONS

**Build Directory**: `/app/standalone-build/`  
**Installer Output**: `standalone-build/dist/`  
**User Data**: `%APPDATA%\SpeedyStatements\data\`  

---

## DOCUMENTATION

📘 **Build Guide**: `BUILD_INSTRUCTIONS.md`  
📗 **User Guide**: `USER_GUIDE.md`  
📙 **Architecture**: `standalone-build/README.md`  
📕 **Full Summary**: `DEPLOYMENT_SUMMARY.md`

---

## SUPPORT

Build issues → `BUILD_INSTRUCTIONS.md`  
Usage questions → `USER_GUIDE.md`  
Architecture details → `standalone-build/README.md`

---

**You're all set!** 🎉

Build → Test → Distribute → Done!
