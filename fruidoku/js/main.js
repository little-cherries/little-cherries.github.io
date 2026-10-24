'use strict';

/*
  main.js
  Starts everything: connects taps and clicks to the actions, runs the timer, and loads the saved game (or starts a new one).
  Loaded last. Needs: all other files.
*/

/* =====================================================================
   EVENT HANDLERS
   ===================================================================== */

// Tapping a cell selects it. One listener on the board handles all 81 cells.
boardElement.addEventListener('click', function (event) {
  const button = event.target.closest('.cell');
  if (!button) return;
  game.selectedCell = Number(button.dataset.cell);
  renderGame();
});

// Number pad (fruit buttons).
numberPadElement.addEventListener('click', function (event) {
  const key = event.target.closest('.key');
  if (key) enterDigit(Number(key.dataset.digit));
});

// Tool buttons.
document.getElementById('undo').addEventListener('click', undoLastMove);
document.getElementById('erase').addEventListener('click', eraseSelectedCell);
document.getElementById('hint').addEventListener('click', giveHint);
document.getElementById('notes').addEventListener('click', function () {
  game.isNotesMode = !game.isNotesMode;
  renderGame();
});

// New game and difficulty buttons go through the confirmation check.
document.getElementById('new-game').addEventListener('click', function () {
  requestNewGame(game.level);
});
document.querySelectorAll('.seg button').forEach(function (button) {
  button.addEventListener('click', function () {
    if (button.dataset.level !== game.level) requestNewGame(button.dataset.level);
  });
});

// Tapping the dark area around the confirmation box closes it.
overlayElement.addEventListener('click', function (event) {
  if (event.target === overlayElement && overlayElement.dataset.mode === 'confirm') hideOverlay();
});

// Timer: counts one second at a time while a game is in progress and the tab is visible.
setInterval(function () {
  if (!game || isGameFinished() || document.hidden) return;
  game.elapsedSeconds++;
  document.getElementById('timer').textContent = formatTime(game.elapsedSeconds);
  if (game.elapsedSeconds % 5 === 0) saveGame(); // save the clock every few seconds
}, 1000);

/* =====================================================================
   START UP
   Resume the saved game if there is one, otherwise start a Medium game.
   ===================================================================== */

const savedGame = loadSavedGame();
if (savedGame) {
  game = savedGame;
  if (game.selectedCell < 0 || game.selectedCell >= CELL_COUNT) game.selectedCell = firstUnsolvedCell();
  undoStack = []; // undo history is not saved
  renderGame();
} else {
  game = createGame('medium', generatePuzzle('medium'));
  game.selectedCell = firstUnsolvedCell();
  renderGame();
  saveGame();
}
