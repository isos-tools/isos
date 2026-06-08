export function formatHeadingCounts(
  arr: number[],
  documentClass?: string,
  hasPart?: boolean,
) {
  if (['report', 'book'].includes(documentClass || '')) {
    if (hasPart) {
      if (arr.length === 1) {
        return `Part ${arr[0]}:`;
      } else if (arr.length === 2) {
        return `Chapter ${arr[1]}:`;
      } else if (arr.length < 5) {
        return arr.slice(1).join('.');
      }
    } else {
      if (arr.length === 1) {
        return `Chapter ${arr[0]}:`;
      } else if (arr.length < 4) {
        return arr.join('.');
      }
    }
    return '';
  } else {
    if (arr.length < 4) {
      return arr.join('.');
    }
    return '';
  }
  // return arr.map((s) => s + '.').join('');
}
