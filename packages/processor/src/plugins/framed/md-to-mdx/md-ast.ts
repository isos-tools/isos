import { Root } from 'mdast';
import { visit } from 'unist-util-visit';

export function framed() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'framed') {
        // console.log(node);
        node.data = {
          hProperties: {
            className: ['framed'],
          },
        };
      }
    });
  };
}
