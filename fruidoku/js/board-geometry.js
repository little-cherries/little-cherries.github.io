'use strict';

/*
  board-geometry.js
  Which board cells belong together (same 3x3 box, same row/column).
  Used by: generator.js, board-view.js, actions.js. Needs: config.js.
*/

/* =====================================================================
   BOARD GEOMETRY
   Cells are numbered 0..80, left to right, top to bottom:
     row = floor(cell / 9), column = cell % 9
   A "box" is one of the nine 3x3 blocks, numbered 0..8 in the same order.
   ===================================================================== */

const boxIndexOfCell = [];  // boxIndexOfCell[cell] -> which 3x3 box the cell is in
const peerCellsOf = [];     // peerCellsOf[cell]    -> the 20 cells sharing its row, column or box

for (let cell = 0; cell < CELL_COUNT; cell++) {
  const row = Math.floor(cell / 9);
  const column = cell % 9;
  boxIndexOfCell.push(Math.floor(row / 3) * 3 + Math.floor(column / 3));
}

for (let cell = 0; cell < CELL_COUNT; cell++) {
  const peers = [];
  for (let other = 0; other < CELL_COUNT; other++) {
    if (other === cell) continue;
    const sameRow = Math.floor(cell / 9) === Math.floor(other / 9);
    const sameColumn = cell % 9 === other % 9;
    const sameBox = boxIndexOfCell[cell] === boxIndexOfCell[other];
    if (sameRow || sameColumn || sameBox) peers.push(other);
  }
  peerCellsOf.push(peers);
}
