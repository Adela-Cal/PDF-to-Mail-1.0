#!/bin/bash

echo "========================================"
echo "Speedy Statements - Mac Build Script"
echo "========================================"
echo ""
echo "This will:"
echo "1. Check prerequisites (Python, Node.js)"
echo "2. Install dependencies"
echo "3. Build the application"
echo "4. Create the Mac installer (.dmg)"
echo ""
read -p "Press Enter to continue..."
echo ""

# Check Python
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ ERROR: Python 3 is not installed!"
    echo ""
    echo "Install Python using Homebrew:"
    echo "  brew install python@3.11"
    echo ""
    exit 1
fi
echo "✅ Python installed"
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js is not installed!"
    echo ""
    echo "Install Node.js using Homebrew:"
    echo "  brew install node"
    echo ""
    exit 1
fi
echo "✅ Node.js installed"
echo ""

# Check if in correct directory
if [ ! -d "standalone-build" ]; then
    echo "❌ ERROR: standalone-build directory not found!"
    echo "Make sure you're in the PDF-to-Mail-1.0 directory"
    exit 1
fi

# Install Yarn if needed
echo "Checking Yarn..."
if ! command -v yarn &> /dev/null; then
    echo "Installing Yarn..."
    npm install -g yarn
fi
echo "✅ Yarn ready"
echo ""

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf standalone-build/backend
rm -rf standalone-build/frontend
rm -rf standalone-build/dist
echo "✅ Cleaned"
echo ""

# Build frontend
echo "========================================"
echo "Building Frontend (5-10 minutes)"
echo "========================================"
echo ""
cd frontend || exit 1

cp ../standalone-build/.env.production .env.production 2>/dev/null

echo "Installing frontend dependencies..."
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Frontend dependency installation failed!"
    exit 1
fi

echo "Building frontend..."
yarn build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

mkdir -p ../standalone-build/frontend
cp -R build/* ../standalone-build/frontend/
cd ..
echo "✅ Frontend built"
echo ""

# Build backend
echo "========================================"
echo "Building Backend (5-10 minutes)"
echo "========================================"
echo ""
cd standalone-build || exit 1

echo "Installing Python dependencies..."
pip3 install -r requirements.txt --quiet
pip3 install pyinstaller --quiet

echo "Building backend executable..."
echo "This may take several minutes..."
pyinstaller server_standalone.spec --clean
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed!"
    exit 1
fi

mkdir -p backend
cp dist/SpeedyStatementsServer backend/
echo "✅ Backend built"
echo ""

# Build Mac installer
echo "========================================"
echo "Building Mac Installer (3-5 minutes)"
echo "========================================"
echo ""
echo "Installing Electron dependencies..."
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Electron dependency installation failed!"
    exit 1
fi

echo "Building Mac installer..."
yarn build
if [ $? -ne 0 ]; then
    echo "❌ Mac installer build failed!"
    exit 1
fi

cd ..

echo ""
echo "========================================"
echo "SUCCESS! BUILD COMPLETE!"
echo "========================================"
echo ""
echo "Your Mac installer is ready at:"
echo "$(pwd)/standalone-build/dist/Speedy Statements-1.0.0.dmg"
echo ""
echo "You can now:"
echo "1. Navigate to: standalone-build/dist/"
echo "2. Double-click: Speedy Statements-1.0.0.dmg"
echo "3. Drag to Applications folder"
echo "4. Launch and enjoy!"
echo ""
echo "Opening the dist folder for you..."
open "$(pwd)/standalone-build/dist"
echo ""
read -p "Press Enter to exit..."
