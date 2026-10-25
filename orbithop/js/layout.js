/* =========================================================================
 * LAYOUT: canvas and screen sizing
 *
 * Grabs the canvas and converts between real device pixels and the
 * 400-unit-wide logical space the whole game is drawn in.
 * ========================================================================= */
'use strict';

const canvas=document.getElementById('game-canvas');
const context=canvas.getContext('2d');
const safeAreaProbe=document.getElementById('safe-area-probe');

let viewportWidth=0,viewportHeight=0;   // window size in CSS pixels
let pixelRatio=1;                       // device pixels per CSS pixel
let pixelsPerUnit=1;                    // device pixels per logical unit
let logicalHeight=800;                  // screen height in logical units
let gameOffsetX=0;                      // left margin (device pixels) when the window is wider than the game
let safeTopUnits=0;                     // phone notch height in logical units

function resizeCanvas(){
  pixelRatio=Math.min(window.devicePixelRatio||1,2.5);
  viewportWidth=window.innerWidth;
  viewportHeight=window.innerHeight;
  canvas.width=Math.round(viewportWidth*pixelRatio);
  canvas.height=Math.round(viewportHeight*pixelRatio);
  // On wide desktop windows keep a phone-shaped play area in the middle.
  const gameWidthCss=Math.min(viewportWidth,viewportHeight*0.62);
  pixelsPerUnit=gameWidthCss*pixelRatio/LOGICAL_WIDTH;
  logicalHeight=viewportHeight*pixelRatio/pixelsPerUnit;
  gameOffsetX=(viewportWidth-gameWidthCss)/2*pixelRatio;
  safeTopUnits=(safeAreaProbe.getBoundingClientRect().height||0)*pixelRatio/pixelsPerUnit;
}
/** Screen height at which the ship is always drawn (70% of the way down). */
const shipScreenY=()=>logicalHeight*0.7;
