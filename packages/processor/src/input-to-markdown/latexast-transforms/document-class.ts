import { Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../input-to-markdown/context';

export function documentClass(ctx: Context) {
  return (tree: Root) => {
    // console.log(ctx);
    // console.dir(tree, { depth: null });
    visit(tree, (node) => {
      if (node.type === 'macro' && node.content === 'documentclass') {
        const args = node.args || [];
        const arg = args[args.length - 1] || {};
        const documentClass = printRaw(arg.content);

        if (documentClass !== 'article') {
          ctx.frontmatter.documentClass = documentClass;
        }
      }
    });
  };
}
