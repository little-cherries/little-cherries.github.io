/* =========================================================================
 * RENDER: the game world
 *
 * Draws the scene around the ship: stars, orbit lines, landing ring, obstacles,
 * the ship and particles. The planet and obstacle artwork comes from assets/.
 * ========================================================================= */
'use strict';

/** Skips drawing orbits that lie completely off screen. */
function isOrbitVisible(planetX,planetY,orbitRadius){
  const nearestX=clamp(planetX,0,LOGICAL_WIDTH),nearestY=clamp(planetY,0,logicalHeight);
  const nearestDistance=Math.hypot(nearestX-planetX,nearestY-planetY);
  const farthestDistance=Math.max(
    Math.hypot(planetX,planetY),Math.hypot(LOGICAL_WIDTH-planetX,planetY),
    Math.hypot(planetX,logicalHeight-planetY),Math.hypot(LOGICAL_WIDTH-planetX,logicalHeight-planetY));
  return orbitRadius>=nearestDistance-6&&orbitRadius<=farthestDistance+6;
}

function drawStars(planetX){
  // Stars move at half the speed of the world, which gives a feeling of depth.
  const starCentreY=shipScreenY()-camera.radius*.5;
  for(const star of stars){
    const angle=star.angle-camera.angle*.55;
    const x=planetX+star.distance*Math.sin(angle),y=starCentreY+star.distance*Math.cos(angle);
    if(x<0||x>LOGICAL_WIDTH||y<0||y>logicalHeight)continue;
    context.globalAlpha=.45+.35*Math.sin(gameTime*1.5+star.twinklePhase);
    context.fillStyle=star.color;
    context.fillRect(x,y,star.size,star.size);
  }
  context.globalAlpha=1;
}

function drawOrbits(planetX,planetY){
  for(const orbit of orbits){
    if(!isOrbitVisible(planetX,planetY,orbit.radius))continue;
    const depth=orbit.index/(orbitCount-1);
    const rgb=mixColors(OUTER_ORBIT_RGB,INNER_ORBIT_RGB,depth);   // colour shifts from blue to pink toward the planet
    context.beginPath();
    context.arc(planetX,planetY,orbit.radius,0,TWO_PI);
    if(orbit.type==='safe'){
      // Safe orbits get a solid glowing teal line.
      context.setLineDash([]);
      context.lineWidth=16;context.strokeStyle='rgba(94,242,208,.07)';context.stroke();
      context.lineWidth=3;context.strokeStyle='rgba(94,242,208,.55)';context.stroke();
    }else{
      if(gameState==='play'&&ship.alive&&orbit.index===ship.orbit){
        // Faint wide band highlights the orbit the ship is on.
        context.setLineDash([]);
        context.lineWidth=14;context.strokeStyle='rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+',.07)';context.stroke();
      }
      context.setLineDash([5,9]);
      context.lineWidth=1.6;
      context.strokeStyle='rgba('+rgb[0]+','+rgb[1]+','+rgb[2]+','+(.28+.2*depth)+')';
      context.stroke();
    }
  }
  context.setLineDash([]);
}
/** The ring where the ship would land if it hopped now: teal when clear, red when blocked. */
function drawLandingPads(){
  if(gameState!=='play'||!ship.alive||ship.move)return;
  const targetOrbit=ship.orbit+1;
  const targetRadius=targetOrbit>=orbitCount?PLANET_RADIUS:orbitRadii[targetOrbit];
  const isBlocked=targetOrbit<orbitCount?collidesWithObstacle(orbits[targetOrbit],ship.angle,SHIP_HIT_RADIUS+9):false;
  const position=polarToScreen(targetRadius,ship.angle);
  context.lineWidth=2;
  context.strokeStyle=isBlocked?'#ff5f7e':'#5ef2d0';
  context.fillStyle=isBlocked?'rgba(255,95,126,.15)':'rgba(94,242,208,.15)';
  context.beginPath();context.arc(position.x,position.y,10+1.5*Math.sin(gameTime*6),0,TWO_PI);context.fill();context.stroke();
  if(ship.orbit>0){
    // Small dot on the orbit behind the ship.
    const backPosition=polarToScreen(orbitRadii[ship.orbit-1],ship.angle);
    context.fillStyle='rgba(234,240,255,.25)';
    context.beginPath();context.arc(backPosition.x,backPosition.y,3,0,TWO_PI);context.fill();
  }
}

function drawObstacles(planetX,planetY){
  for(const orbit of orbits){
    if(orbit.type==='safe'||!isOrbitVisible(planetX,planetY,orbit.radius))continue;
    for(const obstacle of orbit.obstacles){
      const relativeAngle=angleDifference(obstacle.baseAngle+orbit.rotationOffset,camera.angle);
      const x=planetX+orbit.radius*Math.sin(relativeAngle),y=planetY+orbit.radius*Math.cos(relativeAngle);
      if(x<-80||x>LOGICAL_WIDTH+80||y<-80||y>logicalHeight+80)continue;   // off screen
      context.save();
      context.translate(x,y);
      context.rotate(-relativeAngle);   // line the obstacle up with the curve of its orbit
      OBSTACLE_PAINTERS[obstacle.kind](obstacle,orbit);
      context.restore();
    }
  }
}

function drawShip(){
  if(!ship.alive||gameState==='title')return;
  const position=polarToScreen(ship.radius,ship.angle);
  let scale=1.15;
  let flameLength=.4+.2*Math.sin(gameTime*30);     // idle flicker
  if(ship.move){
    const progress=Math.min(1,ship.move.elapsed/ship.move.duration);
    scale+=.35*Math.sin(PI*progress);              // ship grows at the top of a hop
    flameLength=1;
  }
  context.save();
  if(ship.invulnerableTime>0&&Math.floor(gameTime*14)%2)context.globalAlpha=.35;   // blink while invulnerable
  context.translate(position.x,position.y);
  context.rotate(-position.relativeAngle+ship.facing);
  context.scale(scale,scale);
  drawShipShape(flameLength);
  context.restore();
}
function drawParticles(){
  for(const particle of particles){
    const fade=clamp(particle.life/particle.maxLife,0,1);
    context.globalAlpha=fade;
    context.fillStyle=particle.color;
    context.beginPath();context.arc(particle.x,particle.y,particle.size*(.5+.5*fade),0,TWO_PI);context.fill();
  }
  context.globalAlpha=1;
  for(const popup of floatingTexts){
    context.globalAlpha=1-popup.age;
    drawText(popup.text,popup.x,popup.y,16,popup.color,'center',800);
  }
  context.globalAlpha=1;
}
