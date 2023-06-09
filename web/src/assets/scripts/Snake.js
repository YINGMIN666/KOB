import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject {
  constructor(info, gamemap) {
    super();

    this.id = info.id;
    this.color = info.color;
    this.gamemap = gamemap;

    //存放蛇的身体，cells[0]存蛇头
    this.cells = [new Cell(info.r, info.c)];
    this.next_cell = null; //下一步的目标位置

    this.speed = 5; //蛇每秒钟走5个格子
    //-1表示没有指令，0，1，2，3表示上右下左
    this.direction = -1;
    //idle表示静止，move表示正在移动，die表示死亡
    this.status = "idle";

    this.dr = [-1, 0, 1, 0]; //4个方向行的偏移量
    this.dc = [0, 1, 0, -1]; //4个方向列的偏移量
    //表示回合数
    this.step = 0;
    this.eps = 1e-2; // 允许的误差

    this.eye_direction = 0;
    if (this.id === 1) this.eye_direction = 2; // 左下角的蛇初始朝上，右上角的蛇朝下

    this.eye_dx = [
      // 蛇眼睛不同方向的x的偏移量
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ];
    this.eye_dy = [
      // 蛇眼睛不同方向的y的偏移量
      [-1, -1],
      [-1, 1],
      [1, 1],
      [1, -1],
    ];
  }

  start() {}

  set_direction(d) {
    this.direction = d;
  }

  check_tail_increasing() {
    //检测当前回合，蛇的长度是否增加
    if (this.step <= 10) return true;
    if (this.step % 3 === 1) return true;
    return false;
  }

  // 将蛇的状态变为走下一步
  next_step() {
    //把蛇的下一步要走的方向取出来
    const d = this.direction;
    //然后创建一个新的格子身体到蛇头所在的地方旁边指定的位置（这里有了方向，有了偏移量就可以求出来下一步走的格子的位置）
    this.next_cell = new Cell(
      this.cells[0].r + this.dr[d],
      this.cells[0].c + this.dc[d]
    );
    this.eye_direction = d;
    this.direction = -1; // 清空操作
    this.status = "move"; //改变蛇的状态
    this.step++;

    //蛇的长度
    const k = this.cells.length;
    //枚举一下蛇
    for (let i = k; i > 0; i--) {
      //让蛇的每一个部分向后面移动一位，然后得到比之前更加长的蛇，蛇头还是之前蛇头，相当于创建新的蛇头
      this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
    }

    if (!this.gamemap.check_valid(this.next_cell)) {
      //下一步操作撞了，蛇直接去世
      this.status = "die";
    }
  }

  update_move() {
    const dx = this.next_cell.x - this.cells[0].x;
    const dy = this.next_cell.y - this.cells[0].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.eps) {
      // 走到目标点了
      this.cells[0] = this.next_cell; // 添加一个新蛇头
      this.next_cell = null;
      this.status = "idle"; // 走完了，停下来

      if (!this.check_tail_increasing()) {
        // 蛇不变长
        this.cells.pop(); //把尾巴砍掉
      }
    } else {
      const move_distance = (this.speed * this.timedelta) / 1000; // 每两帧之间走的距离
      this.cells[0].x += (move_distance * dx) / distance;
      this.cells[0].y += (move_distance * dy) / distance;

      if (!this.check_tail_increasing()) {
        // 蛇不变长，蛇走到下个目的地
        const k = this.cells.length;
        const tail = this.cells[k - 1],
          tail_target = this.cells[k - 2];
        const tail_dx = tail_target.x - tail.x;
        const tail_dy = tail_target.y - tail.y;
        tail.x += (move_distance * tail_dx) / distance;
        tail.y += (move_distance * tail_dy) / distance;
      }
    }
  }

  update() {
    //每一帧执行一次
    if (this.status === "move") {
      this.update_move();
    }

    this.render();
  }

  render() {
    const L = this.gamemap.L;
    const ctx = this.gamemap.ctx;

    ctx.fillStyle = this.color;
    if (this.status === "die") {
      ctx.fillStyle = "white";
    }

    for (const cell of this.cells) {
      ctx.beginPath();
      ctx.arc(cell.x * L, cell.y * L, (L / 2) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 1; i < this.cells.length; i++) {
      const a = this.cells[i - 1],
        b = this.cells[i];
      if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)
        continue;
      if (Math.abs(a.x - b.x) < this.eps) {
        ctx.fillRect(
          (a.x - 0.4) * L,
          Math.min(a.y, b.y) * L,
          L * 0.8,
          Math.abs(a.y - b.y) * L
        );
      } else {
        ctx.fillRect(
          Math.min(a.x, b.x) * L,
          (a.y - 0.4) * L,
          Math.abs(a.x - b.x) * L,
          L * 0.8
        );
      }
    }

    ctx.fillStyle = "black";
    for (let i = 0; i < 2; i++) {
      const eye_x =
        (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
      const eye_y =
        (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

      ctx.beginPath();
      ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
