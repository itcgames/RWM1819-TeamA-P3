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

  /** @param {{ left: number, top: number, right: number, bottom: number }} direction */
  function pickAbsoluteSmallestDirection(direction) {
    const dir = {
      left: Math.abs(direction.left), top: Math.abs(direction.top),
      right: Math.abs(direction.right), bottom: Math.abs(direction.bottom)
    };
    const min = Math.min(dir.left, dir.top, dir.right, dir.bottom);
    return min === dir.left ? { x: direction.left, y: 0}
      : (min === dir.top ? { x: 0, y: direction.top }
      : (min === dir.right ? { x: direction.right, y: 0 }
      : { x: 0, y: direction.bottom }));
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
      /** @type {{x: number, y: number, w: number, h: number }} */
      const rectBall = { x: ball.position.x, y: ball.position.y, w: ball.radius, h: ball.radius };
      const rectBlock = { x: block.x, y: block.y, w: block.width, h: block.height };

      if (
        rectBall.x < rectBlock.x + rectBlock.w &&
        rectBall.x + rectBall.w > rectBlock.x &&
        rectBall.y < rectBlock.y + rectBlock.h &&
        rectBall.y + rectBall.h > rectBlock.y
      ) {
        const response = {
          left: rectBlock.x - (rectBall.x + rectBall.w),
          top: (rectBlock.y + rectBlock.h) - rectBall.y,
          right: (rectBlock.x + rectBlock.w) - rectBall.x,
          bottom: rectBlock.y - (rectBall.y + rectBall.h)
        };
        const result = pickAbsoluteSmallestDirection(response);
        if (result.x !== 0) {
          ball.velocity.x = (result.x > 0) ? Math.abs(ball.velocity.x)
            : -Math.abs(ball.velocity.x);
        }
        if (result.y !== 0) {
          ball.velocity.y = (result.y > 0) ? Math.abs(ball.velocity.y)
            : -Math.abs(ball.velocity.y)
        }
        ball.position = {
          x: ball.position.x + result.x,
          y: ball.position.y + result.y
        };
        block.damage();
        block.playDestroySound();
        ball.playBlockBounce();
        return true;
      }
      return false;
    }
    /**
     * Will process collisions between enemy and rectangle.
     * @param {Enemy} enemy
     *  enemy object is expected to have a position and velocity properties.
     * @param {Brick} block
     *  block is expected to have a position, width and height.
     */
    static EnemyToBlock(enemy, block) {
      const aabbEnemy = rectangleToAabb({ position: enemy.position, width: enemy.width, height: enemy.height });
      const aabbBlock = rectangleToAabb({ position: { x: block.x, y: block.y }, width: block.width, height: block.height });
      const result = collisions.maniAABBToAABB(aabbEnemy, aabbBlock);
      if (result.collision) {
        // hotfix for the inaccuracy of floating point numbers
        const direction = {
          x: result.manifest.leftAABB.distance.x * 1.05,
          y: result.manifest.leftAABB.distance.y * 1.05
        };
        enemy.velocity = {
          x: (direction.x !== 0) ? -enemy.velocity.x : enemy.velocity.x,
          y: (direction.y !== 0) ? -enemy.velocity.y : enemy.velocity.y
        };
        enemy.position = {
          x: enemy.position.x + enemy.velocity.x + direction.x,
          y: enemy.position.y + enemy.velocity.y + direction.y
        };

      }
    }
    /**
   * Will process collisions between ball and rectangle.
   * @param {Ball} ball
   *  Ball object is expected to have a position and radius properties.
   * @param {Paddle} paddle
   *  block is expected to have a position, width and height.
   */
    static BallToPaddle(ball, paddle, catchPowerActive) {
      const aabbBall = rectangleToAabb({ position: ball.position, width: ball.radius, height: ball.radius });
      const aabbPaddle = rectangleToAabb({ position: { x: paddle.colBox.position.x, y: paddle.colBox.position.y }, width: paddle.colBox.size.x, height: paddle.colBox.size.y });
      const result = collisions.maniAABBToAABB(aabbBall, aabbPaddle);
      if (result.collision) {
        var vectorBetweenBallAndPaddle = {
          x: ball.position.x + ball.radius - paddle.origin.x,
          y: ball.position.y + ball.radius - paddle.origin.y
        }

        //get angle
        var angle = Math.atan2(vectorBetweenBallAndPaddle.y, vectorBetweenBallAndPaddle.x);
        angle = VectorMath.toDeg(angle)

        //make unit vector from angle
        var firingVectorUnit = VectorMath.vector(angle);
        //multiply by speed
        ball.speed += 0.2;
        if (ball.speed > ball.slowStartSpeed && ball.slowStartSpeed != 0) {
          ball.img.src = "./res/Images/Ball/ball.png";
          ball.slowStartSpeed = 0;
        }
        var firingVector = {
          x: firingVectorUnit.x * ball.speed,
          y: firingVectorUnit.y * ball.speed
        }
        if(catchPowerActive === false)
        {
          ball.velocity.x = firingVector.x;
          ball.velocity.y = firingVector.y;
        }
        else {
          ball.sticky = true;
        }
        paddle.playPaddleHitSound();
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
      const aabbBlock = rectangleToAabb({ position: { x: enemy.position.x, y: enemy.position.y }, width: enemy.width, height: enemy.height });
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
    static LaserToBlock(laser, block) {
      const aabbLaser = rectangleToAabb({ position: laser.position, width: laser.width, height: laser.height });
      const aabbBlock = rectangleToAabb({ position: { x: block.x, y: block.y }, width: block.width, height: block.height });
      const result = collisions.maniAABBToAABB(aabbLaser, aabbBlock);

      if (result.collision) {
        block.damage();
        block.playDestroySound();
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
    static LasersToWorld(lasers, minY) {
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
    static LasersToEnemy(lasers, enemy) {
      lasers.forEach((laser, index, array) => {
        if (Collision.LaserToEnemyCol(laser, enemy)) {
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
    static LaserToEnemyCol(laser, enemy) {
      const aabbLaser = rectangleToAabb({ position: laser.position, width: laser.width, height: laser.height });
      const aabbEnemy = rectangleToAabb({ position: { x: enemy.position.x, y: enemy.position.y }, width: enemy.width, height: enemy.height });

      const result = collisions.maniAABBToAABB(aabbLaser, aabbEnemy);

      if (result.collision) {
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
      const aabbEnemy = rectangleToAabb({ position: enemy.position, width: enemy.width, height: enemy.height });

      if (collisions.boolAABBToAABB(aabbPaddle, aabbEnemy)) {
        enemy.die();
      }
    }

    static PaddleToPowerUp(paddle, powerup) {
      const aabbPaddle = rectangleToAabb({ position: paddle.position, width: paddle.size.x, height: paddle.size.y });
      const aabbPowerUp = rectangleToAabb({ position: powerup.position, width: powerup.width, height: powerup.height });
      return collisions.boolAABBToAABB(aabbPaddle, aabbPowerUp);
    }
  }
  return Collision;
})();
