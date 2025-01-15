import { app, BrowserWindow } from 'electron';
import started from 'electron-squirrel-startup';

import path from 'path';
import { fileURLToPath } from 'url';
// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true, // Disables DevTools
      nodeIntegration: false, // Disable node integration (for security)
      contextIsolation: true, // Enable context isolation (for security)
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  setInterval(() => {
    import('os-utils').then((os) => {
      os.cpuUsage((v) => {
        //console.log('CPU Usage (%):', v * 100);
        mainWindow.webContents.send('cpu', v * 100);
  
        //console.log('Free Memory:', os.freemem());
        mainWindow.webContents.send('mem', os.freemem());
  
        //console.log('Total Memory:', os.totalmem());
        mainWindow.webContents.send('total-mem', os.totalmem());
  
        //console.log('Platform:', os.platform());
        mainWindow.webContents.send('platform', os.platform());
      });
    });
  }, 1000);
  

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
