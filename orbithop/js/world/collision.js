/* =========================================================================
 * WORLD: collisions and coordinate conversion
 *
 * Hit testing between the ship and obstacles, finding a safe respawn spot,
 * and converting world positions (orbit + angle) into screen positions.
 * ========================================================================= */
'use strict';

/** True if a ship at this angle on this orbit would touch any obstacle. */
function collidesWithObstacle(orbit,shipAngle,shipRadius){
  shipRadius=shipRadius||SHIP_HIT_RADIUS;
  for(const obstacle of orbit.obstacles){
    const obstacleAngle=obstacle.baseAngle+orbit.rotationOffset;
    // Quick reject: skip obstacles that are far away along the orbit.
    if(Math.abs(angleDifference(obstacleAngle,shipAngle))*orbit.radius>70)continue;
    for(const [offsetAlongOrbit,circleRadius] of HIT_CIRCLES_BY_KIND[obstacle.kind]){
      const radius=obstacle.kind==='meteor'?obstacle.size*.88:circleRadius;
      const circleAngle=obstacleAngle+offsetAlongOrbit/orbit.radius;
      // Straight-line distance between two points on the same circle.
      const distance=2*orbit.radius*Math.sin(Math.abs(angleDifference(circleAngle,shipAngle))/2);
      if(distance<shipRadius+radius)return true;
    }
  }
  return false;
}
/** After a crash, find the nearest angle on the orbit with plenty of empty space. */
function findSafeAngle(orbitIndex,preferredAngle){
  const orbit=orbits[orbitIndex];
  if(orbit.type==='safe')return preferredAngle;
  for(let attempt=0;attempt<400;attempt++){
    // Try 0, then 1 step to each side, then 2 steps, and so on.
    const step=Math.ceil(attempt/2)*(14/orbit.radius)*(attempt%2?1:-1);
    if(!collidesWithObstacle(orbit,preferredAngle+step,24))return preferredAngle+step;
  }
  return preferredAngle;
}
/**
 * Which orbit's obstacles can hurt the ship right now?
 * While hopping, the ship is "on" the starting orbit for the first half and the
 * destination orbit for the second half. Returns -1 when nothing can hit it.
 */
function orbitForCollision(){
  const move=ship.move;
  if(!move)return ship.orbit;
  const progress=move.elapsed/move.duration;
  if(move.toOrbit>=orbitCount)return progress<.5?move.fromOrbit:-1;   // landing on the planet
  return progress<.5?move.fromOrbit:move.toOrbit;
}
/** Converts a world position (orbit radius + angle) to a screen position. */
function polarToScreen(radius,angle){
  const relativeAngle=angleDifference(angle,camera.angle);
  return{
    x:LOGICAL_WIDTH/2+radius*Math.sin(relativeAngle),
    y:shipScreenY()-camera.radius+radius*Math.cos(relativeAngle),
    relativeAngle
  };
}
