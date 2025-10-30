# PDF Email Manager - Standalone Windows Application

A complete solution for extracting email addresses from PDFs and generating Outlook draft emails with attachments.

## 📦 Quick Start (For Users)

### Option 1: Simple Batch Files (Easiest)

1. **First Time Setup:**
   ```
   Double-click setup.bat
   Wait for installation to complete
   ```

2. **Start the Application:**
   ```
   Double-click start.bat
   Browser will open automatically
   ```

3. **Stop the Application:**
   ```
   Double-click stop.bat
   Or close the command windows
   ```

### Option 2: Python Launcher (Recommended)

1. **Launch:**
   ```
   Double-click launcher.py
   Or run: python launcher.py
   ```
   
   The launcher will:
   - Check all dependencies
   - Install missing packages automatically
   - Start both servers
   - Open your browser
   - Keep running until you close it

### Option 3: Manual Start

1. **Start Backend:**
   ```
   cd backend
   python -m uvicorn server:app --host 0.0.0.0 --port 8001
   ```

2. **Start Frontend (in new terminal):**
   ```
   cd frontend
   npm start
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📋 Prerequisites

### Required Software:
- **Python 3.8+** → [Download](https://www.python.org/downloads/)
  - ⚠️ Check "Add Python to PATH" during installation
- **Node.js 16+** → [Download](https://nodejs.org/)
- **MongoDB Community** → [Download](https://www.mongodb.com/try/download/community)

### Installation Checklist:
- [ ] Python installed and in PATH
- [ ] Node.js installed and in PATH
- [ ] MongoDB installed and running
- [ ] Dependencies installed (run setup.bat)

## 🚀 Features

- ✅ **PDF Email Extraction** - Automatically finds email addresses in PDFs
- ✅ **Bulk Processing** - Handle multiple PDFs at once
- ✅ **Email Templates** - Save and reuse email templates
- ✅ **Email Preview** - See and edit drafts before generating
- ✅ **Multiple Sender Accounts** - Switch between your email accounts
- ✅ **Outlook Integration** - Generate .eml files that open in Outlook
- ✅ **Standalone** - Runs completely offline on your computer

## 📁 Project Structure

```
PDF-Email-Manager/
├── start.bat              ← Double-click to start (Windows)
├── stop.bat               ← Double-click to stop (Windows)
├── setup.bat              ← First-time setup (Windows)
├── launcher.py            ← Python launcher (cross-platform)
├── backend/               ← FastAPI server
│   ├── server.py
│   ├── requirements.txt
│   └── .env
├── frontend/              ← React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
├── WINDOWS_SETUP_GUIDE.md
├── TROUBLESHOOTING.md
└── CREATING_EXECUTABLE.md ← How to make .exe installer
```

## 🎯 How to Use

### 1. Add Your Email Account
- Click the user icon in the Email Template section
- Enter your email address and display name
- Click "Save Email Account"
- Select it from the dropdown

### 2. Load PDFs
**Method A - Browse Files:**
- Click "Browse & Select PDF Files"
- Select one or more PDFs
- Click Open

**Method B - Folder Path:**
- Enter full path: `C:\Users\YourName\Documents\PDFs`
- Click "Extract"

### 3. Select PDFs to Email
- Review extracted emails
- Check boxes next to PDFs you want to send
- Or click "Select All"

### 4. Create Email
- Enter email subject
- Enter email body (HTML supported)
- Or select a saved template
- Edit in the live preview if needed

### 5. Generate Drafts
- Click "Generate Outlook Drafts"
- .eml files download to your Downloads folder
- Double-click each .eml to open in Outlook
- Review and send from Outlook

## 🛠️ Configuration

### Backend Configuration (backend/.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=pdf_email_manager
CORS_ORIGINS=http://localhost:3000
```

### Frontend Configuration (frontend/.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

⚠️ **Do not change these values** unless you know what you're doing!

## 🔧 Troubleshooting

### Application Won't Start

**Check Python:**
```bash
python --version
```
Should show Python 3.8 or higher

**Check Node.js:**
```bash
node --version
```
Should show v16 or higher

**Check MongoDB:**
```bash
# Windows Services
services.msc
# Look for MongoDB service

# Or check processes
tasklist | findstr mongod
```

### Downloads Not Appearing

1. Check browser downloads bar (bottom of window)
2. Look for blocked download icon in address bar
3. Check your Downloads folder manually
4. Open DevTools (F12) → Console for errors
5. See TROUBLESHOOTING.md for detailed solutions

### Port Already in Use

**Backend (port 8001):**
```bash
# Find process using port
netstat -ano | findstr :8001

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Frontend (port 3000):**
```bash
# Find and kill
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Not Running

**Start MongoDB:**
```bash
# If installed as service
net start MongoDB

# Or from Services
services.msc → Find MongoDB → Start

# Or run manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

## 📦 Creating a Distributable Installer

See **CREATING_EXECUTABLE.md** for detailed instructions on:
- Creating a Windows .exe installer
- Using PyInstaller
- Using Inno Setup
- Creating portable ZIP versions
- Electron-based standalone app

## 🔒 Data Privacy

- ✅ Runs 100% on your computer
- ✅ No data sent to external servers
- ✅ PDFs stay on your machine
- ✅ Email drafts created locally
- ✅ All processing happens offline

## 📝 License

[Your License Here]

## 🤝 Support

- **Setup Issues**: See WINDOWS_SETUP_GUIDE.md
- **Download Problems**: See TROUBLESHOOTING.md
- **Creating Installer**: See CREATING_EXECUTABLE.md

## 🔄 Updating the Application

1. Stop the application (stop.bat or close windows)
2. Replace files with new version
3. Run setup.bat again (installs new dependencies)
4. Start the application normally

## ⚙️ Advanced Configuration

### Running on Different Ports

**Backend (.env):**
```env
PORT=8001  # Change this
```

**Frontend (.env):**
```env
PORT=3000  # Change this
REACT_APP_BACKEND_URL=http://localhost:8001  # Update if backend port changed
```

### Using Different MongoDB

```env
MONGO_URL=mongodb://your-mongodb-server:27017
```

### Running as Windows Service

See WINDOWS_SETUP_GUIDE.md for instructions on:
- Installing as Windows Service
- Auto-start on boot
- Running in background

## 📊 System Requirements

**Minimum:**
- Windows 10 or higher
- 4GB RAM
- 1GB free disk space
- Internet connection (for first-time setup only)

**Recommended:**
- Windows 11
- 8GB RAM
- 2GB free disk space
- SSD for better performance

## 🎓 Tips & Best Practices

1. **Keep MongoDB Running** - Start it once and leave it running
2. **Use Templates** - Save time by creating reusable email templates
3. **Organize PDFs** - Keep PDFs in dedicated folders for easy batch processing
4. **Backup Data** - Your templates and settings are in MongoDB
5. **Check Downloads Folder** - Clean it regularly as .eml files accumulate

## 🐛 Known Issues

1. **First Launch Slow** - Normal, installing dependencies
2. **Browser Caching** - Hard refresh (Ctrl+F5) if you see old version
3. **Multiple Instances** - Only run one instance at a time
4. **Large PDFs** - May take longer to process

## 📞 Getting Help

If you're stuck:

1. Check TROUBLESHOOTING.md first
2. Look at browser console (F12) for errors
3. Check backend logs in the terminal window
4. Verify all prerequisites are installed
5. Try on a fresh Windows install (VM) to rule out conflicts

## 🎉 You're Ready!

Run `start.bat` and start managing your PDF emails!
