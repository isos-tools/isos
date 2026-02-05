import { Element, ElementContent, Parent, Root, Text } from 'hast';
import { findAndReplace } from 'hast-util-find-and-replace';
import remarkRehype from 'remark-rehype';

import { Context, Reference } from '../../markdown-to-mdx/context';
import { createRemarkProcessor } from '../../remark-processor';

const pattern = /(^|[^a-zA-Z0-9])@([\w-]+)/g;

export function atReferenceToLink(ctx: Context) {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    // console.log(ctx.frontmatter.refMap);
    findAndReplace(tree, [
      pattern,
      (_, prefix, ref) => {
        const reference = ctx.frontmatter.refMap[ref];
        // console.log(ref, reference);

        const output: (Element | Text)[] = [
          {
            type: 'text',
            value: prefix,
          },
        ];

        if (reference) {
          output.push(createReferenceLink(reference));
        } else {
          output.push(createBrokenReferenceWarning(ref));
        }

        return output;
      },
    ]);
  };
}

function createReferenceLink(reference: Reference): Element {
  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href: `#${reference.id}`,
      class: 'ref',
    },
    children: getTagHast(reference.label),
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

function createBrokenReferenceWarning(ref: string): Element {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`unknown ref:`, ref);
  }
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      class: 'warn',
    },
    children: [
      {
        type: 'element',
        tagName: 'strong',
        properties: {},
        children: [{ type: 'text', value: `unknown ref:` }],
      },
      {
        type: 'text',
        value: ' ',
      },
      {
        type: 'element',
        tagName: 'code',
        properties: {},
        children: [{ type: 'text', value: ref }],
      },
    ],
  };
}
