export function formatCount(
  arr: number[],
  documentClass?: string,
  hasPart?: boolean,
) {
  if (['report', 'book'].includes(documentClass || '')) {
    if (hasPart) {
      return arr.slice(1).join('.');
    }
  }
  // return arr.map((s) => s + '.').join('');
  return arr.join('.');
}
