/**
 * Represents the laser shot out by the player
 * during the laser power up.
 */
class Paddle {
  constructor(xPos,yPos){
    this.img = new Image();
    this.position = {
      x: xPos,
      y: yPos
    };
    this.speed = 600;
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

  }
}