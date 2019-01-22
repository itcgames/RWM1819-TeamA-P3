
class Game {
  constructor() {
    this.paddle = new Paddle(100,700);
    this.prevDt = Date.now();
    this.canvas = new Canvas("canvas");
    this.ctx = canvas.getContext("2d");
    this.ball = new Ball(100, 100, 50);
    this.yellowBrick = new Brick("YELLOW","y1", 100,100,50,25);
    this.dnd = new DragDrop();
    this.paddleRect = new Square(this.paddle.position.x, this.paddle.position.y, this.paddle.size.x, this.paddle.size.y, "#095ee8")
    this.dnd.addDraggable(this.paddleRect, false, true);
    this.clampPaddleLeft = 100;
    this.clampPaddleRight = 800;
    
    window.addEventListener("mousedown", this.dnd.dragstart.bind(this.dnd));
    window.addEventListener("mouseup", this.dnd.dragend.bind(this.dnd));
  }

  run() {
    this.loop();
  }

  loop() {
    this.update();
    this.render();

    /** Use bind function to keep the 'this' context throughout loop usage */
    window.requestAnimationFrame(this.loop.bind(this));
  }

  update() {
    const dt = this.calculateDt();
    this.dnd.update();
    this.paddle.position.x = this.paddleRect.x;
    this.paddle.position.y = this.paddleRect.y;
    if (this.paddle.position.x < this.clampPaddleLeft)
    {
      this.paddle.position.x = this.clampPaddleLeft;
    }
    else if (this.paddle.position.x > this.clampPaddleRight)
    {
      this.paddle.position.x = this.clampPaddleRight;
    }
    this.paddle.update(dt);
    this.yellowBrick.update();
    this.ball.update();
  }

  render() {
    this.ctx.clearRect(0,0,this.canvas.resolution.x, this.canvas.resolution.y);
    this.paddle.draw(this.ctx);
    this.ball.render(this.ctx);
  }

  calculateDt() {
    const now = Date.now();
    const dt = now - this.prevDt;
    this.prevDt = now;
    return dt;
  }
}
