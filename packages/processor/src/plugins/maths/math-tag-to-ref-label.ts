import { ElementContent, Parent, Root } from 'hast';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';

import { createRemarkProcessor } from '../../remark-processor';

const pattern = /\\tag\{(.+?)\}/;

export function mathTagToRefLabel() {
  return (tree: Root) => {
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
                  const tag = match[1];
                  const eqCountFirst = eqCount.children[0];
                  if (eqCountFirst.type === 'element') {
                    const id = eqCountFirst.properties['data-id'];
                    if (id) {
                      eqCountFirst.properties['data-tag'] = tag;
                    } else {
                      eqCount.properties.className = ['eq-tag'];
                      eqCount.children = getTagHast(`(${tag})`);
                    }
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

const processor = createRemarkProcessor([remarkRehype]);

function getTagHast(tag: string) {
  const parsed = processor.parse(String(tag));
  const transformed = processor.runSync(parsed) as Parent;

  if (transformed.children.length === 0) {
    return [];
  }
  const firstChild = transformed.children[0] as Parent;
  return firstChild.children as ElementContent[];
}
