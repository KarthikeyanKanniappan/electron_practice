const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  setTitle: (title) => ipcRenderer.send("set-title", title), //Renderer to main-one Way
  openFile: () => ipcRenderer.invoke("dialog:openFile"), // Bi-directional
  handleCounter: (callback) => ipcRenderer.on("update-counter", callback), //main to Renderer
});
