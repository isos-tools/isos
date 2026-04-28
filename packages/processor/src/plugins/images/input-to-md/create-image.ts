import { convertToMarkdown } from '@unified-latex/unified-latex-to-mdast';
import { Macro } from '@unified-latex/unified-latex-types';
import { pgfkeysArgToObject } from '@unified-latex/unified-latex-util-pgfkeys';

import { htmlLike } from '@isos/unified-latex-util-html-like';
import { printRaw } from '@isos/unified-latex-util-print-raw';

import { getWidth } from './subfigure-width';

export function createImage(node: Macro): Macro {
  const args = node.args || [];

  const attributes: Record<string, string> = {};

  const lastArg = args[args.length - 1];
  if (lastArg && lastArg.type === 'argument' && lastArg.openMark === '{') {
    attributes.src = printRaw(lastArg.content);
  }

  const opts = pgfkeysArgToObject(args[1]);

  if (opts.alt) {
    attributes.alt = convertToMarkdown(opts.alt).trim();
  }

  if (opts.width) {
    attributes.width = getWidth(opts.width);
  }

  const img = htmlLike({
    tag: 'img',
    attributes,
    content: [],
  });

  return img;
}
