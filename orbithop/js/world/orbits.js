/* =========================================================================
 * WORLD: orbits and obstacle placement
 *
 * Decides how many orbits a level has, how far apart they are, and which
 * obstacles sit on each one. Called once at the start of every level.
 * ========================================================================= */
'use strict';

let orbitCount=11;          // how many orbits lie between the start and the planet (changes per level)
const orbitRadii=[];        // orbitRadii[0] is the outer start orbit, the last entry is the orbit closest to the planet

/** Each level adds two more orbits. Orbits get closer together near the planet. */
function setupOrbitRadii(levelNumber){
  orbitCount=Math.min(11+2*(levelNumber-1),31);
  orbitRadii.length=0;
  orbitRadii[orbitCount-1]=212;   // innermost orbit
  for(let index=orbitCount-2;index>=0;index--){
    const gapToInnerNeighbour=lerp(76,56,index/(orbitCount-2));
    orbitRadii[index]=orbitRadii[index+1]+gapToInnerNeighbour;
  }
}
setupOrbitRadii(1);
/** On the title screen the camera shows a mid-depth orbit so the planet is visible. */
const titleCameraRadius=()=>orbitRadii[Math.min(9,orbitCount-1)];

let orbits=[];            // the current level's orbits, outermost first

/**
 * Decides what each orbit contains.
 * Orbit 0 and every 6th orbit after it are safe. The rest get a random obstacle
 * type from the pool for their depth, and deeper orbits are faster and busier.
 */
function makeOrbitPlans(){
  const plans=[];
  let previousType='';
  for(let index=0;index<orbitCount;index++){
    const isSafe=index%6===0&&index<orbitCount-1;
    if(isSafe){plans.push({type:'safe'});previousType='';continue;}
    const depth=index/(orbitCount-1);   // 0 at the outer orbit, 1 at the innermost
    const pool=OBSTACLE_POOLS_BY_DEPTH[Math.min(3,Math.floor(depth*4))];
    // Each level the outer orbits catch up a little with the inner ones: they get faster and more crowded.
    // tunedDepth only affects speed and spacing (not which obstacle types appear).
    const outerOrbitBoost=Math.min(.6,.06*(level-1));
    const tunedDepth=depth+(1-depth)*outerOrbitBoost;
    let type;
    // Pick a random type, usually avoiding the same type twice in a row.
    do{type=pool[(Math.random()*pool.length)|0];}while(type===previousType&&Math.random()<.8);
    previousType=type;
    const traits=OBSTACLE_TRAITS[type];
    plans.push({
      type,
      averageSpacing:lerp(320,225,tunedDepth)*traits.spacingFactor,
      speed:lerp(26,100,tunedDepth)*traits.speedFactor,
      minCentreDistance:traits.minCentreDistance
    });
  }
  return plans;
}

/**
 * Builds all orbits and obstacles for the current level.
 * Obstacle positions are random: every gap is at least the minimum width, and
 * the leftover angle is shared out unevenly so some gaps are tight and some wide.
 */
function buildOrbits(){
  setupOrbitRadii(level);
  const levelsCompleted=level-1;
  const plans=makeOrbitPlans();
  orbits=plans.map((plan,index)=>{
    const orbit={
      index,
      radius:orbitRadii[index],
      type:plan.type,
      direction:index%2?1:-1,           // neighbouring orbits turn in opposite directions
      rotationOffset:randomBetween(0,TWO_PI), // how far the whole orbit has turned
      obstacles:[],
      baseSpeed:0                       // units per second along the orbit
    };
    if(plan.type==='safe')return orbit;

    // Later levels pack obstacles closer together and make them faster.
    const averageSpacing=plan.averageSpacing*Math.max(0.72,1-0.05*levelsCompleted);
    orbit.baseSpeed=plan.speed*(1+0.14*levelsCompleted);

    const minGapAngle=plan.minCentreDistance/orbit.radius;
    let obstacleCount=Math.max(3,Math.round(TWO_PI*orbit.radius/averageSpacing));
    obstacleCount=Math.min(obstacleCount,Math.floor(TWO_PI/minGapAngle*.85)); // always leave room for the minimum gaps

    // Random weights decide how the spare angle is divided between gaps.
    const gapWeights=[];
    let weightTotal=0;
    for(let i=0;i<obstacleCount;i++){
      const weight=Math.pow(Math.random(),1.6)+.12;
      gapWeights.push(weight);
      weightTotal+=weight;
    }
    const spareAngle=TWO_PI-obstacleCount*minGapAngle;

    let angle=randomBetween(0,TWO_PI);
    for(let i=0;i<obstacleCount;i++){
      const size=randomBetween(11,15);
      // A lumpy 9-point outline gives each meteor its own shape.
      const outline=[];
      for(let point=0;point<9;point++){
        const pointAngle=point/9*TWO_PI,pointRadius=size*randomBetween(.78,1.12);
        outline.push([Math.cos(pointAngle)*pointRadius,Math.sin(pointAngle)*pointRadius]);
      }
      orbit.obstacles.push({
        baseAngle:angle,                // angle before the orbit's rotationOffset is added
        kind:plan.type,
        size,
        outline,
        color:ROCK_COLORS[(Math.random()*ROCK_COLORS.length)|0],
        spinSpeed:randomBetween(-1.5,1.5),
        rotation:randomBetween(0,TWO_PI),
        phase:randomBetween(0,TWO_PI)   // offsets blinking lights so obstacles don't pulse in sync
      });
      angle+=minGapAngle+spareAngle*gapWeights[i]/weightTotal;
    }
    return orbit;
  });
}
