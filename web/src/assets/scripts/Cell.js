export class Cell {
  constructor(r, c) {
    //r,c 是格子的坐标
    this.r = r;
    this.c = c;
    //x，y是画圆的那个中心
    this.x = c + 0.5;
    this.y = r + 0.5;
  }
}

