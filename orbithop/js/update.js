/* =========================================================================
 * UPDATE: one step of game time
 *
 * Runs every frame before drawing: moves orbits, animates the ship,
 * checks for crashes, follows with the camera and ages particles.
 * ========================================================================= */
'use strict';

function updateGame(deltaTime){
  gameTime+=deltaTime;
  stateTime+=deltaTime;

  // 1. Turn every orbit so its obstacles drift around the planet.
  for(const orbit of orbits){
    if(orbit.type==='safe')continue;
    let speed=orbit.baseSpeed;
    if(orbit.type==='ufo')speed*=1+.5*Math.sin(gameTime*1.5+orbit.index);   // UFOs surge and slow down
    if(orbit.type==='alienShip'){   // alien ships fly in short fast bursts
      const burst=Math.max(0,Math.sin(gameTime*1.2+orbit.index));
      speed*=.7+.9*burst*burst;
    }
    orbit.rotationOffset+=orbit.direction*speed/orbit.radius*deltaTime;     // speed / radius = angular speed
  }

  // 2. Animate the ship's current hop or slide.
  if(ship.move){
    const move=ship.move;
    move.elapsed+=deltaTime;
    const progress=Math.min(1,move.elapsed/move.duration);
    const smoothProgress=easeInOut(progress);
    ship.radius=lerp(move.fromRadius,move.toRadius,smoothProgress);
    ship.angle=lerp(move.fromAngle,move.toAngle,smoothProgress);
    if(Math.random()<.9){   // exhaust trail
      const position=polarToScreen(ship.radius,ship.angle);
      spawnParticle(position.x,position.y,'#5ef2d0',randomBetween(1.5,3),.35,randomBetween(-20,20),randomBetween(-20,20));
    }
    if(progress>=1)finishMove();
  }
  // Turn the ship graphic smoothly toward the direction it just moved.
  ship.facing+=angleDifference(ship.facingTarget,ship.facing)*(1-Math.exp(-18*deltaTime));
  if(ship.invulnerableTime>0)ship.invulnerableTime-=deltaTime;

  // 3. Crash handling and respawn.
  if(!ship.alive){
    ship.deadTime+=deltaTime;
    if(ship.deadTime>1&&gameState==='play'){
      if(lives>0)respawnShip();else endGame();
    }
  }else if(gameState==='play'&&ship.invulnerableTime<=0){
    const orbitIndex=orbitForCollision();
    if(orbitIndex>=0&&orbits[orbitIndex].type!=='safe'&&collidesWithObstacle(orbits[orbitIndex],ship.angle)){
      loseLife();
    }
  }

  // 4. Camera eases toward the ship (exp() makes the smoothing frame-rate independent).
  const targetRadius=gameState==='title'?titleCameraRadius():ship.radius;
  camera.radius+=(targetRadius-camera.radius)*(1-Math.exp(-10*deltaTime));
  camera.angle+=angleDifference(ship.angle,camera.angle)*(1-Math.exp(-7*deltaTime));
  screenShake*=Math.exp(-6*deltaTime);

  // 5. Particles, popups and banner.
  for(const particle of particles){
    particle.x+=particle.vx*deltaTime;
    particle.y+=particle.vy*deltaTime;
    particle.vx*=1-1.5*deltaTime;   // drag
    particle.vy*=1-1.5*deltaTime;
    particle.life-=deltaTime;
  }
  for(let i=particles.length-1;i>=0;i--)if(particles[i].life<=0)particles.splice(i,1);
  for(const popup of floatingTexts){popup.age+=deltaTime;popup.y-=28*deltaTime;}
  for(let i=floatingTexts.length-1;i>=0;i--)if(floatingTexts[i].age>1)floatingTexts.splice(i,1);
  if(banner){banner.elapsed+=deltaTime;if(banner.elapsed>banner.duration)banner=null;}

  // 6. After the "planet reached" celebration, start the next level.
  if(gameState==='landed'&&stateTime>2.6)startNextLevel();
}
