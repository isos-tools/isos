import { Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { Context } from '../../input-to-markdown/context';

export function documentClass(ctx: Context) {
  return (tree: Root) => {
    // console.log(ctx);
    // console.dir(tree, { depth: null });
    visit(tree, (node) => {
      if (node.type === 'macro' && node.content === 'documentclass') {
        const args = node.args || [];
        const arg = args[args.length - 1] || {};

        if (
          arg.content[0].type === 'string' &&
          arg.content[0].content !== 'article'
        ) {
          ctx.documentClass = arg.content[0].content;
        }
      }
    });
  };
}
