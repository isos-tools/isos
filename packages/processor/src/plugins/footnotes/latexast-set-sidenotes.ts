import { Root } from '@unified-latex/unified-latex-types';
import { pgfkeysArgToObject } from '@unified-latex/unified-latex-util-pgfkeys';
import { toString } from '@unified-latex/unified-latex-util-to-string';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { Context } from '../../input-to-markdown/context';

export function setSideNotes(ctx: Context) {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });

    // console.log('before:', ctx.frontmatter['reference-location']);

    visit(tree, (node) => {
      if (node.type === 'macro' && node.content === 'usepackage') {
        const args = node.args || [];
        const lastArg = args[args.length - 1];
        const packageName = toString(lastArg.content);

        if (packageName === 'snotez') {
          const { footnote } = pgfkeysArgToObject(args[0]);

          if (Array.isArray(footnote)) {
            if (footnote.length === 0 || toString(footnote) === 'true') {
              ctx.frontmatter['reference-location'] = 'margin';
            }
          }
        }
      }

      // if (node.type === 'macro' && node.content === 'setsidenotes') {
      //   const args = node.args || [];
      //   const arg = args[args.length - 1] || {};
      //   // console.log(arg.content);
      //   ctx.frontmatter['reference-location'] =
      //     arg.content[0].type === 'string' &&
      //     arg.content[0].content === 'footnote' &&
      //     arg.content[1].type === 'string' &&
      //     arg.content[1].content === '=' &&
      //     arg.content[2].type === 'string' &&
      //     arg.content[2].content === 'false'
      //       ? 'document'
      //       : 'margin';
      // }
    });

    // console.log('after:', ctx.frontmatter['reference-location']);
  };
}
