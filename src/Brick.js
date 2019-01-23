/**
* @ColourEnum enum for the different type of bricks in our game
*/
const ColourEnum = {
  RED: "./res/Images/Bricks/brick_red.png",
  WHITE: "./res/Images/Bricks/brick_white.png",
  ORANGE: "./res/Images/Bricks/brick_orange.png",
  LIGHTBLUE: "./res/Images/Bricks/brick_light_blue.png",
  GREEN: "./res/Images/Bricks/brick_green.png",
  BLUE: "./res/Images/Bricks/brick_blue.png",
  PINK: "./res/Images/Bricks/brick_pink.png",
  YELLOW: "./res/Images/Bricks/brick_yellow.png",
  METAL: "./res/Images/Bricks/brick_metal.png",
  GOLD: "./res/Images/Bricks/brick_gold.png"
}
/**
* Brick class used to setup each of the destructible blocks in the game
*/
class Brick
{
  /**
  * @constructor constructor for the brick class that also sets the health based on the colour
  */
  constructor(colour, id, positionX, positionY, width, height)
  {
     this.img;
     this.x = positionX;
     this.y = positionY;
     this.id = id;
     this.colour = colour;
     this.width = width;
     this.height = height;
     this.health = 1;

     this.setHealth();
     this.createNewBrick();
  }

  /**
  * @update update paddle logic.
  */
  update()
  {

  }
  /**
  * @draw
  * @param {context} ctx used to draw the paddle.
  */
  draw(ctx)
  {
    ctx.save();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();

  }
  /**
  * @createNewBrick function used to create new bricks
  */
  createNewBrick()
  {
      this.img = new Image(this.width, this.height)
      if(this.colour === "RED")
        this.img.src = ColourEnum.RED;
      if(this.colour === "WHITE")
        this.img.src = ColourEnum.WHITE;
      if(this.colour === "ORANGE")
        this.img.src = ColourEnum.ORANGE;
      if(this.colour === "LIGHTBLUE")
        this.img.src = ColourEnum.LIGHTBLUE;
      if(this.colour === "GREEN")
        this.img.src = ColourEnum.GREEN;
      if(this.colour === "BLUE")
        this.img.src = ColourEnum.BLUE;
      if(this.colour === "PINK")
        this.img.src = ColourEnum.PINK;
      if(this.colour === "YELLOW")
        this.img.src = ColourEnum.YELLOW;
      if(this.colour === "METAL")
        this.img.src = ColourEnum.METAL;
      if(this.colour === "GOLD")
        this.img.src = ColourEnum.GOLD;

      this.img.id = this.id;
  }
  /**
  * @setHealth function used to set the health of a brick
  */
  setHealth()
  {
    if(this.colour === "METAL")
    {
      this.health = 2;
    }
    else if(this.colour === "GOLD")
    {
      this.health = 3;
    }
    else {
      this.health = 1;
    }
  }
  damage()
  {
    if(this.health < 3)
    {
      this.health -= 1;
    }
  }

}
