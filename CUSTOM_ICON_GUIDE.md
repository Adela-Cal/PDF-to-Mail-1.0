# Custom Icon Guide for PDF Email Manager

## 📦 Current Icon

Your application now has a custom icon with:
- Blue-purple gradient background
- "PM" letters (PDF Manager)
- "Email Manager" subtitle
- Multiple sizes (16x16 to 256x256)

## 🎨 How to Replace with Your Own Icon

### Option 1: Use an Existing .ico File

1. **Get your icon file** (must be .ico format)
   - Download from icon websites
   - Or convert your image to .ico format

2. **Replace the icon files:**
   ```
   standalone/icon.ico         ← Replace this
   electron/icon.ico           ← Replace this
   standalone-electron/icon.ico ← Replace this
   ```

3. **Rebuild the application:**
   ```
   build-standalone-fixed.bat
   ```

### Option 2: Create Icon from Image

If you have a PNG/JPG image:

**Step 1: Install Icon Converter**
```cmd
pip install pillow
```

**Step 2: Create conversion script**

Save this as `convert_to_icon.py`:
```python
from PIL import Image

# Open your image
img = Image.open('your_image.png')  # Change to your image

# Create icon with multiple sizes
icon_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
img.save('icon.ico', sizes=icon_sizes)
print("Icon created: icon.ico")
```

**Step 3: Run it**
```cmd
python convert_to_icon.py
```

**Step 4: Copy to folders**
```cmd
copy icon.ico standalone\icon.ico
copy icon.ico electron\icon.ico
copy icon.ico standalone-electron\icon.ico
```

### Option 3: Use the Icon Generator Script

I've created a script for you:

```cmd
cd standalone
python create_icon.py
```

This creates a default icon. You can edit `create_icon.py` to customize:
- Colors
- Text
- Font
- Background

## 🌐 Where to Get Icons

### Free Icon Sites:
1. **Flaticon** - https://www.flaticon.com/
   - Search "email" or "pdf"
   - Download as ICO

2. **Icons8** - https://icons8.com/
   - Huge collection
   - Can customize colors

3. **Iconfinder** - https://www.iconfinder.com/
   - Free and premium icons

4. **Favicon.io** - https://favicon.io/
   - Convert text to icon
   - Simple and quick

### Converting Images to ICO:

**Online Converters:**
- https://convertio.co/png-ico/
- https://www.icoconverter.com/
- https://favicon.io/favicon-converter/

**Requirements:**
- Square image (256x256, 512x512, or 1024x1024)
- PNG or JPG format
- Clear/simple design works best

## 🎨 Icon Design Tips

### Best Practices:
1. **Keep it simple** - Complex designs don't scale well
2. **High contrast** - Make it stand out
3. **Recognizable** - Should be clear at 16x16
4. **Square format** - No borders needed
5. **Clear center focus** - Important elements in middle

### Size Requirements:
- **Minimum**: 256x256 pixels
- **Recommended**: 512x512 pixels
- **Format**: PNG, JPG, or ICO

### Color Suggestions:
- Professional: Blue, Gray, Black
- Creative: Purple, Orange, Green
- Your brand colors

## 🔧 Technical Details

### Icon Sizes Included:
```
256x256 - Windows 10/11 large tiles
128x128 - High DPI displays
64x64  - Standard desktop
48x48  - Windows Explorer
32x32  - Taskbar
16x16  - System tray/tabs
```

### File Locations:
```
standalone/icon.ico
  ↓ Used by PyInstaller for backend .exe
  
electron/icon.ico
  ↓ Used by Electron for window icon
  
standalone-electron/icon.ico
  ↓ Used by Electron Builder for installer
```

## 🚀 Quick Replace Guide

**Have an icon file ready?**

```cmd
REM Copy to all locations
copy your_icon.ico standalone\icon.ico
copy your_icon.ico electron\icon.ico
copy your_icon.ico standalone-electron\icon.ico

REM Rebuild
build-standalone-fixed.bat
```

Done! Your new icon will be in the installer.

## 🎯 Current Icon Details

The default icon I created has:
- **Background**: Blue-purple gradient (#667eea to #764ba2)
- **Text**: "PM" in white, bold
- **Subtitle**: "Email Manager" 
- **Style**: Modern, professional
- **Format**: Multi-size ICO file

Feel free to replace it with your own!

## 🆘 Troubleshooting

**Icon not showing after build?**
1. Make sure icon.ico exists in all 3 folders
2. Delete old build folders and rebuild
3. Check icon file is valid (open it in Windows)

**Icon looks blurry?**
- Use higher resolution source image
- Make sure it's at least 256x256

**Build fails with icon error?**
- Check file is named exactly `icon.ico`
- Verify it's in the correct folder
- Make sure it's a valid .ico file

## 💡 Pro Tip

Create a `brand/` folder with your icons:
```
brand/
  icon.ico
  icon.png (original)
  logo.png
```

Then use a batch script to copy everywhere:
```cmd
copy brand\icon.ico standalone\icon.ico
copy brand\icon.ico electron\icon.ico
copy brand\icon.ico standalone-electron\icon.ico
```

This makes updating easier!
