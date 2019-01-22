/**
* @EnemyType enum for the different type of bricks in our game
*/
const EnemyType = {
    BLUE: "./res/Images/Bricks/brick_yellow.png",
    RED: 2,
    GREEN: 3,
    RAINBOW: 4
}
/**
* Enemy class used to setup each of the enemy types in the game
*/
class Enemy
{
  /**
  * @constructor constructor for the enemy class
  */
  constructor(type, id, posX, posY, velX, velY, width, height, minX, maxX)
  {
    this.img;
    this.type = type;
    this.id = id;
    this.x = posX;
    this.y = posY;
    this.velX = velX;
    this.velY = velY;
    this.width = width;
    this.height = height;
    this.minX = minX;
    this.maxX = maxX;
    this.health =1;
    this.direction = Math.floor((Math.random() * 2) + 1);

    this.createNewEnemy();
  }
  /**
  * @update update enemy logic.
  */
  update()
  {
    this.y +=1;
    if(this.direction === 1)
    {
      this.x -=3;
    }
    else {
      this.x+=3;
    }

    if(this.x < this.minX)
    {
      this.x = this.minX;
      this.direction = 2;
    }

    if(this.x > this.maxX)
    {
      this.x = this.maxX;
      this.direction = 1
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
  * @createNewEnemy function used to create new enemies
  */
  createNewEnemy()
  {
      this.img = new Image(this.width, this.height)
      if(this.type === "BLUE")
      {
        this.img.src = EnemyType.BLUE;
      }
      this.img.id = this.id;
  }
  die()
  {
    this.health -=1;
  }
}
