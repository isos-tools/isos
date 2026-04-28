import { Element, ElementContent } from 'hast';
import { Parent, Root } from 'mdast';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';

import { createRemarkProcessor } from '../../../remark-processor';

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
      const unnumbered =
        Array.isArray(props.class) && props.class.includes('unnumbered');

      if (!caption && !id) {
        return;
      }

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

      const children: ElementContent[] = [];

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

      children.push(figContent);

      if (id || caption) {
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
          children: captionHast,
        };

        if (captionHast.length) {
          strong.children.push({
            type: 'text',
            value: ':',
          });
          if (!unnumbered) {
            figCaption.children.unshift({
              type: 'text',
              value: ' ',
            });
          }
        }
        if (!unnumbered) {
          figCaption.children.unshift(strong);
        }

        children.push(figCaption);
      }

      const style: string[] = [];
      // console.log(props);
      if (props.style) {
        const match = String(props.style).match(/width:\s?(\d+)%/);
        if (match !== null) {
          style.push(`width: ${match[1]}%`);
        }
      }

      parent.data = {
        hName: 'figure',
        hProperties: {
          src: null,
          alt: null,
          id,
          style: style.join(';'),
        },
        hChildren: children,
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

  // const children: ElementContent[] = [];

  // for (const child of firstChild.children) {
  //   if (child.type === 'text') {
  //     const segments = child.value.split('\\n');
  //     if (segments.length > 1) {
  //       for (let i = 0; i < segments.length; i++) {
  //         if (i > 0) {
  //           children.push({
  //             type: 'break',
  //           });
  //         }
  //         children.push({
  //           type: 'text',
  //           value: segments[i],
  //         });
  //       }
  //     } else {
  //       children.push(child as ElementContent);
  //     }
  //   } else {
  //     children.push(child as ElementContent);
  //   }
  // }

  // visit(firstChild, 'text', (node) => {
  //   if (node.va)
  //   node.value = node.value.replace('')
  // })

  // return children;
}
