export function classifyBoat(boat, classId, progress, scanLock, streak) {
  const isCorrect = classId === boat.classId;
  const remainingBonus = Math.max(0, Math.round((1 - progress) * 120));
  const scanBonus = scanLock ? 45 : 0;
  const streakBonus = isCorrect ? Math.min(120, streak * 15) : 0;

  if (!isCorrect) {
    return {
      isCorrect,
      points: -45,
      outcome: 'Wrong stamp',
      message: `Incorrect. ${boat.name} was ${boat.classId.toUpperCase()}. ${boat.feedback}`
    };
  }

  return {
    isCorrect,
    points: 120 + remainingBonus + scanBonus + streakBonus,
    outcome: scanLock ? 'Locked and classified' : 'Snap classification',
    message: boat.feedback
  };
}

export function missBoat(boat) {
  return {
    isCorrect: false,
    points: -60,
    outcome: 'Sailed past unclassified',
    message: `${boat.name} escaped the reporting window. Incident report generated.`
  };
}

export function performanceReview(accuracy, score, missed) {
  if (accuracy >= 90 && score > 1200 && missed === 0) return 'Outstanding action classification. Your reflexes are alarming and will be added to a dashboard.';
  if (accuracy >= 75) return 'Strong APS5 performance. You classified under pressure with only moderate procedural smoke.';
  if (accuracy >= 50) return 'Adequate. Recommend remedial training in fast-moving hull vibes.';
  return 'Development opportunity identified. The ocean defeated the spreadsheet today.';
}
