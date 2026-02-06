import { Element, ElementContent } from 'hast';
import { Parent, Root } from 'mdast';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';

import { createRemarkProcessor } from '../../remark-processor';

export function pandocImplicitFigures() {
  return (tree: Root) => {
    // console.log('pandocImplicitFigures');
    // console.dir(tree, { depth: null });
    visit(tree, 'image', (node, _idx, parent) => {
      if (parent?.type !== 'paragraph') {
        return;
      }

      const props = node.data?.hProperties || {};
      const id = props['id'] || null;
      const caption = props['data-caption'] || '';

      if (!caption && !id) {
        return;
      }

      // console.log(caption);

      const img: Element =
        process.env.NODE_ENV === 'test' || node.url.startsWith('data')
          ? {
              type: 'element',
              tagName: 'img',
              properties: {
                src: node.url,
                alt: node.alt || '',
                title: node.title || null,
              },
              children: [],
            }
          : {
              type: 'element',
              tagName: 'span',
              properties: {
                className: ['warn'],
              },
              children: [
                {
                  type: 'text',
                  value: `No image found at: ${node.url}`,
                },
              ],
            };

      // console.log(node.url);

      const strong: Element = {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [
          {
            type: 'text',
            value: 'Figure',
          },
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['fig-count', 'figure'],
              'data-id': id,
            },
            children: [],
          },
        ],
      };

      const captionHast = getCaptionHast(String(caption));

      const figCaption: Element = {
        type: 'element',
        tagName: 'figcaption',
        properties: {},
        children: [strong],
      };

      if (caption) {
        strong.children.push({
          type: 'text',
          value: ':',
        });
        figCaption.children.push(
          {
            type: 'text',
            value: ' ',
          },
          ...captionHast,
        );
      }

      const figContent: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['fig-content'],
        },
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [img],
          },
        ],
      };

      parent.data = {
        hName: 'figure',
        hProperties: {
          src: null,
          alt: null,
          id,
        },
        hChildren: [figContent, figCaption],
      };
    });
    // console.dir(tree, { depth: null });
  };
}

const processor = createRemarkProcessor([remarkRehype]);

function getCaptionHast(caption: string) {
  const parsed = processor.parse(String(caption));
  const transformed = processor.runSync(parsed) as Parent;
  if (transformed.children.length === 0) {
    return [];
  }
  const firstChild = transformed.children[0] as Parent;
  return firstChild.children as ElementContent[];
}
