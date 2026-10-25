/* =========================================================================
 * ASSET: planet looks
 *
 * Data only. Describes how each planet is coloured and which surface style it uses.
 * The painting code lives in planet-art.js.
 * ========================================================================= */
'use strict';

/**
 * Planet looks. The level number picks one, so each level ends at a different world.
 *   kind: how the surface is painted ('terran', 'desert', 'gas', 'lava', 'ice')
 *   ring: colour of a ring around the planet (optional)
 */
const PLANET_STYLES=[
  {name:'Aqua',kind:'terran',surfaceLight:'#59b8ff',surfaceDark:'#10286b',landColor:'#46c277',glowColor:'#4fb3ff',cloudColor:'#ffffff'},
  {name:'Rustra',kind:'desert',surfaceLight:'#ff9d66',surfaceDark:'#6d2216',landColor:'#c85a2e',glowColor:'#ff7a4f',cloudColor:'#ffe2cf'},
  {name:'Violeta',kind:'gas',surfaceLight:'#cfb0ff',surfaceDark:'#2f1b66',landColor:'#8c6bff',glowColor:'#a98bff',cloudColor:'#f1e8ff',
    bandColors:['#efe3ff','#b693f2','#7a56c9','#d9c3ff','#8f6ad8'],stormColor:'#ff8fb1'},
  {name:'Aurum',kind:'gas',surfaceLight:'#ffd983',surfaceDark:'#7d3f1a',landColor:'#e0923d',glowColor:'#ffbf5a',cloudColor:'#fff3d6',
    bandColors:['#fff0c9','#e8b565','#b9702f','#f6d28b','#c98a43'],stormColor:'#b8441f',ring:'#ffe9b8'},
  {name:'Cinder',kind:'lava',surfaceLight:'#4a2a28',surfaceDark:'#12080a',landColor:'#ff6a1f',glowColor:'#ff5a2a',cloudColor:'#3a1a14'},
  {name:'Glacia',kind:'ice',surfaceLight:'#e8f6ff',surfaceDark:'#33507f',landColor:'#7fa8d8',glowColor:'#9be7ff',cloudColor:'#ffffff'}
];
const planetStyleForLevel=()=>PLANET_STYLES[(level-1)%PLANET_STYLES.length];
