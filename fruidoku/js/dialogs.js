'use strict';

/*
  dialogs.js
  The pop-up box: win / out-of-mistakes message and the "Start a new game?" confirmation.
  Used by: actions.js, main.js. Needs: config.js, utils.js, game-state.js, board-view.js, actions.js.
*/

/* =====================================================================
   DIALOGS
   One overlay element is reused for two purposes:
     'end'     - shown when the puzzle is solved or mistakes run out
     'confirm' - shown before throwing away a game in progress
   ===================================================================== */

function hideOverlay() {
  overlayElement.hidden = true;
}

function showEndDialog(playerWon) {
  overlayElement.dataset.mode = 'end';
  document.getElementById('ov-title').textContent = playerWon ? 'Solved' : 'Out of mistakes';
  document.getElementById('ov-text').textContent = playerWon
    ? LEVEL_LABEL[game.level] + ' puzzle complete.'
    : 'Three wrong numbers ends the round. Try the same puzzle again or start a new one.';

  // Summary tiles: time, mistakes, hints.
  const factsElement = document.getElementById('ov-facts');
  factsElement.hidden = false;
  factsElement.innerHTML = '';
  [[formatTime(game.elapsedSeconds), 'time'], [game.mistakeCount, 'mistakes'], [game.hintsUsed, 'hints']]
    .forEach(function (fact) {
      const tile = document.createElement('div');
      const value = document.createElement('b');
      const label = document.createElement('span');
      value.textContent = fact[0];
      label.textContent = fact[1];
      tile.appendChild(value);
      tile.appendChild(label);
      factsElement.appendChild(tile);
    });

  const primaryButton = document.getElementById('ov-primary');
  const secondaryButton = document.getElementById('ov-secondary');
  if (playerWon) {
    primaryButton.textContent = 'New ' + LEVEL_LABEL[game.level].toLowerCase() + ' game';
    primaryButton.onclick = function () { startNewGame(game.level); };
    secondaryButton.hidden = true;
  } else {
    primaryButton.textContent = 'Try again';
    primaryButton.onclick = restartSamePuzzle;
    secondaryButton.hidden = false;
    secondaryButton.textContent = 'New game';
    secondaryButton.onclick = function () { startNewGame(game.level); };
  }
  overlayElement.hidden = false;
  primaryButton.focus();
}

// True if the player has entered anything beyond the starting numbers.
function hasUnsavedProgress() {
  if (isGameFinished()) return false;
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    if (game.currentDigits[cell] !== game.givenDigits[cell]) return true;
  }
  return false;
}

// Used by "New game" and the difficulty switch: asks first if progress would be lost.
function requestNewGame(level) {
  if (!hasUnsavedProgress()) {
    startNewGame(level);
    return;
  }
  overlayElement.dataset.mode = 'confirm';
  document.getElementById('ov-title').textContent = 'Start a new game?';
  document.getElementById('ov-text').textContent = 'You will lose your progress on this puzzle.'
    + (level !== game.level ? ' The new puzzle will be ' + LEVEL_LABEL[level] + '.' : '');
  document.getElementById('ov-facts').hidden = true;

  const primaryButton = document.getElementById('ov-primary');
  const secondaryButton = document.getElementById('ov-secondary');
  primaryButton.textContent = 'Start new game';
  primaryButton.onclick = function () { startNewGame(level); };
  secondaryButton.hidden = false;
  secondaryButton.textContent = 'Keep playing';
  secondaryButton.onclick = hideOverlay;

  overlayElement.hidden = false;
  secondaryButton.focus(); // the safe choice gets focus so a stray Enter keeps the game
}
