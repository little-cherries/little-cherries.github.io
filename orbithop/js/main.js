/* =========================================================================
 * MAIN: start-up and the game loop
 *
 * Runs last. Builds the first level and starts the frame loop.
 * ========================================================================= */
'use strict';

resizeCanvas();
buildOrbits();
generatePlanetFeatures();
ship.angle=camera.angle=0;

let lastTimestamp=0;
function gameLoop(timestamp){
  // Cap the time step so a background tab doesn't cause a huge jump.
  const deltaTime=Math.min(.033,lastTimestamp?(timestamp-lastTimestamp)/1000:.016);
  lastTimestamp=timestamp;
  updateGame(deltaTime);
  drawFrame();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
