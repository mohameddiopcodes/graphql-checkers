export default function computePossibleMoves(
  size: number,
  state: Array<Array<number>>,
  chip: { x: number; y: number }
) {
  const chipValue = state[chip.x][chip.y];
  const topLeft = computeTopLeft(chip);
  const topRight = computeTopRight(size, chip);
  const bottomLeft = computeBottomLeft(size, chip);
  const bottomRight = computeBottomRight(size, chip);
  if (chipValue <= 1) {
    return chipValue === 1 ? [bottomLeft, bottomRight] : [topLeft, topRight];
  } else {
    return [topLeft, topRight, bottomLeft, bottomRight];
  }
}

function computeTopLeft(chip: { x: number; y: number }) {
  return chip.x - 1 >= 0 && chip.y - 1 >= 0 ? [chip.x - 1, chip.y - 1] : null;
}
function computeTopRight(size: number, chip: { x: number; y: number }) {
  return chip.x - 1 >= 0 && chip.y + 1 < size ? [chip.x - 1, chip.y + 1] : null;
}
function computeBottomLeft(size: number, chip: { x: number; y: number }) {
  return chip.x + 1 < size && chip.y - 1 >= 0 ? [chip.x + 1, chip.y - 1] : null;
}
function computeBottomRight(size: number, chip: { x: number; y: number }) {
  return chip.x + 1 < size && chip.y + 1 < size
    ? [chip.x + 1, chip.y + 1]
    : null;
}
