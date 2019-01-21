
class Game {
  constructor() {
    this.prevDt = Date.now();
    this.canvas = new Canvas("canvas");

    this.yellowBrick = new Brick("YELLOW","y1", 100,100,50,25);
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
    this.yellowBrick.update();

  }

  render() {
  }

  calculateDt() {
    const now = Date.now();
    const dt = now - this.prevDt;
    this.prevDt = now;
    return dt;
  }
}
