/**
* @PowerUpType enum for the different type of power ups in our game
*/
const PowerUpType = {
  Slow: "./res/Images/Bricks/brick_red.png",
  Player: "./res/Images/Bricks/brick_white.png"
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
    this.active = true;
    this.createPowerUp();
  }

update()
{
  if (this.active)
    this.position.y += 1;
}

    /**
  * @draw
  * @param {context} ctx used to draw the power up.
  */
 draw(ctx)
 {
   if (this.active){
    ctx.save();
    ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
    ctx.restore();
  }
 }

 createPowerUp(){
    this.img = new Image(this.width, this.height);
    if (this.type === "SLOW")
      this.img.src = PowerUpType.Slow;
    if (this.type === "1UP")
      this.img.src = PowerUpType.Player;
 }
}