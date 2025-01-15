// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

// Exposing specific methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, data) => callback(data)); // Listen for events
  }
});
