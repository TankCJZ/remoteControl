// 远程界面显示
const { desktopCapturer, ipcRenderer } = window.require('electron');
const $ = (selector) => {
  return document.querySelector(selector);
}
const $video = $('#video');
const $localCode = $('#localCode');
const $remoteCode = $('#remoteCode');
const $connect = $('#connect');
const peerServerConfig = {
  host: '192.168.96.129',
  port: 9000,
  path: '/',
  debug: 1
};

const peer = new Peer(randomCode(), peerServerConfig);
let localConn = null;
let remoteConn = null;

// 获取桌面流
async function getScreenStream() {
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
  });
  return new Promise((resolve, reject) => {
  navigator.mediaDevices
      .getUserMedia({
          audio: false,
          video: {
              mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: sources[0].id,
              maxWidth: window.screen.width,
              maxHeight: window.screen.height,
            },
          },
      })
      .then((stream) => {
          resolve(stream);
      })
      .catch((err) => {
          alert('获取屏幕流失败');
          console.error(err);
          reject(err);
      });
  });
}

// 生成随机账号码
function randomCode() {
  if (localStorage['localCode']) {
      return localStorage['localCode'];
  } else {
      let localCode = Math.floor(Math.random() * (999999 - 100000)) + 1000000;
      localStorage['localCode'] = localCode;
      return localCode;
  }
}

// 重置界面
function resetView() {
  $('.main').style.display = 'block';
  $('#beControl').style.display = 'none';
}

// 初始化成功
peer.on('open', id => {
  console.log('peer ID: ', id);
  $localCode.innerText = id;
  ipcRenderer.send('on-peer-open', id);
});

// 发生错误
peer.on('error', err => {
  alert('错误:', err);
  resetView();
});
// 连接中断peer.reconnect();
peer.on('disconnected', err => {
  alert('连接已终止');
  resetView();
});
// 连接关闭 peer.destroyed();
peer.on('close', err => {
  console.log('peer close');
  alert('连接已终止');
  resetView();
});

// 接受远程连接
peer.on('connection', conn => {
  ipcRenderer.send('on-peer-connection');
  remoteConn = conn;
  console.log('已接受连接', remoteConn);
  remoteConn.on('data', data => {
      console.log('收到消息: ', data);
      handleRemoteMessage(data);
      if (data.remoteCode) {
          $('#beControl').style.display = 'block';
          $('.main').style.display = 'none';
          $('#beControlCode').innerText = data.remoteCode;
      }
  });
});

// 处理收到的消息
function handleRemoteMessage(data) {
  if (!data) return;
  if (data.type) {
    ipcRenderer.send('robot', data);
  } else {
    //其他消息
    console.log('其他消息:', data)
  }
}

// 显示远程界面到本地video
function handleRemoteStream(stream) {
  // 隐藏main界面
  $('.container').style.display = 'none';
  ipcRenderer.send('on-peer-stream');
  $video.srcObject = stream;
  $video.onloadedmetadata = (e) => {
      $video.play();
  }
}

// 响应远程界面
peer.on('call', function(call) {
  getScreenStream()
      .then(function(stream) {
          call.answer(stream); // 响应流
          call.on('close', () => {
            alert('r stream close');
          });
          call.on('error', () => {
            alert('r stream error');
          });
      })
      .catch(function(err) {
          console.log('Failed to get local stream' ,err);
      });
});

// 请求远程界面显示
function onCallStream(id) {
  getScreenStream()
      .then(function(stream) {
          let call = peer.call(id, stream);
          call.on('stream', function(remoteStream) {
              handleRemoteStream(remoteStream);
          });
          call.on('close', () => {
            alert('c stream close');
          });
          call.on('error', () => {
            alert('c stream error');
          });
      })
      .catch(function(err) {
          console.log('Failed to get local stream' ,err);
      });
}

// 回复消息
function reSendData(data)  {
  if (remoteConn) {
      remoteConn.send(data);
  }
}

// 发送消息
function sendData(data)  {
  if (localConn) {
      // Send messages
      localConn.send(data);
  }
}

// 建立连接
function peerConnect(id) {
  localConn = peer.connect(id);
  ipcRenderer.send('on-peer-connect', id);
  // 建立连接-成功
  localConn.on('open', () => {
      console.log('建立连接-成功');
      ipcRenderer.send('on-peer-connected', id);
      localConn.send({
          remoteCode: id
      });
      localConn.on('data', function(data) {
          console.log('接受数据', data);
      });
  });
}

// 开始连接点击
$connect.addEventListener('click', e => {
  const remoteCode = $remoteCode.value.trim();
  if (remoteCode === '') {
      alert('请输入远程设备码');
      return;
  }
  // 建立连接
  peerConnect(remoteCode);
  // 请求远程界面
  onCallStream(remoteCode);
  // 请求远程控制
  require('./robotHandle.js');
});
