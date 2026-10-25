/* =========================================================================
 * INPUT: touch, mouse and keyboard
 *
 * Tap = hop in. Swipe up = hop in, down = hop out, left/right = slide.
 * Keyboard: arrows or WASD, Space to hop in, M to mute.
 * ========================================================================= */
'use strict';

/** Converts a pointer position on the page to logical game units. */
function clientToLogical(event){
  return{x:(event.clientX*pixelRatio-gameOffsetX)/pixelsPerUnit,y:event.clientY*pixelRatio/pixelsPerUnit};
}
function toggleMute(){
  soundMuted=!soundMuted;
  try{localStorage.setItem('orbithop.muted',soundMuted?'1':'0');}catch(error){}
  if(!soundMuted)playTone(660,.08,'triangle',.06,880);
}
/** A tap on a menu-style screen: start, retry or skip the celebration. */
function handleMenuTap(){
  if(gameState==='title')startGame();
  else if(gameState==='over'&&stateTime>.7)startGame();
  else if(gameState==='landed'&&stateTime>1)startNextLevel();
}

let activePointer=null;       // the finger currently down: {id,startX,startY,usedAsSwipe}

canvas.addEventListener('pointerdown',event=>{
  event.preventDefault();
  getAudioContext();
  const point=clientToLogical(event),muteButton=muteButtonCenter();
  if(gameState!=='title'&&Math.hypot(point.x-muteButton.x,point.y-muteButton.y)<26){toggleMute();return;}
  if(gameState!=='play'){handleMenuTap();return;}
  activePointer={id:event.pointerId,startX:event.clientX,startY:event.clientY,usedAsSwipe:false};
  try{canvas.setPointerCapture(event.pointerId);}catch(error){}
});
canvas.addEventListener('pointermove',event=>{
  if(!activePointer||activePointer.id!==event.pointerId||activePointer.usedAsSwipe)return;
  const deltaX=event.clientX-activePointer.startX,deltaY=event.clientY-activePointer.startY;
  if(Math.hypot(deltaX,deltaY)>SWIPE_DISTANCE){
    activePointer.usedAsSwipe=true;   // fire as soon as the swipe is recognised, not on release
    if(Math.abs(deltaY)>Math.abs(deltaX))startMove(deltaY<0?'in':'out');
    else startMove(deltaX<0?'left':'right');
  }
});
canvas.addEventListener('pointerup',event=>{
  if(!activePointer||activePointer.id!==event.pointerId)return;
  getAudioContext();
  // Released without swiping: that was a tap.
  if(!activePointer.usedAsSwipe&&gameState==='play')startMove('in');
  activePointer=null;
});
canvas.addEventListener('pointercancel',()=>{activePointer=null;});
canvas.addEventListener('contextmenu',event=>event.preventDefault());

const KEY_TO_MOVE={
  ArrowUp:'in',w:'in',W:'in',' ':'in',
  ArrowDown:'out',s:'out',S:'out',
  ArrowLeft:'left',a:'left',A:'left',
  ArrowRight:'right',d:'right',D:'right'
};
window.addEventListener('keydown',event=>{
  const moveType=KEY_TO_MOVE[event.key];
  if(moveType){
    event.preventDefault();
    getAudioContext();
    if(gameState==='play')startMove(moveType);else handleMenuTap();
  }else if(event.key==='Enter'){
    event.preventDefault();
    handleMenuTap();
  }else if(event.key==='m'||event.key==='M'){
    toggleMute();
  }
});
window.addEventListener('resize',resizeCanvas);
