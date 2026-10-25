/* =========================================================================
 * ASSET: obstacle artwork
 *
 * One painter function per obstacle type (meteor, satellite, comet, ufo, mine,
 * whale, alienShip, jellyfish, vortex). To add a new obstacle, add a painter here,
 * then add its traits and hit circles in config.js and put it in a pool.
 * ========================================================================= */
'use strict';

/**
 * How to draw each obstacle type. Before these run, the canvas is moved to the
 * obstacle and rotated so local +x runs along the orbit (the direction of
 * increasing angle) and local +y points away from the planet.
 */
const OBSTACLE_PAINTERS={
  meteor(obstacle){
    context.rotate(obstacle.rotation+gameTime*obstacle.spinSpeed);   // tumbling
    context.beginPath();
    obstacle.outline.forEach((point,i)=>i?context.lineTo(point[0],point[1]):context.moveTo(point[0],point[1]));
    context.closePath();
    context.fillStyle=obstacle.color;context.fill();
    context.lineWidth=1.5;context.strokeStyle='rgba(255,255,255,.22)';context.stroke();
    context.fillStyle='rgba(0,0,0,.22)';   // two craters
    context.beginPath();context.arc(obstacle.size*.25,obstacle.size*.2,obstacle.size*.28,0,TWO_PI);context.fill();
    context.beginPath();context.arc(-obstacle.size*.35,-obstacle.size*.25,obstacle.size*.16,0,TWO_PI);context.fill();
  },
  satellite(obstacle){
    context.fillStyle='#2b5bd7';                       // solar panels
    context.fillRect(-31,-5,20,10);context.fillRect(11,-5,20,10);
    context.strokeStyle='rgba(255,255,255,.4)';context.lineWidth=1;context.beginPath();
    for(const x of[-26,-21,-16,16,21,26]){context.moveTo(x,-5);context.lineTo(x,5);}
    context.moveTo(-31,0);context.lineTo(-11,0);context.moveTo(11,0);context.lineTo(31,0);
    context.stroke();
    context.fillStyle='#aab4c8';context.fillRect(-11,-1.5,22,3);   // arm between panels
    roundedRect(-7,-7,14,14,3);context.fillStyle='#d8deea';context.fill();   // body
    context.strokeStyle='rgba(0,0,0,.25)';context.stroke();
    context.fillStyle='#ffc857';context.beginPath();context.arc(0,-7,5,PI,TWO_PI);context.fill();   // dish
    context.fillStyle=Math.sin(gameTime*5+obstacle.phase)>0?'#ff5f7e':'#5a2030';   // blinking light
    context.beginPath();context.arc(0,3,1.8,0,TWO_PI);context.fill();
  },
  comet(obstacle,orbit){
    // The tail trails behind the direction of travel (visual only, not part of the hit area).
    const tailDirection=-orbit.direction;
    let gradient=context.createLinearGradient(0,0,tailDirection*72,0);
    gradient.addColorStop(0,'rgba(155,231,255,.85)');
    gradient.addColorStop(1,'rgba(155,231,255,0)');
    context.fillStyle=gradient;
    context.beginPath();
    context.moveTo(0,-7);context.lineTo(tailDirection*72,-2);context.lineTo(tailDirection*72,2);context.lineTo(0,7);
    context.fill();
    gradient=context.createRadialGradient(0,0,2,0,0,15);   // glow around the head
    gradient.addColorStop(0,'rgba(190,240,255,.7)');
    gradient.addColorStop(1,'rgba(190,240,255,0)');
    context.fillStyle=gradient;context.beginPath();context.arc(0,0,15,0,TWO_PI);context.fill();
    context.fillStyle='#f4fbff';context.beginPath();context.arc(0,0,6,0,TWO_PI);context.fill();
  },
  ufo(obstacle){
    context.fillStyle='#b7c2d9';context.beginPath();context.ellipse(0,0,17,6,0,0,TWO_PI);context.fill();   // saucer
    context.fillStyle='rgba(120,235,255,.85)';context.beginPath();context.ellipse(0,-3,8,6,0,PI,TWO_PI);context.fill();   // dome
    for(let light=-1;light<=1;light++){   // alternating blinking lights
      context.fillStyle=(Math.floor(gameTime*4+light+obstacle.phase)%2)?'#ffc857':'#ff5f7e';
      context.beginPath();context.arc(light*9,1,1.8,0,TWO_PI);context.fill();
    }
  },
  mine(obstacle){
    const bodyRadius=9+2*Math.sin(gameTime*4+obstacle.phase);   // pulsing size
    context.strokeStyle='#ff5f7e';context.lineWidth=2;context.beginPath();
    for(let spike=0;spike<8;spike++){
      const angle=spike/8*TWO_PI+gameTime*.6;                   // slowly rotating spikes
      context.moveTo(Math.cos(angle)*bodyRadius,Math.sin(angle)*bodyRadius);
      context.lineTo(Math.cos(angle)*(bodyRadius+5),Math.sin(angle)*(bodyRadius+5));
    }
    context.stroke();
    context.fillStyle='#3a0f2a';context.beginPath();context.arc(0,0,bodyRadius,0,TWO_PI);context.fill();
    context.lineWidth=1.5;context.stroke();
    context.fillStyle=Math.sin(gameTime*8+obstacle.phase)>0?'#ff5f7e':'#6a2038';
    context.beginPath();context.arc(0,0,3,0,TWO_PI);context.fill();
  },
  whale(obstacle,orbit){
    // A cyber whale: dark armoured hull, neon circuit lines, a visor eye and data bits instead of a water spout.
    context.scale(orbit.direction,1);              // head always faces the way the whale swims
    const tailSwing=Math.sin(gameTime*3+obstacle.phase);
    const glow=.65+.35*Math.sin(gameTime*4+obstacle.phase);   // neon pulse
    const cyan='rgba(0,240,255,'+glow+')',magenta='rgba(255,43,214,'+glow+')';
    context.lineJoin='round';
    context.save();                                 // angular tail fluke with glowing edges
    context.translate(-28,0);context.rotate(tailSwing*.3);
    context.fillStyle='#16224d';
    context.beginPath();context.moveTo(4,-3);context.lineTo(-13,-15);context.lineTo(-9,-1);context.lineTo(-9,1);context.lineTo(-13,15);context.lineTo(4,3);context.closePath();context.fill();
    context.lineWidth=1.2;context.strokeStyle=cyan;context.stroke();
    context.restore();
    context.fillStyle='#1a2a5e';                    // low-poly armoured body
    context.beginPath();
    context.moveTo(36,0);context.lineTo(25,-9);context.lineTo(8,-13);context.lineTo(-12,-10);context.lineTo(-30,-3);
    context.lineTo(-30,3);context.lineTo(-12,10);context.lineTo(8,13);context.lineTo(26,8);context.closePath();context.fill();
    context.fillStyle='#2f5fb0';                    // lighter belly plating
    context.beginPath();context.moveTo(26,6);context.lineTo(8,10);context.lineTo(-12,8);context.lineTo(-24,3);context.lineTo(-12,5);context.lineTo(8,6);context.closePath();context.fill();
    context.lineWidth=1;context.strokeStyle='rgba(0,240,255,.45)';   // armour panel seams
    context.beginPath();
    context.moveTo(14,-12);context.lineTo(14,-6);context.moveTo(2,-13);context.lineTo(2,-7);context.moveTo(-10,-10);context.lineTo(-10,-5);
    context.stroke();
    context.lineWidth=1.4;context.strokeStyle=cyan;                  // glowing circuit line along the back
    context.beginPath();context.moveTo(28,-5);context.lineTo(10,-8);context.lineTo(-6,-6);context.lineTo(-24,-2);context.stroke();
    context.fillStyle=cyan;                                          // circuit nodes
    context.beginPath();context.arc(10,-8,1.6,0,TWO_PI);context.fill();
    context.beginPath();context.arc(-6,-6,1.6,0,TWO_PI);context.fill();
    context.fillStyle='#16224d';                                     // angular side fin with a magenta edge
    context.beginPath();context.moveTo(6,8);context.lineTo(-8,18);context.lineTo(-2,8);context.closePath();context.fill();
    context.lineWidth=1.2;context.strokeStyle=magenta;context.stroke();
    const halo=context.createRadialGradient(24,-3,1,24,-3,11);       // visor eye with a halo
    halo.addColorStop(0,'rgba(0,240,255,.6)');
    halo.addColorStop(1,'rgba(0,240,255,0)');
    context.fillStyle=halo;context.beginPath();context.arc(24,-3,11,0,TWO_PI);context.fill();
    context.fillStyle='#00f0ff';
    context.beginPath();context.moveTo(19,-6);context.lineTo(30,-4);context.lineTo(28,0);context.lineTo(18,-1);context.closePath();context.fill();
    context.fillStyle='#ff2bd6';
    context.beginPath();context.arc(25,-3,1.3,0,TWO_PI);context.fill();
    for(let bit=0;bit<4;bit++){                                      // data bits drifting up from the blowhole
      const lift=((gameTime*1.6+bit*.25+obstacle.phase)%1)*11;
      context.globalAlpha=1-lift/11;
      context.fillStyle=bit%2?'#00f0ff':'#ff2bd6';
      context.fillRect(8+(bit%2?3:-1)+bit,-14-lift,2,2);
    }
    context.globalAlpha=1;
  },
  alienShip(obstacle,orbit){
    context.scale(orbit.direction,1);
    const flicker=.7+.3*Math.sin(gameTime*25+obstacle.phase);
    context.fillStyle='rgba(120,255,160,'+(.55*flicker)+')';   // engine flame at the back
    context.beginPath();context.moveTo(-8,-3);context.lineTo(-8-15*flicker,0);context.lineTo(-8,3);context.fill();
    context.fillStyle='#3fae6a';                                // arrow-shaped hull
    context.beginPath();context.moveTo(16,0);context.lineTo(-9,-10);context.lineTo(-4,0);context.lineTo(-9,10);context.closePath();context.fill();
    context.lineWidth=1;context.strokeStyle='rgba(255,255,255,.3)';context.stroke();
    context.fillStyle='#2a7a4a';                                // wing tips
    context.fillRect(-9,-11,6,3);context.fillRect(-9,8,6,3);
    context.fillStyle='#ff5f7e';                                // glowing eye cockpit
    context.beginPath();context.ellipse(4,0,4.5,2.8,0,0,TWO_PI);context.fill();
    context.fillStyle='#ffd0da';
    context.beginPath();context.arc(5,-.7,1,0,TWO_PI);context.fill();
  },
  jellyfish(obstacle){
    const pulse=Math.sin(gameTime*4+obstacle.phase);
    context.strokeStyle='rgba(255,150,230,.7)';context.lineWidth=1.6;   // wobbling tentacles
    for(let t=-2;t<=2;t++){
      context.beginPath();context.moveTo(t*3.4,2);
      context.quadraticCurveTo(t*3.4+Math.sin(gameTime*3+t+obstacle.phase)*3.5,9,t*3.4+Math.sin(gameTime*3+t*1.7+obstacle.phase)*3,15);
      context.stroke();
    }
    context.fillStyle='rgba(255,140,220,.85)';                          // bell squeezes in and out
    context.beginPath();context.ellipse(0,2,11+1.6*pulse,10-1.4*pulse,0,PI,TWO_PI);context.closePath();context.fill();
    context.fillStyle='rgba(255,236,250,.55)';
    context.beginPath();context.ellipse(0,1,6,5,0,PI,TWO_PI);context.closePath();context.fill();
    context.fillStyle='rgba(120,40,110,.5)';
    context.beginPath();context.arc(-3,-2,1.2,0,TWO_PI);context.fill();
    context.beginPath();context.arc(3,-2,1.2,0,TWO_PI);context.fill();
  },
  vortex(obstacle){
    const size=10+1.5*Math.sin(gameTime*3+obstacle.phase);
    const glow=context.createRadialGradient(0,0,2,0,0,size+9);
    glow.addColorStop(0,'rgba(10,0,30,.95)');
    glow.addColorStop(.55,'rgba(120,60,255,.55)');
    glow.addColorStop(1,'rgba(120,60,255,0)');
    context.fillStyle=glow;context.beginPath();context.arc(0,0,size+9,0,TWO_PI);context.fill();
    context.strokeStyle='rgba(200,165,255,.9)';context.lineWidth=1.6;
    for(let arm=0;arm<3;arm++){                                          // three spiral arms swirling inward
      context.beginPath();
      for(let step=0;step<=12;step++){
        const along=step/12,angle=arm*TWO_PI/3+gameTime*2.5+along*3.2,radius=2+along*size;
        if(step)context.lineTo(Math.cos(angle)*radius,Math.sin(angle)*radius);
        else context.moveTo(Math.cos(angle)*radius,Math.sin(angle)*radius);
      }
      context.stroke();
    }
    context.fillStyle='#07000f';context.beginPath();context.arc(0,0,3.5,0,TWO_PI);context.fill();
  }
};
