'use strict';

/*
  assets.js
  The fruit pictures. Fruit number n is drawn for digit n, so the game logic only ever deals with the digits 1-9
  and this file decides what they look like. To change a picture, edit its <symbol> below.
  Used by: board-view.js. Needs: nothing.
*/

/* ---------- Names (index 0 is digit 1) ---------- */
// Each digit 1-9 is shown as one fruit. FRUIT_NAMES[0] is the fruit for digit 1, and so on.
// The names are also read out by screen readers, e.g. "Row 1, column 2, Apple".
const FRUIT_NAMES = ['Apple', 'Orange', 'Pineapple', 'Watermelon', 'Grapes', 'Strawberry', 'Pear', 'Cherries', 'Lemon'];

// Returns the SVG markup that draws the fruit for a digit.
function fruitIcon(digit) {
  return '<svg viewBox="0 0 64 64" aria-hidden="true"><use href="#fruit-' + digit + '"/></svg>';
}

/* ---------- Drawings ---------- */
// Each fruit is an SVG <symbol>. They are added to the page once, then drawn anywhere with <use href="#fruit-n">.
const FRUIT_SPRITE_MARKUP = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <!-- 1 Apple -->
    <symbol id="fruit-1" viewBox="0 0 64 64">
      <path d="M32 20c-6-5-20-3-20 14 0 14 9 24 16 24 2 0 3-1 4-1s2 1 4 1c7 0 16-10 16-24 0-17-14-19-20-14z" fill="#e03131" stroke="#8f1d1d" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M32 20c0-6 2-10 6-13" fill="none" stroke="#5b3a1e" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M37 13c4-6 11-5 14-3-1 6-8 9-14 3z" fill="#51b848" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="21" cy="32" rx="3" ry="6" fill="#fff" opacity=".35" transform="rotate(15 21 32)"/>
    </symbol>
    <!-- 2 Orange -->
    <symbol id="fruit-2" viewBox="0 0 64 64">
      <circle cx="32" cy="36" r="23" fill="#ff922b" stroke="#c2570c" stroke-width="2.5"/>
      <path d="M31 13c0-5 4-8 10-8 0 6-4 9-10 8z" fill="#51b848" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="32" cy="14" r="2.5" fill="#8a4a0f"/>
      <path d="M17 34a15 15 0 0 1 8-12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"/>
      <g fill="#e8710f" opacity=".6"><circle cx="38" cy="42" r="1.2"/><circle cx="26" cy="46" r="1.2"/><circle cx="44" cy="34" r="1.2"/><circle cx="33" cy="52" r="1.2"/></g>
    </symbol>
    <!-- 3 Pineapple -->
    <symbol id="fruit-3" viewBox="0 0 64 64">
      <clipPath id="pineapple-body"><ellipse cx="32" cy="42" rx="16" ry="20"/></clipPath>
      <path d="M32 26C25 18 20 14 21 5c4 3 8 8 11 14 3-6 7-11 11-14 1 9-4 13-11 21z" fill="#3f9e45" stroke="#25692b" stroke-width="2" stroke-linejoin="round"/>
      <path d="M32 26C24 22 15 20 12 13c7 0 15 4 20 13zM32 26c8-4 17-6 20-13-7 0-15 4-20 13z" fill="#51b848" stroke="#25692b" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="32" cy="42" rx="16" ry="20" fill="#fcc419"/>
      <g clip-path="url(#pineapple-body)" stroke="#c77d0a" stroke-width="2" opacity=".75">
        <path d="M10 28l44 40M10 40l44 40M10 16l44 40M10 52l32 30M24 22l40 36"/>
        <path d="M54 28L10 68M54 40L10 80M54 16L10 56M54 52L22 82M40 22L0 58"/>
      </g>
      <ellipse cx="32" cy="42" rx="16" ry="20" fill="none" stroke="#b7791f" stroke-width="2.5"/>
    </symbol>
    <!-- 4 Watermelon slice -->
    <symbol id="fruit-4" viewBox="0 0 64 64">
      <g transform="translate(0 6)">
        <path d="M4 24a28 28 0 0 0 56 0z" fill="#2f9e44" stroke="#1d6b2d" stroke-width="2" stroke-linejoin="round"/>
        <path d="M8 24a24 24 0 0 0 48 0z" fill="#d3f9d8"/>
        <path d="M11 24a21 21 0 0 0 42 0z" fill="#fa5252"/>
        <g fill="#2b1d12"><ellipse cx="22" cy="33" rx="1.8" ry="3" transform="rotate(-20 22 33)"/><ellipse cx="32" cy="40" rx="1.8" ry="3"/><ellipse cx="42" cy="33" rx="1.8" ry="3" transform="rotate(20 42 33)"/><ellipse cx="32" cy="29" rx="1.8" ry="3"/></g>
        <path d="M4 24h56" stroke="#1d6b2d" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    </symbol>
    <!-- 5 Grapes -->
    <symbol id="fruit-5" viewBox="0 0 64 64">
      <path d="M32 22v-9" stroke="#5b3a1e" stroke-width="3" stroke-linecap="round"/>
      <path d="M33 14c4-7 13-7 18-4-2 7-11 9-18 4z" fill="#51b848" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>
      <g fill="#7048e8" stroke="#45299c" stroke-width="2">
        <circle cx="21" cy="29" r="8"/><circle cx="43" cy="29" r="8"/><circle cx="32" cy="27" r="8"/>
        <circle cx="26" cy="41" r="8"/><circle cx="38" cy="41" r="8"/><circle cx="32" cy="53" r="8"/>
      </g>
      <g fill="#fff" opacity=".45"><circle cx="19" cy="26" r="2"/><circle cx="30" cy="24" r="2"/><circle cx="41" cy="26" r="2"/><circle cx="24" cy="38" r="2"/><circle cx="36" cy="38" r="2"/><circle cx="30" cy="50" r="2"/></g>
    </symbol>
    <!-- 6 Strawberry -->
    <symbol id="fruit-6" viewBox="0 0 64 64">
      <path d="M32 58C16 49 9 35 11 26c2-8 12-9 21-5 9-4 19-3 21 5 2 9-5 23-21 32z" fill="#ff4d6d" stroke="#a61e4d" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M32 22l-12-5 6-1 3-5 3 4 3-4 3 5 6 1z" fill="#51b848" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>
      <g fill="#ffe066"><ellipse cx="22" cy="32" rx="1.5" ry="2.4"/><ellipse cx="32" cy="30" rx="1.5" ry="2.4"/><ellipse cx="42" cy="32" rx="1.5" ry="2.4"/><ellipse cx="26" cy="42" rx="1.5" ry="2.4"/><ellipse cx="38" cy="42" rx="1.5" ry="2.4"/><ellipse cx="32" cy="50" rx="1.5" ry="2.4"/></g>
    </symbol>
    <!-- 7 Pear -->
    <symbol id="fruit-7" viewBox="0 0 64 64">
      <path d="M32 12c-4 0-6 4-6 9 0 7-11 12-11 27 0 9 8 12 17 12s17-3 17-12c0-15-11-20-11-27 0-5-2-9-6-9z" fill="#a9d63a" stroke="#5c7c0b" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M32 12c0-4 1-7 4-9" fill="none" stroke="#5b3a1e" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M36 8c4-4 10-3 13-1-2 5-8 6-13 1z" fill="#51b848" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>
      <path d="M22 46c0 6 3 9 7 10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>
    </symbol>
    <!-- 8 Cherries -->
    <symbol id="fruit-8" viewBox="0 0 64 64">
      <path d="M20 44C22 26 30 16 41 9M43 43C41 30 40 18 41 9" fill="none" stroke="#5b3a1e" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 9c6-5 14-3 17 1-6 5-14 4-17-1z" fill="#51b848" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="20" cy="49" r="11" fill="#c2255c" stroke="#7a1238" stroke-width="2.5"/>
      <circle cx="43" cy="48" r="11" fill="#c2255c" stroke="#7a1238" stroke-width="2.5"/>
      <g fill="#fff" opacity=".45"><circle cx="16" cy="45" r="2.4"/><circle cx="39" cy="44" r="2.4"/></g>
    </symbol>
    <!-- 9 Lemon -->
    <symbol id="fruit-9" viewBox="0 0 64 64">
      <g fill="#ffe066" stroke="#b08a00" stroke-width="2.5" stroke-linejoin="round">
        <ellipse cx="32" cy="35" rx="23" ry="17" transform="rotate(-25 32 35)"/>
        <circle cx="11" cy="45" r="4"/><circle cx="53" cy="25" r="4"/>
      </g>
      <ellipse cx="32" cy="35" rx="21" ry="15" transform="rotate(-25 32 35)" fill="#ffe066"/>
      <path d="M44 15c2-6 8-8 13-6-2 6-7 9-13 6z" fill="#51b848" stroke="#2e7d32" stroke-width="2" stroke-linejoin="round"/>
      <path d="M20 36c2-6 6-9 11-11" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>
    </symbol>
  </defs>
</svg>
`;

document.body.insertAdjacentHTML('afterbegin', FRUIT_SPRITE_MARKUP);
