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
  constructor(type, id, posX, posY, velX, velY, width, height, minX, maxX, minY, maxY)
  {
    this.img;
    this.type = type;
    this.id = id;
    this.position = {
      x: posX,
      y: posY
    }
    this.velocity = {
      x:velX ,
      y:velY
    }
    this.width = width;
    this.height = height;
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.health =1;

    this.onScreen = false;

    this.soundManager = new AudioManager();
    this.soundManager.init();
    this.soundManager.loadSoundFile("death", "./res/Sounds/Explosion.wav");
    this.soundManager.loadSoundFile("block-hit", "./res/Sounds/Bumper2.wav");
    this.soundManager.loadSoundFile("wall-hit", "./res/Sounds/Bumper3.wav");

    this.createNewEnemy();
  }
  /**
  * @update update enemy logic.
  */
  update()
  {
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if(this.position.x < this.minX)
    {
      this.position.x = this.minX + 1;
      this.velocity.x *= -1;
      this.soundManager.playAudio("wall-hit", false, 0.5);
    }
    if(this.position.x > this.maxX - this.width)
    {
      this.x = this.maxX-this.width;
      this.velocity.x *= -1;
      this.soundManager.playAudio("wall-hit", false, 0.5);
    }
    if(this.position.y > this.minY)
    {
      this.onScreen = true;
    }
    if(this.onScreen === true && this.position.y < this.minY)
    {
      this.position.y = this.minY + 1;
      this.velocity.y *= -1;
      this.soundManager.playAudio("wall-hit", false, 0.5);
    }
    if(this.onScreen === true && this.position.y > this.maxY)
    {
      this.die();
    }

  }
  /**
  * @draw
  * @param {context} ctx used to draw the paddle.
  */
  draw(ctx)
  {
    ctx.save();
    ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
    ctx.restore();
  }
  /**
  * @createNewEnemy function used to create new enemies
  */
  createNewEnemy()
  {
      this.img = new Image(this.width, this.height)
      if(this.type === "BLUE")
        this.img.src = EnemyType.BLUE;
      if(this.type === "RED")
        this.img.src = EnemyType.RED;
      if(this.type === "GREEN")
        this.img.src = EnemyType.GREEN;
      if(this.type === "RAINBOW")
        this.img.src = EnemyType.RAINBOW;

      this.img.id = this.id;
  }
  die()
  {
    this.soundManager.playAudio("death", false, 0.5);
    this.health -=1;
  }
}
