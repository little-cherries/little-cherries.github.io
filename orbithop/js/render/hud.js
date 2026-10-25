/* =========================================================================
 * RENDER: HUD and menu screens
 *
 * Score, lives, level, progress track, mute button, banner, title screen and game-over screen.
 * ========================================================================= */
'use strict';

function muteButtonCenter(){
  return{x:LOGICAL_WIDTH-28,y:safeTopUnits+14+22};
}
function drawMuteButton(centerX,centerY){
  context.strokeStyle='rgba(234,240,255,.55)';
  context.fillStyle='rgba(234,240,255,.85)';
  context.lineWidth=1.5;
  context.beginPath();context.arc(centerX,centerY,16,0,TWO_PI);context.stroke();
  // Speaker shape.
  context.beginPath();
  context.moveTo(centerX-7,centerY-3);context.lineTo(centerX-3,centerY-3);context.lineTo(centerX+2,centerY-7);
  context.lineTo(centerX+2,centerY+7);context.lineTo(centerX-3,centerY+3);context.lineTo(centerX-7,centerY+3);
  context.closePath();context.fill();
  if(soundMuted){
    context.strokeStyle='#ff5f7e';context.lineWidth=2;
    context.beginPath();context.moveTo(centerX-9,centerY+9);context.lineTo(centerX+9,centerY-9);context.stroke();
  }else{
    context.lineWidth=1.5;
    context.beginPath();context.arc(centerX+2,centerY,5,-.9,.9);context.stroke();
    context.beginPath();context.arc(centerX+2,centerY,9,-.9,.9);context.stroke();
  }
}
function drawHud(){
  const top=safeTopUnits+14;
  const style=planetStyleForLevel();
  drawText('SCORE',16,top+10,10,'rgba(234,240,255,.6)','left',700);
  drawText(String(score),16,top+34,26,'#eaf0ff','left',800);
  // Lives as little ships; spent lives are faded.
  for(let i=0;i<3;i++){
    context.save();
    context.globalAlpha=i<lives?1:.25;
    context.translate(24+i*22,top+58);
    context.scale(.7,.7);
    drawShipShape(0);
    context.restore();
  }
  drawText('LEVEL '+level,LOGICAL_WIDTH/2,top+22,13,'rgba(234,240,255,.85)','center',800);
  drawText('BEST '+bestScore,LOGICAL_WIDTH/2,top+38,10,'rgba(234,240,255,.5)','center',700);
  const muteButton=muteButtonCenter();
  drawMuteButton(muteButton.x,muteButton.y);

  // Progress track on the left edge: planet at the top, start at the bottom.
  const trackTop=top+96,trackBottom=logicalHeight*.66;
  const progress=clamp((orbitRadii[0]-ship.radius)/(orbitRadii[0]-PLANET_RADIUS),0,1);
  context.strokeStyle='rgba(234,240,255,.22)';context.lineWidth=2;
  context.beginPath();context.moveTo(16,trackTop);context.lineTo(16,trackBottom);context.stroke();
  for(let i=0;i<=orbitCount;i++){   // one tick per orbit
    const y=lerp(trackBottom,trackTop,i/orbitCount);
    context.fillStyle='rgba(234,240,255,.3)';context.fillRect(13,y-.5,6,1);
  }
  context.fillStyle=style.glowColor;context.beginPath();context.arc(16,trackTop-9,6,0,TWO_PI);context.fill();
  context.fillStyle='#5ef2d0';context.beginPath();context.arc(16,lerp(trackBottom,trackTop,progress),4.5,0,TWO_PI);context.fill();
}
function drawBanner(){
  if(!banner)return;
  // Fade in over 0.2s and fade out over the last 0.3s.
  const opacity=clamp(Math.min(banner.elapsed/.2,(banner.duration-banner.elapsed)/.3),0,1);
  context.globalAlpha=opacity;
  drawText(banner.text,LOGICAL_WIDTH/2,logicalHeight*.3,banner.text.length>9?30:36,'#eaf0ff','center',800);
  drawText(banner.subtitle,LOGICAL_WIDTH/2,logicalHeight*.3+24,15,'#5ef2d0','center',700);
  context.globalAlpha=1;
}
function dimScreen(opacity){
  context.fillStyle='rgba(4,6,20,'+opacity+')';
  context.fillRect(0,0,LOGICAL_WIDTH,logicalHeight);
}
function drawTitleScreen(){
  dimScreen(.5);
  const titleGradient=context.createLinearGradient(0,logicalHeight*.2,0,logicalHeight*.3);
  titleGradient.addColorStop(0,'#9be7ff');
  titleGradient.addColorStop(1,'#5ef2d0');
  drawText('ORBIT HOP',LOGICAL_WIDTH/2,logicalHeight*.27,54,titleGradient,'center',800);
  drawText('Hop through the orbits to reach the planet',LOGICAL_WIDTH/2,logicalHeight*.27+28,14,'rgba(234,240,255,.8)','center',700);
  const panelTop=logicalHeight*.42;
  roundedRect(40,panelTop,LOGICAL_WIDTH-80,134,16);
  context.fillStyle='rgba(10,14,40,.7)';context.fill();
  context.strokeStyle='rgba(155,231,255,.25)';context.lineWidth=1;context.stroke();
  const instructions=[['TAP','hop toward the planet'],['SWIPE ← →','slide along the orbit'],['SWIPE ↓','hop back out']];
  instructions.forEach((row,i)=>{
    drawText(row[0],58,panelTop+36+i*34,13,'#5ef2d0','left',800);
    drawText(row[1],168,panelTop+36+i*34,13,'#eaf0ff','left',700);
  });
  drawText('Land only in empty space. Inner orbits are faster.',LOGICAL_WIDTH/2,panelTop+156,12,'rgba(234,240,255,.6)','center',700);
  if(Math.floor(gameTime*2)%2===0)drawText('TAP TO START',LOGICAL_WIDTH/2,logicalHeight*.84,20,'#ffc857','center',800);   // blinks
}
function drawGameOverScreen(){
  dimScreen(.55);
  drawText('GAME OVER',LOGICAL_WIDTH/2,logicalHeight*.34,42,'#ff5f7e','center',800);
  drawText('SCORE',LOGICAL_WIDTH/2,logicalHeight*.34+40,12,'rgba(234,240,255,.6)','center',700);
  drawText(String(score),LOGICAL_WIDTH/2,logicalHeight*.34+78,44,'#eaf0ff','center',800);
  drawText(score>=bestScore&&score>0?'NEW BEST!':'BEST '+bestScore,LOGICAL_WIDTH/2,logicalHeight*.34+104,14,'#ffc857','center',800);
  // The retry prompt appears after a short delay so a frantic tap doesn't skip the score.
  if(stateTime>.7&&Math.floor(gameTime*2)%2===0)drawText('TAP TO RETRY',LOGICAL_WIDTH/2,logicalHeight*.74,20,'#5ef2d0','center',800);
}
