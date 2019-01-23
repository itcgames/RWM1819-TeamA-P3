/**
* @MenuScenes enum for the different type of bricks in our game
*/
const MenuScenes = {
    SPLASH: "./res/Images/Scenes/SplashScene.png",
    MAIN: "./res/Images/Scenes/TitleScene.png",
    GAME: "./res/Images/Scenes/GameScene.png"
}
/**
* scene class to setup each of the scenes in the game
*/
class Scene
{
  /**
  * @constructor constructor for the scene class
  */
  constructor(type, id, posX, posY, width, height)
  {
    this.img;
  //  this.imgWall;
    this.cursorImg;
    this.p1Img;
    this.p2Img;
    this.type = type;
    this.id = id;
    this.x = posX;
    this.y = posY;
    this.width = width;
    this.height = height;
    this.cursorHeight = 712;
    if(this.type === "MAIN")
    {
      this.cursorImg = new Image(50,50);
      this.cursorImg.src = "./res/Images/Scenes/cursor.png";

      this.p1Img = new Image(100,25);
      this.p1Img.src = "./res/Images/Scenes/player_1.png";

      this.p2Img = new Image(100,25);
      this.p2Img.src = "./res/Images/Scenes/player_2.png";

    }
    // if(this.type === "GAME")
    // {
    //   this.imgWall = new Image(-25,-25);
    //   this.imgWall.src = "./res/Images/Scenes/GameSceneWall.png";
    // }

    this.createScene();
  }
  /**
  * @update update scene logic.
  */
  update(dt)
  {
  }
  /**
  * @draw draw scene .
  */
  draw(ctx)
  {
    ctx.save();
    ctx.drawImage(this.img, this.x,this.y,this.width, this.height);
    if(this.type === "MAIN")
    {
      ctx.drawImage(this.cursorImg, 500,this.cursorHeight,50,25);
      ctx.drawImage(this.p1Img, 600,700,100,50);
      ctx.drawImage(this.p2Img, 600,750, 100,50);
    }
    // if(this.type === "GAME")
    // {
    //   ctx.drawImage(this.imgWall,this.x,this.y,this.width+20, this.height+20);
    // }
    ctx.restore();
  }
/**
* @createScene function used to create new scenes
*/
  createScene()
  {
    this.img = new Image(this.width, this.height)
    if(this.type === "SPLASH")
      this.img.src = MenuScenes.SPLASH;
    if(this.type === "MAIN")
      this.img.src = MenuScenes.MAIN;
    if(this.type === "GAME")
      this.img.src = MenuScenes.GAME;

    this.img.id = this.id;
  }
}
