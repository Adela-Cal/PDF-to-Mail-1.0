const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const { dialog } = require('electron');

let mainWindow;
let backendProcess;

// Start the backend server
function startBackend() {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // In development, assume backend is running separately
    console.log('Development mode: Backend should be running on port 8001');
    return;
  }
  
  // In production, start the bundled backend executable
  const backendPath = path.join(
    process.resourcesPath,
    'backend',
    'SpeedyStatementsServer.exe'
  );
  
  try {
    backendProcess = spawn(backendPath, [], {
      detached: false,
      stdio: 'ignore'
    });
    
    backendProcess.on('error', (err) => {
      console.error('Failed to start backend:', err);
      dialog.showErrorBox(
        'Backend Error',
        'Failed to start the backend server. Please restart the application.'
      );
    });
    
    console.log('Backend server started');
  } catch (error) {
    console.error('Error starting backend:', error);
  }
}

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    title: 'Speedy Statements',
    autoHideMenuBar: true // Hide menu bar for cleaner look
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // Load from development server
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Load from bundled frontend
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Wait a bit for backend to start before opening window
  startBackend();
  
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill backend process when app quits
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
