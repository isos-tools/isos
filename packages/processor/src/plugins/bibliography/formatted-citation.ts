export function unescapeCitation(markdown: string) {
  return markdown.replace(/\\\[@/g, '[@');
}
