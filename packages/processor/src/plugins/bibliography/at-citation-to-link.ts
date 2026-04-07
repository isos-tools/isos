import { Element, ElementContent, Parent, Root, Text } from 'hast';
import { findAndReplace } from 'hast-util-find-and-replace';
import remarkRehype from 'remark-rehype';

import { Context } from '../../markdown-to-mdx/context';
import { createRemarkProcessor } from '../../remark-processor';
import { Reference } from '../bibliography/extract-bibliography';

const pattern = /\[@([^\s]+) (.*?)\]/g;

export function atCitationToLink(ctx: Context) {
  return (tree: Root) => {
    findAndReplace(tree, [
      pattern,
      (_, id, cite) => {
        const reference = ctx.frontmatter.refMap[`bib-${id}`];
        const output: (Element | Text)[] = [];
        if (reference) {
          output.push(createReferenceLink(reference, cite));
        } else {
          output.push(createBrokenReferenceWarning(id));
        }
        return output;
      },
    ]);
  };
}

function createReferenceLink(reference: Reference, cite: string): Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      class: 'cite',
    },
    children: [
      {
        type: 'text',
        value: '[',
      },
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${reference.id}`,
          class: 'ref',
        },
        children: getTagHast(reference.label),
      },
      {
        type: 'text',
        value: ' ',
      },
      {
        type: 'text',
        value: cite,
      },
      {
        type: 'text',
        value: ']',
      },
    ],
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
