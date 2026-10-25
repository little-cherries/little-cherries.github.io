/* =========================================================================
 * STATE: everything that changes while playing
 *
 * Score, lives, level, the ship, the camera, particles and the current screen.
 * Other files read and update these variables.
 * ========================================================================= */
'use strict';

let gameState='title';   // 'title' | 'play' | 'landed' (level cleared) | 'over'
let stateTime=0;         // seconds spent in the current state
let gameTime=0;          // total seconds, drives animations
let screenShake=0;       // current shake strength in units
let score=0,bestScore=0,lives=3,level=1;
let furthestOrbitReached=0;   // so each new orbit only scores once per level
let soundMuted=false;
try{
  bestScore=+localStorage.getItem('orbithop.best')||0;
  soundMuted=localStorage.getItem('orbithop.muted')==='1';
}catch(error){/* storage can be blocked; the game still works */}

/**
 * The ship.
 *   orbit/angle/radius: where it is (radius is animated while hopping between orbits)
 *   facing: rotation of the ship graphic; facingTarget is where it is turning to
 *   move: the hop or slide in progress, or null
 *   queuedMove: one input remembered while a move is still playing
 */
const ship={
  orbit:0,angle:0,radius:orbitRadii[0],
  facing:0,facingTarget:0,
  alive:true,invulnerableTime:0,deadTime:0,
  move:null,queuedMove:null
};
/** The camera: which angle faces down, and the radius the screen is centred on. */
const camera={angle:0,radius:titleCameraRadius()};

const particles=[];       // sparks, trails and confetti (screen space)
const floatingTexts=[];   // "+10" popups
let banner=null;          // big centre message such as "LEVEL 2"
