import { Root } from 'hast';
import { visit } from 'unist-util-visit';

const pattern = /\\tag\{(.+?)\}/;

export function mathTagToRefLabel() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre') {
        if (node.children.length > 1) {
          if (
            node.children[0].type === 'element' &&
            node.children[0].tagName === 'code' &&
            node.children[1].type === 'element' &&
            node.children[1].tagName === 'span'
          ) {
            const properties = node.children[1].properties || {};
            const className = properties.className || [];
            if (
              Array.isArray(className) &&
              className.includes('eq-count')
            ) {
              const [maths, eqCount] = node.children;
              const codeFirst = maths.children[0];
              if (codeFirst.type === 'text') {
                const match = codeFirst.value.match(pattern);
                if (match !== null) {
                  // remove tag
                  codeFirst.value = codeFirst.value.replace(pattern, '');
                  // add tag as eq-count attribute
                  const eqCountFirst = eqCount.children[0];
                  if (
                    eqCountFirst.type === 'element' &&
                    eqCountFirst.properties['data-id']
                  ) {
                    eqCountFirst.properties['data-tag'] = match[1];
                  }
                }
              }
            }
          }
        }
      }
    });
  };
}
