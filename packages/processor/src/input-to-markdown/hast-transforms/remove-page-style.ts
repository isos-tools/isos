import { Root } from 'hast';
import { visit } from 'unist-util-visit';

export function removePageStyle() {
  return (tree: Root) => {
    visit(tree, 'element', (node, idx = 0, parent) => {
      if (node.tagName === 'span') {
        const className = node.properties.className;
        if (
          Array.isArray(className) &&
          className.includes('macro-pagestyle')
        )
          parent?.children.splice(idx, 1);
      }
    });
  };
}
