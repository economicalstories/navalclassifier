import test from 'node:test';
import assert from 'node:assert/strict';
import { boats } from './boats.js';
import { classifyBoat, missBoat, performanceReview } from './scoring.js';

test('classifyBoat awards action bonuses for early scanned correct classifications', () => {
  const result = classifyBoat(boats[0], boats[0].classId, 0.25, true, 3);
  assert.equal(result.isCorrect, true);
  assert.equal(result.points, 300);
  assert.equal(result.outcome, 'Locked and classified');
});

test('classifyBoat penalises the wrong classification stamp', () => {
  const result = classifyBoat(boats[0], 'civilian', 0.5, false, 4);
  assert.equal(result.isCorrect, false);
  assert.equal(result.points, -45);
  assert.equal(result.outcome, 'Wrong stamp');
});

test('missBoat generates a larger penalty than a wrong stamp', () => {
  const result = missBoat(boats[0]);
  assert.equal(result.isCorrect, false);
  assert.equal(result.points, -60);
  assert.match(result.message, /escaped the reporting window/);
});

test('performanceReview recognises clean high-pressure shifts', () => {
  assert.match(performanceReview(96, 1300, 0), /Outstanding action classification/);
});
