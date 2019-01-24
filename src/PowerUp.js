/**
* @PowerUpType enum for the different type of power ups in our game
*/
const PowerUpType = {
  LASER: "./res/Images/Powerups/power_up_laser.png",
  ENLARGE: "./res/Images/Powerups/power_up_enlarge.png",
  CATCH: "./res/Images/Powerups/power_up_catch.png",
  SLOW: "./res/Images/Powerups/power_up_slow.png",
  BREAK: "./res/Images/Powerups/power_up_slow.png",
  DISRUPTION: "./res/Images/Powerups/power_up_disruption.png",
  PLAYER: "./res/Images/Powerups/power_up_player.png",
}

class PowerUp
{
  constructor(img, type, posX, posY, width, height, maxY)
  {
    this.img = img;
    this.type = type;
    this.position = {
      x: posX,
      y: posY
    };
    this.width = width;
    this.height = height;
    this.active = true;
    this.maxY = maxY;
    this.animation;
    this.animationManager = new AnimationManager();
    this.createPowerUp();
  }

update(dt)
{
  if (this.active)
  {
    this.position.y += 3;
  }
  if(this.position.y > this.maxY)
  {
    this.active = false;
  }
  this.animationManager.update(dt, this.position.x + this.width / 2, this.position.y + this.height / 2);
}

    /**
  * @draw
  * @param {context} ctx used to draw the power up.
  */
 draw(ctx)
 {
   if (this.active){
    ctx.save();
    this.animationManager.draw(ctx);
    ctx.restore();
  }
 }

 createPowerUp(){
   //this.img = new Image(this.width, this.height);
    // if(this.type === "LASER")
    //   this.img.src = PowerUpType.LASER;
    // else if(this.type === "ENLARGE")
    //   this.img.src = PowerUpType.ENLARGE;
    // else if(this.type === "CATCH")
    //   this.img.src = PowerUpType.CATCH;
    // else if (this.type === "SLOW")
    //   this.img.src = PowerUpType.SLOW;
    // else if (this.type === "BREAK")
    //   this.img.src = PowerUpType.BREAK;
    // else if (this.type === "DISRUPTION")
    //   this.img.src = PowerUpType.DISRUPTION;
    // else if (this.type === "PLAYER")
    //   this.img.src = PowerUpType.PLAYER;

    this.animation = new Animation(this.img, 100, 50, 10);
    this.animationManager.addAnimation("Update", this.animation);
    var scaleX = this.width / 100;
    var scaleY = this.height / 50;
    this.animationManager.setScale("Update", 0.7, 0.7);
 }
}
