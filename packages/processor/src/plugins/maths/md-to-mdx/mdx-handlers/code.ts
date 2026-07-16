import Prism from 'prismjs';

import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-markup';

export function syntaxHighlight(code: string = '', language: string) {
  const grammar = Prism.languages[language];
  Prism.hooks.run('before-highlight', { grammar });
  return Prism.highlight(code, grammar, language);
}

export function formatLaTeX(expr: string = '') {
  return expr
    .replace(/\\\\\s?/g, '\\\\\n')
    .replace(/\\begin{align(\*?)}/g, '\\begin{align$1}\n')
    .replace(/\\end{align(\*?)}/g, '\n\\end{align$1}');
}

export function formatMathMl(expr: string = '') {
  return expr.replace(
    /\s+xmlns="http:\/\/www\.w3\.org\/1998\/Math\/MathML"/g,
    '',
  );
}
