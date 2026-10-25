/* =========================================================================
 * WORLD: planet surface and star field
 *
 * Random decoration that does not affect gameplay.
 * ========================================================================= */
'use strict';

let planetFeatures=[];    // land and cloud blobs drawn on the planet

/** Scatters land and cloud blobs over the planet. */
function generatePlanetFeatures(){
  planetFeatures=[];
  for(let i=0;i<16;i++){
    planetFeatures.push({
      angle:randomBetween(0,TWO_PI),
      distance:randomBetween(.05,.95)*PLANET_RADIUS,   // distance from the planet centre
      width:randomBetween(16,40),
      height:randomBetween(10,26),
      tilt:randomBetween(0,PI),
      isCloud:i>=10
    });
  }
}

/** Background stars, stored in polar coordinates around a far-away centre. */
const stars=[];
for(let i=0;i<4500;i++){
  const roll=Math.random();
  stars.push({
    distance:2000*Math.sqrt(Math.random()),
    angle:randomBetween(0,TWO_PI),
    size:roll<.08?2:roll<.4?1.3:.8,
    twinklePhase:randomBetween(0,TWO_PI),
    color:roll<.2?'#bcd0ff':roll>.9?'#ffd9b0':'#ffffff'
  });
}
