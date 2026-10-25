/* =========================================================================
 * ASSET: ship artwork
 *
 * The player ship, drawn at the origin with its nose pointing up.
 * ========================================================================= */
'use strict';

/** The ship artwork, drawn at the origin with its nose pointing up (toward the planet). */
function drawShipShape(flameLength){
  if(flameLength>0){
    context.fillStyle='#ffb347';
    context.beginPath();context.moveTo(-3.5,8);context.lineTo(0,8+flameLength*13);context.lineTo(3.5,8);context.fill();
    context.fillStyle='#fff3b0';
    context.beginPath();context.moveTo(-1.8,8);context.lineTo(0,8+flameLength*7);context.lineTo(1.8,8);context.fill();
  }
  context.fillStyle='#ff5f7e';   // wings
  context.beginPath();context.moveTo(-4,0);context.lineTo(-11,10);context.lineTo(-3,7);context.fill();
  context.beginPath();context.moveTo(4,0);context.lineTo(11,10);context.lineTo(3,7);context.fill();
  context.fillStyle='#eaf0ff';   // body
  context.beginPath();
  context.moveTo(0,-13);context.quadraticCurveTo(7,-3,5,8);context.lineTo(-5,8);context.quadraticCurveTo(-7,-3,0,-13);
  context.fill();
  context.fillStyle='#2a3a7a';context.beginPath();context.arc(0,-3,3.2,0,TWO_PI);context.fill();   // window
  context.fillStyle='rgba(155,231,255,.9)';context.beginPath();context.arc(-.8,-4,1.2,0,TWO_PI);context.fill();
}
