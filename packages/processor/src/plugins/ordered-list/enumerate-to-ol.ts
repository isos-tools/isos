import { Environment } from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { match } from '@unified-latex/unified-latex-util-match';

import { htmlLike } from '@isos/unified-latex-util-html-like';
import { printRaw } from '@isos/unified-latex-util-print-raw';

export function enumerateToOl(node: Environment) {
  return htmlLike({
    tag: 'ol',
    attributes: {
      start: getSetCounter(node),
    },
    content: node.content
      .filter((node) => match.macro(node, 'item'))
      .flatMap((node) => {
        const args = node.args || [];
        const content = args[args.length - 1];

        return htmlLike({
          tag: 'li',
          content: content?.content,
        });
      }),
  });
}

function getSetCounter(node: Environment) {
  const setCounter = node.content.find((o) =>
    match.macro(o, 'setcounter'),
  );
  if (setCounter) {
    const args = getArgsContent(setCounter);
    if (args.length === 2) {
      const name = printRaw(args[0] || []);
      if (name === 'enumi') {
        const value = printRaw(args[1] || []);
        return Number(value) + 1;
      }
    }
  }

  return 1;
}
