import { Element, Root } from 'hast';
import { toHtml } from 'hast-util-to-html';
import kebabCase from 'lodash.kebabcase';
import { visit } from 'unist-util-visit';

import { Context } from '../../../markdown-to-mdx/context';

export function mmlToOutput(ctx: Context) {
  return (tree: Root) => {
    const { refMap } = ctx.frontmatter;
    visit(tree, 'element', (node, _idx, parent) => {
      if (node.tagName === 'math') {
        const { dataLatex } = node.properties;

        visit(node, 'element', (child) => {
          // remove all data-latex attributes
          const { dataLatex, href } = child.properties;
          if (typeof dataLatex === 'string') {
            delete child.properties.dataLatex;
          }

          // merge in reference values
          if (child.tagName === 'mrow' && typeof href === 'string') {
            const id = kebabCase(href);
            const ref = refMap[id];
            if (ref) {
              child.properties.href = `#${ref.id}`;
              Object.assign(child, {
                children: [
                  {
                    type: 'element',
                    tagName: 'mtext',
                    properties: {},
                    children: [{ type: 'text', value: ref.label }],
                  },
                ],
              });
            }
          }

          // fix strange whitespace issue
          // if (
          //   child.tagName === 'mtext' &&
          //   child.children.length === 1 &&
          //   child.children[0].type === 'text'
          // ) {
          //   const { value } = child.children[0];
          //   console.log({
          //     orig: value,
          //     new: value.replace(/\s/g, ' '),
          //   });
          //   child.children[0].value = value.replace(/\s/g, ' ');
          // }
        });

        const mml = toHtml(node);
        // console.log(mml);

        const code: Element = {
          type: 'element',
          tagName: 'code',
          properties: {
            className: ['mathml'],
            ['data-latex']: String(dataLatex || ''),
          },
          children: [{ type: 'text', value: mml }],
        };

        if (
          parent &&
          parent.type === 'element' &&
          parent.tagName === 'p' &&
          Array.isArray(parent.properties.className) &&
          parent.properties.className.includes('maths') &&
          Array.isArray(code.properties.className)
        ) {
          code.properties.className.push('display');
        }
        Object.assign(node, code);
      }
    });
  };
}
