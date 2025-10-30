"""
PDF Email Manager - Windows Setup and Launcher
Checks dependencies and starts the application
"""

import os
import sys
import subprocess
import webbrowser
import time
from pathlib import Path

# Colors for console output (Windows)
try:
    import colorama
    colorama.init()
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
except ImportError:
    GREEN = RED = YELLOW = BLUE = RESET = ''


def print_header(text):
    print(f"\n{BLUE}{'=' * 50}")
    print(f"{text}")
    print(f"{'=' * 50}{RESET}\n")


def print_success(text):
    print(f"{GREEN}✓ {text}{RESET}")


def print_error(text):
    print(f"{RED}✗ {text}{RESET}")


def print_warning(text):
    print(f"{YELLOW}⚠ {text}{RESET}")


def check_python():
    """Check if Python is installed"""
    try:
        version = sys.version.split()[0]
        print_success(f"Python {version} is installed")
        return True
    except:
        print_error("Python check failed")
        return False


def check_node():
    """Check if Node.js is installed"""
    try:
        result = subprocess.run(['node', '--version'], 
                              capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            version = result.stdout.strip()
            print_success(f"Node.js {version} is installed")
            return True
        else:
            print_error("Node.js is not installed")
            return False
    except FileNotFoundError:
        print_error("Node.js is not installed or not in PATH")
        print("Download from: https://nodejs.org/")
        return False
    except Exception as e:
        print_error(f"Error checking Node.js: {e}")
        return False


def check_mongodb():
    """Check if MongoDB is running"""
    try:
        result = subprocess.run(['tasklist', '/FI', 'IMAGENAME eq mongod.exe'],
                              capture_output=True, text=True)
        if 'mongod.exe' in result.stdout:
            print_success("MongoDB is running")
            return True
        else:
            print_warning("MongoDB is not running")
            print("Please start MongoDB before launching the app")
            return False
    except Exception as e:
        print_warning(f"Could not check MongoDB status: {e}")
        return False


def install_backend_dependencies():
    """Install Python backend dependencies"""
    print("\n[Installing Backend Dependencies]")
    backend_dir = Path(__file__).parent / 'backend'
    requirements_file = backend_dir / 'requirements.txt'
    
    if not requirements_file.exists():
        print_error(f"requirements.txt not found at {requirements_file}")
        return False
    
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 
                       str(requirements_file)], check=True)
        print_success("Backend dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install backend dependencies: {e}")
        return False


def install_frontend_dependencies():
    """Install Node.js frontend dependencies"""
    print("\n[Installing Frontend Dependencies]")
    frontend_dir = Path(__file__).parent / 'frontend'
    
    if not (frontend_dir / 'package.json').exists():
        print_error(f"package.json not found in {frontend_dir}")
        return False
    
    try:
        os.chdir(frontend_dir)
        subprocess.run(['npm', 'install'], check=True)
        print_success("Frontend dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install frontend dependencies: {e}")
        return False
    except FileNotFoundError:
        print_error("npm is not found. Please install Node.js")
        return False


def start_backend():
    """Start the FastAPI backend server"""
    print("\n[Starting Backend Server]")
    backend_dir = Path(__file__).parent / 'backend'
    
    try:
        # Start backend in a new process
        backend_process = subprocess.Popen(
            [sys.executable, '-m', 'uvicorn', 'server:app', 
             '--host', '0.0.0.0', '--port', '8001', '--reload'],
            cwd=backend_dir,
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
        print_success("Backend server starting on http://localhost:8001")
        return backend_process
    except Exception as e:
        print_error(f"Failed to start backend: {e}")
        return None


def start_frontend():
    """Start the React frontend server"""
    print("\n[Starting Frontend Server]")
    frontend_dir = Path(__file__).parent / 'frontend'
    
    try:
        # Set environment variable to prevent browser auto-open
        env = os.environ.copy()
        env['BROWSER'] = 'none'
        
        # Start frontend in a new process
        frontend_process = subprocess.Popen(
            ['npm', 'start'],
            cwd=frontend_dir,
            env=env,
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
        print_success("Frontend server starting on http://localhost:3000")
        return frontend_process
    except Exception as e:
        print_error(f"Failed to start frontend: {e}")
        return None


def open_browser():
    """Open the application in the default browser"""
    print("\n[Opening Browser]")
    time.sleep(5)  # Wait for servers to start
    try:
        webbrowser.open('http://localhost:3000')
        print_success("Browser opened")
    except Exception as e:
        print_warning(f"Could not open browser automatically: {e}")
        print("Please open http://localhost:3000 manually")


def main():
    """Main setup and launch function"""
    print_header("PDF Email Manager - Launcher")
    
    # Check if this is first run
    backend_deps_exist = (Path(__file__).parent / 'backend' / 'venv').exists()
    frontend_deps_exist = (Path(__file__).parent / 'frontend' / 'node_modules').exists()
    
    first_run = not (backend_deps_exist and frontend_deps_exist)
    
    if first_run:
        print("First time setup detected...")
        print("This will install all required dependencies.\n")
        input("Press Enter to continue...")
    
    # Check dependencies
    print_header("Checking System Requirements")
    
    python_ok = check_python()
    node_ok = check_node()
    mongodb_ok = check_mongodb()
    
    if not python_ok or not node_ok:
        print_error("\nMissing required software. Please install:")
        if not python_ok:
            print("  - Python 3.8+: https://www.python.org/downloads/")
        if not node_ok:
            print("  - Node.js 16+: https://nodejs.org/")
        input("\nPress Enter to exit...")
        sys.exit(1)
    
    if not mongodb_ok:
        print_warning("\nMongoDB is not running. Please start it first.")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            sys.exit(1)
    
    # Install dependencies if needed
    if first_run:
        print_header("Installing Dependencies")
        
        if not install_backend_dependencies():
            print_error("\nFailed to install backend dependencies")
            input("Press Enter to exit...")
            sys.exit(1)
        
        if not install_frontend_dependencies():
            print_error("\nFailed to install frontend dependencies")
            input("Press Enter to exit...")
            sys.exit(1)
        
        print_success("\n✓ All dependencies installed successfully!")
    
    # Start servers
    print_header("Starting PDF Email Manager")
    
    backend_process = start_backend()
    if not backend_process:
        print_error("\nFailed to start backend server")
        input("Press Enter to exit...")
        sys.exit(1)
    
    time.sleep(2)  # Give backend time to start
    
    frontend_process = start_frontend()
    if not frontend_process:
        print_error("\nFailed to start frontend server")
        backend_process.terminate()
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Open browser
    open_browser()
    
    # Keep running
    print_header("PDF Email Manager is Running!")
    print(f"{GREEN}Backend:  http://localhost:8001{RESET}")
    print(f"{GREEN}Frontend: http://localhost:3000{RESET}")
    print(f"\n{YELLOW}Two console windows have opened - don't close them!{RESET}")
    print(f"\n{BLUE}Press Ctrl+C here or close this window to stop all servers{RESET}\n")
    
    try:
        # Keep the script running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nStopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print_success("Servers stopped")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_error(f"An error occurred: {e}")
        input("\nPress Enter to exit...")
        sys.exit(1)
