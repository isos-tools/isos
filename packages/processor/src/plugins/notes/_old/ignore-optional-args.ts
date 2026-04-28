import * as Ast from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

export function ignoreOptionalSidenoteArgs() {
  return (tree: Ast.Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, (node) => {
      if (
        node.type === 'macro' &&
        ['footnote', 'sidenote', 'framedsidenote', 'marginnote'].includes(
          node.content,
        )
      ) {
        if (Array.isArray(node.args)) {
          // ignore optional arguments
          node.args = node.args.filter((o) => o.openMark === '{');
        }
      }
    });
  };
}
