
/**
 * Represents the paddle.
 */
class Paddle {
    constructor(posX, posY, minX, maxX) {
        this.position = {
            x: posX,
            y: posY
        };
        this.speed = 600.0;
        this.size = {
            x: 150,
            y: 50
        }

        this.colBox = {
            position :{
                x: posX + 10,
                y: posY + 10
            },
            size:{
                x: 130,
                y: 40
            }
        }
        this.leftPressed = false;
        this.rightPressed = false;
        this.spacePressed = false;

        this.maxX = maxX;
        this.minX = minX;
        this.origin = {
            x: this.position.x + this.size.x / 2,
            y: this.position.y + this.size.y / 2
        }

        this.events = {
            onKeyDown: this.onKeyDown.bind(this),
            onKeyUp: this.onKeyUp.bind(this)
        };
        this.paddleRect = new Square(this.position.x, this.position.y, this.size.x, this.size.y, "#095ee8");
        this.clampPaddleLeft = minX;
        this.clampPaddleRight = maxX;
        document.addEventListener("keydown", this.events.onKeyDown, false);
        document.addEventListener("keyup", this.events.onKeyUp, false);

        /**LASER POWERUP */
        this.laserPowerActive = false;
        /**ENLARGE POWERUP */
        this.enlargePowerActive = false;
        this.finishedEnlarging = false;

        /** @type {Array<Laser>} */
        this.lasers = [];

        //laser power related
        this.canFire = true;
        this.laserWidth = 10;
        this.laserHeight = 50;
        this.laserIndex = 0;

        this.defaultPaddleImg = new Image();
        this.defaultPaddleImg.src = "./res/Images/Player/paddle.png";

        this.laserPaddleImg = new Image();
        this.laserPaddleImg.src = "./res/Images/Player/laser_paddle.png";


        this.paddleAnimator = new AnimationManager();

        this.defaultToLaserSprite = {};
        this.defaultToLaserImage = new Image();

        this.defaultToLaserImage.addEventListener('load', () => {
            this.defaultToLaserSprite = new Animation(this.defaultToLaserImage, 307.54, 84, 24);
            this.paddleAnimator.addAnimation("defaultToLaser", this.defaultToLaserSprite);
            this.paddleAnimator.setScale("defaultToLaser", 0.65,0.7);
            this.paddleAnimator.isLooping("defaultToLaser",false);
            this.paddleAnimator.stop();
        });
        this.defaultToLaserImage.src = "./res/Images/Player/paddle_to_laser.png";

        /**Laser image */
        this.laserImg = new Image();
        this.laserImg.src = "./res/Images/Laser.png";

        this.soundManager = new AudioManager();
        this.soundManager.init();
        this.soundManager.loadSoundFile("paddle-sound-hit", "./res/Sounds/paddle-ball-hit.mp3");
        this.soundManager.loadSoundFile("power-up", "./res/Sounds/BlueShield.wav");
        this.soundManager.loadSoundFile("laser", "./res/Sounds/Shot.wav");
    }

    playPaddleHitSound() {
      this.soundManager.playAudio("paddle-sound-hit", false, 0.5);
    }

    playPowerUpPickup(){
        this.soundManager.playAudio("power-up", false, 0.5);
    }

