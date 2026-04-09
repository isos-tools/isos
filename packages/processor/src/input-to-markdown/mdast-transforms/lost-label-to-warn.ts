import { Root } from 'mdast';
import { TextDirective } from 'mdast-util-directive';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export function lostLabelToWarn() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, 'textDirective', (node) => {
      if (node.name === 'label') {
        // console.log(node.children);

        const warn: TextDirective = {
          type: 'textDirective',
          name: 'warn',
          children: [
            {
              type: 'strong',
              children: [
                {
                  type: 'text',
                  value: 'lost label:',
                },
              ],
            },
            {
              type: 'text',
              value: ' ',
            },
            {
              type: 'inlineCode',
              value: toString(node.children),
            },
          ],
        };

        Object.assign(node, warn);
      }
    });
  };
}
