const { app, BrowserWindow, session, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;

// Get the default downloads folder
function getDownloadsFolder() {
  return app.getPath('downloads');
}

// Setup download handler for .eml files
function setupDownloadHandler() {
  session.defaultSession.on('will-download', (event, item, webContents) => {
    const filename = item.getFilename();
    const downloadsPath = getDownloadsFolder();
    const savePath = path.join(downloadsPath, filename);
    
    console.log('Download initiated:', filename);
    console.log('Saving to:', savePath);
    
    // For .eml files, show a save dialog
    if (filename.endsWith('.eml')) {
      // Show save dialog to let user choose location
      dialog.showSaveDialog(mainWindow, {
        title: 'Save Email Draft',
        defaultPath: savePath,
        filters: [
          { name: 'Email Files', extensions: ['eml'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      }).then(result => {
        if (!result.canceled && result.filePath) {
          item.setSavePath(result.filePath);
          console.log('User chose to save to:', result.filePath);
        } else {
          // User cancelled, still save to default location
          item.setSavePath(savePath);
          console.log('User cancelled dialog, saving to default:', savePath);
        }
      }).catch(err => {
        console.error('Save dialog error:', err);
        item.setSavePath(savePath);
      });
    } else {
      // For other files, save to downloads automatically
      item.setSavePath(savePath);
    }
    
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download interrupted');
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download paused');
        } else {
          console.log(`Downloading: ${item.getReceivedBytes()} / ${item.getTotalBytes()}`);
        }
      }
    });
    
    item.once('done', (event, state) => {
      if (state === 'completed') {
        const savedPath = item.getSavePath();
        console.log('Download completed:', savedPath);
        
        // Show notification to user
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Download Complete',
          message: 'Email draft saved successfully!',
          detail: `Saved to: ${savedPath}\n\nDouble-click the .eml file to open it in Outlook as a draft email.`,
          buttons: ['OK', 'Open Folder']
        }).then(result => {
          if (result.response === 1) {
            // User clicked "Open Folder"
            shell.showItemInFolder(savedPath);
          }
        });
      } else {
        console.log('Download failed:', state);
        dialog.showErrorBox('Download Failed', `Failed to save ${filename}. State: ${state}`);
      }
    });
  });
}

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
  
  // Setup download handling after window is created
  setupDownloadHandler();
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
