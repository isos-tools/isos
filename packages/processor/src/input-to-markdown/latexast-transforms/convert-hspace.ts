import { Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

export function convertHspace() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (node.type === 'macro' && node.content === 'hspace') {
        if (Array.isArray(node.args)) {
          if (
            node.args[0] &&
            node.args[0].content[0] &&
            node.args[0].content[0].type === 'string' &&
            node.args[0].content[0].content === '*'
          ) {
            Object.assign(node, {
              args: node.args.slice(1),
            });
          }
        }
      }
    });
  };
}
