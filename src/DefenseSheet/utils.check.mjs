// run: node src/DefenseSheet/utils.check.mjs
import assert from 'node:assert/strict';
import { countThreeStops, summarize } from './utils.ts';

const p = (points, contested = true) => ({ period: 'Q1', defense: 'red', result: '', points, contested });

// Q1 row of the 呈現 sheet: F/2, F/0, so/2, R/1, R/0, R/0, R/失誤 0, so/2
assert.equal(countThreeStops([2, 0, 2, 1, 0, 0, 0, 2].map((pts) => p(pts))), 1);
assert.equal(countThreeStops([0, 0, 0, 0, 0, 0].map((pts) => p(pts))), 2);
assert.equal(countThreeStops([0, 0, 2, 0].map((pts) => p(pts))), 0);

// Q1 of the 統計 sheet: 5 points on 10 possessions = Drtg 50
assert.equal(summarize([2, 3, 0, 0, 0, 0, 0, 0, 0, 0].map((pts) => p(pts)))[2], 50);
assert.deepEqual(summarize([p(2, false), p(0, false), p(3), p(0)]), [5, 4, 125, 2, 1, 200, 3, 1, 300]);
assert.deepEqual(summarize([]), [0, 0, '-', 0, 0, '-', 0, 0, '-']);

console.log('ok');
