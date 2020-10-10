const { app, dialog } = require('electron');
const createWindow = require('./createWindow.js');
const { event } = require('./mainPeer.js');
let win = null;

// 监听连接成功-窗体重新设置大小
event.once('streamSuccess', id => {
    if (win) {
        win.setSize(1280, 1024, true);
    }
});
// 退出
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
        app.quit();
    }
    return true;
});

// 启动
app.whenReady()
    .then(() => {
        win = createWindow();
    });
