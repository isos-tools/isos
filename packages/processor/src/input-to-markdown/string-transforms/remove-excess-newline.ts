export function removeExcessNewline(markdown: string) {
  const lines = markdown.split('\n');

  const newLines = lines.reduce((acc: string[], line) => {
    if (line.trim() === '') {
      const prev = acc[acc.length - 1];
      if (prev?.trim() !== '') {
        acc.push(line);
      }
    } else {
      acc.push(line);
    }
    return acc;
  }, []);

  return newLines.join('\n');
}
