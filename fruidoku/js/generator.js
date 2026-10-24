'use strict';

/*
  generator.js
  Makes a new puzzle: a solver that can count solutions, and a generator that removes clues while keeping one answer.
  Used by: actions.js, main.js. Needs: config.js, board-geometry.js, utils.js.
*/

/* =====================================================================
   PUZZLE GENERATION
   1. Fill a complete valid grid using a randomised solver.
   2. Remove numbers one at a time, but only keep a removal if the puzzle
      still has exactly one solution.
   ===================================================================== */

/*
  Backtracking solver.

  `grid` is an array of 81 digits, with 0 meaning empty.
  The solver tracks which digits are already used in each row, column and
  box as bitmasks: digit d is stored as bit (d - 1), so 1 -> 0b000000001
  and 9 -> 0b100000000.

  It always fills the empty cell with the fewest possible digits first,
  which keeps the search very small.

  It stops once it has found `solutionLimit` solutions. Passing 2 is
  enough to answer "is this solution unique?".
  With `randomizeOrder` it tries digits in random order, which is how we
  create a random complete grid from an empty one.

  Returns how many solutions it found and a copy of the first one.
*/
function solveGrid(grid, solutionLimit, randomizeOrder) {
  const rowDigitMasks = new Array(9).fill(0);
  const columnDigitMasks = new Array(9).fill(0);
  const boxDigitMasks = new Array(9).fill(0);
  const workingGrid = grid.slice(); // never modify the caller's grid
  let solutionCount = 0;
  let firstSolution = null;

  // Record the digits that are already on the board.
  for (let cell = 0; cell < CELL_COUNT; cell++) {
    const digit = workingGrid[cell];
    if (digit) {
      const digitBit = 1 << (digit - 1);
      rowDigitMasks[Math.floor(cell / 9)] |= digitBit;
      columnDigitMasks[cell % 9] |= digitBit;
      boxDigitMasks[boxIndexOfCell[cell]] |= digitBit;
    }
  }

  function search() {
    // Step 1: find the empty cell with the fewest candidate digits.
    let bestCell = -1;
    let bestCandidates = 0;     // bitmask of digits that fit in bestCell
    let bestCandidateCount = 10;

    for (let cell = 0; cell < CELL_COUNT; cell++) {
      if (workingGrid[cell]) continue;
      const usedDigits = rowDigitMasks[Math.floor(cell / 9)] | columnDigitMasks[cell % 9] | boxDigitMasks[boxIndexOfCell[cell]];
      const candidates = ~usedDigits & 0b111111111;

      // Count the set bits in `candidates`.
      let candidateCount = 0;
      let remaining = candidates;
      while (remaining) {
        remaining &= remaining - 1; // clears the lowest set bit
        candidateCount++;
      }

      if (candidateCount < bestCandidateCount) {
        bestCandidateCount = candidateCount;
        bestCell = cell;
        bestCandidates = candidates;
        if (candidateCount <= 1) break; // can't do better than 0 or 1
      }
    }

    // Step 2: no empty cell left means the grid is solved.
    if (bestCell < 0) {
      solutionCount++;
      if (!firstSolution) firstSolution = workingGrid.slice();
      return;
    }

    // An empty cell with no candidates is a dead end: go back and try something else.
    if (bestCandidateCount === 0) return;

    // Step 3: try each candidate digit in the chosen cell.
    const digitsToTry = [];
    for (let digitIndex = 0; digitIndex < 9; digitIndex++) {
      if (bestCandidates & (1 << digitIndex)) digitsToTry.push(digitIndex);
    }
    if (randomizeOrder) shuffleInPlace(digitsToTry);

    const row = Math.floor(bestCell / 9);
    const column = bestCell % 9;
    const box = boxIndexOfCell[bestCell];

    for (const digitIndex of digitsToTry) {
      const digitBit = 1 << digitIndex;

      // Place the digit and mark it as used...
      workingGrid[bestCell] = digitIndex + 1;
      rowDigitMasks[row] |= digitBit;
      columnDigitMasks[column] |= digitBit;
      boxDigitMasks[box] |= digitBit;

      search(); // ...then solve the rest of the grid.

      // Undo the placement before trying the next digit.
      workingGrid[bestCell] = 0;
      rowDigitMasks[row] &= ~digitBit;
      columnDigitMasks[column] &= ~digitBit;
      boxDigitMasks[box] &= ~digitBit;

      if (solutionCount >= solutionLimit) return;
    }
  }

  search();
  return { solutionCount, firstSolution };
}

// Builds a puzzle for the given level. Returns the puzzle (with blanks) and its solution.
function generatePuzzle(level) {
  const emptyGrid = new Array(CELL_COUNT).fill(0);
  const solvedGrid = solveGrid(emptyGrid, 1, true).firstSolution;

  const puzzleGrid = solvedGrid.slice();
  const removalOrder = shuffleInPlace(emptyGrid.map((_, cell) => cell));
  const targetClues = CLUES_BY_LEVEL[level];
  let clueCount = CELL_COUNT;
  const startedAt = Date.now();

  for (const cell of removalOrder) {
    if (clueCount <= targetClues) break;
    if (Date.now() - startedAt > MAX_GENERATION_MS) break;

    const removedDigit = puzzleGrid[cell];
    puzzleGrid[cell] = 0;

    // Keep the removal only if exactly one solution remains.
    if (solveGrid(puzzleGrid, 2, false).solutionCount === 1) {
      clueCount--;
    } else {
      puzzleGrid[cell] = removedDigit; // put it back
    }
  }
  return { givenDigits: puzzleGrid, solvedDigits: solvedGrid };
}
