
class Game {
  constructor() {
    this.paddle = new Paddle(100,100);
    this.prevDt = Date.now();
    this.canvas = new Canvas("canvas");
    this.ctx = canvas.getContext("2d");
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
    this.paddle.update(dt);
  }

  render() {
    this.ctx.clearRect(0,0,this.canvas.resolution.x, this.canvas.resolution.y);
    this.paddle.draw(this.ctx);
  }

  calculateDt() {
    const now = Date.now();
    const dt = now - this.prevDt;
    this.prevDt = now;
    return dt;
  }
}