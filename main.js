const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });
  const contents = win.webContents;

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => win.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
  ]);

  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const wind = BrowserWindow.fromWebContents(webContents);
    wind.setTitle(title);
  });

  Menu.setApplicationMenu(menu);
  win.loadFile("index.html"); // default window

  // Open the DevTools.
  win.webContents.openDevTools();
};

// // when app is ready, create a window
// app.on("ready", () => {
//   createWindow(); // open default window
// });

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
