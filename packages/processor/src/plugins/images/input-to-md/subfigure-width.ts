import { Environment, Node } from '@unified-latex/unified-latex-types';

import { htmlLike } from '@isos/unified-latex-util-html-like';

export function subfigureWidth(node: Environment) {
  let width = '';
  if (Array.isArray(node.args) && node.args.length > 1) {
    width = getWidth(node.args[1].content);
  }
  return htmlLike({
    tag: 'div',
    attributes: { class: 'environment subfigure', width },
    content: node.content,
  });
}

export function getWidth(content: Node[]) {
  const trimmed = content.filter((o) => o.type !== 'whitespace');
  let width = '';
  if (
    trimmed.length === 2 &&
    trimmed[0].type === 'string' &&
    trimmed[1].type === 'macro' &&
    ['textwidth', 'linewidth'].includes(trimmed[1].content)
  ) {
    const str = trimmed[0].content;
    if (str.includes('.')) {
      const num = parseFloat(trimmed[0].content);
      if (num < 1) {
        width = `${num * 100}%`;
      }
    }
  }
  return width;
}
