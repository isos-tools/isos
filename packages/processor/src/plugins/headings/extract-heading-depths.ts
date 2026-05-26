import { Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { Context } from '../../input-to-markdown/context';
import { createHeadingDepths } from './heading-depths';

export function extractHeadingDepths(ctx: Context) {
  return (tree: Root) => {
    const { documentClass } = ctx.frontmatter;
    const hasPart = hasPartHeading(tree);
    ctx.sectionToHeading = createHeadingDepths(documentClass, hasPart);
  };
}

function hasPartHeading(tree: Root) {
  let hasPart = false;
  // console.dir(tree, { depth: null });
  visit(tree, (node) => {
    if (node.type === 'macro' && node.content === 'part') {
      hasPart = true;
    }
  });
  return hasPart;
}
