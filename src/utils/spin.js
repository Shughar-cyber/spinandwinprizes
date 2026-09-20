export function selectPrize(prizes) {
  const available = prizes.filter((prize) => prize.available);
  const total = available.reduce((sum, prize) => sum + (prize.winningProbability || 1), 0);
  let roll = Math.random() * total;

  for (const prize of available) {
    roll -= prize.winningProbability || 1;
    if (roll <= 0) return prize;
  }

  return available[available.length - 1];
}

export function getPrizeAngle(index, total) {
  return (360 / total) * index;
}

export function getBottleRotationForPrize(index, total, currentRotation) {
  const prizeAngle = getPrizeAngle(index, total);
  const pointerOffset = 90;
  const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
  const targetModulo = pointerOffset - prizeAngle;
  const delta = ((targetModulo - normalizedCurrent + 360) % 360) + 360 * 6;
  return currentRotation + delta;
}
