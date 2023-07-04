const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  Notification,
  session,
  shell,
  Tray,
  nativeImage,
  webContents,
  BrowserView,
  desktopCapturer,
  globalShortcut,
} = require("electron");

const path = require("path");
const os = require("os");
// loading Extensions- kbfnbcaeplbcioakkpcpgfkobkghlhen

// const GrammerlyPath = path.join(
//   os.homedir(),
//   "/Library/Application Support/Google/Chrome/Default/Extensions/kbfnbcaeplbcioakkpcpgfkobkghlhen/14.1112.0_0"
// );

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
}
let resizedIcon;

async function showMessager() {
  let result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
    type: "question",
    title: "Confirmation",
    message: "Are you sure you want to proceed?",
    buttons: ["Yes", "No"],
    defaultId: 0,
    cancelId: 1,
    detail: "This action cannot be undone.",
    checkboxLabel: "Remember my choice",
    checkboxChecked: false,
  });
  return result;
}

const createWindow = () => {
  // const appIcon = new Tray("/Users/user/Downloads/Any.jpeg");
  const iconImage = nativeImage.createFromPath(
    "/Users/user/Downloads/Any.jpeg"
  );
  const iconSize = { width: 256, height: 256 };
  resizedIcon = iconImage.resize(iconSize);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      extensions: [
        // Path to the extension's source directory
        "/Library/Application Support/Google/Chrome/Default/Extensions/kbfnbcaeplbcioakkpcpgfkobkghlhen/14.1112.0_0",
      ],
      webviewTag: true,
    },
  });

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

    //   let org = win.getTitle();

    //   if (title === org) {
    //     const notification = new Notification({
    //       title: "Title Updated",
    //       body: `New title set to: ${title}`,
    //     });

    //     notification.show();
    //   }
  });

  Menu.setApplicationMenu(menu);
  win.loadFile("index.html"); // default window

  // win.webContents.on("did-finish-load", () => {
  //   win.webContents.send("extension-object", grammer);
  // });
  win.webContents.once("did-finish-load", () => {
    const allWebContents = webContents.getAllWebContents();
    const rendererCount = allWebContents.length;
    console.log(`Number of running renderer processes: ${rendererCount}`);
  });
  // Open the DevTools.
  win.webContents.openDevTools();
  return win;
};

// // when app is ready, create a window
// app.on("ready", () => {
//   createWindow(); // open default window
// });

app.setAsDefaultProtocolClient("example");

function handleGrammarlyOAuthCallback(win) {
  app.on("open-url", (event, link) => {
    console.log(1);
    console.log(app.getApplicationNameForProtocol(link));
    if (link.includes("grammarly-auth")) {
      // this validation depends on the redirectURI provided in the developer hub
      // in the connected accounts section. For this app, I used `example://grammarly-auth/`
      event.preventDefault();
      win.webContents.send("grammarly:handleOAuthCallback", link);
    }
  });
}

function handleNewWindowLinks(win) {
  win.webContents.setWindowOpenHandler(({ url }) => {
    console.log(1);
    if (url.includes("grammarly")) {
      // Grammarly's SDK works properly when the links open in the default browser
      // instead of the Electron app

      shell.openExternal(url); // open link in electron system's default browser
      return { action: "deny" }; // don't open link in electron window
    } else {
      // you can allow the app to open all other links within the electron app
      // if required
      return { action: "allow" };
    }
  });
}

app.whenReady().then(() => {
  // try {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("dialog:message", showMessager);
  // let grammer = await session.defaultSession.loadExtension(GrammerlyPath, {
  //   allowFileAccess: true,
  // });
  // console.log(grammer);

  // -----globalShortcut-----
  const ret = globalShortcut.register("CommandOrControl+X", () => {
    console.log("CommandOrControl+X is pressed");
  });
  console.log(globalShortcut.isRegistered("CommandOrControl+X"));
  const win = createWindow();

  // BrowserView
  const view = new BrowserView();
  win.setBrowserView(view);
  view.setBounds({ x: 400, y: 0, width: 400, height: 300 });
  view.webContents.loadURL("https://github.com/KarthikeyanKanniappan");

  // ---Grammerly--
  // handleGrammarlyOAuthCallback(win);
  // handleNewWindowLinks(win);
  // ---Grammerly--

  ipcMain.handle("get-sources", () => {
    return desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        for (const source of sources) {
          if (source.name === "1.electron" && mainWindow) {
            return source.id;
          }
        }
      });
  });

  // win.previewFile("/Users/user/Documents/1.Electron/image.html");
  app.dock.setIcon(resizedIcon);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  // } catch (err) {
  //   console.log(err);
  // }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.enableSandbox();
