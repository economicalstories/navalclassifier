export function classifyBoat(boat, answer, secondsRemaining, streak) {
  const isCorrect = answer === boat.correct;
  if (!isCorrect) return { isCorrect, points: -35, outcome: 'Incident report generated' };
  const speedBonus = Math.max(0, Math.round(secondsRemaining * 7));
  const streakBonus = Math.min(80, streak * 10);
  return {
    isCorrect,
    points: 100 + speedBonus + streakBonus,
    outcome: boat.feedback.toLowerCase().includes('bureaucratically') ? 'Bureaucratically correct' : 'Correct'
  };
}

export function performanceReview(accuracy, score) {
  if (accuracy >= 90 && score > 900) return 'Outstanding classification agility. Please prepare a slide deck explaining why this can be done with fewer resources.';
  if (accuracy >= 75) return 'Strong APS5 performance. Your ability to detect boat-like intent has been noted.';
  if (accuracy >= 50) return 'Adequate. Please attend the mandatory webinar: Hulls, Vibes, and You.';
  return 'Development opportunity identified. A senior officer will reclassify your classifications next quarter.';
}
