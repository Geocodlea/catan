export const calculateScores = (type, scores) => {
  const rankPoints =
    type === "catan" || type === "cavaleri" ? [5, 3, 2, 1] : [7, 5, 4, 3, 2, 1];

  let points = [];
  let equalScoresCount = 0;
  let equalPoints = 0;

  for (let i = 0; i < scores.length; i++) {
    equalPoints = rankPoints[i];

    for (let j = i + 1; j < scores.length + 1; j++) {
      if (points[i]) break;
      equalScoresCount++;
      if (scores[i] !== scores[j]) break;
      equalPoints += rankPoints[j];
    }

    for (let k = 0; k < equalScoresCount; k++) {
      points[k + i] = equalPoints / equalScoresCount;
    }

    equalScoresCount = 0;
  }

  return points;
};
