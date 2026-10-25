/* =========================================================================
 * UTILITIES: small math helpers
 *
 * Pure helper functions with no game knowledge. Everything else builds on these.
 * ========================================================================= */
'use strict';

const TWO_PI=Math.PI*2;
const PI=Math.PI;
const clamp=(value,min,max)=>value<min?min:value>max?max:value;
/** Blend from a to b. amount 0 gives a, amount 1 gives b. */
const lerp=(a,b,amount)=>a+(b-a)*amount;
const randomBetween=(min,max)=>min+Math.random()*(max-min);
/** Shortest signed angle from b to a, always between -PI and +PI. */
function angleDifference(a,b){
  let difference=(a-b)%TWO_PI;
  if(difference>PI)difference-=TWO_PI;
  else if(difference<-PI)difference+=TWO_PI;
  return difference;
}
/** Smooth start and stop. Takes 0..1, returns 0..1. */
const easeInOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
/** Builds a canvas font string. */
const fontString=(size,weight)=>(weight||800)+' '+size+'px ui-rounded,"SF Pro Rounded","Trebuchet MS",system-ui,sans-serif';

/** Blend two [r,g,b] colours. amount 0 gives a, amount 1 gives b. */
const mixColors=(a,b,amount)=>[Math.round(lerp(a[0],b[0],amount)),Math.round(lerp(a[1],b[1],amount)),Math.round(lerp(a[2],b[2],amount))];
