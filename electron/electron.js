const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, '../build/icon.png'),
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#1e293b',
            symbolColor: '#ffffff',
        },
    });

    const startUrl = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../frontend/dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => (mainWindow = null));
}

function startBackend() {
    if (isDev) {
        console.log('In dev mode, assuming backend is running separately via npm run dev');
        return;
    }

    const backendPath = path.join(__dirname, '../backend/src/app.js');
    // In production, we might want to bundle the backend or ensure node is available.
    // For this setup, we assume node is available or we bundle the backend logic.
    // A robust way for production is to use a bundled backend or pkg, but for this task we spawn node.
    // Note: In a real packaged app, you'd bundle the backend into the executable or ship a node binary.
    // Here we'll assume the user has node or we are just running the script.
    // Actually, for electron-builder, we can include the backend folder in 'files' and spawn it.

    backendProcess = spawn('node', [backendPath], {
        cwd: path.join(__dirname, '../backend'),
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
    });
}

app.on('ready', () => {
    startBackend();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('will-quit', () => {
    if (backendProcess) {
        backendProcess.kill();
    }
});
