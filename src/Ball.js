class Ball{
  constructor(x, y, r, speed, velocity) {
    //optionally set velocity
    if(velocity === undefined){
      this.velocity = {
        x:1 ,
        y:1
      }
    } else {
      this.velocity = {
        x: velocity.x,
        y: velocity.y
      };
    }
    this.position = {
      x: x,
      y: y
    }
    this.radius = r;
    this.speed = speed === undefined ? 0 : speed;
    this.speed = speed;
    this.minSpeed = 4;
    this.slowStartSpeed = 0;
    this.img = new Image(this.radius, this.radius);
    this.img.src = "./res/Images/Ball/ball.png";
    this.soundManager = new AudioManager();
    this.soundManager.init();
    this.soundManager.loadSoundFile("block-hit", "./res/Sounds/Bumper.wav");
    this.soundManager.loadSoundFile("wall-hit", "./res/Sounds/Bumper3.wav");
    this.soundManager.loadSoundFile("death", "./res/Sounds/roblox-death-sound.mp3");
    this.sticky = false;
    this.offset = 0;
    this.resetSpeed = 0;
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
    if (this.speed < this.minSpeed){
      this.speed = this.minSpeed;
    }
    var angle = Math.atan2(this.velocity.y, this.velocity.x);
    angle = VectorMath.toDeg(angle)

    //make unit vector from angle
    var firingVectorUnit = VectorMath.vector(angle);
    //multiply by speed
    var firingVector = {
      x: firingVectorUnit.x * this.speed,
      y: firingVectorUnit.y * this.speed
    }
    this.velocity.x = firingVector.x;
    this.velocity.y = firingVector.y;


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
