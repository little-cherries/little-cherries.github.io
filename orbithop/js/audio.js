/* =========================================================================
 * AUDIO: tiny synthesised sound effects
 *
 * No audio files. Each sound is a short oscillator beep made with the Web Audio API.
 * ========================================================================= */
'use strict';

let audioContext=null;
/** Browsers only allow sound after a tap, so this is called from input handlers. */
function getAudioContext(){
  if(audioContext===null){
    try{audioContext=new (window.AudioContext||window.webkitAudioContext)();}catch(error){audioContext=false;}
  }
  if(audioContext&&audioContext.state==='suspended'){try{audioContext.resume();}catch(error){}}
  return audioContext||null;
}
function playTone(frequency,duration,waveform,volume,endFrequency,delay){
  if(soundMuted)return;
  const audio=getAudioContext();
  if(!audio)return;
  try{
    const startTime=audio.currentTime+(delay||0);
    const oscillator=audio.createOscillator(),gain=audio.createGain();
    oscillator.type=waveform||'square';
    oscillator.frequency.setValueAtTime(frequency,startTime);
    if(endFrequency)oscillator.frequency.exponentialRampToValueAtTime(endFrequency,startTime+duration);
    gain.gain.setValueAtTime(volume||.05,startTime);
    gain.gain.exponentialRampToValueAtTime(.0001,startTime+duration);   // fade out to avoid clicks
    oscillator.connect(gain);gain.connect(audio.destination);
    oscillator.start(startTime);oscillator.stop(startTime+duration+.03);
  }catch(error){}
}
const sounds={
  hopIn(){playTone(420,.1,'triangle',.07,760);},
  hopOut(){playTone(520,.1,'triangle',.06,300);},
  slide(){playTone(360,.07,'sine',.05,460);},
  bump(){playTone(140,.08,'square',.05,100);},
  crash(){playTone(260,.55,'sawtooth',.08,40);playTone(90,.4,'square',.06,30);},
  planetReached(){[523,659,784,1047].forEach((note,i)=>playTone(note,.16,'triangle',.07,null,i*.09));},
  newOrbit(){playTone(880,.07,'sine',.04,1175);}
};
