import test from 'node:test';
import assert from 'node:assert/strict';
import { boats } from './boats.js';
import { classifyBoat, performanceReview } from './scoring.js';

test('classifyBoat awards points for correct answers with speed and streak bonuses', () => {
  const result = classifyBoat(boats[0], boats[0].correct, 10, 2);
  assert.equal(result.isCorrect, true);
  assert.equal(result.points, 190);
  assert.equal(result.outcome, 'Correct');
});

test('classifyBoat penalises wrong answers', () => {
  const result = classifyBoat(boats[0], 'Ferry', 8, 4);
  assert.equal(result.isCorrect, false);
  assert.equal(result.points, -35);
  assert.equal(result.outcome, 'Incident report generated');
});

test('performanceReview returns an excellent review for high accuracy and score', () => {
  assert.match(performanceReview(96, 1200), /Outstanding classification agility/);
});