    /**
     * update paddle logic.
     * @param {Number} dt
     * time since last update
     */
    update(dt) {


        //if only right arrow pressed
        if (this.rightPressed && !this.leftPressed) {
            //check if next step will be out of bounds if not move
            if (!((this.position.x + this.size.x) + this.speed * (dt / 1000) > this.maxX)) {
                this.paddleRect.x += this.speed * (dt / 1000);
            }
        }
        //if only left arrow pressed
        else if (this.leftPressed && !this.rightPressed) {
            if (!(this.position.x - this.speed * (dt / 1000) < this.minX)) {
                this.paddleRect.x -= this.speed * (dt / 1000);
            }
        }
        this.position.x = this.paddleRect.x;
        this.position.y = this.paddleRect.y;
        if (this.position.x < this.clampPaddleLeft) {
            this.position.x = this.clampPaddleLeft;
            this.paddleRect.x = this.clampPaddleLeft;
        }
        else if (this.position.x + this.size.x > this.clampPaddleRight) {
            this.position.x = this.clampPaddleRight - this.size.x;
            this.paddleRect.x = this.clampPaddleRight - this.size.x;
        }
        this.lasers.forEach((laser) => {
            laser.update(dt);
        });
        this.colBox.position.x = this.position.x;
        this.updateOrigin();


        if(this.enlargePowerActive){
            if(!this.finishedEnlarging && this.size.x < 250){
                this.colBox.size.x += 3.0;
                this.size.x += 3.0;
            }
        }
        else if(!this.enlargePowerActive && this.size.x > 150){
            this.finishedEnlarging = false;
            this.size.x = 150.0;
            this.colBox.size.x = 130.0;
        }
        if (this.laserPowerActive) {
            if (this.spacePressed && this.canFire) {
                this.lasers.push(new Laser(this.laserImg,
                    this.position.x + 35,
                    this.position.y,
                    this.laserWidth,
                    this.laserHeight,
                    "Laser" + this.laserIndex)
                );
                this.soundManager.playAudio("laser", false, 0.5);
                this.laserIndex++;

                this.lasers.push(new Laser(this.laserImg,
                    this.position.x + (this.size.x - this.laserWidth) - 35,
                    this.position.y,
                    this.laserWidth,
                    this.laserHeight,
                    "Laser" + this.laserIndex)
                );
                this.laserIndex++;

                this.canFire = false;
            }
            if(this.paddleAnimator.isPlaying()){
                this.paddleAnimator.update(dt, this.origin.x, this.origin.y);
            }

        }

        /**
         * code to run when collide with laser powerup
         *              if(!this.laserPowerActive){
                this.paddleAnimator.isReversing("defaultToLaser", false);
                this.laserPowerActive = true;
                this.paddleAnimator.continue();
            }

         */


    }

    /**
     * draw the paddle
     * @param {CanvasRenderingContext2D} ctx
     * canvas we want to draw to
     */
    draw(ctx) {

        this.lasers.forEach(function (laser) {
            laser.draw(ctx);
        });
        ctx.save()
        if(this.laserPowerActive)
        {
            if(this.paddleAnimator.isPlaying()){
                this.paddleAnimator.draw(ctx);
            }
            else{
                //draw laser image
                ctx.drawImage(this.laserPaddleImg, this.position.x, this.position.y, this.size.x, this.size.y);
            }
        }
        else{
            ctx.drawImage(this.defaultPaddleImg, this.position.x, this.position.y, this.size.x, this.size.y);
        }
        ctx.restore();

    }

    /**
     * This is the function that detect key presses.
     * @param {KeyboardEvent} event
     * the key down event
     */
    onKeyDown(event) {
        //left arrow key
        if (event.keyCode === 37) {
            this.leftPressed = true;
        }
        //right arrow key
        if (event.keyCode === 39) {
            this.rightPressed = true;
        }
        if (event.keyCode === 32) {
            this.spacePressed = true;
        }
    }

    /**
     * This is the function that detects a key being released.
     * @param {KeyboardEvent} event
     * the keyboard up event.
     */
    onKeyUp(event) {
        //left arrow key
        if (event.keyCode === 37) {
            this.leftPressed = false;
        }
        //right arrow key
        if (event.keyCode === 39) {
            this.rightPressed = false;
        }
        if (event.keyCode === 32) {
            this.canFire = true;
            this.spacePressed = false;
        }
    }

    updateOrigin() {
        this.origin.x = this.position.x + this.size.x / 2;
        this.origin.y = this.position.y + this.size.y / 2;
    }

}
