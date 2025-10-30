# PDF Email Manager - Windows Setup Guide

This guide explains how to run the PDF Email Manager on your Windows computer.

## Prerequisites

1. **Python 3.8+** - Download from [python.org](https://www.python.org/downloads/)
2. **Node.js 16+** - Download from [nodejs.org](https://nodejs.org/)
3. **MongoDB** - Download from [mongodb.com](https://www.mongodb.com/try/download/community)

## Installation Steps

### 1. Install Python Dependencies

Open Command Prompt or PowerShell in the `backend` folder and run:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

Open Command Prompt or PowerShell in the `frontend` folder and run:

```bash
cd frontend
yarn install
```

### 3. Start MongoDB

Make sure MongoDB is running on your system. If you installed MongoDB as a service, it should start automatically. Otherwise, start it manually:

```bash
mongod
```

### 4. Configure Environment Variables

#### Backend (.env)
The `backend/.env` file should have:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=pdf_email_manager
CORS_ORIGINS=http://localhost:3000
```

#### Frontend (.env)
The `frontend/.env` file should have:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 5. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
yarn start
```

The application will open automatically in your browser at `http://localhost:3000`

## Usage Instructions

### 1. Add Your Email Account
- Click the user icon (+) button next to "Your Email Account"
- Enter your email address (e.g., john@company.com)
- Enter your display name (e.g., John Doe)
- Click "Save Email Account"
- Select your account from the dropdown

### 2. Load PDFs
**Option A - Browse Files:**
- Click "Browse & Select PDF Files"
- Select one or more PDF files from your computer
- Click Open

**Option B - Folder Path:**
- Enter the full folder path (e.g., C:\Users\John\Documents\PDFs)
- Click "Extract"

### 3. Review Extracted Emails
- The app will show all PDFs with extracted email addresses
- Check the boxes next to the PDFs you want to email

### 4. Create Email Template (Optional)
- Click the + button next to "Select Template"
- Enter a template name
- The subject and body will be saved with the template
- Or select an existing template from the dropdown

### 5. Compose Email
- Enter the email subject
- Enter the email body (HTML is supported)
- Example: `<h2>Hello</h2><p>Please find attached...</p>`

### 6. Generate Drafts
- Click "Generate Outlook Drafts"
- .eml files will download to your Downloads folder
- Double-click each .eml file to open in Outlook
- The draft will open with:
  - Your email in the From field
  - Recipient email in the To field
  - PDF attached
  - Subject and body filled in

**Note:** Each PDF generates its own separate email with its own recipient and attachment.

## Email Preview Feature

The app shows a live preview of how each email will look:

1. **Appears Automatically** - When you select PDFs and enter email content
2. **Shows Email Headers** - From, To, Subject, and attachment info
3. **Editable Preview** - Click inside the preview to edit the email body
4. **Text Editing** - Select, copy, paste, and rearrange text as needed
5. **Reset Button** - Restores the email body to the original template
6. **What You Edit is What You Send** - The generated drafts use your edited preview content

## Controlling Where Files Are Saved

By default, .eml files download to your Windows Downloads folder (usually `C:\Users\YourName\Downloads`).

**To change the download location:**

1. In Chrome: Settings → Downloads → Change "Location"
2. Or enable "Ask where to save each file before downloading"
3. In Edge: Settings → Downloads → Change location

**Or set it per-download:**
- When the download starts, right-click the download at the bottom
- Click "Show in folder" to see where it went
- Or in browser settings, enable asking where to save each file

## Tips for Windows Users

### Making It Easier to Start

Create two batch files to start the application quickly:

**start-backend.bat:**
```batch
@echo off
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
pause
```

**start-frontend.bat:**
```batch
@echo off
cd frontend
yarn start
pause
```

### Common Issues

**Issue: "uvicorn is not recognized"**
- Solution: Make sure Python Scripts folder is in your PATH
- Or use: `python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload`

**Issue: "yarn is not recognized"**
- Solution: Install Yarn globally: `npm install -g yarn`
- Or use npm instead: `npm start`

**Issue: .eml files don't open in Outlook**
- Solution: Right-click .eml file → Open with → Choose Outlook as default

**Issue: PDFs not found**
- Solution: Use forward slashes in paths: `C:/Users/John/Documents/PDFs`
- Or use double backslashes: `C:\\Users\\John\\Documents\\PDFs`

## Troubleshooting

### Backend won't start
1. Check if port 8001 is already in use
2. Make sure MongoDB is running
3. Check backend/.env file exists with correct values

### Frontend won't start
1. Check if port 3000 is already in use
2. Delete `node_modules` folder and run `yarn install` again
3. Check frontend/.env file exists with correct values

### No emails extracted from PDFs
1. Make sure PDFs contain searchable text (not scanned images)
2. Check that email addresses are in standard format (name@domain.com)

## Running in Production

For a production deployment on Windows:

1. Set environment variables properly
2. Use a process manager like PM2 or Windows Service
3. Consider using a reverse proxy like nginx
4. Secure your MongoDB instance
5. Use HTTPS for production

## Support

For issues or questions, check:
- Backend logs in the terminal running uvicorn
- Frontend logs in browser console (F12)
- MongoDB logs in MongoDB installation folder
