import { Element, Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

// import { visitParents } from 'unist-util-visit-parents';

import { texToMml } from '@isos/maths';

import { createWarn } from '../../warn/hast-warn';

export function latexMathToMml() {
  return (tree: Root) => {
    visit(tree, 'element', (node, _idx, parent) => {
      if (node.tagName === 'code') {
        const { className } = node.properties;
        if (
          Array.isArray(className) &&
          className.includes('language-math')
        ) {
          const latex = toString(node);
          // console.log(latex);

          const match = latex.match(/\\(ref|eqref){/);
          if (match !== null) {
            if (
              parent &&
              parent.type === 'element' &&
              parent.tagName === 'pre'
            ) {
              parent.properties.className = ['warn'];
            }
            Object.assign(node, createWarn('macro', match[1]));
            return;
          }

          const mml = texToMml(latex);

          if (mml.error) {
            Object.assign(node, createWarn('mathjax', mml.mml));
            return;
          }
          // console.log(mml.mml);

          const math = fromHtml(mml.mml, { fragment: true });

          if (math.children.length !== 1) {
            return;
          }

          const mathElement = math.children[0] as Element;

          if (
            parent &&
            parent.type === 'element' &&
            parent.tagName === 'pre'
          ) {
            Object.assign(parent, {
              type: 'element',
              tagName: 'p',
              properties: {
                className: ['maths', parent.properties.className],
              },
              children: [mathElement],
            });
          } else {
            delete mathElement.properties.display;
            Object.assign(node, mathElement);
          }
        }
      }
    });
  };
}
