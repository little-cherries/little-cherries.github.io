/* =========================================================================
 * CONFIG: fixed numbers and tuning tables
 *
 * Values the game reads but never changes. Tweak difficulty and feel here:
 *   - which obstacles appear and how big their hit areas are
 *   - how far the ship slides, how big it is, how far a swipe must travel
 * ========================================================================= */
'use strict';

/** The screen is always 400 logical units wide; the height follows the device. */
const LOGICAL_WIDTH=400;

/** Radius of the planet in logical units. */
const PLANET_RADIUS=150;

/** Which obstacle types may appear, from the outer orbits (first list) to the inner orbits (last list). */
const OBSTACLE_POOLS_BY_DEPTH=[
  ['meteor','meteor','satellite','jellyfish'],
  ['meteor','satellite','comet','whale','jellyfish'],
  ['satellite','comet','ufo','mine','alienShip','whale'],
  ['comet','ufo','mine','alienShip','vortex','meteor','whale']
];
/**
 * Per-type tuning.
 *   spacingFactor: multiplies the average spacing between obstacles
 *   speedFactor: multiplies the orbit speed
 *   minCentreDistance: closest two obstacle centres may be (units), so the ship can always squeeze through
 */
const OBSTACLE_TRAITS={
  meteor:   {spacingFactor:1,   speedFactor:.9, minCentreDistance:85},
  satellite:{spacingFactor:1.05,speedFactor:.8, minCentreDistance:105},
  comet:    {spacingFactor:1.4, speedFactor:1.3,minCentreDistance:90},
  ufo:      {spacingFactor:1,   speedFactor:.85,minCentreDistance:90},
  mine:     {spacingFactor:.9,  speedFactor:.7, minCentreDistance:85},
  whale:    {spacingFactor:1.5, speedFactor:.55,minCentreDistance:125},   // huge and slow
  alienShip:{spacingFactor:1.2, speedFactor:1,  minCentreDistance:95},    // flies in bursts
  jellyfish:{spacingFactor:1,   speedFactor:.6, minCentreDistance:88},
  vortex:   {spacingFactor:1.1, speedFactor:.5, minCentreDistance:92}
};
/** Invisible circles that make up each obstacle's hit area: [offset along the orbit, radius]. */
const HIT_CIRCLES_BY_KIND={
  meteor:[[0,1]],                       // radius is replaced by the meteor's own size
  satellite:[[-22,8],[0,9],[22,8]],
  comet:[[0,7]],
  ufo:[[-9,8.5],[9,8.5]],
  mine:[[0,10.5]],
  whale:[[-24,11],[0,13],[24,10]],
  alienShip:[[-5,7.5],[8,6]],
  jellyfish:[[0,10.5]],
  vortex:[[0,11.5]]
};

const ROCK_COLORS=['#8b7e74','#7a6f8a','#9a7b64','#6f7f86'];
const OUTER_ORBIT_RGB=[110,170,255];   // calm blue
const INNER_ORBIT_RGB=[255,95,150];    // dangerous pink

const SLIDE_DISTANCE=46;       // how far a sideways slide moves the ship (units)
const SHIP_HIT_RADIUS=7.5;

const SWIPE_DISTANCE=26;      // finger travel (pixels) that counts as a swipe instead of a tap
