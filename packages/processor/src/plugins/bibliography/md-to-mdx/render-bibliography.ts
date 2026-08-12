import { Element, Parent, Root } from 'hast';
import remarkRehype from 'remark-rehype';

import { Context } from '../../../markdown-to-mdx/context';
import { createRemarkProcessor } from '../../../remark-processor';

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
            children: references.map(({ id, label }) => ({
              type: 'element',
              tagName: 'li',
              properties: {
                id: `bib-${id}`,
              },
              children: converToHast(label),
            })),
          },
        ],
      };
      tree.children.push(bibliography);
    }
  };
}

function converToHast(md: string) {
  const processor = createRemarkProcessor([remarkRehype]);
  const parsed = processor.parse(md);
  // console.log(parsed);
  const transformed = processor.runSync(parsed) as Parent;
  return transformed.children as Element[];
}
