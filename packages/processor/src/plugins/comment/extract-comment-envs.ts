import { Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

export function commentEnv() {
  return (tree: Root) => {
    const excludeComments: string[] = [];
    // const includeComments: string[] = [];

    visit(tree, (node, info) => {
      if (node.type === 'macro') {
        if (node.content === 'excludecomment') {
          const args = node.args || [];
          const name = printRaw(args[0].content);
          excludeComments.push(name);
        }

        // if (node.content === 'includecomment') {
        //   const args = node.args || [];
        //   const name = printRaw(args[0].content);
        //   includeComments.push(name);
        // }
      }

      if (
        node.type === 'environment' &&
        excludeComments.includes(node.env)
      ) {
        const parent = info.parents[0];
        if (parent.type === 'environment' && info.index !== undefined) {
          parent.content.splice(info.index, 1);
        }
      }

      if (node.type === 'verbatim' && node.env === 'comment') {
        const parent = info.parents[0];
        if (parent.type === 'environment' && info.index !== undefined) {
          parent.content.splice(info.index, 1);
        }
      }
    });
  };
}
