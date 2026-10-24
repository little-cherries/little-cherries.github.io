'use strict';

/*
  actions.js
  Everything the player can do: enter a fruit, erase, undo, hint, start or restart a game.
  Used by: main.js, dialogs.js. Needs: config.js, board-geometry.js, generator.js, game-state.js, board-view.js, dialogs.js.
*/

/* =====================================================================
   PLAYER ACTIONS
   ===================================================================== */

// Saves a snapshot of the board so the next change can be undone.
function rememberStateForUndo() {
  undoStack.push({
    digits: game.currentDigits.slice(),
    noteMasks: game.pencilNoteMasks.slice()
  });
  if (undoStack.length > 200) undoStack.shift(); // keep memory bounded
}

// After a correct digit is placed, that digit can no longer be a candidate in any peer cell.
function removeNoteFromPeers(cell, digit) {
  const digitBitCleared = ~(1 << (digit - 1));
  for (const peer of peerCellsOf[cell]) game.pencilNoteMasks[peer] &= digitBitCleared;
}

// Runs after every move: checks for a win or a loss, saves, and redraws.
function afterMove() {
  const puzzleIsComplete = game.currentDigits.every((digit, cell) => digit === game.solvedDigits[cell]);

  if (puzzleIsComplete) {
    game.isSolved = true;
    showEndDialog(true);
  } else if (game.mistakeCount >= MAX_MISTAKES) {
    game.isOutOfMistakes = true;
    showEndDialog(false);
  }
  saveGame();
  renderGame();
}

// The player tapped a fruit button.
function enterDigit(digit) {
  if (isGameFinished()) return;
  const cell = game.selectedCell;
  if (cell < 0 || game.givenDigits[cell]) return; // nothing selected, or a locked starting number

  const existingDigit = game.currentDigits[cell];
  if (existingDigit && existingDigit === game.solvedDigits[cell]) return; // correct answers are locked

  if (game.isNotesMode) {
    // Notes mode: flip this digit's pencil mark on or off (XOR toggles one bit).
    if (existingDigit) return; // marks only go in empty cells
    rememberStateForUndo();
    game.pencilNoteMasks[cell] ^= (1 << (digit - 1));
  } else {
    if (existingDigit === digit) return; // same wrong digit again: nothing to do
    rememberStateForUndo();
    game.currentDigits[cell] = digit;
    game.pencilNoteMasks[cell] = 0; // a placed digit replaces any pencil marks

    if (digit !== game.solvedDigits[cell]) {
      game.mistakeCount++; // wrong digit: it stays on the board in red until erased
    } else {
      removeNoteFromPeers(cell, digit);
    }
  }
  afterMove();
}

// Clears a wrong digit and/or the pencil marks from the selected cell.
function eraseSelectedCell() {
  if (isGameFinished()) return;
  const cell = game.selectedCell;
  if (cell < 0 || game.givenDigits[cell]) return;

  const existingDigit = game.currentDigits[cell];
  if (existingDigit && existingDigit === game.solvedDigits[cell]) return; // correct answers stay
  if (!existingDigit && !game.pencilNoteMasks[cell]) return;              // already empty

  rememberStateForUndo();
  game.currentDigits[cell] = 0;
  game.pencilNoteMasks[cell] = 0;
  saveGame();
  renderGame();
}

// Restores the board to how it was before the last move. (Mistakes already counted stay counted.)
function undoLastMove() {
  if (isGameFinished() || undoStack.length === 0) return;
  const snapshot = undoStack.pop();
  game.currentDigits = snapshot.digits;
  game.pencilNoteMasks = snapshot.noteMasks;
  saveGame();
  renderGame();
}

// Reveals the correct digit for the selected cell, or for a random unsolved cell
// if nothing useful is selected.
function giveHint() {
  if (isGameFinished() || game.hintsUsed >= MAX_HINTS) return;

  let targetCell = game.selectedCell;
  const selectionIsUseless = targetCell < 0
    || game.givenDigits[targetCell]
    || game.currentDigits[targetCell] === game.solvedDigits[targetCell];

  if (selectionIsUseless) {
    const unsolvedCells = [];
    for (let cell = 0; cell < CELL_COUNT; cell++) {
      if (game.currentDigits[cell] !== game.solvedDigits[cell]) unsolvedCells.push(cell);
    }
    if (unsolvedCells.length === 0) return;
    targetCell = unsolvedCells[Math.floor(Math.random() * unsolvedCells.length)];
  }

  rememberStateForUndo();
  game.currentDigits[targetCell] = game.solvedDigits[targetCell];
  game.pencilNoteMasks[targetCell] = 0;
  removeNoteFromPeers(targetCell, game.solvedDigits[targetCell]);
  game.hintsUsed++;
  game.selectedCell = targetCell;
  afterMove();
}

// Generates a puzzle and starts playing it. The short timeout lets the browser
// update the page before the (brief) generation work begins.
function startNewGame(level) {
  boardElement.setAttribute('aria-busy', 'true');
  setTimeout(function () {
    game = createGame(level, generatePuzzle(level));
    game.selectedCell = firstUnsolvedCell();
    undoStack = [];
    hideOverlay();
    boardElement.removeAttribute('aria-busy');
    saveGame();
    renderGame();
  }, 30);
}

// Same puzzle, back to the starting position (used after running out of mistakes).
function restartSamePuzzle() {
  game = createGame(game.level, { givenDigits: game.givenDigits, solvedDigits: game.solvedDigits });
  game.selectedCell = firstUnsolvedCell();
  undoStack = [];
  hideOverlay();
  saveGame();
  renderGame();
}
