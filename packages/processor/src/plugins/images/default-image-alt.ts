import { Root } from 'hast';
import { visit } from 'unist-util-visit';

export function addDefaultAltText() {
  return (tree: Root) => {
    // console.log('hast: addDefaultAltText');
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        if (
          typeof node.properties.alt !== 'string' ||
          node.properties.alt === ''
        ) {
          node.properties.alt = 'Image';
        }
      }
    });
  };
}
