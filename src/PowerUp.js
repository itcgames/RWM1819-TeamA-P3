/**
* @PowerUpType enum for the different type of power ups in our game
*/
const PowerUpType = {
  Slow: "./res/Images/Bricks/brick_red.png",
  Player: 2
}

class PowerUp
{
  constructor(type, posX, posY)
  {
    this.img;
    this.type = type;
    this.position = {
      x: posX,
      y: posY
    };
    this.width = 40;
    this.height = 15;
    this.createPowerUp();
  }

update()
{
  this.position.y += 1;
}

    /**
  * @draw
  * @param {context} ctx used to draw the power up.
  */
 draw(ctx)
 {
   ctx.save();
   ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
   ctx.restore();
 }

 createPowerUp(){
    this.img = new Image(this.width, this.height);
    if (this.type === "SLOW")
      this.img.src = PowerUpType.Slow;
 }
}