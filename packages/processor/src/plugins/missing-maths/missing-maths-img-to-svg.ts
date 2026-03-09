import { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

import { inlineSvg } from '@isos/image-tools';

export function missingMathsImageToSvg() {
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

        const classNames = node.properties.class;
        if (
          Array.isArray(classNames) &&
          classNames.includes('missing-maths')
        ) {
          const src = String(node.properties.src);
          if (src.startsWith('data:image/svg+xml')) {
            const svg = inlineSvg(src);
            // console.log(svg);

            if (svg !== null) {
              const code = wrapSvg(svg);
              code.properties['aria-label'] = node.properties.alt;
              Object.assign(node, code);
            }
          }
        }
      }
    });
  };
}

function wrapSvg(svg: Element): Element {
  return {
    type: 'element',
    tagName: 'code',
    properties: {
      className: ['maths'],
    },
    children: [svg],
  };
}
