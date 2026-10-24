'use strict';

/*
  board-view.js
  Builds the board and number pad once, then redraws them from `game` with renderGame().
  Used by: actions.js, dialogs.js, main.js. Needs: config.js, board-geometry.js, utils.js, assets.js, game-state.js.
*/

/* =====================================================================
   PAGE ELEMENTS
   ===================================================================== */

const boardElement = document.getElementById('board');
const numberPadElement = document.getElementById('pad');
const overlayElement = document.getElementById('overlay');

const cellButtons = [];          // the 81 board buttons
const cellValueElements = [];    // the big digit inside each cell
const cellNoteElements = [];     // for each cell, its nine small pencil-mark digits
const padKeyButtons = [];        // buttons 1-9 under the board
const padKeyCountLabels = [];    // the "how many left" label on each pad button

// Builds the 81 cells and the 9 number buttons once. After that we only update them.
(function buildBoardAndPad() {
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    const row = Math.floor(cell / 9);
    const column = cell % 9;

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.cell = cell;

    // Class names add the thicker lines between the 3x3 boxes (see the CSS).
    // `cr`/`cb` = thick right/bottom edge, `ce`/`be` = no edge on the last column/row.
    button.className = 'cell'
      + (column % 3 === 2 && column < 8 ? ' cr' : '')
      + (row % 3 === 2 && row < 8 ? ' cb' : '')
      + (column === 8 ? ' ce' : '')
      + (row === 8 ? ' be' : '');

    // One big digit plus a 3x3 grid of small pencil marks.
    let markup = '<span class="v"></span><span class="nt">';
    for (let digit = 1; digit <= 9; digit++) markup += '<i>' + fruitIcon(digit) + '</i>';
    button.innerHTML = markup + '</span>';

    boardElement.appendChild(button);
    cellButtons.push(button);
    cellValueElements.push(button.firstChild);
    cellNoteElements.push(Array.from(button.lastChild.children));
  }

  for (let digit = 1; digit <= 9; digit++) {
    const key = document.createElement('button');
    key.type = 'button';
    key.className = 'key';
    key.dataset.digit = digit;
    key.setAttribute('aria-label', 'Enter ' + FRUIT_NAMES[digit - 1]);
    key.innerHTML = '<span class="d">' + fruitIcon(digit) + '</span><span class="n"></span>';
    numberPadElement.appendChild(key);
    padKeyButtons.push(key);
    padKeyCountLabels.push(key.lastChild);
  }
})();

/* =====================================================================
   DRAWING
   renderGame() makes the page match the `game` object. It is called after
   every change, so the rest of the code never edits the display directly.
   ===================================================================== */

function renderGame() {
  const selectedCell = game.selectedCell;
  const selectedDigit = selectedCell >= 0 ? game.currentDigits[selectedCell] : 0;
  const selectedPeers = selectedCell >= 0 ? peerCellsOf[selectedCell] : [];
  const correctDigitCounts = new Array(10).fill(0); // index = digit 1..9

  for (let cell = 0; cell < CELL_COUNT; cell++) {
    const digit = game.currentDigits[cell];
    const button = cellButtons[cell];
    const isGiven = game.givenDigits[cell] !== 0;
    const isWrong = digit !== 0 && digit !== game.solvedDigits[cell];

    if (digit && !isWrong) correctDigitCounts[digit]++;

    // Classes decide colours: player digit, wrong digit, selection, highlights.
    button.classList.toggle('given', isGiven);
    button.classList.toggle('bad', isWrong);
    button.classList.toggle('hasv', digit !== 0);
    button.classList.toggle('sel', cell === selectedCell);
    button.classList.toggle('peer', selectedCell >= 0 && cell !== selectedCell && selectedPeers.includes(cell));
    button.classList.toggle('same', selectedDigit !== 0 && digit === selectedDigit && cell !== selectedCell);

    // Draw the fruit for this digit. The markup is only rebuilt when the digit changes.
    if (cellValueElements[cell].dataset.digit !== String(digit)) {
      cellValueElements[cell].dataset.digit = digit;
      cellValueElements[cell].innerHTML = digit ? fruitIcon(digit) : '';
    }

    // Show pencil marks only on empty cells.
    if (!digit) {
      for (let digitIndex = 0; digitIndex < 9; digitIndex++) {
        const markIsSet = (game.pencilNoteMasks[cell] & (1 << digitIndex)) !== 0;
        cellNoteElements[cell][digitIndex].classList.toggle('on', markIsSet);
      }
    }

    button.setAttribute('aria-label',
      'Row ' + (Math.floor(cell / 9) + 1) + ', column ' + (cell % 9 + 1) + ', '
      + (digit ? (isGiven ? 'given ' : '') + FRUIT_NAMES[digit - 1] : 'empty'));
  }

  // Number pad: show how many of each digit are still missing, and disable finished digits.
  for (let digit = 1; digit <= 9; digit++) {
    const remaining = 9 - correctDigitCounts[digit];
    padKeyCountLabels[digit - 1].textContent = remaining > 0 ? remaining : '';
    padKeyButtons[digit - 1].disabled = remaining <= 0;
  }

  // Header and tool buttons.
  document.getElementById('timer').textContent = formatTime(game.elapsedSeconds);
  document.getElementById('miss').textContent = game.mistakeCount + '/' + MAX_MISTAKES;
  document.getElementById('miss-wrap').className = game.mistakeCount > 0 ? 'warn' : '';

  document.getElementById('notes').setAttribute('aria-pressed', game.isNotesMode ? 'true' : 'false');
  document.getElementById('notes-badge').textContent = game.isNotesMode ? 'on' : 'off';

  const hintsLeft = MAX_HINTS - game.hintsUsed;
  document.getElementById('hint-badge').textContent = hintsLeft;
  document.getElementById('hint').disabled = hintsLeft <= 0;
  document.getElementById('undo').disabled = undoStack.length === 0;

  // Difficulty switch: mark the current level.
  ['easy', 'medium', 'hard'].forEach(function (level) {
    document.getElementById('lv-' + level).setAttribute('aria-checked', game.level === level ? 'true' : 'false');
  });
}
