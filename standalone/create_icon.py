"""
Simple script to create a basic icon for the application
Uses PIL (Pillow) to create an icon with initials
"""
try:
    from PIL import Image, ImageDraw, ImageFont
    import os

    # Create a 256x256 image with a gradient background
    size = 256
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background (blue to purple)
    for y in range(size):
        r = int(102 + (118 - 102) * y / size)  # 102 -> 118
        g = int(126 + (75 - 126) * y / size)   # 126 -> 75
        b = int(234 + (162 - 234) * y / size)  # 234 -> 162
        draw.rectangle([0, y, size, y+1], fill=(r, g, b))
    
    # Add text
    try:
        font = ImageFont.truetype("arial.ttf", 120)
    except:
        font = ImageFont.load_default()
    
    # Draw "PM" for PDF Manager
    text = "PM"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    position = ((size - text_width) // 2, (size - text_height) // 2 - 20)
    
    # Draw text with shadow
    draw.text((position[0]+3, position[1]+3), text, fill=(0, 0, 0, 128), font=font)
    draw.text(position, text, fill=(255, 255, 255), font=font)
    
    # Add subtitle
    try:
        small_font = ImageFont.truetype("arial.ttf", 24)
    except:
        small_font = ImageFont.load_default()
    
    subtitle = "Email Manager"
    bbox = draw.textbbox((0, 0), subtitle, font=small_font)
    subtitle_width = bbox[2] - bbox[0]
    sub_position = ((size - subtitle_width) // 2, position[1] + text_height + 10)
    draw.text(sub_position, subtitle, fill=(255, 255, 255), font=small_font)
    
    # Save as PNG first
    img.save('icon.png')
    print("✓ Created icon.png")
    
    # Convert to ICO with multiple sizes
    icon_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
    img.save('icon.ico', sizes=icon_sizes)
    print("✓ Created icon.ico with multiple sizes")
    print(f"✓ Icon saved in: {os.path.abspath('icon.ico')}")
    
except ImportError:
    print("Pillow not installed. Installing...")
    import subprocess
    subprocess.run(['pip', 'install', 'pillow'])
    print("Please run this script again.")
except Exception as e:
    print(f"Error creating icon: {e}")
    print("\nAlternative: Download an icon from:")
    print("  - https://www.iconfinder.com/")
    print("  - https://icons8.com/")
    print("  - https://flaticon.com/")
    print("\nSave it as 'icon.ico' in the standalone folder")
