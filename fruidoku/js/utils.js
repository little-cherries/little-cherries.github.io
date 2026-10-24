'use strict';

/*
  utils.js
  Small helpers that know nothing about the game itself.
  Used by: generator.js, board-view.js, dialogs.js, main.js. Needs: nothing.
*/

// Fisher-Yates shuffle: puts the array in random order (changes the array itself).
function shuffleInPlace(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = items[i];
    items[i] = items[j];
    items[j] = swap;
  }
  return items;
}

// 75 seconds -> "1:15"
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
