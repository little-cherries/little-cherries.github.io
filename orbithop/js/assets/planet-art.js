/* =========================================================================
 * ASSET: planet painting
 *
 * Draws the planet disc, its rings, gas-giant bands and surface features,
 * using the style chosen in planet-styles.js.
 * ========================================================================= */
'use strict';

/** One half of a planet ring. The back half is drawn before the planet, the front half after. */
function drawPlanetRing(planetX,planetY,style,drawFrontHalf){
  context.save();
  context.translate(planetX,planetY);
  context.rotate(-.28);          // tilt the ring
  context.scale(1,.22);          // squash the circle into a thin ellipse
  const startAngle=drawFrontHalf?0:PI;
  context.beginPath();context.arc(0,0,172,startAngle,startAngle+PI);
  context.lineWidth=20;context.strokeStyle=style.ring+'88';context.stroke();
  context.beginPath();context.arc(0,0,194,startAngle,startAngle+PI);
  context.lineWidth=7;context.strokeStyle=style.ring+'55';context.stroke();
  context.restore();
}
/** Horizontal cloud bands and a drifting storm for gas giants. Drawn inside the planet's clip. */
function drawGasBands(planetX,planetY,style){
  const bandCount=9,bandHeight=PLANET_RADIUS*2/bandCount;
  context.globalAlpha=.55;
  for(let i=0;i<bandCount;i++){
    context.fillStyle=style.bandColors[i%style.bandColors.length];
    context.fillRect(planetX-PLANET_RADIUS,planetY-PLANET_RADIUS+i*bandHeight+Math.sin(i*1.7)*4,PLANET_RADIUS*2,bandHeight*.8);
  }
  // The storm slowly crosses the planet.
  const stormX=planetX+Math.sin(gameTime*.08)*PLANET_RADIUS*.8,stormY=planetY+PLANET_RADIUS*.25;
  context.globalAlpha=.85;context.fillStyle=style.stormColor;
  context.beginPath();context.ellipse(stormX,stormY,36,18,0,0,TWO_PI);context.fill();
  context.globalAlpha=.5;context.lineWidth=2;context.strokeStyle='#ffffff';
  context.beginPath();context.ellipse(stormX,stormY,22,10,0,0,TWO_PI);context.stroke();
  context.globalAlpha=1;
}
function drawPlanet(planetX,planetY){
  if(planetY+PLANET_RADIUS*2.4<0||planetY-PLANET_RADIUS*2.4>logicalHeight)return;   // off screen
  const style=planetStyleForLevel();

  // Soft glow around the planet.
  let gradient=context.createRadialGradient(planetX,planetY,PLANET_RADIUS*.9,planetX,planetY,PLANET_RADIUS*2.3);
  gradient.addColorStop(0,style.glowColor+'55');
  gradient.addColorStop(1,style.glowColor+'00');
  context.fillStyle=gradient;
  context.beginPath();context.arc(planetX,planetY,PLANET_RADIUS*2.3,0,TWO_PI);context.fill();

  if(style.ring)drawPlanetRing(planetX,planetY,style,false);   // back half of the ring

  // Everything inside the planet disc is clipped to the circle.
  context.save();
  context.beginPath();context.arc(planetX,planetY,PLANET_RADIUS,0,TWO_PI);context.clip();
  gradient=context.createRadialGradient(planetX-PLANET_RADIUS*.35,planetY-PLANET_RADIUS*.35,PLANET_RADIUS*.1,planetX,planetY,PLANET_RADIUS*1.05);
  gradient.addColorStop(0,style.surfaceLight);
  gradient.addColorStop(1,style.surfaceDark);
  context.fillStyle=gradient;
  context.fillRect(planetX-PLANET_RADIUS,planetY-PLANET_RADIUS,PLANET_RADIUS*2,PLANET_RADIUS*2);
  if(style.kind==='gas')drawGasBands(planetX,planetY,style);
  // Surface blobs rotate with the camera so the planet seems to turn. What they look like depends on the planet kind.
  const lavaGlow=.8+.2*Math.sin(gameTime*2);
  for(const feature of planetFeatures){
    if(style.kind==='gas')break;   // gas giants have bands instead
    const angle=feature.angle-camera.angle;
    const featureX=planetX+feature.distance*Math.sin(angle),featureY=planetY+feature.distance*Math.cos(angle);
    if(feature.isCloud){   // clouds, ash or frost
      context.globalAlpha=style.kind==='lava'?.2:.3;
      context.fillStyle=style.cloudColor;
      context.beginPath();context.ellipse(featureX,featureY,feature.width,feature.height,feature.tilt-angle,0,TWO_PI);context.fill();
    }else if(style.kind==='lava'){   // glowing lava pool with a bright core
      context.globalAlpha=.9*lavaGlow;context.fillStyle=style.landColor;
      context.beginPath();context.ellipse(featureX,featureY,feature.width*.7,feature.height*.7,feature.tilt-angle,0,TWO_PI);context.fill();
      context.globalAlpha=.9*lavaGlow;context.fillStyle='#ffd36b';
      context.beginPath();context.ellipse(featureX,featureY,feature.width*.3,feature.height*.3,feature.tilt-angle,0,TWO_PI);context.fill();
    }else if(style.kind==='ice'){    // round crater with a bright rim
      const craterRadius=Math.min(feature.width,feature.height)*.8;
      context.globalAlpha=.6;context.fillStyle=style.landColor;
      context.beginPath();context.arc(featureX,featureY,craterRadius,0,TWO_PI);context.fill();
      context.globalAlpha=.5;context.lineWidth=1.5;context.strokeStyle='#ffffff';context.stroke();
    }else{                           // land masses
      context.globalAlpha=.85;context.fillStyle=style.landColor;
      context.beginPath();context.ellipse(featureX,featureY,feature.width,feature.height,feature.tilt-angle,0,TWO_PI);context.fill();
    }
  }
  context.globalAlpha=1;
  // Night-side shading toward the bottom right.
  gradient=context.createRadialGradient(planetX+PLANET_RADIUS*.45,planetY+PLANET_RADIUS*.55,PLANET_RADIUS*.2,planetX+PLANET_RADIUS*.45,planetY+PLANET_RADIUS*.55,PLANET_RADIUS*1.5);
  gradient.addColorStop(0,'rgba(0,0,10,0)');
  gradient.addColorStop(1,'rgba(0,0,10,.6)');
  context.fillStyle=gradient;
  context.fillRect(planetX-PLANET_RADIUS,planetY-PLANET_RADIUS,PLANET_RADIUS*2,PLANET_RADIUS*2);
  context.restore();

  // Thin atmosphere ring.
  context.lineWidth=6;
  context.strokeStyle=style.glowColor+'40';
  context.beginPath();context.arc(planetX,planetY,PLANET_RADIUS+3,0,TWO_PI);context.stroke();

  if(style.ring)drawPlanetRing(planetX,planetY,style,true);    // front half of the ring crosses over the planet
}
