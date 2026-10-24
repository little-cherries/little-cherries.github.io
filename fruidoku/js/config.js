'use strict';

/*
  config.js
  Game settings and fixed numbers. Change these to tune the game.
  Used by: every other file. Needs: nothing.
*/

/* =====================================================================
   SETTINGS
   ===================================================================== */

// Bumped from v1 because the saved-game format changed with the renaming.
const STORAGE_KEY = 'nine-by-nine-v2';  // the saved format is unchanged, so earlier games still load
const CELL_COUNT = 81;
const MAX_MISTAKES = 3;
const MAX_HINTS = 3;

// How many numbers are pre-filled ("clues") at each difficulty. Fewer clues = harder.
const CLUES_BY_LEVEL = { easy: 40, medium: 32, hard: 26 };
const LEVEL_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

// Removing clues one by one can take a while; stop after this long and keep what we have.
const MAX_GENERATION_MS = 1500;
