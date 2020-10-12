const { BrowserWindow, Menu } = require('electron');
const path = require('path');

let win = null;
let willClose = false;

function createWindow() {
  win = new BrowserWindow({
      width: 600,
      height: 200,
      webPreferences: {
          nodeIntegration: true
      }
  });

  // 退出
  win.on('close', e => {
    e.preventDefault();
    if (willClose) {
      win = null;
    } else {
      win.hide();
    }
  });
  

  Menu.setApplicationMenu(null);
  win.webContents.openDevTools(true);

  win.loadFile(path.resolve(__dirname, '../renderer/stream.html'));

  return win;
}

function close() {
  if (win) {
    willClose = true;
    win.close();
  }
}

module.exports = {
  createWindow,
  close
};