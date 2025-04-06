export const gameConfig = {
  slots: {
    count: 3, // 底部槽的数量
    width: 125, // 每个槽的宽度（像素）
    height: 125, // 每个槽的高度（像素）
    spacing: 20, // 槽之间的间距（像素）
  },
  grid: {
    size: 5, // 5x5 网格
    blockSize: 4, // 方块大小
    spacing: 4.8, // 方块之间的间距
  },
  animations: {
    flipDuration: 800, // 翻转动画持续时间（毫秒）
    moveDuration: 500, // 移动动画持续时间（毫秒）
    insertDuration: 300, // 插入动画持续时间（毫秒）
  }
}; 