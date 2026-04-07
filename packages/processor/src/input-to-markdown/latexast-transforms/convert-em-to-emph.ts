import { Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

export function convertEmToEmph() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, (node) => {
      if (node.type === 'group') {
        const firstChild = node.content[0];

        if (
          firstChild &&
          firstChild.type === 'macro' &&
          firstChild.content === 'em'
        ) {
          Object.assign(node, {
            type: 'macro',
            content: 'emph',
            args: [
              {
                type: 'argument',
                content: node.content.slice(
                  node.content.findIndex((o) => o.type === 'string'),
                ),
              },
            ],
          });
        }

        if (
          firstChild &&
          firstChild.type === 'macro' &&
          firstChild.content === 'bf'
        ) {
          Object.assign(node, {
            type: 'macro',
            content: 'textbf',
            args: [
              {
                type: 'argument',
                content: node.content.slice(
                  node.content.findIndex((o) => o.type === 'string'),
                ),
              },
            ],
          });
        }
      }
    });
  };
}
