
class Game {
  constructor() {
    this.worldBounds = {
      minX: 100,
      minY: 100,
      maxX: 1100,
      maxY: 800
    };
    //scene management
    this.menuManager = new MenuManager();
    this.menuManager.addScene("Splash", new Scene("SPLASH", "s", this.worldBounds.minX, this.worldBounds.minY, this.worldBounds.maxX - 100, this.worldBounds.maxY));
    this.menuManager.addScene("Main Menu", new Scene("MAIN", "m", this.worldBounds.minX, this.worldBounds.minY, this.worldBounds.maxX - 100, this.worldBounds.maxY));
    this.menuManager.addScene("Game Scene", new Scene("GAME", "g", this.worldBounds.minX, this.worldBounds.minY, this.worldBounds.maxX - 100, this.worldBounds.maxY));
    this.menuManager.setCurrentScene("Splash");
    this.menuManager.fadeSpeed = 2000;
    this.menuManager.fadeTo("Main Menu");
    this.paddle = new Paddle(this.worldBounds.maxX/2, 700, this.worldBounds.minX, this.worldBounds.maxX);
    this.prevDt = Date.now();
    this.canvas = new Canvas("canvas");
    this.ctx = canvas.getContext("2d");
    /** @type {Array<Brick>} */
    this.bricks = [];
    /** @type {Array<Enemy>} */
    this.enemies = [];
    /** @type {{ one: { score: number, bricks: Array<Brick>, enemies: Array<Enemy> }, two: { score: number, bricks: Array<Brick>, enemies: Array<Enemy> }}} */
    this.players = {
      one: { score: 0, bricks: [], enemies: [], lives: 3 },
      two: { score: 0, bricks: [], enemies: [], lives: 3 }
    };
    this.isPlayerOne = true;
    this.twoPlayerMode = false;
    this.play = true;
    this.currentLevelP1 = 0;
    this.currentLevelP2 = 0;
    //powerups
    this.powerUps = [];
    this.randomNumGen;
    //preload powerup images
    this.laserImg = new Image(0,0);
    this.laserImg.src = "./res/Images/Powerups/power_up_laser.png";
    this.enlargeImg = new Image(0,0);
    this.enlargeImg.src = "./res/Images/Powerups/power_up_enlarge.png";
    this.catchImg = new Image(0,0);
    this.catchImg.src = "./res/Images/Powerups/power_up_catch.png";
    this.slowImg = new Image(0,0);
    this.slowImg.src = "./res/Images/Powerups/power_up_slow.png";
    this.breakImg = new Image(0,0);
    this.breakImg.src = "./res/Images/Powerups/power_up_break.png";
    this.disruptionImg = new Image(0,0);
    this.disruptionImg.src = "./res/Images/Powerups/power_up_disruption.png";
    this.playerImg = new Image(0,0);
    this.playerImg.src = "./res/Images/Powerups/power_up_player.png";
    /** @type {Array<{ Bricks: Array<{ type: string, position: { x: number, y: number }, width: number, height: number }> }>} */
    this.levels = [];

    new LevelLoader("./res/Levels.json", (ev, data) => {
      this.levels = data;
      this.currentLevelP1 = 0;
      this.currentLevelP2 = 0;
      this.setLevel(this.players.one, this.currentLevelP1);
      this.setLevel(this.players.two, this.currentLevelP2);
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
  onKeyDown(event) {
    if (this.menuManager.current.key === "Main Menu") {
      if (this.timer1 - this.timer2 < this.menuManager.fadeSpeed * -2) {
        //enter key
        if (event.keyCode === 13) {
          this.pressedEnter = true;
        }
        //UP arrow key
        if (event.keyCode === 38) {
          this.pressedUp = true;
        }
        //Down arrow key
        if (event.keyCode === 40) {
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
    if (this.menuManager.current.key === "Main Menu") {
      if (this.pressedUp === true) {
        this.timer2 = new Date();
        this.menuManager.current.value.cursorHeight = 712;
        this.twoPlayerMode = false;
        this.isPlayerOne = true;
        this.play = true;
        this.players.one.lives = 3;
        this.players.two.lives = 3;
      }
      if (this.pressedUp === false) {
        this.menuManager.current.value.cursorHeight = 762;
        this.twoPlayerMode = true;
        this.isPlayerOne = true;
        this.play = true;
        this.players.one.lives = 3;
        this.players.two.lives = 3;
      }
      if (this.pressedEnter === true) {
        this.menuManager.setCurrentScene("Game Scene");
      }
    }

    if (this.menuManager.current.key === "Game Scene") {
      if (this.play) {
        if(this.players.one.bricks.length<= 0)
        {
          this.ballSpawning = true;
          this.powerups = [];
          this.currentLevelP1+=1;
          this.setLevel(this.players.one, this.currentLevelP1);
        }
        if(this.players.two.bricks.length<= 0 && this.twoPlayerMode === true)
        {
          this.ballSpawning = true;
          this.powerups = [];
          this.currentLevelP2+=1;
          this.setLevel(this.players.two, this.currentLevelP2);
        }
        //reset bools
        this.pressedUp = true;
        this.pressedEnter = false;

        this.dnd.update();
        this.paddle.update(dt);
        this.ballUpdate(dt);

        if ((this.isPlayerOne ? this.players.one.score : this.players.two.score) > this.highScore) {
          this.highScore = (this.isPlayerOne ? this.players.one.score : this.players.two.score);
        }
        this.bricks = this.isPlayerOne
          ? this.players.one.bricks
          : this.players.two.bricks;
        //update entities
        this.bricks.forEach((brick,index,array) => {
          this.updateBrick(brick, index, array);
        });
        Collision.LasersToWorld(this.paddle.lasers, this.worldBounds.minY);
        this.enemies.forEach(enemy => {
          this.updateEnemy(enemy);
        });
        this.powerUps.forEach((powerup,index,array) => {
          this.updatePowerup(powerup,index,array,dt);
        });
        if (!this.ballSpawning) {
          Collision.BallToPaddle(this.ball, this.paddle);
        }
      }
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.resolution.x, this.canvas.resolution.y);
    this.menuManager.draw(this.ctx);
    if (this.menuManager.current.key === "Main Menu") {

    }
    if (this.menuManager.current.key === "Game Scene") {
      this.paddle.draw(this.ctx);
      this.ball.render(this.ctx);
      this.bricks = this.isPlayerOne
        ? this.players.one.bricks
        : this.players.two.bricks;
      this.bricks.forEach(brick => brick.draw(this.ctx));
      this.enemies.forEach(enemy => enemy.draw(this.ctx));
      this.powerUps.forEach(powerup => powerup.draw(this.ctx));

      this.ctx.font = "14px Arial";
      this.ctx.fillText("Score: " + (this.isPlayerOne ? this.players.one.score : this.players.two.score), 50, 50);
      this.ctx.fillText("High Score: " + this.highScore, 50, 80);
      this.ctx.fillText("Lives: " + (this.isPlayerOne ? this.players.one.lives : this.players.two.lives), 200, 50);
      this.ctx.fillText("Player " + (this.isPlayerOne ? "1" : "2"), 200, 80);
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
      this.ball.position.y = this.paddle.colBox.position.y - (this.ball.radius);
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

        this.ball.slowStartSpeed = 0;
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
      this.ball.playWallBounce();
    }
    if (this.ball.position.x < this.worldBounds.minX) {
      this.ball.flipVelX();
      this.ball.playWallBounce();
    }
    if (this.ball.position.y > this.worldBounds.maxY) {
      this.ball.flipVelY();
      this.ball.playWallBounce();
    }
    if (this.ball.position.y + (this.ball.radius * 2) > this.worldBounds.maxY) {
      this.ballSpawning = true;
      this.ball.img.src = "./res/Images/Ball/ball.png";
      this.ball.playDeathSound();
      if (this.isPlayerOne) {
        this.powerUps = [];
        this.players.one.lives -= 1;
        if (this.players.one.lives < 0)
          this.players.one.lives = 0;

      } else {
        this.players.two.lives -= 1;
        this.powerUps = [];
        if (this.players.two.lives < 0)
          this.players.two.lives = 0;
      }
      this.paddle.laserPowerActive = false;
      if (this.twoPlayerMode) {
        if ((this.isPlayerOne && this.players.two.lives > 0) || (!this.isPlayerOne && this.players.one.lives > 0)) {
          this.isPlayerOne = !this.isPlayerOne; // swapping active player
        } else if (this.players.one.lives > 0) {
          // player one has lives left swap to him
          this.isPlayerOne = true;
        } else if (this.players.two.lives > 0) {
          // player two has lives left swap to him
          this.isPlayerOne = false;
        } else {
          // Game over both players lose
          this.menuManager.setCurrentScene("Main Menu");
          this.play = false;
          this.currentLevelP1 = 0;
          this.currentLevelP2 = 0;
          this.setLevel(this.players.one, this.currentLevelP1);
          this.setLevel(this.players.two, this.currentLevelP2);
        }
        this.bricks = this.isPlayerOne
          ? this.players.one.bricks
          : this.players.two.bricks;
        this.enemies = this.isPlayerOne
          ? this.players.one.enemies
          : this.players.two.enemies;
      } else if (this.players.one.lives <= 0) {
        // Game over in player one mode
        this.menuManager.setCurrentScene("Main Menu");
        this.play = false;
        this.currentLevelP1 = 0;
        this.setLevel(this.players.one, this.currentLevelP1);
      }
    }
  }
  checkSpawnPowerup(x, y) {
    this.randomNumGen = Math.floor((Math.random() * 100) + 1);
    if (this.randomNumGen >= 90) {
      this.randomNumGen = Math.floor((Math.random() * 7) + 1);
      if (this.randomNumGen === 1) {
        this.powerUp = new PowerUp(this.laserImg,"LASER", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 2) {
        this.powerUp = new PowerUp(this.enlargeImg,"ENLARGE", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 3) {
        this.powerUp = new PowerUp(this.catchImg,"CATCH", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 4) {
        this.powerUp = new PowerUp(this.slowImg,"SLOW", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 5) {
        this.powerUp = new PowerUp(this.breakImg,"BREAK", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 6) {
        this.powerUp = new PowerUp(this.disruptionImg,"DISRUPTION", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 7) {
        this.powerUp = new PowerUp(this.playerImg,"PLAYER", x, y, 50, 25, this.worldBounds.maxY);
      }
      this.powerUps.push(this.powerUp);
    }
  }
  updateBrick(brick, index, array){
    brick.update();
    if (Collision.BallToBlock(this.ball, brick))
    {
      if(brick.health <= 0)
        this.checkSpawnPowerup(brick.x + 12, brick.y);
    }
    Collision.LasersToBlock(this.paddle.lasers, brick);
    if (brick.health <= 0)
    {
      array.splice(index, 1);
      if (this.isPlayerOne)
      {
        this.players.one.score += brick.score;
      }
      else
      {
        this.players.two.score += brick.score;
      }
    }
    this.enemies.forEach(enemy =>
    {
      Collision.EnemyToBlock(enemy, brick);
    });
  }
  updateEnemy(enemy){
    enemy.update();
    if (!this.ballSpawning)
    {
      Collision.BallToEnemy(this.ball, enemy);
    }
    Collision.LasersToEnemies(this.paddle.lasers, enemy);
    Collision.PaddleToEnemy(this.paddle, enemy);
    if (enemy.health <= 0) {
      array.splice(index, 1);
      if (this.isPlayerOne) {
        this.players.one.score += 100;
      } else {
        this.players.two.score += 100;
      }
    }
  }
  updatePowerup(powerup,index,array,dt){
      powerup.update(dt);
      if (Collision.PaddleToPowerUp(this.paddle, powerup) && powerup.active) {
        this.paddle.playPowerUpPickup();
        if (powerup.type === "LASER") {
          if(this.paddle.enlargePowerActive){
            this.paddle.enlargePowerActive = false;
          }
          this.paddle.laserPowerActive = true;
          this.paddle.paddleAnimator.continue();
          powerup.active = false;
        }
        else if (powerup.type === "ENLARGE") {
          if(this.paddle.laserPowerActive){
            this.paddle.laserPowerActive = false;
          }
          this.paddle.enlargePowerActive = true;
          powerup.active = false;
        }
        else if (powerup.type === "CATCH") {
          powerup.active = false;
        }
        else if (powerup.type === "SLOW") {
          this.ball.speed -= 3;//get angle
          var angle = Math.atan2(this.ball.velocity.y, this.ball.velocity.x);
          angle = VectorMath.toDeg(angle)

          //make unit vector from angle
          var firingVectorUnit = VectorMath.vector(angle);
          //multiply by speed
          var firingVector = {
            x: firingVectorUnit.x * this.ball.speed,
            y: firingVectorUnit.y * this.ball.speed
          }
          this.ball.velocity.x = firingVector.x;
          this.ball.velocity.y = firingVector.y;
          this.ball.img.src = "./res/Images/Ball/ball_slow.png";
          powerup.active = false;
        }
        else if (powerup.type === "BREAK") {
          powerup.active = false;
        }
        else if (powerup.type === "DISRUPTION") {
          powerup.active = false;
        }
        else if (powerup.type === "PLAYER") {
          powerup.active = false;
          if (this.isPlayerOne) {
            this.players.one.lives += 1;
          } else {
            this.players.two.lives += 1;
          }
        }
        array.splice(index, 1);
      }
  }

  setLevel(playerToSet, current) {
    if (current >= this.levels.length)  {
      console.log("Setting a level that doesn't exist in the loaded levels");
      this.menuManager.setCurrentScene("Main Menu");
    }
    else{
      playerToSet.bricks.splice(0);
      const currentLevel = this.levels[current];
      currentLevel.Bricks.forEach((brick, index) => {
        const id = brick.type + index.toString();
        playerToSet.bricks.push(new Brick(brick.type, id, brick.position.x, brick.position.y, brick.width, brick.height, current));
        this.bricks = playerToSet.bricks;
      });
    }
  }
}
