/**
* @EnemyType enum for the different type of bricks in our game
*/
const EnemyType = {
  BLUE: "./res/Images/Enemies/enemy_blue.png",
  RED: "./res/Images/Enemies/enemy_red.png",
  GREEN: "./res/Images/Enemies/enemy_green.png",
  LIGHT_BLUE: "./res/Images/Enemies/enemy_light_blue.png"
}
/**
 * 
 */
const EnemySize = {
  width: 2000,
  height: 200
}

/*

    sprites.blue.src = ;
    sprites.lightBlue.src = ;
    sprites.red.src = ;
    sprites.green.src = ;
    sprites.explosion.src = "./res/Images/Enemies/enemy_explode.png";
*/

/**
* Enemy class used to setup each of the enemy types in the game
*/
class Enemy {
  /**
  * @constructor constructor for the enemy class
  * @param {HTMLImageElement} explosion
  * @param {HTMLImageElement} spritesheet
  * @param {"BLUE" | "RED" | "GREEN" | ""} type
  * @param {{x: number, y: number}} position
  * @param {{x: number, y: number }} velocity
  * @param {number} width
  * @param {number} height
  * @param {{ minX: number, maxX: number, minY: number, maxY: number }} worldBounds
  */
  constructor(explosion, spritesheet, type, position, velocity, width, height, worldBounds) {
    this.type = type;
    this.position = {
      x: position.x,
      y: position.y
    }
    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }
    this.width = width;
    this.height = height;
    this.origin = {
      x: this.position.x + (this.width / 2),
      y: this.position.y + (this.height / 2)
    };
    this.minX = worldBounds.minX;
    this.maxX = worldBounds.maxX;
    this.minY = worldBounds.minY;
    this.maxY = worldBounds.maxY;
    this.health = 1;
    this.onScreen = false;
    this.image = spritesheet;
    this.explosion = explosion;
    this.idleAnimator = new AnimationManager();
    this.idleAnimation = new Animation(this.image
      , 200 // width of the animation frame
      , 200 // height of the animation frame
      , 10
    );
    this.idleAnimator.addAnimation("idle", this.idleAnimation);
    this.idleAnimator.setScale("idle", 0.5, 0.5);
    this.idleAnimator.isLooping("idle", true);
    this.idleAnimator.continue();
  }
  /**
  * @update update enemy logic.
  * @param {number} dt delta time between update calls.
  */
  update(dt) {
    this.position.y += this.velocity.y;
    this.position.x += this.velocity.x;

    if (this.position.x < this.minX) {
      this.position.x = this.minX + 1;
      this.velocity.x *= -1;
    }
    if (this.position.x > this.maxX - this.width) {
      this.x = this.maxX - this.width;
      this.velocity.x *= -1;
    }
    if (this.position.y > this.minY) {
      this.onScreen = true;
    }
    if (this.onScreen === true && this.position.y < this.minY) {
      this.position.y = this.minY + 1;
      this.velocity.y *= -1;
    }
    if (this.onScreen === true && this.position.y > this.maxY) {
      this.die();
    }
    if (this.idleAnimator.isPlaying()) {
      this.idleAnimator.update(dt, this.origin.x, this.origin.y);
    }
    this.updateOrigin();
  }
  /**
  * @draw
  * @param {CanvasRenderingContext2D} ctx used to draw the paddle.
  */
  draw(ctx) {
    ctx.save();
    if (this.idleAnimator.isPlaying()) {
      this.idleAnimator.draw(ctx);
    }
    // DEBUG COLLISION DRAWING
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    // END DEBUG COLLISION DRAWING
    ctx.restore();
  }

  die() {
    this.health -= 1;
  }

  updateOrigin() {
    this.origin = {
      x: this.position.x + (this.width / 2),
      y: this.position.y + (this.height / 2)
    };
  }
}
