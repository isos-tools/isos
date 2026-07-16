export function unindentStringAndTrim(str: string) {
  return unindentString(str).trim();
  // .replace(/[^\S\r\n]/g, ' ');
}

function unindentString(str: string) {
  const arr = str.split('\n');
  const indentIdx = arr.reduce((acc, line) => {
    const idx = line.search(/[^\s]/);
    return idx > -1 && idx < acc ? idx : acc;
  }, 100);
  return arr.map((s) => s.slice(indentIdx)).join('\n');
}
