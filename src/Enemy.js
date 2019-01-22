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
constructor(type, id, posX, posY, velX, velY, width, height)
{
  this.img;
  this.type = type;
  this.id = id;
  
  this.position = {
    x: posX,
    y: posY
  }
  this.size = {
      x: width,
      y: height
  }
  this.x = posX;
  this.y = posY;
  this.width = width;
  this.height = height;
  this.velX = velX;
  this.velY = velY;
  this.direction = Math.floor((Math.random() * 2) + 1);

  this.createNewEnemy();
}
/**
* @update update enemy logic.
*/
update()
{
  this.position.y +=1;
  if(this.direction === 1)
  {
    this.position.x -=3;
  }
  else {
    this.position.x+=3;
  }

  if(this.position.x < 0)
  {
    this.position.x = 1;
    this.direction = 2;
  }

  if(this.position.x > 1000)
  {
    this.position.x = 1000;
    this.direction = 1
  }
  this.x = this.position.x;
  this.y = this.position.y;

}
/**
* @draw
* @param {context} ctx used to draw the paddle.
*/
draw(ctx)
{
  ctx.save();
  ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
  ctx.restore();
}
/**
* @createNewEnemy function used to create new enemies
*/
createNewEnemy()
{
    this.img = new Image(this.size.x, this.size.y)
    if(this.type === "BLUE")
    {
      this.img.src = EnemyType.BLUE;
    }
    this.img.id = this.id;
}
die()
{
  delete this;
}
}
