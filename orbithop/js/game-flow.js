/* =========================================================================
 * GAME FLOW: starting, crashing, hopping and levelling up
 *
 * The rules of the game: start and reset levels, lose a life, respawn,
 * turn input into hops and slides, and finish a move (score, land on the planet).
 * ========================================================================= */
'use strict';

function saveBestScore(){
  if(score>bestScore){
    bestScore=score;
    try{localStorage.setItem('orbithop.best',String(bestScore));}catch(error){}
  }
}

/** Builds a fresh level and puts the ship on the outer start orbit. */
function resetLevel(){
  buildOrbits();
  generatePlanetFeatures();
  ship.orbit=0;
  ship.angle=randomBetween(0,TWO_PI);
  ship.radius=orbitRadii[0];
  ship.move=null;ship.queuedMove=null;
  ship.alive=true;
  ship.invulnerableTime=1.2;
  ship.facing=ship.facingTarget=0;
  ship.deadTime=0;
  furthestOrbitReached=0;
  camera.angle=ship.angle;
  floatingTexts.length=0;
}
function startGame(){
  score=0;lives=3;level=1;
  resetLevel();
  gameState='play';stateTime=0;
  showBanner('LEVEL 1',planetStyleForLevel().name+' is '+(orbitCount-1)+' orbits away');
}
function startNextLevel(){
  level++;
  resetLevel();
  gameState='play';stateTime=0;
  showBanner('LEVEL '+level,planetStyleForLevel().name+' is '+(orbitCount-1)+' orbits away');
}
function endGame(){
  gameState='over';stateTime=0;
  saveBestScore();
}
function onPlanetReached(){
  gameState='landed';stateTime=0;
  const bonus=100*level+lives*25;   // bigger bonus for later levels and spare lives
  score+=bonus;
  saveBestScore();
  sounds.planetReached();
  spawnConfetti();
  showBanner('PLANET REACHED','+'+bonus+' bonus',2.4);
}
/** The ship hit something: explode and lose a life. */
function loseLife(){
  const orbitHit=orbitForCollision();
  if(orbitHit>=0)ship.orbit=orbitHit;
  ship.radius=orbitRadii[ship.orbit];
  ship.move=null;ship.queuedMove=null;
  const position=polarToScreen(ship.radius,ship.angle);
  ship.alive=false;ship.deadTime=0;
  lives--;
  spawnExplosion(position.x,position.y);
  screenShake=14;
  sounds.crash();
}
/** Brings the ship back on the same orbit at a clear spot, briefly invulnerable. */
function respawnShip(){
  ship.angle=findSafeAngle(ship.orbit,ship.angle);
  ship.alive=true;
  ship.invulnerableTime=2;
  ship.facing=ship.facingTarget=0;
  ship.move=null;
}
/**
 * Starts a hop or slide. moveType is 'in', 'out', 'left' or 'right'.
 * If a move is already playing, the new one is remembered and starts right after.
 */
function startMove(moveType){
  if(gameState!=='play'||!ship.alive)return;
  if(ship.move){ship.queuedMove=moveType;return;}

  let toOrbit=ship.orbit,toAngle=ship.angle,toRadius=orbitRadii[ship.orbit],duration=.15;
  if(moveType==='in'){
    toOrbit=ship.orbit+1;
    // Past the last orbit the ship lands on the planet's surface.
    toRadius=toOrbit>=orbitCount?PLANET_RADIUS+6:orbitRadii[toOrbit];
    ship.facingTarget=0;                    // nose toward the planet
    sounds.hopIn();
  }else if(moveType==='out'){
    if(ship.orbit===0){sounds.bump();screenShake=Math.max(screenShake,3);return;}   // can't leave the start orbit
    toOrbit=ship.orbit-1;
    toRadius=orbitRadii[toOrbit];
    ship.facingTarget=PI;                   // nose away from the planet
    sounds.hopOut();
  }else{
    // Sliding keeps the ship on its orbit; a fixed distance turns into an angle.
    const direction=moveType==='left'?-1:1;
    toAngle=ship.angle+direction*SLIDE_DISTANCE/orbitRadii[ship.orbit];
    ship.facingTarget=direction*PI/2;
    duration=.12;
    sounds.slide();
  }
  ship.move={
    type:moveType,elapsed:0,duration,
    fromOrbit:ship.orbit,toOrbit,
    fromRadius:ship.radius,toRadius,
    fromAngle:ship.angle,toAngle
  };
}
/** Called when a move's animation ends: score it, land, or start the queued move. */
function finishMove(){
  const move=ship.move;
  ship.orbit=Math.min(move.toOrbit,orbitCount-1);
  ship.radius=move.toRadius;
  ship.angle=move.toAngle;
  ship.move=null;
  if(move.toOrbit>=orbitCount){onPlanetReached();return;}
  if(move.toOrbit>furthestOrbitReached){
    furthestOrbitReached=move.toOrbit;
    score+=10*level;
    sounds.newOrbit();
    spawnFloatingText('+'+10*level,'#5ef2d0');
  }
  if(ship.queuedMove){
    const next=ship.queuedMove;
    ship.queuedMove=null;
    startMove(next);
  }
}
