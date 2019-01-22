class Ball{
  constructor(x, y, r) {
    this.position = {
      x: x,
      y: y
    }
    this.velocity = {
      x:1 ,
      y:1
    }
    this.radius = r;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /** @type {ctx<CanvasRenderingContext2D>} */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = "#ce0a2b";
    ctx.fillRect(this.position.x, this.position.y, this.radius, this.radius);
    ctx.restore();
  }

  flipVelX(){
    this.velocity.x = this.velocity.x * -1;
  }

  flipVelY(){
    this.velocity.y = this.velocity.y * -1;
  }

}