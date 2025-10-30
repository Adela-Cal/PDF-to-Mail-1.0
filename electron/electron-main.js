const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const kill = require('tree-kill');

let mainWindow;
let backendProcess = null;
let frontendProcess = null;

// Determine if running in development or production
const isDev = !app.isPackaged;

// Get the correct paths
const getBackendPath = () => {
  if (isDev) {
    return path.join(__dirname, '..', 'backend');
  }
  return path.join(process.resourcesPath, 'backend');
};

const getFrontendPath = () => {
  if (isDev) {
    return path.join(__dirname, '..', 'frontend');
  }
  return path.join(process.resourcesPath, 'frontend', 'build');
};

// Start the FastAPI backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = getBackendPath();
    console.log('Starting backend from:', backendPath);

    // In production, use the system Python, in dev use local
    const pythonCmd = 'python';
    
    backendProcess = spawn(pythonCmd, [
      '-m', 'uvicorn',
      'server:app',
      '--host', '127.0.0.1',
      '--port', '8001',
      '--log-level', 'info'
    ], {
      cwd: backendPath,
      stdio: 'pipe'
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
      if (data.includes('Application startup complete')) {
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

    // Timeout if backend doesn't start
    setTimeout(() => resolve(), 5000);
  });
}

// Start the React frontend (production build server)
function startFrontendServer() {
  if (isDev) {
    // In development, use the development server
    const frontendPath = path.join(__dirname, '..', 'frontend');
    console.log('Starting frontend dev server from:', frontendPath);
    
    frontendProcess = spawn('npm', ['start'], {
      cwd: frontendPath,
      shell: true,
      stdio: 'pipe',
      env: { ...process.env, BROWSER: 'none' }
    });

    frontendProcess.stdout.on('data', (data) => {
      console.log(`Frontend: ${data}`);
    });

    frontendProcess.stderr.on('data', (data) => {
      console.error(`Frontend Error: ${data}`);
    });
  }
  // In production, we serve static files directly from Electron
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
    show: false
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
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
        { role: 'zoomIn' },
        { role: 'zoomOut' },
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
              detail: 'A desktop application for extracting emails from PDFs and generating Outlook drafts.\n\n© 2024 Your Company'
            });
          }
        },
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
    }, 8000);
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

  // Show loading window
  const loadingWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  loadingWindow.loadURL(`data:text/html;charset=utf-8,
    <html>
      <body style="margin:0;padding:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial,sans-serif;">
        <div style="text-align:center;color:white;">
          <h1 style="margin:0;font-size:28px;margin-bottom:20px;">PDF Email Manager</h1>
          <div style="margin:20px 0;">
            <div style="border:4px solid rgba(255,255,255,0.3);border-top:4px solid white;border-radius:50%;width:50px;height:50px;animation:spin 1s linear infinite;margin:0 auto;"></div>
          </div>
          <p style="margin:10px 0;font-size:16px;">Starting application...</p>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      </body>
    </html>
  `);

  try {
    // Start backend
    console.log('Starting backend server...');
    await startBackend();
    console.log('Backend started successfully');

    // Start frontend if in dev
    if (isDev) {
      console.log('Starting frontend dev server...');
      startFrontendServer();
      console.log('Frontend dev server started');
    }

    // Wait a bit more for everything to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create main window
    createWindow();

    // Close loading window
    loadingWindow.close();

  } catch (error) {
    console.error('Error starting application:', error);
    loadingWindow.close();
    
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start the application:\n\n${error.message}\n\nPlease make sure Python and all dependencies are installed.`
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
  
  if (backendProcess) {
    console.log('Killing backend process...');
    kill(backendProcess.pid, 'SIGTERM', (err) => {
      if (err) console.error('Error killing backend:', err);
    });
  }
  
  if (frontendProcess) {
    console.log('Killing frontend process...');
    kill(frontendProcess.pid, 'SIGTERM', (err) => {
      if (err) console.error('Error killing frontend:', err);
    });
  }
});

// Handle app activation (macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('get-app-path', () => {
  return app.getAppPath();
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});
