import { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

export function scaleRelToMissingMaths() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'span') {
        const className = node.properties?.className || [];
        if (Array.isArray(className)) {
          if (className.includes('macro-scalerel')) {
            const img = extractImage(node);
            if (img !== null) {
              Object.assign(node, { children: [img] });
            }
          }
        }
      }
    });
  };
}

function extractImage(scalerel: Element) {
  let img = null;
  visit(scalerel, 'element', (node, idx = 0, parent) => {
    if (node.tagName === 'img') {
      node.properties.class = 'missing-maths';
      img = node;
      parent?.children.splice(idx, 1);
    }
  });
  return img;
}
