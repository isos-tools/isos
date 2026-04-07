import { Element, Root } from 'hast';

import { Context } from '../../markdown-to-mdx/context';

export function renderBibliography(ctx: Context) {
  return (tree: Root) => {
    const { references } = ctx.frontmatter;

    if (references.length > 0) {
      const bibliography: Element = {
        type: 'element',
        tagName: 'section',
        properties: {
          class: 'bibliography',
        },
        children: [
          {
            type: 'element',
            tagName: 'h2',
            properties: {},
            children: [
              {
                type: 'text',
                value: 'References',
              },
            ],
          },
          {
            type: 'element',
            tagName: 'ol',
            properties: {},
            children: references.map((o) => ({
              type: 'element',
              tagName: 'li',
              properties: {
                id: `bib-${o.id}`,
              },
              children: [
                {
                  type: 'element',
                  tagName: 'p',
                  properties: {},
                  children: [
                    {
                      type: 'text',
                      value: o.label,
                    },
                  ],
                },
              ],
            })),
          },
        ],
      };
      tree.children.push(bibliography);
    }
  };
}
