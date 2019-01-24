/**
* @PowerUpType enum for the different type of power ups in our game
*/
const PowerUpType = {
  LASER: "./res/Images/Bricks/brick_red.png",
  ENLARGE: "./res/Images/Bricks/brick_blue.png",
  CATCH: "./res/Images/Bricks/brick_green.png",
  SLOW: "./res/Images/Bricks/brick_orange.png",
  BREAK: "./res/Images/Bricks/brick_pink.png",
  DISRUPTION: "./res/Images/Bricks/brick_light_blue.png",
  PLAYER: "./res/Images/Bricks/brick_metal.png",
}

class PowerUp
{
  constructor(type, posX, posY, width, height, maxY)
  {
    this.img;
    this.type = type;
    this.position = {
      x: posX,
      y: posY
    };
    this.width = width;
    this.height = height;
    this.active = true;
    this.maxY = maxY;
    this.createPowerUp();
  }

update()
{
  if (this.active)
  {
    this.position.y += 5;
  }
  if(this.position.y > this.maxY)
  {
    this.active = false;
  }
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
    if(this.type === "LASER")
      this.img.src = PowerUpType.LASER;
    else if(this.type === "ENLARGE")
      this.img.src = PowerUpType.ENLARGE;
    else if(this.type === "CATCH")
      this.img.src = PowerUpType.CATCH;
    else if (this.type === "SLOW")
      this.img.src = PowerUpType.SLOW;
    else if (this.type === "BREAK")
      this.img.src = PowerUpType.BREAK;
    else if (this.type === "DISRUPTION")
      this.img.src = PowerUpType.DISRUPTION;
    else if (this.type === "PLAYER")
      this.img.src = PowerUpType.PLAYER;
 }
}
