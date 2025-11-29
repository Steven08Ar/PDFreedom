const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    // Expose IPC methods if needed
    // send: (channel, data) => ipcRenderer.send(channel, data),
    // on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
