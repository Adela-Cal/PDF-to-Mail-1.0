# Speedy Statements - User Guide

## Installation

### System Requirements
- Windows 10 or Windows 11
- 500 MB free disk space
- No additional software required (100% standalone)

### Installation Steps

1. **Download** the installer: `Speedy Statements Setup 1.0.0.exe`

2. **Run the installer**:
   - Double-click the downloaded file
   - Windows may show a security warning (click "More info" → "Run anyway")
   - This is normal for new applications without a code signing certificate

3. **Choose installation location**:
   - Default: `C:\Program Files\Speedy Statements`
   - Or choose a custom location

4. **Complete installation**:
   - The installer will create:
     - Desktop shortcut
     - Start Menu entry
   - Click "Finish" to complete

5. **Launch the application**:
   - Double-click the desktop shortcut, or
   - Search for "Speedy Statements" in Start Menu

## Using Speedy Statements

### First Launch

When you first open Speedy Statements:
- The application opens in a desktop window (not a web browser)
- Your data is stored locally on your computer
- No internet connection required for operation

### Main Features

#### 1. Select PDF Folder

**Option A: Browse for Folder**
- Click the **"Browse Folder"** button
- Navigate to the folder containing your PDF files
- Select the folder and click "OK"

**Option B: Drag & Drop**
- Drag PDF files directly into the application window

#### 2. Extract Email Addresses

- After selecting PDFs, the application automatically extracts email addresses
- You'll see a list of PDFs with their associated email addresses
- Each row shows:
  - PDF filename
  - Extracted email address(es)
  - Checkbox to select for draft generation

#### 3. Select PDFs for Email Drafts

- Use **Select All** button to select all PDFs
- Use **Deselect All** to clear all selections
- Or manually check individual PDFs

#### 4. Customize Email Content

**Email Subject:**
- Enter a subject line for your emails
- This will be used for all selected drafts

**Email Body:**
- Enter the email message content
- Use the rich text editor for formatting
- The text will be applied to all drafts

**Save Templates (Optional):**
- Enter a template name
- Click "Save Template" to save for future use
- Load templates from the dropdown menu

#### 5. Set Email Account (Optional)

**Add Email Account:**
- Click "Manage Accounts"
- Enter your email address and name
- Click "Add Account"

**Select Account:**
- Choose an account from the dropdown
- This will be used as the "From" address in drafts

#### 6. Preview Email

- The preview window shows how your email will look
- Review the subject, body, and formatting
- Make any necessary changes before generating drafts

#### 7. Choose Save Location

- Click "Choose Folder" under "Draft Save Location"
- Select where you want the `.eml` draft files saved
- Default: Downloads folder

#### 8. Generate Outlook Drafts

- Click **"Generate Outlook Drafts"** button
- One `.eml` file is created for each selected PDF
- Files are saved to your chosen location

#### 9. Open Drafts in Outlook

- Navigate to your save location
- Double-click any `.eml` file
- The draft opens in Microsoft Outlook as an **editable draft**
- The PDF is attached
- Recipient email is pre-filled
- You can edit, add content, and send

## Data Storage

### Where is my data stored?

All your data is stored locally at:
```
C:\Users\[YourUsername]\AppData\Roaming\SpeedyStatements\data\
```

This includes:
- `templates.json` - Saved email templates
- `accounts.json` - Saved email accounts

### Is my data shared?

- **No** - All data stays on your computer
- Each installation has its own data
- No cloud sync or remote storage
- No internet connection required

## Troubleshooting

### Application Won't Start

**Problem**: Double-clicking the icon does nothing
**Solution**:
1. Right-click the shortcut → "Run as administrator"
2. Check Windows Defender hasn't blocked the app
3. Reinstall the application

### Can't Select Folder

**Problem**: "Browse Folder" button doesn't work
**Solution**:
- Ensure the folder exists
- Check you have read permissions for the folder
- Try a different folder location

### PDF Extraction Not Working

**Problem**: No emails found in PDFs
**Solution**:
- Ensure PDFs contain actual text (not scanned images)
- Check if email addresses are in correct format
- Verify PDFs are not password-protected

### Outlook Drafts Won't Open

**Problem**: `.eml` files don't open in Outlook
**Solution**:
1. Ensure Microsoft Outlook is installed
2. Right-click `.eml` file → "Open with" → Select Outlook
3. Set Outlook as default email client

### Drafts Open as Read-Only

**Problem**: Can't edit the draft in Outlook
**Solution**:
- This should not happen in version 1.0.0+
- Verify you're using the latest version
- Try opening Outlook first, then double-clicking the `.eml` file

## Uninstalling

To remove Speedy Statements:

1. **Windows 10/11**:
   - Settings → Apps → "Speedy Statements" → Uninstall

2. **Or use Control Panel**:
   - Control Panel → Programs → Uninstall a program → "Speedy Statements"

3. **Remove data (optional)**:
   - Delete: `%APPDATA%\SpeedyStatements\`
   - This removes all templates and saved accounts

## Tips & Best Practices

### Organizing PDFs
- Keep PDFs in a dedicated folder
- Use clear file names for easy identification
- Ensure PDFs contain extractable text

### Template Management
- Create templates for common email types
- Use descriptive template names
- Regularly review and update templates

### Email Accounts
- Add all your sender accounts
- Use descriptive names for easy selection
- Keep account list up to date

### Draft Review
- Always preview emails before generating
- Check spelling and formatting
- Verify recipient addresses are correct

## Support

For issues or questions:
- Review the Troubleshooting section
- Check that you're using the latest version
- Ensure Windows 10/11 is up to date

---

**Version**: 1.0.0
**Last Updated**: 2025
