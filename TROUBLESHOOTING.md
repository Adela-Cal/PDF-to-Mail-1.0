# PDF Email Manager - Troubleshooting Guide

## Issue: Downloads Not Appearing

If you click "Generate Outlook Drafts" but don't see the .eml files in your Downloads folder, try these solutions:

### Solution 1: Check Browser Downloads Bar
1. Look at the **bottom of your browser window** - Chrome shows downloads here
2. Click the download icon in the top-right corner of Chrome
3. Check if the downloads are listed but blocked

### Solution 2: Allow Downloads for This Site
1. Look for a **blocked download icon** in your address bar (right side)
2. Click it and select "Always allow downloads from this site"
3. Try generating drafts again

### Solution 3: Check Browser Download Settings
**For Chrome:**
1. Go to Settings (three dots → Settings)
2. Click "Downloads" in the left sidebar
3. Make sure "Ask where to save each file" is OFF (or turn it ON if you want to choose)
4. Note the download location path
5. Try the download again

**For Edge:**
1. Go to Settings (three dots → Settings)  
2. Click "Downloads"
3. Verify the download location
4. Ensure downloads aren't being blocked

### Solution 4: Check Your Antivirus/Security Software
Some antivirus programs block .eml files:
1. Check your antivirus quarantine folder
2. Add an exception for .eml files
3. Temporarily disable antivirus and try again

### Solution 5: Verify Files Are Actually Downloading
1. Press **F12** to open Developer Tools
2. Click the **Console** tab
3. Click "Generate Outlook Drafts"
4. Look for messages starting with "Successfully downloaded:"
5. If you see errors, note them down

### Solution 6: Try a Different Browser
If Chrome isn't working:
1. Try Microsoft Edge
2. Try Firefox
3. The issue may be browser-specific

### Solution 7: Check Disk Space
1. Make sure your Downloads folder isn't full
2. Free up space if needed (at least 10MB recommended)

### Solution 8: Manual Download Path Check
1. Open File Explorer
2. Type `%USERPROFILE%\Downloads` in the address bar
3. Press Enter
4. Look for files named like `draft_filename.eml`
5. Sort by "Date Modified" to see newest files

### Solution 9: Reset Browser Download Settings
**Chrome:**
1. Settings → Reset and clean up
2. "Restore settings to their original defaults"
3. Restart browser and try again

### Solution 10: Use Different Download Method
If all else fails, the app stores files on the server temporarily:
1. Contact support to access files from the server's /tmp folder
2. Or use a different computer/browser to test

## Issue: .eml Files Won't Open in Outlook

### Solution 1: Set Outlook as Default
1. Right-click an .eml file
2. Select "Open with" → "Choose another app"
3. Select **Outlook**
4. Check "Always use this app to open .eml files"
5. Click OK

### Solution 2: Outlook Not Installed
- .eml files require Outlook or another email client
- Install Microsoft Outlook if not already installed
- Or use Windows Mail as an alternative

### Solution 3: File Association Broken
1. Press Windows key
2. Type "Default apps"
3. Scroll to "Email"
4. Select Microsoft Outlook

## Issue: "No emails found in PDF"

### Check 1: Is the PDF Text-Based?
- Scanned PDFs (images) won't work
- The PDF must contain selectable text
- Test: Try selecting text in the PDF - if you can't, it's an image

### Check 2: Email Format
- Emails must be in standard format: `name@domain.com`
- Check the PDF manually - can you see email addresses?

### Check 3: PDF Corruption
- Try opening the PDF in Adobe Reader
- If it won't open, the PDF may be corrupted

## Issue: Drafts Have Wrong Sender

### Solution:
1. Make sure you've added your email account
2. Click the User icon (+) next to "Your Email Account (Sender)"
3. Enter your email and display name
4. **Select it from the dropdown** before generating drafts

## Issue: Attachments Missing from Draft

### Check:
1. The PDF was included when you selected files
2. The PDF file still exists at the original location
3. The PDF isn't corrupted (try opening it manually)

## Issue: HTML Not Rendering in Email Body

### Solution:
- Outlook may display HTML as code in the preview
- Once opened as a draft, Outlook will render it correctly
- Make sure you're using valid HTML syntax

## Issue: Can't Select Multiple PDFs

### Solution:
1. When clicking "Browse & Select PDF Files"
2. Hold **Ctrl** key while clicking files to select multiple
3. Or hold **Shift** to select a range
4. Or use the "Select All" button after extraction

## Issue: App Won't Start (Windows)

### Backend Won't Start:
1. Check if port 8001 is already in use
2. Make sure MongoDB is running
3. Check the terminal for error messages
4. Verify Python and all packages are installed

### Frontend Won't Start:
1. Check if port 3000 is already in use
2. Delete `node_modules` folder
3. Run `yarn install` again
4. Check for errors in the terminal

## Still Having Issues?

### Collect This Information:
1. Operating System (Windows 10/11)
2. Browser (Chrome/Edge/Firefox) and version
3. Error messages from browser console (F12)
4. Screenshot of the issue
5. Steps you've already tried

### Where to Get Help:
- Check the WINDOWS_SETUP_GUIDE.md
- Review the README.md
- Check browser console for specific error messages
- Try running on a different computer to isolate the issue

## Quick Diagnostic Checklist

Before reporting an issue, verify:
- [ ] MongoDB is running
- [ ] Backend server is running (port 8001)
- [ ] Frontend is running (port 3000)
- [ ] You can access http://localhost:3000 in browser
- [ ] You've added your email account in the app
- [ ] You've selected PDFs and they have checkmarks
- [ ] You've entered email subject and body
- [ ] Browser isn't blocking downloads
- [ ] Downloads folder has space available
- [ ] You're using a supported browser (Chrome/Edge/Firefox)
