class Ball{
  constructor(x, y, r) {
    this.currentX = x;
    this.currentY = y;
    this.velocityX = 1;
    this.velocityY = 1;
    this.radius = r;
  }

  update() {
    this.currentX += this.velocityX;
    this.currentY += this.velocityY;
  }

  /** @type {ctx<CanvasRenderingContext2D>} */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = "#ce0a2b";
    ctx.fillRect(this.currentX, this.currentY, this.radius, this.radius);
    ctx.restore();
  }

}