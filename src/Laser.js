/**
 * Represents the laser shot out by the player
 * during the laser power up.
 */
class Laser {
  constructor(image,xPos,yPos,width,height,index){
    this.position = {
      x: xPos,
      y: yPos
    };
    this.width = width;
    this.height = height;
    this.speed = -800;
    this.image = image;
    this.id = index;
  }

  /**
   * Update laser logic
   * @param {Number} dt 
   * change in time since last update
   */
  update(dt){
    this.position.y += this.speed * (dt/1000);
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx){
    ctx.save()
    ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    ctx.restore();
  }
}