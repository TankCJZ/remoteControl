const { app } = require('electron');
const { createWindow } = require('./createWindow.js');
const { event } = require('./mainPeer.js');
let win = null;

// 监听连接成功-窗体重新设置大小
event.once('streamSuccess', id => {
    if (win) {
        win.setSize(1280, 1024, true);
    }
});

// 启动
app.whenReady()
    .then(() => {
        win = createWindow();
    });
