const { app, dialog, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const robot = require('robotjs');
const path = require('path');
let win = null;

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

}

// peer-open
ipcMain.on('on-peer-open', (e, id) => {
    onPeerOpen(id);
});
ipcMain.on('on-peer-connection', onPeerConnection);
ipcMain.on('on-peer-connect', (e, id) => {
    onPeerConnect(id)
});
ipcMain.on('on-peer-connected', (e, id) => {
    onPeerConnected(id)
});
ipcMain.on('on-peer-stream', (e, id) => {
    onPeerStream(id)
});
ipcMain.on('robot', (e, data) => {
    const { clientX, clientY, videoWidth, videoHeight } = data;
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const x = width / videoWidth / clientX;
    const y = height / videoHeight / clientY;
    robot.moveMouse(x, y);
})


function onPeerOpen(id) {
    console.log('peer 创建成功', id)
}

function onPeerConnection() {
    console.log('接受连接成功')
}

function onPeerConnect(id) {
    console.log('开始连接对象=>', id);
}

function onPeerConnected(id) {
    console.log('连接对象成功=>', id);
}

function onPeerStream() {
    win.setSize(1280, 1024, true);
}

app.on('window-all-closed', (e) => {
    e.preventDefault();
    dialog.showMessageBox({
        type: "question",
        buttons: [
            '确认',
            '取消'
        ],
        title: '是否退出？',
        message: '退出后远程控制将关闭',
    })
    .then(res => {
        console.log(res);
    })
    if (process.platform !== 'darwin') {
        //app.quit();
    }
    return true;
});

app.whenReady()
    .then(createWindow);
