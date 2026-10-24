'use strict';

/*
  game-state.js
  The `game` object (everything about the current round) plus saving to and loading from the browser.
  Used by: board-view.js, actions.js, dialogs.js, main.js. Needs: config.js.
*/

/* =====================================================================
   GAME STATE
   ===================================================================== */

/*
  `game` holds everything needed to draw the board and to save it:
    level            'easy' | 'medium' | 'hard'
    givenDigits      the puzzle as generated (0 = empty). Never changes.
    solvedDigits     the unique solution. Used to detect wrong numbers.
    currentDigits    what is on the board now (givens + the player's entries)
    pencilNoteMasks  per cell, a bitmask of pencil-mark digits (bit d-1 = digit d)
    mistakeCount, hintsUsed, elapsedSeconds
    selectedCell     0..80, or -1 for none
    isNotesMode      true when number buttons toggle pencil marks
    isSolved         the puzzle is complete
    isOutOfMistakes  the player used up all their mistakes
*/
let game = null;

// Snapshots of the board taken before each move, so Undo can step back.
let undoStack = [];

function createGame(level, puzzle) {
  return {
    level: level,
    givenDigits: puzzle.givenDigits,
    solvedDigits: puzzle.solvedDigits,
    currentDigits: puzzle.givenDigits.slice(),
    pencilNoteMasks: new Array(CELL_COUNT).fill(0),
    mistakeCount: 0,
    hintsUsed: 0,
    elapsedSeconds: 0,
    selectedCell: -1,
    isNotesMode: false,
    isSolved: false,
    isOutOfMistakes: false
  };
}

// First cell that does not yet hold its correct digit. Used as the starting selection.
function firstUnsolvedCell() {
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    if (game.currentDigits[cell] !== game.solvedDigits[cell]) return cell;
  }
  return 0;
}

// The game ends when it is solved or the mistakes are used up. Input is locked then.
function isGameFinished() {
  return game.isSolved || game.isOutOfMistakes;
}

/* ---------- Saving to the browser ---------- */
// Storage can be blocked (private windows etc.), so every access is wrapped in try/catch.

function saveGame() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(game)); } catch (error) { /* ignore */ }
}

// Returns a previously saved, unfinished game, or null if there is none or it looks damaged.
function loadSavedGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved || !CLUES_BY_LEVEL[saved.level]) return null;

    const listsAreValid = ['givenDigits', 'solvedDigits', 'currentDigits', 'pencilNoteMasks']
      .every(name => Array.isArray(saved[name]) && saved[name].length === CELL_COUNT);
    if (!listsAreValid || saved.isSolved) return null;
    return saved;
  } catch (error) {
    return null;
  }
}
