
const robot = require('robotjs');
const { screen } = require('electron');

function mainRobotHandle(data) {
  if (data.type === 'mousemove') {
      handleMousemove(data);
  } else if (data.type === 'mousedown') {
      handleMousedown(data);
  } else if (data.type === 'keyup') {
      handleKeyup(data);
  } else {

  }
}

// 鼠标按下
function handleMousedown(data) {
  handleMousemove(data);
  robot.mouseClick(data.button);
}

// 键盘输入
function handleKeyup(data) {
  if (data.key) {
    robot.keyTap(data.key);
  }
}

//鼠标移动
function handleMousemove(data) {
  const { clientX, clientY, videoWidth, videoHeight } = data;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const x = width / videoWidth * clientX;
  const y = height / videoHeight * clientY;
  if (x < 0 || y < 0) return;
  console.log(x, y);
  robot.moveMouse(x, y);
}

module.exports = mainRobotHandle;