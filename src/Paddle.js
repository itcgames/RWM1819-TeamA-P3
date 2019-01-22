
/**
 * Represents the paddle.
 */
class Paddle {
    constructor(posX,posY, minX, maxX){
        this.position = {
            x: posX,
            y: posY
        };
        this.speed = 500.0;
        this.size = {
            x: 150,
            y: 50
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
        this.clampPaddleLeft = 100;
        this.clampPaddleRight = 800;
        document.addEventListener("keydown", this.events.onKeyDown, false);
        document.addEventListener("keyup", this.events.onKeyUp, false);

        this.laserPowerActive = false;


        //laser power related
        this.canFire = true;

    }

    /**
     * update paddle logic.
     * @param {Number} dt 
     * time since last update
     */
    update(dt){

        if(this.laserPowerActive){
            if(this.spacePressed){

            }
        }

        //if only right arrow pressed
        if(this.rightPressed && !this.leftPressed){
            //check if next step will be out of bounds if not move
            if(!((this.position.x + this.size.x) + this.speed * (dt/1000) > this.maxX)){
                this.paddleRect.x += this.speed * (dt/1000);
            }
        }
        //if only left arrow pressed
        else if(this.leftPressed && !this.rightPressed){
            if(!(this.position.x - this.speed * (dt/1000) < this.minX)){
                this.paddleRect.x -= this.speed * (dt/1000);
            }       
         }
         this.position.x = this.paddleRect.x;
         this.position.y = this.paddleRect.y;
         if (this.position.x < this.clampPaddleLeft){
           this.position.x = this.clampPaddleLeft;
           this.paddleRect.x = this.clampPaddleLeft;
         }
         else if (this.position.x > this.clampPaddleRight){
           this.position.x = this.clampPaddleRight;
           this.paddleRect.x = this.clampPaddleRight;
         }
         this.updateOrigin();

    }

    /**
     * draw the paddle
     * @param {CanvasRenderingContext2D} ctx 
     * canvas we want to draw to
     */
    draw(ctx){

      ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.stroke();

    }

    /**
     * This is the function that detect key presses.
     * @param {KeyboardEvent} event 
     * the key down event
     */
    onKeyDown(event){
        //left arrow key
        if(event.keyCode === 37) {
            this.leftPressed = true;
        }
        //right arrow key
        if(event.keyCode === 39){
            this.rightPressed = true;
        }
        if(event.keyCode === 32){
            this.canFire = false;
            this.spacePressed = true;
        }
    }

    /**
     * This is the function that detects a key being released.
     * @param {KeyboardEvent} event 
     * the keyboard up event.
     */
    onKeyUp(event){
        //left arrow key
        if(event.keyCode === 37) {
            this.leftPressed = false;
        }
        //right arrow key
        if(event.keyCode === 39){
            this.rightPressed = false;
        }
        if(event.keyCode === 32){
            this.canFire = true;
            this.spacePressed = false;
        }
    }

    updateOrigin(){
        this.origin.x = this.position.x + this.size.x / 2;
        this.origin.y = this.position.y + this.size.y / 2;
    }
    
}