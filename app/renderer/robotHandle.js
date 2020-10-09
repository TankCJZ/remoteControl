// 远程控制

//鼠标 移动
window.addEventListener('mousemove', e => {
  const { clientX, clientY } = e;
  const data = {
    type: 'mousemove',
    clientX,
    clientY,
    videoWidth: video.getBoundingClientRect().width,
    videoHeight: video.getBoundingClientRect().height,
  };
  sendData(data);
});

// 鼠标按下
window.addEventListener('mousedown', e => {
  console.log(e);
});

