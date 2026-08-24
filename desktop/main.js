const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow = null;
let internalServer = null;
let serverPort = null;

// Register custom deep-link protocol for secure OAuth returns
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('growthpilot', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('growthpilot');
}

// Single instance lock to prevent duplicate processes and handle deep links
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      // Find deep link URI
      const deepLink = commandLine.find(arg => arg.startsWith('growthpilot://'));
      if (deepLink && serverPort) {
        try {
          const parsed = new URL(deepLink);
          const connected = parsed.searchParams.get('connected');
          const success = parsed.searchParams.get('success');
          const error = parsed.searchParams.get('error');
          if (connected) {
            mainWindow.loadURL(`http://127.0.0.1:${serverPort}/social-accounts?connected=${connected}&success=${success || 'true'}`);
          } else if (error) {
            mainWindow.loadURL(`http://127.0.0.1:${serverPort}/social-accounts?error=${encodeURIComponent(error)}`);
          }
        } catch (e) {
          console.error('[GrowthPilot AI Desktop] Deep link parsing error:', e);
        }
      }
    }
  });
}

// Determine absolute project/bundle root directory
function getAppRootDir() {
  if (app.isPackaged) {
    const resourceDir = process.resourcesPath;
    const appDir = path.join(resourceDir, 'app');
    if (fs.existsSync(path.join(appDir, '.next'))) {
      return appDir;
    }
    if (fs.existsSync(path.join(resourceDir, '.next'))) {
      return resourceDir;
    }
    return app.getAppPath();
  }
  return path.resolve(__dirname, '..');
}

// Start in-process Next.js Server on dynamic private port
async function startGrowthPilotServer() {
  const rootDir = getAppRootDir();
  console.log('[GrowthPilot AI Desktop] Starting internal engine from:', rootDir);

  // In development, Next.js can be in dev mode; in production, dev is false
  const isDev = !app.isPackaged && process.env.NODE_ENV === 'development';
  
  try {
    const next = require('next');
    const nextApp = next({ dev: isDev, dir: rootDir });
    const handle = nextApp.getRequestHandler();
    await nextApp.prepare();

    const server = http.createServer((req, res) => {
      handle(req, res);
    });

    return new Promise((resolve, reject) => {
      // Listen on 127.0.0.1 on OS-allocated dynamic port (port 0)
      server.listen(0, '127.0.0.1', () => {
        const address = server.address();
        serverPort = address.port;
        internalServer = server;
        console.log(`[GrowthPilot AI Desktop] Internal server active on http://127.0.0.1:${serverPort}`);
        resolve(`http://127.0.0.1:${serverPort}`);
      });
      server.on('error', (err) => {
        console.error('[GrowthPilot AI Desktop] Server listen error:', err);
        reject(err);
      });
    });
  } catch (err) {
    console.error('[GrowthPilot AI Desktop] Failed to initialize Next.js engine:', err);
    throw err;
  }
}

function createWindow(targetUrl) {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 868,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0b0f19',
    title: 'GrowthPilot AI — AI Social Media Growth Platform',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Remove default menu for clean SaaS look
  Menu.setApplicationMenu(null);

  // Load the isolated internal GrowthPilot AI URL
  mainWindow.loadURL(targetUrl).catch((err) => {
    console.error('[GrowthPilot AI Desktop] loadURL error:', err);
    mainWindow.loadFile(path.join(__dirname, 'loading.html'));
  });

  // Open external links in user default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || (url.startsWith('http:') && !url.includes(`127.0.0.1:${serverPort}`))) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    const targetUrl = await startGrowthPilotServer();
    createWindow(targetUrl);
  } catch (err) {
    console.error('[GrowthPilot AI Desktop] Fatal startup error:', err);
    // Fallback: create window with error/loading screen
    createWindow('about:blank');
    if (mainWindow) {
      mainWindow.loadFile(path.join(__dirname, 'loading.html'));
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && serverPort) {
      createWindow(`http://127.0.0.1:${serverPort}`);
    }
  });
});

// Handle custom protocol URLs on macOS
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow && serverPort && url.startsWith('growthpilot://')) {
    try {
      const parsed = new URL(url);
      const connected = parsed.searchParams.get('connected');
      const success = parsed.searchParams.get('success');
      const error = parsed.searchParams.get('error');
      if (connected) {
        mainWindow.loadURL(`http://127.0.0.1:${serverPort}/social-accounts?connected=${connected}&success=${success || 'true'}`);
      } else if (error) {
        mainWindow.loadURL(`http://127.0.0.1:${serverPort}/social-accounts?error=${encodeURIComponent(error)}`);
      }
    } catch (e) {
      console.error('[GrowthPilot AI Desktop] macOS open-url parsing error:', e);
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (internalServer) {
    console.log('[GrowthPilot AI Desktop] Shutting down internal server...');
    internalServer.close();
    internalServer = null;
  }
});

// Safe IPC Handlers
ipcMain.handle('app:version', () => app.getVersion());
ipcMain.handle('app:platform', () => process.platform);
ipcMain.handle('app:isDesktop', () => true);
