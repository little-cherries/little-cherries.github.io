/* =========================================================================
 * RENDER: one complete frame
 *
 * Clears the canvas, scales to logical units, then draws world, HUD and overlays in order.
 * ========================================================================= */
'use strict';

/** Draws one complete frame: background, world, HUD, then any overlay screen. */
function drawFrame(){
  // Clear the whole canvas, including the side margins on wide windows.
  context.setTransform(1,0,0,1,0,0);
  context.fillStyle='#04050d';
  context.fillRect(0,0,canvas.width,canvas.height);

  // Switch to logical units and clip to the phone-shaped play area.
  context.save();
  context.translate(gameOffsetX,0);
  context.scale(pixelsPerUnit,pixelsPerUnit);
  context.beginPath();context.rect(0,0,LOGICAL_WIDTH,logicalHeight);context.clip();

  const background=context.createLinearGradient(0,0,0,logicalHeight);
  background.addColorStop(0,'#0c1236');
  background.addColorStop(1,'#04050f');
  context.fillStyle=background;
  context.fillRect(0,0,LOGICAL_WIDTH,logicalHeight);

  // World layer (shaken after a crash; the HUD is not).
  context.save();
  if(screenShake>.1)context.translate(randomBetween(-screenShake,screenShake),randomBetween(-screenShake,screenShake));
  const planetX=LOGICAL_WIDTH/2;
  const planetY=shipScreenY()-camera.radius;   // the planet slides down the screen as the ship gets closer
  drawStars(planetX);
  drawPlanet(planetX,planetY);
  drawOrbits(planetX,planetY);
  drawLandingPads();
  drawObstacles(planetX,planetY);
  drawShip();
  drawParticles();
  context.restore();

  if(gameState!=='title')drawHud();
  drawBanner();
  if(gameState==='title')drawTitleScreen();
  if(gameState==='over')drawGameOverScreen();
  context.restore();
}
