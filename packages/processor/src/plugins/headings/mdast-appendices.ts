import { Root } from 'mdast';
import { visit } from 'unist-util-visit';

export function appendices() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'appendices') {
        node.data = {
          hName: 'section',
          ...(node.data || {}),
          hProperties: {
            ...(node.data?.hProperties || {}),
            className: ['appendices'],
          },
        };
      }
    });
  };
}
