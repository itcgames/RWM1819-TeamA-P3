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
     * @param {{ position: { x: number, y: number }, radius: number }, velocity: { x: number, y: number }} ball 
     *  Ball object is expected to have a position and radius properties.
     * @param {{ position: { x: number, y: number }, width: number, height: number }} block 
     *  block is expected to have a position, width and height.
     */
    static BallToBlock(ball, block) {
      const aabb = rectangleToAabb(block);
      const result = collisions.maniCircleToAABB(ball, aabb);
      if (result.collision) {
        ball.position = {
            x: ball.position.x + result.manifest.circle.distance.x,
            y: ball.position.y + result.manifest.circle.distance.y
        };
        const direction = {
            x: block.position.x - ball.position.x,
            y: block.position.y - ball.position.y
        };
        if (direction.x > 0) {

        }
      }
    }
  }
  return Collision;
})();