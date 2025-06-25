const { app, BrowserWindow, screen, ipcMain, Menu, globalShortcut, dialog } = require("electron/main");
const path = require("node:path");

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, //
    titleBarStyle: "hidden", // 移除默认标题栏
    resizable: false, // 窗口大小是否可变
    movable: false, // 窗口是否能被移动
    minimizable: false, // 窗口是否能被最小化
    maximizable: false, // 窗口是否能被最大化
    closable: true, // 窗口能否被关闭
    focusable: true, // 在 Windows 中设置 focusable: false 也意味着设置了skipTaskbar: true。 在 Linux 设置 focus: false 使窗口停止与 wm（窗口管理器 - Windows Manager） 互动，所以窗口将始终保持在所有工作区的顶部。
    alwaysOnTop: true, // 窗口是否一直处于其他窗口之上
    fullscreen: true, // 窗口是否全屏显示
    kiosk: true, // 启用Kiosk模式
    frame: false,         // 无边框窗口
    skipTaskbar: true,    // 隐藏任务栏图标
    webPreferences: {
      nodeIntegration: false, // 集成Node.js
      contextIsolation: true, // 启用上下文隔离
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // win.loadFile(path.join(__dirname, "index.html"));

  // const loadURL = "http://192.168.50.247:17033/#/login"
  const loadURL = "https://hskks.fdkkxbs.com:9596/login"

  // 加载远程URL
  win.loadURL(loadURL).catch(error => {
    // win 指定父窗口，弹框提示，加载失败，错误处理，直接退出
    dialog.showMessageBox(win, {
      type: 'info',
      title: '提示',
      message: '页面加载失败！',
      buttons: ['确定']
    }).then(() => {
      app.quit();
    })
  });

  // 在此事件后显示窗口将没有视觉闪烁
  win.once("ready-to-show", () => {
    win.show();
  });

  // 窗口最大化
  win.maximize()

  // 设置全屏模式
  win.setFullScreen(true);

  // 调试应用
  // win.webContents.openDevTools();

  // 通用拦截方案
  win.webContents.on('before-input-event', (event, input) => {
    const blocked = (input.alt && input.key === 'Tab') || (input.meta) || (input.key === 'F11')

    if (blocked) {
      event.preventDefault();
    }
  });

  // 去掉默认菜单
  Menu.setApplicationMenu(null);
};

app.whenReady().then(() => {
  // 拦截 Alt+Tab
  globalShortcut.register('Alt+Tab', () => {
    console.log('Alt+Tab blocked');
    return false;
  });

  // 拦截 Alt+Esc，退出应用
  globalShortcut.register('Alt+Esc', () => {
    app.quit()
    return false;
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  })

  ipcMain.handle("ping", () => "pong");

  // 关闭所有窗口
  ipcMain.handle("quit", () => app.quit());
  createWindow();
})