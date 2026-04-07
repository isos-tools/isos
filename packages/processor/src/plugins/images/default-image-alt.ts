import { Element, ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export function addDefaultAltText() {
  return (tree: Root) => {
    // console.log('hast: addDefaultAltText');
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        // console.log(node);
        if (
          typeof node.properties.alt !== 'string' ||
          node.properties.alt === ''
        ) {
          node.properties.alt = 'Image';
        }
      }
    });

    visit(tree, 'element', (node) => {
      if (node.tagName === 'figcaption') {
        addLineBreaks(node);
      }
    });
  };
}

function addLineBreaks(node: Element) {
  const children = node.children.reduce((acc: ElementContent[], child) => {
    if (child.type === 'text') {
      const segments = child.value.split('\\n');
      if (segments.length > 1) {
        for (let i = 0; i < segments.length; i++) {
          if (i > 0) {
            acc.push({
              type: 'element',
              tagName: 'br',
              properties: {},
              children: [],
            });
          }
          acc.push({
            type: 'text',
            value: segments[i],
          });
        }
      } else {
        acc.push(child as ElementContent);
      }
    } else {
      acc.push(child as ElementContent);
    }

    return acc;
  }, []);

  Object.assign(node, { children });
}
