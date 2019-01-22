
class Game {
  constructor() {
    this.paddle = new Paddle(100,700);
    this.prevDt = Date.now();
    this.canvas = new Canvas("canvas");
    this.ctx = canvas.getContext("2d");
    this.ball = new Ball(100, 100, 50);
    this.yellowBrick = new Brick("YELLOW","y1", 100,100,50,25);
    this.dnd = new DragDrop();
    this.dnd.addDraggable(this.paddle.paddleRect, false, true);
    
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
    this.paddle.update(dt);
    this.yellowBrick.update();
    this.ball.update();
  }

  render() {
    this.ctx.clearRect(0,0,this.canvas.resolution.x, this.canvas.resolution.y);
    this.paddle.draw(this.ctx);
    this.ball.render(this.ctx);
    this.yellowBrick.draw(this.ctx);
  }

  calculateDt() {
    const now = Date.now();
    const dt = now - this.prevDt;
    this.prevDt = now;
    return dt;
  }
}
