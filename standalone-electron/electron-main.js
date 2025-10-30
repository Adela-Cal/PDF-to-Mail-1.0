const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { spawn, execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const kill = require('tree-kill');

let mainWindow;
let backendProcess = null;

// Determine if running in development or production
const isDev = !app.isPackaged;

// Get the correct paths
const getBackendExePath = () => {
  if (isDev) {
    // In development, use Python script
    return null;
  }
  // In production, use bundled executable
  return path.join(process.resourcesPath, 'backend', 'PDFEmailManagerBackend.exe');
};

const getFrontendPath = () => {
  if (isDev) {
    return null; // Will use localhost:3000
  }
  return path.join(process.resourcesPath, 'frontend');
};

// Start the backend server (standalone executable)
function startBackendExecutable() {
  return new Promise((resolve, reject) => {
    const backendExe = getBackendExePath();
    
    if (!backendExe || !fs.existsSync(backendExe)) {
      console.error('Backend executable not found:', backendExe);
      reject(new Error('Backend executable not found'));
      return;
    }

    console.log('Starting backend from executable:', backendExe);

    // Start the backend executable
    backendProcess = execFile(backendExe, ['8001'], {
      cwd: path.dirname(backendExe),
      windowsHide: true,
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
      if (data.includes('Application startup complete') || data.includes('Uvicorn running')) {
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('error', (error) => {
      console.error('Failed to start backend:', error);
      reject(error);
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
    });

    // Timeout fallback
    setTimeout(() => resolve(), 3000);
  });
}

// Start backend for development
function startBackendDev() {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'standalone', 'server_standalone.py');
    
    backendProcess = spawn('python', [pythonScript, '8001'], {
      cwd: path.dirname(pythonScript),
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    setTimeout(() => resolve(), 3000);
  });
}

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: false,
    show: false,
    backgroundColor: '#667eea'
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn', accelerator: 'CmdOrCtrl+Plus' },
        { role: 'zoomOut', accelerator: 'CmdOrCtrl+-' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About PDF Email Manager',
              message: 'PDF Email Manager v1.0.0',
              detail: 'A standalone desktop application for extracting emails from PDFs and generating Outlook drafts.\n\nNo external dependencies required!\n\n© 2024'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Open DevTools',
          accelerator: 'F12',
          click: () => mainWindow.webContents.openDevTools()
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app
  if (isDev) {
    // Development: load from webpack dev server
    setTimeout(() => {
      mainWindow.loadURL('http://localhost:3000');
    }, 5000);
  } else {
    // Production: load from built files
    const indexPath = path.join(getFrontendPath(), 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize the app
app.whenReady().then(async () => {
  console.log('App starting...');
  console.log('Is Development:', isDev);
  console.log('Resource Path:', process.resourcesPath);
  console.log('App Path:', app.getAppPath());

  // Show loading window
  const loadingWindow = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    backgroundColor: '#667eea',
    webPreferences: {
      nodeIntegration: false
    }
  });

  loadingWindow.loadURL(`data:text/html;charset=utf-8,
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
          }
          .container {
            text-align: center;
            color: white;
            padding: 40px;
          }
          h1 {
            font-size: 32px;
            margin-bottom: 30px;
            font-weight: 600;
            letter-spacing: 1px;
          }
          .spinner {
            border: 5px solid rgba(255,255,255,0.2);
            border-top: 5px solid white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1s linear infinite;
            margin: 30px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .status {
            font-size: 18px;
            margin-top: 20px;
            opacity: 0.9;
          }
          .features {
            margin-top: 30px;
            font-size: 14px;
            opacity: 0.8;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📧 PDF Email Manager</h1>
          <div class="spinner"></div>
          <div class="status">Starting application...</div>
          <div class="features">
            ✨ Fully Standalone<br>
            🚀 No Dependencies Required<br>
            💼 Professional Grade
          </div>
        </div>
      </body>
    </html>
  `);

  try {
    // Start backend
    console.log('Starting backend server...');
    if (isDev) {
      await startBackendDev();
    } else {
      await startBackendExecutable();
    }
    console.log('Backend started successfully');

    // Wait a bit more for everything to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create main window
    createWindow();

    // Close loading window
    setTimeout(() => {
      loadingWindow.close();
    }, 1000);

  } catch (error) {
    console.error('Error starting application:', error);
    loadingWindow.close();
    
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start the application:\n\n${error.message}\n\nThe application will now close.`
    );
    
    app.quit();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});

// Clean up processes before quitting
app.on('before-quit', (event) => {
  console.log('Shutting down servers...');
  
  if (backendProcess && backendProcess.pid) {
    console.log('Killing backend process...');
    try {
      kill(backendProcess.pid, 'SIGTERM');
    } catch (err) {
      console.error('Error killing backend:', err);
    }
  }
});

// Handle app activation (macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths;
  }
  return null;
});
