import { Root } from 'hast';
import { visit } from 'unist-util-visit';

export function centerEnvToDiv() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'center') {
        node.tagName = 'div';
      }
    });
  };
}
