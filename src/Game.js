
class Game {
  constructor() {
    this.worldBounds = {
      minX: 100,
      minY: 100,
      maxX: 1000,
      maxY: 800
    };
    //scene management
    this.menuManager = new MenuManager();
    this.menuManager.addScene("Splash", new Scene("SPLASH", "s", this.worldBounds.minX, this.worldBounds.minY, this.worldBounds.maxX, this.worldBounds.maxY));
    this.menuManager.addScene("Main Menu", new Scene("MAIN", "m", this.worldBounds.minX, this.worldBounds.minY, this.worldBounds.maxX, this.worldBounds.maxY));
    this.menuManager.addScene("Game Scene", new Scene("GAME", "g", this.worldBounds.minX, this.worldBounds.minY, this.worldBounds.maxX, this.worldBounds.maxY));
    this.menuManager.setCurrentScene("Splash");
    this.menuManager.fadeSpeed = 4000;
    this.menuManager.fadeTo("Main Menu");
    this.paddle = new Paddle(100,700, this.worldBounds.minX, this.worldBounds.maxX);
    this.prevDt = Date.now();
    this.canvas = new Canvas("canvas");
    this.ctx = canvas.getContext("2d");
    /** @type {Array<Brick>} */
    this.bricks = [];
    /** @type {Array<Enemy>} */
    this.enemies = [];
    this.currentLevel = 0;
    new LevelLoader("./res/Levels.json", (ev, data) => {
      const level = data[this.currentLevel];
      this.worldBounds = level.WorldBounds;
      level.Bricks.forEach((brick, index) => {
        const id = brick.type + index.toString();
        this.bricks.push(new Brick(brick.type, id, brick.position.x, brick.position.y, brick.width, brick.height, this.currentLevel));
      });
      level.Enemies.forEach((enemy, index) => {
        const id = enemy.type + index.toString();
        this.enemies.push(new Enemy(enemy.type, id, enemy.position.x, enemy.position.y, enemy.velocity.x, enemy.velocity.y, enemy.width, enemy.height, this.worldBounds.minX, this.worldBounds.maxX));
      });
      this.dnd = new DragDrop();
      this.dnd.addDraggable(this.paddle.paddleRect, false, true);
      window.addEventListener("mousedown", this.dnd.dragstart.bind(this.dnd));
      window.addEventListener("mouseup", this.dnd.dragend.bind(this.dnd));
      this.run();
    }, ev => { alert("Failed to load level"); });

    this.ball = new Ball(100, 100, 20);
    this.ballSpawning = true;
    this.spawnBallCountdown = 3.0;
    this.generatedRandomPaddlePos = false;
    this.randPaddlePos;
    this.ballStartSpeed = 8;
    this.score = 0;
    this.highScore = 500;
    this.pressedUp = true;
    this.pressedEnter = false;
    this.timer1 = new Date();
    this.timer2;
    this.events = {
        onKeyDown: this.onKeyDown.bind(this)
      };
    window.addEventListener("keydown", this.events.onKeyDown, false);
  }
  /**
   * This is the function that detect key presses.
   * @param {KeyboardEvent} event
   * the key down event
   */
  onKeyDown(event){
    if(this.menuManager.current.key === "Main Menu")
    {
      console.log(this.timer1 - this.timer2 < -8000);
      if(this.timer1 - this.timer2 < -8000)
      {
        //enter key
        if(event.keyCode === 13){
            this.pressedEnter = true;
        }
        //UP arrow key
        if(event.keyCode === 38) {
            this.pressedUp = true;
        }
        //Down arrow key
        if(event.keyCode === 40){
          this.pressedUp = false;
          }
      }
    }
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
    this.menuManager.update(dt);
    if(this.menuManager.current.key === "Main Menu")
    {
        this.timer2 = new Date();
        if(this.pressedUp === true)
        {
          this.menuManager.current.value.cursorHeight = 712;
        }
        if(this.pressedUp === false) {
          this.menuManager.current.value.cursorHeight = 762;
        }
        if(this.pressedEnter === true)
        {
          this.menuManager.setCurrentScene("Game Scene");
        }

    }

    if(this.menuManager.current.key === "Game Scene")
    {
      //reset bools
      this.pressedUp = true;
      this.pressedEnter = false;

      this.dnd.update();
      this.paddle.update(dt);
      this.ballUpdate(dt);
      if (this.score > this.highScore)
      {
        this.highScore = this.score;
      }
      this.bricks.forEach((brick, index, array) => {
        brick.update();
        Collision.BallToBlock(this.ball, brick);
        if (brick.health <= 0) {
          array.splice(index, 1);
          this.score += brick.score;
        }
      });
      this.enemies.forEach((enemy, index, array) => {
        enemy.update();
        if (!this.ballSpawning) {
          Collision.BallToEnemy(this.ball, enemy);
        }
        if (enemy.health <= 0) {
          array.splice(index, 1);
          this.score += 100;
        }
      });
      if (!this.ballSpawning){
        Collision.BallToPaddle(this.ball, this.paddle);
      }
    }

  }

  render() {
    this.ctx.clearRect(0,0,this.canvas.resolution.x, this.canvas.resolution.y);
    this.menuManager.draw(this.ctx);
    if(this.menuManager.current.key === "Main Menu")
    {

    }
    if(this.menuManager.current.key === "Game Scene")
    {
      this.paddle.draw(this.ctx);
      this.ball.render(this.ctx);
      this.bricks.forEach(brick => brick.draw(this.ctx));
      this.enemies.forEach(enemy => enemy.draw(this.ctx));
      this.ctx.font = "14px Arial";
      this.ctx.fillText("Score: " + this.score, 50, 50);
      this.ctx.fillText("High Score: " + this.highScore, 50, 80);
    }
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
  ballUpdate(dt) {

    if (this.ballSpawning) {
      this.spawnBallCountdown -= dt / 1000;

      if (!this.generatedRandomPaddlePos) {
        //generate random offset from centre of paddle
        this.randPaddlePos = Math.random() * this.paddle.size.x - (this.paddle.size.x / 2);
        this.generatedRandomPaddlePos = true;
      }
      //make balls position relative to the paddle
      this.ball.position.x = this.paddle.origin.x - (this.ball.radius / 2) + this.randPaddlePos;
      this.ball.position.y = this.paddle.position.y - (this.ball.radius);
      //when countdown is 0 fire ball at angle depending on position
      //relative to the paddle
      if (this.spawnBallCountdown <= 0) {

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
        this.ball.speed = this.ballStartSpeed;
        this.generatedRandomPaddlePos = false;
      }
    }
    else {
      this.ballWorldCollision();
      this.ball.update();
    }
  }

  ballWorldCollision() {
    if (this.ball.position.x + (this.ball.radius * 2) > this.worldBounds.maxX) {
      this.ball.flipVelX();
    }
    if (this.ball.position.x < this.worldBounds.minX) {
      this.ball.flipVelX();
    }
    if (this.ball.position.y > this.worldBounds.maxY) {
      this.ball.flipVelY();
    }
    if (this.ball.position.y < this.worldBounds.minY) {
      this.ball.flipVelY();
    }
    if (this.ball.position.y + (this.ball.radius * 2) > this.worldBounds.maxY) {
      this.ballSpawning = true;
    }
  }
}
