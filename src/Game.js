
class Game {
  constructor() {
    
    this.worldBounds = {
      minX: 100,
      minY: 100,
      maxX: 1000,
      maxY: 800
    };
    this.paddle = new Paddle(100,700, this.worldBounds.minX, this.worldBounds.maxX);
    this.prevDt = Date.now();
    this.canvas = new Canvas("canvas");
    this.ctx = canvas.getContext("2d");
    this.ball = new Ball(100, 100, 20);
    this.yellowBrick = new Brick("YELLOW","y1", 100,100,50,25);


    this.ballSpawning = true;
    this.spawnBallCountdown = 3.0;
    this.generatedRandomPaddlePos = false;
    this.randPaddlePos;
    this.ballStartSpeed = 8;
    this.dnd = new DragDrop();
    this.dnd.addDraggable(this.paddle.paddleRect, false, true);
    this.score = 0;
    this.highScore = 500;
    
    window.addEventListener("mousedown", this.dnd.dragstart.bind(this.dnd));
    window.addEventListener("mouseup", this.dnd.dragend.bind(this.dnd));
  }

  run() {
    this.loop();
  }

  loop() {
    this.update();
    this.render();

    /** Use bind function to keep the 'this' context throughout loop usage */
    window.requestAnimationFrame(this.loop.bind(this));
  }

  update() {
    const dt = this.calculateDt();
    this.dnd.update();
    this.paddle.update(dt);
    this.yellowBrick.update();
    this.ballUpdate(dt);
    this.score = this.score + 1;
    if (this.score > this.highScore)
    {
      this.highScore = this.score;
    }
  }

  render() {
    this.ctx.clearRect(0,0,this.canvas.resolution.x, this.canvas.resolution.y);
    this.paddle.draw(this.ctx);
    this.ball.render(this.ctx);
    this.yellowBrick.draw(this.ctx);
    this.ctx.font = "14px Arial";
    this.ctx.fillText("Score: " + this.score, 50, 50);
    this.ctx.fillText("High Score: " + this.highScore, 50, 80);
  }

  calculateDt() {
    const now = Date.now();
    const dt = now - this.prevDt;
    this.prevDt = now;
    return dt;
  }

  /**
   * updates the ball.
   * will also deal with when the ball first spawns on the paddle
   * at a randomly selected posiiton and fire it at an angle.
   * @param {Number} dt
   * time between cycles 
   */
  ballUpdate(dt){

    if(this.ballSpawning){
      this.spawnBallCountdown -= dt / 1000;

      if(!this.generatedRandomPaddlePos){
        //generate random offset from centre of paddle
        this.randPaddlePos = Math.random() * this.paddle.size.x - (this.paddle.size.x/2);
        this.generatedRandomPaddlePos = true;
      }
      //make balls position relative to the paddle
      this.ball.position.x = this.paddle.origin.x - (this.ball.radius / 2) + this.randPaddlePos;
      this.ball.position.y = this.paddle.position.y - (this.ball.radius);
      //when countdown is 0 fire ball at angle depending on position 
      //relative to the paddle
      if(this.spawnBallCountdown <= 0){

        //calculate vector between ball and paddle
        var vectorBetweenBallAndPaddle = {
          x: this.ball.position.x + this.ball.radius - this.paddle.origin.x,
          y: this.ball.position.y + this.ball.radius - this.paddle.origin.y
        }

        //get angle
        var angle = Math.atan2(vectorBetweenBallAndPaddle.y, vectorBetweenBallAndPaddle.x);
        angle = VectorMath.toDeg(angle) 

        //make unit vector from angle
        var firingVectorUnit = VectorMath.vector(angle);
        //multiply by start speed
        var firingVector = {
          x: firingVectorUnit.x * this.ballStartSpeed,
          y: firingVectorUnit.y * this.ballStartSpeed
        }

        //reset variables for spawning
        this.ballSpawning = false;
        this.spawnBallCountdown = 3.0;
        this.ball.velocity.x = firingVector.x;
        this.ball.velocity.y = firingVector.y;
        this.generatedRandomPaddlePos = false;
      }
    }
    else{
      this.ballWorldCollision();
      this.ball.update();
    }
  }

  ballWorldCollision(){
    if(this.ball.position.x + (this.ball.radius * 2) > this.worldBounds.maxX){
      this.ball.flipVelX();
    }
    if(this.ball.position.x < this.worldBounds.minX){
      this.ball.flipVelX();
    }
    if(this.ball.position.y > this.worldBounds.maxY){
      this.ball.flipVelY();
    }
    if(this.ball.position.y < this.worldBounds.minY){
      this.ball.flipVelY();
    }
    if(this.ball.position.y + (this.ball.radius * 2) > this.worldBounds.maxY){
      this.ballSpawning = true;
    }
  }
}
