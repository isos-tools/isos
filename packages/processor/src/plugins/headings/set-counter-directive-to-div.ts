import { Root } from 'mdast';
import { visit } from 'unist-util-visit';

export function setHeadingCounterToDiv() {
  return (tree: Root) => {
    visit(tree, 'leafDirective', (node) => {
      // console.log(node);
      if (node.name === 'set-counter') {
        node.data = {
          hProperties: {
            className: ['set-counter'],
            'data-type': node.attributes?.type,
            'data-value': node.attributes?.value,
          },
        };
      }
    });
  };
}
