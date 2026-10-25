/* =========================================================================
 * EFFECTS: particles, popups and banners
 *
 * Short-lived visual extras: explosion sparks, confetti, "+10" popups and the big centre banner.
 * ========================================================================= */
'use strict';

function spawnParticle(x,y,color,size,life,velocityX,velocityY){
  particles.push({x,y,vx:velocityX,vy:velocityY,life,maxLife:life,size,color});
}
function spawnExplosion(x,y){
  const colors=['#ffc857','#ff5f7e','#ffffff','#ff9a62'];
  for(let i=0;i<34;i++){
    const direction=randomBetween(0,TWO_PI),speed=randomBetween(40,220);
    spawnParticle(x,y,colors[i%4],randomBetween(2,5),randomBetween(.5,1),Math.cos(direction)*speed,Math.sin(direction)*speed);
  }
}
function spawnConfetti(){
  const colors=['#5ef2d0','#ffc857','#ff5f7e','#9be7ff','#ffffff'];
  for(let i=0;i<80;i++){
    spawnParticle(randomBetween(0,LOGICAL_WIDTH),randomBetween(-60,0),colors[i%5],randomBetween(2,4),randomBetween(1.8,2.8),randomBetween(-30,30),randomBetween(60,170));
  }
}
function spawnFloatingText(text,color){
  const position=polarToScreen(ship.radius,ship.angle);
  floatingTexts.push({x:position.x,y:position.y-24,age:0,text,color});
}
function showBanner(text,subtitle,duration){
  banner={text,subtitle,elapsed:0,duration:duration||1.7};
}
