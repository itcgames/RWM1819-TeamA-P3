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

    this.setHealth();
    this.createNewBrick(level);
    this.soundManager = new AudioManager();
    this.soundManager.init();
    this.soundManager.loadSoundFile("destroy", "./res/Sounds/Destroy.wav");
  }

  playDestroySound(){
    this.soundManager.playAudio("destroy", false, 0.5);
  }

  /**
  * @update update paddle logic.
  */
  update() {

  }
  /**
  * @draw
  * @param {context} ctx used to draw the paddle.
  */
  draw(ctx) {
    ctx.save();
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
      this.img.src = ColourEnum.METAL;
      this.score = (level + 1) * 50;
    }
    if (this.colour === "GOLD") {
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
      this.health = 3;
    }
    else {
      this.health = 1;
    }
  }
  damage() {
    if (this.health < 3) {
      this.health -= 1;
    }
  }

}
