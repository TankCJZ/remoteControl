const { BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  win = new BrowserWindow({
      width: 600,
      height: 200,
      webPreferences: {
          nodeIntegration: true
      }
  });

  Menu.setApplicationMenu(null);
  win.webContents.openDevTools(true);

  win.loadFile(path.resolve(__dirname, '../renderer/stream.html'));

  return win;
}

module.exports = createWindow;