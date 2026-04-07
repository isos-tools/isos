import { Element, Root } from 'hast';

// import { visit } from 'unist-util-visit';

import { Context } from '../../markdown-to-mdx/context';

export function addPreambleWarnings(ctx: Context) {
  return (tree: Root) => {
    const { preambleWarnings } = ctx.frontmatter;

    if (preambleWarnings.length < 1) {
      return;
    }

    const warnings: Element = {
      type: 'element',
      tagName: 'section',
      properties: {
        class: 'preamble-warnings',
      },
      children: [
        {
          type: 'element',
          tagName: 'h2',
          properties: {},
          children: [
            {
              type: 'text',
              value: 'Preamble warnings:',
            },
          ],
        },
        {
          type: 'element',
          tagName: 'dl',
          properties: {},
          children: preambleWarnings.reduce((acc: Element[], warning) => {
            const dt: Element = {
              type: 'element',
              tagName: 'dt',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: warning.message,
                },
              ],
            };
            const dd: Element = {
              type: 'element',
              tagName: 'dd',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: warning.info,
                },
              ],
            };
            acc.push(dt, dd);
            return acc;
          }, []),
        },
      ],
    };

    tree.children.unshift(warnings);
  };
}
