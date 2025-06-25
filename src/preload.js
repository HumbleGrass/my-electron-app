const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electron", {
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  ipcMain: {
    ping: () => ipcRenderer.invoke('ping'),
    quit: () => ipcRenderer.invoke('quit')
  }
});
