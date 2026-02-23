export function formatAppendixCount(arr: number[]) {
  const formatted = [toAlpha(arr[0]), ...arr.slice(1)];
  return formatted.join('.');
}

function toAlpha(num: number) {
  return String.fromCharCode(64 + num);
}
