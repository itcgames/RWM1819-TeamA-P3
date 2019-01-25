
class Game {
  constructor() {
    this.spawnKeyPressed = false;
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
    this.paddle = new Paddle(this.worldBounds.maxX / 2, 700, this.worldBounds.minX, this.worldBounds.maxX);
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
    this.enemySprites = this.createEnemySprites();
    this.isPlayerOne = true;
    this.twoPlayerMode = false;
    this.play = true;
    this.currentLevelP1 = 0;
    this.currentLevelP2 = 0;
    //Sounds
    this.soundManager = new AudioManager();
    this.soundManager.init();
    this.soundManager.loadSoundFile("levelComplete", "./res/Sounds/LevelComplete.wav");
    this.soundManager.loadSoundFile("TitleMusic", "./res/Sounds/TitleMusic.wav");
    this.soundManager.loadSoundFile("GameMusic", "./res/Sounds/GameMusic.wav");
    this.switchMusicType = false;
    this.hasPlayed = false;
    //powerups
    this.powerUps = [];
    this.randomNumGen;
    //preload powerup images
    this.laserImg = new Image(0, 0);
    this.laserImg.src = "./res/Images/Powerups/power_up_laser.png";
    this.enlargeImg = new Image(0, 0);
    this.enlargeImg.src = "./res/Images/Powerups/power_up_enlarge.png";
    this.catchImg = new Image(0, 0);
    this.catchImg.src = "./res/Images/Powerups/power_up_catch.png";
    this.slowImg = new Image(0, 0);
    this.slowImg.src = "./res/Images/Powerups/power_up_slow.png";
    this.breakImg = new Image(0, 0);
    this.breakImg.src = "./res/Images/Powerups/power_up_break.png";
    this.disruptionImg = new Image(0, 0);
    this.disruptionImg.src = "./res/Images/Powerups/power_up_disruption.png";
    this.playerImg = new Image(0, 0);
    this.playerImg.src = "./res/Images/Powerups/power_up_player.png";


    /** @type {Array<{ Bricks: Array<{ type: string, position: { x: number, y: number }, width: number, height: number }> }>} */
    this.levels = [];
    //spawn enemies
    this.spawnMax = 5;
    this.spawnTimer1 = new Date();
    this.spawnTimer2;

    this.breakoutWallImg = new Image(0, 0);
    this.breakoutWallImg.src = "./res/Images/Scenes/border_pill_vertical.png";
    this.breakoutWallMove = false;
    this.breakoutPos = {
      x: this.worldBounds.maxX,
      y: this.worldBounds.maxY - 100
    };


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

    /**@type {Array<Ball>} */
    this.balls = [];
    this.balls.push(new Ball(100, 100, 20, 8));
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
      onKeyDown: this.onKeyDown.bind(this),
      onKeyUp: this.onKeyUp.bind(this)
    };
    window.addEventListener("keydown", this.events.onKeyDown, false);
    this.triple = false;
    window.addEventListener("keyup", this.events.onKeyUp, false);
    this.breakoutActive = false;
    this.catchPowerActive = false;
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
    } else if (this.menuManager.current.key === "Game Scene" && this.play) {
      if (!this.spawnKeyPressed) {
        this.spawnKeyPressed = true;
        const spawnPosition = { x: 300, y: 600 };
        const spawnSize = { x: 50, y: 50 };
        const spawnVelocity = { x: 0, y: 0.2 };
        if (event.keyCode === 49) { // Number 1
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.blue, "BLUE",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds
          ));
        } else if (event.keyCode === 50) { // Number 2
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.red, "RED",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds
          ));
        } else if (event.keyCode === 51) { // Number 3
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.green, "GREEN",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds
          ));
        } else if (event.keyCode === 52) { // Number 4
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.lightBlue, "LIGHT_BLUE",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds
          ));
        } else if(event.keyCode === 53) { // Number 5
          this.powerUps.push(new PowerUp(this.breakImg, "BREAK", 100, 100, 50, 25, this.worldBounds.maxY));
        }else if (event.keyCode === 54) { // Number 6
          this.powerUps.push(new PowerUp(this.disruptionImg, "DISRUPTION", 100, 200, 50, 25, this.worldBounds.maxY));
        }
        else if(event.keyCode === 32){
          if(this.balls[0].sticky){
            this.balls[0].sticky = false;
            this.spawnBallCountdown = 0;
            //calculate vector between ball and paddle
            var vectorBetweenBallAndPaddle = {
              x: this.balls[0].position.x + this.balls[0].radius - this.paddle.origin.x,
              y: this.balls[0].position.y + this.balls[0].radius - this.paddle.origin.y
            }

            //get angle
            var angle = Math.atan2(vectorBetweenBallAndPaddle.y, vectorBetweenBallAndPaddle.x);
            angle = VectorMath.toDeg(angle)

            this.balls[0].slowStartSpeed = 0;
            //make unit vector from angle
            var firingVectorUnit = VectorMath.vector(angle);
            //multiply by start speed
            var firingVector = {
              x: firingVectorUnit.x * this.ballStartSpeed,
              y: firingVectorUnit.y * this.ballStartSpeed
            }
            this.balls[0].velocity.x = firingVector.x;
            this.balls[0].velocity.y = firingVector.y;
            this.balls[0].offsetOnce = false;
            this.balls[0].speed = 8;
          }
        }
      }
    }
  }

  /** @param {KeyboardEvent} event */
  onKeyUp(event) {
    if (this.spawnKeyPressed) { this.spawnKeyPressed = false; }
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
      if (this.switchMusicType === false) {
        if (this.hasPlayed === true) {
          this.soundManager.stopAudio("GameMusic");
        }
        this.soundManager.playAudio("TitleMusic", true, 0.3);
        this.switchMusicType = true;
      }
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
        if (this.switchMusicType === true) {
          this.soundManager.stopAudio("TitleMusic");
          this.soundManager.playAudio("GameMusic", true, 0.3);
          this.switchMusicType = false;
          this.hasPlayed = true;
        }
        if (this.players.one.bricks.length <= 0) {
          this.soundManager.playAudio("levelComplete", false, 0.3);
          this.ballSpawning = true;
          this.powerups = [];
          this.currentLevelP1 += 1;
          this.setLevel(this.players.one, this.currentLevelP1);
        }
        if (this.players.two.bricks.length <= 0 && this.twoPlayerMode === true) {
          this.soundManager.playAudio("levelComplete", false, 0.3);
          this.ballSpawning = true;
          this.powerups = [];
          this.currentLevelP2 += 1;
          this.setLevel(this.players.two, this.currentLevelP2);
        }
        //reset bools
        this.pressedUp = true;
        this.pressedEnter = false;

        this.dnd.update();
        this.paddle.update(dt);
        this.balls.forEach((ball, index) => {
          this.ballUpdate(ball, index, dt);

          if ((this.isPlayerOne ? this.players.one.score : this.players.two.score) > this.highScore) {
            this.highScore = (this.isPlayerOne ? this.players.one.score : this.players.two.score);
          }
          this.bricks = this.isPlayerOne
            ? this.players.one.bricks
            : this.players.two.bricks;
          //update entities
          this.bricks.forEach((brick, index, array) => {
            this.updateBrick(brick, index, array,dt,  ball);
          });
          Collision.LasersToWorld(this.paddle.lasers, this.worldBounds.minY);


          //spawning enemies
          this.checkSpawnEnemies();

          this.enemies.forEach((enemy, index, array) => {
            this.updateEnemy(enemy, index, array, dt, ball);
          });
          this.powerUps.forEach((powerup, index, array) => {
            this.updatePowerup(powerup, index, array, dt, ball);
          });
          if (!this.ballSpawning) {
            Collision.BallToPaddle(ball, this.paddle, this.catchPowerActive);
          }
        });
      }
      this.checkBreakoutPower();
    }
  }
  render() {
    this.ctx.clearRect(0, 0, this.canvas.resolution.x, this.canvas.resolution.y);
    this.menuManager.draw(this.ctx);
    if (this.menuManager.current.key === "Main Menu") {

    }
    if (this.menuManager.current.key === "Game Scene") {
      this.ctx.drawImage(this.breakoutWallImg, this.breakoutPos.x, this.breakoutPos.y, 30, 70);

      this.paddle.draw(this.ctx);
      //this.ball.render(this.ctx);
      this.balls.forEach(ball => ball.render(this.ctx));
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
  ballUpdate(ball, index, dt) {

    if (this.ballSpawning) {
      this.spawnBallCountdown -= dt / 1000;

      if (!this.generatedRandomPaddlePos) {
        //generate random offset from centre of paddle
        this.randPaddlePos = Math.random() * this.paddle.size.x - (this.paddle.size.x / 2);
        this.generatedRandomPaddlePos = true;
      }
      //make balls position relative to the paddle
      ball.position.x = this.paddle.origin.x - (ball.radius / 2) + this.randPaddlePos;
      ball.position.y = this.paddle.colBox.position.y - (ball.radius);
      //when countdown is 0 fire ball at angle depending on position
      //relative to the paddle
      if (this.spawnBallCountdown <= 0) {

        //calculate vector between ball and paddle
        var vectorBetweenBallAndPaddle = {
          x: ball.position.x + ball.radius - this.paddle.origin.x,
          y: ball.position.y + ball.radius - this.paddle.origin.y
        }

        //get angle
        var angle = Math.atan2(vectorBetweenBallAndPaddle.y, vectorBetweenBallAndPaddle.x);
        angle = VectorMath.toDeg(angle)

        ball.slowStartSpeed = 0;
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
        ball.velocity.x = firingVector.x;
        ball.velocity.y = firingVector.y;
        ball.speed = this.ballStartSpeed;
        this.generatedRandomPaddlePos = false;
        this.spawnTimer1 = new Date();
      }
    }
    else {
      this.ballWorldCollision(ball, index);
      ball.update(dt);
    }
    if(ball.sticky)
    {
      if(this.paddle.origin.x >= ball.position.x && ball.offsetOnce === false)
      {
        ball.offset = this.paddle.origin.x - ball.position.x;
        ball.offsetOnce = true;
        ball.offset *= -1;
      }
      else if(ball.position.x > this.paddle.origin.x && ball.offsetOnce === false){
        ball.offset = ball.position.x - this.paddle.origin.x;
        ball.offsetOnce = true;
      }
      ball.velocity.x = 0;
      ball.velocity.y = 0;
      ball.speed = 0;
      //make balls position relative to the paddle
      // if(ball.offsetOnce === false)
      // {
        ball.position.x = ball.offset + this.paddle.origin.x - (ball.radius / 2) ;
        ball.position.y = this.paddle.colBox.position.y - (ball.radius);
      // }
    }
  }

  ballWorldCollision(ball, index) {
    if (ball.position.x + (ball.radius * 2) > this.worldBounds.maxX) {
      ball.flipVelX();
      ball.playWallBounce();
    }
    if (ball.position.x < this.worldBounds.minX) {
      ball.flipVelX();
      ball.playWallBounce();
    }
    if (ball.position.y > this.worldBounds.maxY) {
      ball.flipVelY();
      ball.playWallBounce();
    }
    if (ball.position.y < this.worldBounds.minY) {
      ball.flipVelY();
      ball.playWallBounce();
    }
    if (ball.position.y + (ball.radius * 2) > this.worldBounds.maxY) {
      if (this.balls.length === 1) {
        this.triple = false;
        this.ballSpawning = true;
        this.breakoutActive = false;
        this.paddle.enlargePowerActive = false;
        this.catchPowerActive = false;
        ball.img.src = "./res/Images/Ball/ball.png";
        ball.playDeathSound();
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
      else {
        this.balls.splice(index, 1);
      }
    }
  }
  checkSpawnPowerup(x, y) {
    this.randomNumGen = Math.floor((Math.random() * 100) + 1);
    if (this.randomNumGen >= 90) {
      this.randomNumGen = Math.floor((Math.random() * 7) + 1);
      if (this.randomNumGen === 1) {
        this.powerUp = new PowerUp(this.laserImg, "LASER", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 2) {
        this.powerUp = new PowerUp(this.enlargeImg, "ENLARGE", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 3) {
        this.powerUp = new PowerUp(this.catchImg, "CATCH", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 4) {
        this.powerUp = new PowerUp(this.slowImg, "SLOW", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 5) {
        this.powerUp = new PowerUp(this.breakImg, "BREAK", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 6) {
        this.powerUp = new PowerUp(this.disruptionImg, "DISRUPTION", x, y, 50, 25, this.worldBounds.maxY);
      }
      if (this.randomNumGen === 7) {
        this.powerUp = new PowerUp(this.playerImg, "PLAYER", x, y, 50, 25, this.worldBounds.maxY);
      }
      this.powerUps.push(this.powerUp);
    }
  }

  updateBrick(brick, index, array, dt, ball) {
    brick.update(dt);
    if (Collision.BallToBlock(ball, brick)) {

      if (brick.health <= 0)
        this.checkSpawnPowerup(brick.x + 12, brick.y);
    }
    Collision.LasersToBlock(this.paddle.lasers, brick);
    if (brick.health <= 0) {
      array.splice(index, 1);
      if (this.isPlayerOne) {
        this.players.one.score += brick.score;
      }
      else {
        this.players.two.score += brick.score;
      }
    }
    this.enemies.forEach(enemy => {
      Collision.EnemyToBlock(enemy, brick);
    });
  }

  /**
   * @param {Enemy} enemy
   * @param {number} index
   * @param {Array<Enemy>} array
   * @param {number} dt
   */
  updateEnemy(enemy, index, array, dt, ball) {
    enemy.update(dt);
    if (!enemy.isDying()) {
      if (!this.ballSpawning) {
        Collision.BallToEnemy(ball, enemy);
      }
      Collision.LasersToEnemy(this.paddle.lasers, enemy);
      Collision.PaddleToEnemy(this.paddle, enemy);
    }
    if (enemy.isDead()) {
      array.splice(index, 1);
      if (this.isPlayerOne) {
        this.players.one.score += 100;
      } else {
        this.players.two.score += 100;
      }
    }
  }


  /** Creates the enemy sprites and initiates the image loading process */
  createEnemySprites() {
    const sprites = {
      blue: new Image(EnemySpritesheetSize.width, EnemySpritesheetSize.height),
      lightBlue: new Image(EnemySpritesheetSize.width, EnemySpritesheetSize.height),
      red: new Image(EnemySpritesheetSize.width, EnemySpritesheetSize.height),
      green: new Image(EnemySpritesheetSize.width, EnemySpritesheetSize.height),
      explosion: new Image(EnemySpritesheetSize.width, EnemySpritesheetSize.height)
    };
    sprites.blue.id = "EnemyBlue";
    sprites.blue.src = EnemyType.BLUE;

    sprites.lightBlue.id = "EnemyLightBlue";
    sprites.lightBlue.src = EnemyType.LIGHT_BLUE;

    sprites.red.id = "EnemyRed";
    sprites.red.src = EnemyType.RED;

    sprites.green.id = "EnemyGreen";
    sprites.green.src = EnemyType.GREEN;

    sprites.explosion.id = "EnemyExplosion";
    sprites.explosion.src = "./res/Images/Enemies/enemy_explode.png";
    return sprites;
  }
  updatePowerup(powerup, index, array, dt, ball) {
    powerup.update(dt);
    if (Collision.PaddleToPowerUp(this.paddle, powerup) && powerup.active) {
      this.paddle.playPowerUpPickup();
      if (powerup.type === "LASER") {
        this.balls[0].sticky = false;
        if (this.paddle.enlargePowerActive) {
          this.paddle.enlargePowerActive = false;
        }
        if(this.catchPowerActive === true){
          this.catchPowerActive = false;
        }

        this.paddle.laserPowerActive = true;
        this.paddle.paddleAnimator.continue();
        powerup.active = false;
      }
      else if (powerup.type === "ENLARGE") {
        this.balls[0].sticky = false;
        if (this.paddle.laserPowerActive) {
          this.paddle.laserPowerActive = false;
        }
        if(this.catchPowerActive === true){
          this.catchPowerActive = false;
        }
        this.paddle.enlargePowerActive = true;
        powerup.active = false;
      }
      else if (powerup.type === "CATCH") {
        if (this.paddle.enlargePowerActive) {
          this.paddle.enlargePowerActive = false;
        }
        if (this.paddle.laserPowerActive) {
          this.paddle.laserPowerActive = false;
        }
        this.catchPowerActive = true;
        powerup.active = false;
      }
      else if (powerup.type === "SLOW") {
        this.ball.speed -= 3;
        //get angle
        this.ball.img.src = "./res/Images/Ball/ball_slow.png";
        powerup.active = false;
      }
      else if (powerup.type === "BREAK") {
        this.breakoutActive = true;
        powerup.active = false;
      }
      else if (powerup.type === "DISRUPTION") {
        if(this.catchPowerActive === true){
          this.catchPowerActive = false;
        }
        if (this.balls.length === 1) {
          this.triple = true;
          //calculate VectorMath.vector()
          var angle = Math.atan2(ball.velocity.y, ball.velocity.x);
          angle = VectorMath.toDeg(angle)
          //offset the angle
          var angle1 = angle - 10;
          var angle2 = angle + 10;
          //var firingVectorUnit = VectorMath.vector(angle);

          var vel1 = VectorMath.vector(angle1);
          var vel2 = VectorMath.vector(angle2);
          this.balls.push(new Ball(ball.position.x, ball.position.y, 20, ball.speed, vel1));
          this.balls.push(new Ball(ball.position.x, ball.position.y, 20, ball.speed, vel2));
        }
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
    this.powerUps = [];
    this.enemies = [];
    if (current >= this.levels.length) {
      console.log("Setting a level that doesn't exist in the loaded levels");
      this.menuManager.setCurrentScene("Main Menu");
    }
    else {
      playerToSet.bricks.splice(0);
      const currentLevel = this.levels[current];
      currentLevel.Bricks.forEach((brick, index) => {
        const id = brick.type + index.toString();
        playerToSet.bricks.push(new Brick(brick.type, id, brick.position.x, brick.position.y, brick.width, brick.height, current));
        this.bricks = playerToSet.bricks;
      });
    }
  }

  checkBreakoutPower(){
    if(this.breakoutActive){

      if(this.breakoutPos.y > this.worldBounds.maxY - 200){
        this.breakoutPos.y -= 2;
      }
      if(this.paddle.collidingWithBreakout){
        if(this.isPlayerOne){
          this.setLevel(this.players.one, this.currentLevelP1 + 1);
          this.currentLevelP1 += 1;
        }
        else{
          this.setLevel(this.playerImg.two, this.currentLevelP2 + 1);
          this.currentLevelP2 += 1;
        }
        this.breakoutActive = false;
        this.balls.splice(0);
        this.balls.push(new Ball(100, 100, 20, 8));
        this.ballSpawning = true;
      }
    }
    else{
      this.breakoutPos.y = this.worldBounds.maxY - 100;
    }
  }
  checkSpawnEnemies()
  {
    this.spawnTimer2 = new Date();
    if(this.spawnTimer1 -this.spawnTimer2 < - 10000 && this.enemies.length <= this.spawnMax)
    {
      const spawnPosition = { x: 300, y: -100 };
      const spawnSize = { x: 50, y: 50 };
      var randomSpawnVX = Math.floor((Math.random() * 3) + 1);
      const spawnVelocity = { x: randomSpawnVX, y: 1 };
      if(this.isPlayerOne)
      {
        if(this.currentLevelP1 === 0)
        {
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.blue, "BLUE",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds));
        }
        else if(this.currentLevelP1 === 1)
        {
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.red, "RED",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds));
        }
        else
        {
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.green, "GREEN",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds));
        }
      }
      else {
        if(this.currentLevelP2 === 0)
        {
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.blue, "BLUE",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds));
        }
        else if(this.currentLevelP2 === 1)
        {
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.red, "RED",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds));
        }
        else
        {
          this.enemies.push(new Enemy(this.enemySprites.explosion, this.enemySprites.green, "GREEN",
            spawnPosition, spawnVelocity, spawnSize.x, spawnSize.y, this.worldBounds));
        }
      }

      this.spawnTimer1 = new Date();
    }
  }
}
