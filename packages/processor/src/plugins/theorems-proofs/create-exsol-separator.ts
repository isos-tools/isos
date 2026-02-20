import { htmlLike } from '@isos/unified-latex-util-html-like';

export function createExSolSeparator() {
  return htmlLike({
    tag: 'hr',
  });
}
