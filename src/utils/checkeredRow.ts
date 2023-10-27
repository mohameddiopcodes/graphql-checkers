export default function generateRow(rowId: number, size: number, filler = 1) {
  return checkeredRow(size, rowId, [filler, filler + 1]);
}

function checkeredRow(
  size: number,
  rowId: number,
  chips: Array<number> = [1, 2]
) {
  return rowId === size / 2 - 1 || rowId === size / 2
    ? toArray(size, undefined)
    : fillRow(size, rowId, chips);
}

export function toArray(size: number, filler: number | undefined = undefined) {
  const arr: Array<number | undefined> = [];
  for (let i = 0; i < size; i++) {
    arr.push(filler);
  }
  return arr;
}

function fillRow(n: number, rowId: number, chips: Array<number> = [1, 2]) {
  const arr: Array<number | undefined> = [];
  for (let i = 0; i < n; i++) {
    pushChips(n, arr, i, rowId, chips);
  }
  return arr;
}

function pushChips(
  n: number,
  arr: Array<number | undefined>,
  i: number,
  rowId: number,
  chips: Array<number>
) {
  const check = isEven(i);
  if (rowId < n / 2) {
    pushChip(arr, rowId, chips[0], check);
  } else {
    pushChip(arr, rowId, chips[1], check);
  }
}

function pushChip(
  arr: Array<number | undefined>,
  rowId: number,
  chip: number,
  check: boolean
) {
  if (isEven(rowId)) {
    arr.push(check ? undefined : chip);
  } else {
    arr.push(check ? chip : undefined);
  }
}

function isEven(n: number) {
  return n % 2 === 1;
}
