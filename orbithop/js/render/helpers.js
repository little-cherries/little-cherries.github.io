/* =========================================================================
 * RENDER: small canvas drawing helpers
 *
 * Rounded rectangles and text, shared by the HUD, screens and world.
 * ========================================================================= */
'use strict';

function roundedRect(x,y,width,height,cornerRadius){
  context.beginPath();
  context.moveTo(x+cornerRadius,y);
  context.arcTo(x+width,y,x+width,y+height,cornerRadius);
  context.arcTo(x+width,y+height,x,y+height,cornerRadius);
  context.arcTo(x,y+height,x,y,cornerRadius);
  context.arcTo(x,y,x+width,y,cornerRadius);
  context.closePath();
}
function drawText(text,x,y,size,color,align,weight){
  context.font=fontString(size,weight);
  context.fillStyle=color;
  context.textAlign=align||'left';
  context.textBaseline='alphabetic';
  context.fillText(text,x,y);
}
