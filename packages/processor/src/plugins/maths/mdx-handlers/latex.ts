import Prism from 'prismjs';

export function syntaxHighlight(expr: string = '') {
  return Prism.highlight(expr, Prism.languages.latex, 'latex');
}

export function formatLaTeX(expr: string = '') {
  return expr
    .replace(/\\\\\s?/g, '\\\\\n')
    .replace(/\\begin{align(\*?)}/g, '\\begin{align$1}\n')
    .replace(/\\end{align(\*?)}/g, '\n\\end{align$1}');
}
