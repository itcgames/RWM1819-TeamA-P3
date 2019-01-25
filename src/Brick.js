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
  // METAL: "./res/Images/Bricks/brick_metal.png",
  // GOLD: "./res/Images/Bricks/brick_gold.png"
  METAL: "./res/Images/Bricks/brick_metal_hit.png",
  GOLD: "./res/Images/Bricks/brick_gold_hit.png"
}
/**
* Brick class used to setup each of the destructible blocks in the game
*/
class Brick {
  /**
  * @constructor constructor for the brick class that also sets the health based on the colour
  */
  constructor(colour, id, positionX, positionY, width, height, level) {
    this.img;
    this.x = positionX;
    this.y = positionY;
    this.id = id;
    this.colour = colour;
    this.width = width;
    this.height = height;
    this.health = 1;
    this.score = 0;
    this.dt;
    if(this.colour === "METAL" || this.colour === "GOLD")
    {
      this.animationManager = new AnimationManager();
    }
    this.setHealth();
    this.createNewBrick(level);
    this.soundManager = new AudioManager();
    this.soundManager.init();
    this.soundManager.loadSoundFile("destroy", "./res/Sounds/Destroy.wav");
    this.soundManager.loadSoundFile("destroyMetal", "./res/Sounds/HitMetal.wav");
    this.soundManager.loadSoundFile("destroyGold", "./res/Sounds/HitGold.wav");
  }

  playDestroySound(){
    if(this.colour === "GOLD")
    {
      this.soundManager.playAudio("destroyGold", false, 0.3);
    }
    else if(this.colour === "METAL")
    {
      this.soundManager.playAudio("destroyMetal", false, 0.3);
    }
    else {
      this.soundManager.playAudio("destroy",false,0.3);
    }
  }

  /**
  * @update update paddle logic.
  */
  update(dt) {
    this.dt = dt;
    if(this.colour === "METAL" || this.colour === "GOLD")
    {
      if(this.animationManager.isPlaying())
      {
        this.animationManager.update(dt, this.x + (this.width / 2), this.y + (this.height / 2));
     }
    }
  }
  /**
  * @draw
  * @param {context} ctx used to draw the paddle.
  */
  draw(ctx) {
    ctx.save();

    if(this.colour === "METAL" || this.colour === "GOLD")
    {
        //ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.img, 0, 0, 100, 50,this.x,this.y,this.width,this.height);
      if(this.animationManager.isPlaying())
      {
        this.animationManager.draw(ctx);
     }
    }
    else {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    ctx.restore();

  }
  /**
  * @createNewBrick function used to create new bricks
  */
  createNewBrick(level) {
    this.img = new Image(this.width, this.height)
    if (this.colour === "RED") {
      this.img.src = ColourEnum.RED;
      this.score = 90;
    }
    if (this.colour === "WHITE") {
      this.img.src = ColourEnum.WHITE;
      this.score = 50;
    }
    if (this.colour === "ORANGE") {
      this.img.src = ColourEnum.ORANGE;
      this.score = 60;
    }
    if (this.colour === "LIGHTBLUE") {
      this.img.src = ColourEnum.LIGHTBLUE;
      this.score = 70;
    }
    if (this.colour === "GREEN") {
      this.img.src = ColourEnum.GREEN;
      this.score = 80;
    }
    if (this.colour === "BLUE") {
      this.img.src = ColourEnum.BLUE;
      this.score = 100;
    }
    if (this.colour === "PINK") {
      this.img.src = ColourEnum.PINK;
      this.score = 110;
    }
    if (this.colour === "YELLOW") {
      this.img.src = ColourEnum.YELLOW;
      this.score = 120;
    }
    if (this.colour === "METAL") {
      this.img = new Image(1000,50);
      this.animation = new Animation(this.img, 100, 50, 10);
      this.animationManager.addAnimation("Hit", this.animation);
      this.animationManager.setScale("Hit", 0.85, 0.72);
      this.animationManager.isLooping("Hit",false);
      this.animationManager.setAnimationFPS("Hit", 60);
      this.animationManager.stop();
      this.score = (level + 1) * 50;
      this.img.src = ColourEnum.METAL;
    }
    if (this.colour === "GOLD") {
      this.img = new Image(1000,50)
      this.animation = new Animation(this.img, 100, 50, 10);
      this.animationManager.addAnimation("Hit", this.animation);
      this.animationManager.setScale("Hit", 0.85, 0.72);
      this.animationManager.isLooping("Hit",false);
      this.animationManager.setAnimationFPS("Hit", 60);
      this.animationManager.stop();
      this.img.src = ColourEnum.GOLD;
    }

    this.img.id = this.id;

  }
  /**
  * @setHealth function used to set the health of a brick
  */
  setHealth() {
    if (this.colour === "METAL") {
      this.health = 2;
    }
    else if (this.colour === "GOLD") {
      this.health = 999999;
    }
    else {
      this.health = 1;
    }
  }
  damage() {
      this.health -= 1;
      if(this.colour === "METAL" || this.colour === "GOLD")
      {
        this.animationManager.continue();
        this.animationManager.update(this.dt, this.x + (this.width / 2), this.y + (this.height / 2));
      }

  }

}
