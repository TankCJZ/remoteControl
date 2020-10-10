
const { ipcMain } = require('electron');
const mainRobotHandle = require('./mainRobotHandle.js');
const events = require('events');
const event = new events.EventEmitter();

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
  event.emit('streamSuccess', id);
});

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

// 监听robot控制
ipcMain.on('robot', (e, data) => {
  mainRobotHandle(data);
});

module.exports = {
  event,
};
