class Ball{
  constructor(x, y, r) {
    this.position = {
      x: x,
      y: y
    }
    this.velocity = {
      x:1 ,
      y:1
    }
    this.radius = r;
    this.speed = 0;
    this.minSpeed = 4;
    this.slowStartSpeed = 0;
    this.img = new Image(this.radius, this.radius);
    this.img.src = "./res/Images/Ball/ball.png";
    this.soundManager = new AudioManager();
    this.soundManager.init();
    this.soundManager.loadSoundFile("block-hit", "./res/Sounds/Bumper.wav");
    this.soundManager.loadSoundFile("wall-hit", "./res/Sounds/Bumper3.wav");
    this.soundManager.loadSoundFile("death", "./res/Sounds/roblox-death-sound.mp3");
  }

  playDeathSound(){
    this.soundManager.playAudio("death", false, 0.5);
  }

  playWallBounce(){
    this.soundManager.playAudio("wall-hit", false, 0.5);
  }

  playBlockBounce(){
    this.soundManager.playAudio("block-hit", false, 0.5);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  /** @type {ctx<CanvasRenderingContext2D>} */
  render(ctx) {
    ctx.save();
    ctx.fillStyle = "#ce0a2b";
    //ctx.fillRect(this.position.x, this.position.y, this.radius, this.radius);
    ctx.drawImage(this.img, this.position.x, this.position.y, this.radius, this.radius);
    ctx.restore();
  }

  flipVelX(){
    this.velocity.x = this.velocity.x * -1;
  }

  flipVelY(){
    this.velocity.y = this.velocity.y * -1;
  }

}