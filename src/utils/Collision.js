const Collision = (function () {

  /**
   * Collision manager externally acquired via library 'RWM1819-Collision-B'.
   * @type {{ boolCircleToCircle: (left: { position: {x: number, y: number}, radius: number }, right: { position: {x: number, y: number}, radius: number }) => boolean, maniCircleToCircle: (left: { position: {x: number, y: number}, radius: number }, right: { position: {x: number, y: number}, radius: number }) => { collision: boolean, manifest: { leftCircleDistance: {x: number, y: number}, rightCircleDistance: {x: number, y: number} } }, boolAABBToAABB: (left: Array<{ x: number, y: number }>, right: Array<{ x: number, y: number }>) => boolean, maniAABBToAABB: (left: Array<{ x: number, y: number }>, right: Array<{ x: number, y: number }>) => { collision: boolean, manifest: { leftAABB: { distance: {x: number, y: number} }, rightAABB: { distance: {x: number, y: number} } }}, boolCircleToAABB: (circle: { position: {x: number, y: number }, radius: number }, aabb: Array<{ x: number, y: number }>) => boolean, maniCircleToAABB: (circle: { position: {x: number, y: number }, radius: number }, aabb: Array<{ x: number, y: number }>) => { collision: boolean, manifest: { circle: { distance: { x: number, y: number }}, aabb: { distance: { x: number, y: number }}} } }}
   */
  const collisions = collisionManager;

  /**
   * Converts a rectangle into a axis aligned bounding box.
   * @param {{ position: { x: number, y: number }, width: number, height: number }} rect
   * @returns {Array<{ x: number, y: number }>} axis aligned bounding box,
   *  an array of positions of size 4.
   */
  function rectangleToAabb(rect) {
    return [
      { x: rect.position.x, y: rect.position.y },
      { x: rect.position.x + rect.width, y: rect.position.y },
      { x: rect.position.x + rect.width, y: rect.position.y + rect.height },
      { x: rect.position.x, y: rect.position.y + rect.height }
    ];
  }

  class Collision {

    /**
     * Will process collisions between ball and rectangle.
     * @param {Ball} ball
     *  Ball object is expected to have a position and radius properties.
     * @param {Brick} block
     *  block is expected to have a position, width and height.
     */
    static BallToBlock(ball, block) {
      const aabbBall = rectangleToAabb({ position: ball.position, width: ball.radius, height: ball.radius });
      const aabbBlock = rectangleToAabb({ position: { x: block.x, y: block.y }, width: block.width, height: block.height });
      const result = collisions.maniAABBToAABB(aabbBall, aabbBlock);
      if (result.collision) {
        ball.position = {
          x: ball.position.x + result.manifest.leftAABB.distance.x,
          y: ball.position.y + result.manifest.leftAABB.distance.y
        };
        const direction = {
          x: result.manifest.leftAABB.distance.x,
          y: result.manifest.leftAABB.distance.y
        };
        ball.velocity = {
          x: (direction.x !== 0) ? -ball.velocity.x : ball.velocity.x,
          y: (direction.y !== 0) ? -ball.velocity.y : ball.velocity.y
        };
        block.damage();
      }
    }
      /**
     * Will process collisions between ball and rectangle.
     * @param {Ball} ball
     *  Ball object is expected to have a position and radius properties.
     * @param {Paddle} paddle
     *  block is expected to have a position, width and height.
     */
    static BallToPaddle(ball, paddle) {
      const aabbBall = rectangleToAabb({ position: ball.position, width: ball.radius, height: ball.radius });
      const aabbPaddle = rectangleToAabb({ position: { x: paddle.position.x, y: paddle.position.y }, width: paddle.size.x, height: paddle.size.y });
      const result = collisions.maniAABBToAABB(aabbBall, aabbPaddle);
      if (result.collision) {
        /*ball.position = {
          x: ball.position.x + result.manifest.leftAABB.distance.x,
          y: ball.position.y + result.manifest.leftAABB.distance.y
        };
        const direction = {
          x: result.manifest.leftAABB.distance.x,
          y: result.manifest.leftAABB.distance.y
        };
        */
        var vectorBetweenBallAndPaddle = {
          x: ball.position.x + ball.radius - paddle.origin.x,
          y: ball.position.y + ball.radius - paddle.origin.y
        }

        //get angle
        var angle = Math.atan2(vectorBetweenBallAndPaddle.y, vectorBetweenBallAndPaddle.x);
        angle = VectorMath.toDeg(angle)

        //make unit vector from angle
        var firingVectorUnit = VectorMath.vector(angle);
        //multiply by start speed
        var firingVector = {
          x: firingVectorUnit.x * ball.speed,
          y: firingVectorUnit.y * ball.speed
        }
        ball.velocity.x = firingVector.x;
        ball.velocity.y = firingVector.y;
        /*if (ball.velocity.y > 0)
        {
          console.log("negative bounce");
        }
        */

      }
    }
    /**
     * Will process collisions between ball and rectangle.
     * @param {Ball} ball
     *  Ball object is expected to have a position and radius properties.
     * @param {Enemy} enemy
     *  enemy is expected to have a position, width and height.
     */
    static BallToEnemy(ball, enemy) {
      const aabbBall = rectangleToAabb({ position: ball.position, width: ball.radius, height: ball.radius });
      const aabbBlock = rectangleToAabb({ position: { x: enemy.x, y: enemy.y }, width: enemy.width, height: enemy.height });
      const result = collisions.maniAABBToAABB(aabbBall, aabbBlock);
      if (result.collision) {
        ball.position = {
          x: ball.position.x + result.manifest.leftAABB.distance.x,
          y: ball.position.y + result.manifest.leftAABB.distance.y
        };
        const direction = {
          x: result.manifest.leftAABB.distance.x,
          y: result.manifest.leftAABB.distance.y
        };
        ball.velocity = {
          x: (direction.x !== 0) ? -ball.velocity.x : ball.velocity.x,
          y: (direction.y !== 0) ? -ball.velocity.y : ball.velocity.y
        };
        enemy.die();
      }
    }

    /**
     * Deals with block to laser collision detection
     * @param {Laser} laser 
     * laser to check against
     * @param {Brick} block 
     * block to check against
     */
    static LaserToBlock(laser, block){
      const aabbLaser = rectangleToAabb({position: laser.position, width: laser.width, height: laser.height});
      const aabbBlock = rectangleToAabb({ position: { x: block.x, y: block.y }, width: block.width, height: block.height });
      const result = collisions.maniAABBToAABB(aabbLaser, aabbBlock);

      if(result.collision){
        block.damage();
        return true;
      }
      return false;
    }

    /**
     * Collisions between lasers an blocks
     * @param {Array<Laser>} lasers 
     * lasers array
     * @param {Brick} block
     * block to check collision against 
     */
    static LasersToBlock(lasers, block) {
      lasers.forEach((laser, index, array) => {
        if (Collision.LaserToBlock(laser, block)) {
          array.splice(index, 1);
        }
      });
    }

    /**
     * Check collision against world
     * @param {Array<Laser>} lasers 
     * lasers array
     * @param {Brick} minY
     * top y value of the border of the game 
     */
    static LasersToWorld(lasers, minY){
      lasers.forEach((laser, index, array) => {
        if (laser.position.y < minY) {
          array.splice(index, 1);
        }
      });
    }

    /**
     * method that deals with collision between lasers and an enemy.
     * @param {Array<Laser>} lasers 
     * laser array
     * @param {Enemy} enemy
     * enemy to check against 
     */
    static LasersToEnemies(lasers, enemy){
      lasers.forEach((laser,index,array) =>{
        if(Collision.LaserToEnemyCol(laser,enemy)){
          array.splice(index, 1);
          enemy.die();
        }
      });
    }

    /**
     * Collision between laser and enemy detection
     * @param {Laser<Array>} laser 
     * the laser array
     * @param {Enemy} enemy 
     * enemy being checked against
     * @returns {boolean}
     * returns true on collision
     */
    static LaserToEnemyCol(laser,enemy){
      const aabbLaser = rectangleToAabb({ position: laser.position, width: laser.width, height: laser.height });
      const aabbEnemy = rectangleToAabb({ position: { x: enemy.x, y: enemy.y }, width: enemy.width, height: enemy.height });

      const result = collisions.maniAABBToAABB(aabbLaser, aabbEnemy);

      if(result.collision){
        return true;
      }
      return false;
    }

    /**
     * @param {Paddle} paddle 
     * @param {Enemy} enemy 
     */
    static PaddleToEnemy(paddle, enemy) {
      const aabbPaddle = rectangleToAabb({ position: { x: paddle.position.x, y: paddle.position.y }, width: paddle.size.x, height: paddle.size.y });
      const aabbEnemy = rectangleToAabb({ position: { x: enemy.x, y: enemy.y }, width: enemy.width, height: enemy.height });

      if (collisions.boolAABBToAABB(aabbPaddle, aabbEnemy)) {
        enemy.die();
      }
    }
  }
  return Collision;
})();
