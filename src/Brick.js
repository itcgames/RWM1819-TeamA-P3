/**
* @ColourEnum enum for the different type of bricks in our game
*/
const ColourEnum = {
  RED: 1,
  WHITE: 2,
  ORANGE: 3,
  LIGHTBLUE: 4,
  GREEN: 5,
  BLUE: 6,
  PINK: 7,
  YELLOW: "./res/Images/YellowBrick.png",
  METAL: 9,
  GOLD: 10
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

     this.setHealth();
     this.createNewBrick();
  }

  /**
  * @update update paddle logic.
  */
  update()
  {
    //if the object has no health delete it
    if(this.health <= 0)
    {
      delete document.getElementById(this.id);
    }
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
      if(this.colour === "YELLOW")
      {
        this.img.src = ColourEnum.YELLOW;
      }
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
    if(this.colour === "GOLD")
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
    if(this.health === 0)
      delete this;
  }

}
