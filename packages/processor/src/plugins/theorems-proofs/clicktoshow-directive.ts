import { Root } from 'mdast';
import { visit } from 'unist-util-visit';

export function exSolSolutionDirective() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'solution') {
        node.data = {
          hProperties: {
            className: ['exsol-solution'],
          },
        };
      }
    });
  };
}
