export const calculateScores = (type, scores) => {
  const rankPoints =
    type === "catan" || type === "cavaleri" ? [5, 3, 2, 1] : [7, 5, 4, 3, 2, 1];
  const scoresArr = scores.map((player) => player.score);

  let points = [];
  let equalScoresCount = 0;
  let equalPoints = 0;

  for (let i = 0; i < scoresArr.length; i++) {
    equalPoints = rankPoints[i];

    for (let j = i + 1; j < scoresArr.length + 1; j++) {
      if (points[i]) break;
      equalScoresCount++;
      if (scoresArr[i] !== scoresArr[j]) break;
      equalPoints += rankPoints[j];
    }

    for (let k = 0; k < equalScoresCount; k++) {
      points[k + i] = equalPoints / equalScoresCount;
    }

    equalScoresCount = 0;
  }

  return points;
};
