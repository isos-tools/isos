import { Root } from 'hast';
import { visit } from 'unist-util-visit';

export function addDefaultAltText() {
  return (tree: Root) => {
    // console.log('hast: addDefaultAltText');
    visit(tree, 'element', (node) => {
      // console.log(node);
      if (node.tagName === 'img') {
        if (node.properties.alt === '') {
          node.properties.alt = 'Image';
        }
      }
    });
  };
}
