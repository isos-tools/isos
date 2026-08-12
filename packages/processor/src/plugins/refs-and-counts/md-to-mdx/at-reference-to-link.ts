import { Element, ElementContent, Parent, Root, Text } from 'hast';
import { findAndReplace } from 'hast-util-find-and-replace';
import remarkRehype from 'remark-rehype';

import { Context } from '../../../markdown-to-mdx/context';
import { createRemarkProcessor } from '../../../remark-processor';
import { Reference } from '../../bibliography/input-to-md/extract-bibliography';
import { latexMathToMml } from '../../maths/md-to-mdx/latex-to-mml';
import { mmlToOutput } from '../../maths/md-to-mdx/mml-to-output';

const pattern = /(^|[^a-zA-Z0-9])@([\w-]+)/g;

export function atReferenceToLink(ctx: Context) {
  return (tree: Root) => {
    const { refMap } = ctx.frontmatter;
    // console.dir(tree, { depth: null });
    // console.log(ctx.frontmatter.refMap);
    findAndReplace(tree, [
      pattern,
      (_, prefix, ref) => {
        const reference = refMap[ref];
        // console.log({ ref, reference });

        const output: (Element | Text)[] = [
          {
            type: 'text',
            value: prefix,
          },
        ];

        if (reference) {
          output.push(createReferenceLink(reference, ctx));
        } else {
          // console.log(ref, structuredClone(refMap));
          output.push(createBrokenReferenceWarning(ref));
        }

        return output;
      },
    ]);
  };
}

function createReferenceLink(reference: Reference, ctx: Context): Element {
  return {
    type: 'element',
    tagName: 'a',
    properties: {
      href: `#${reference.id}`,
      class: 'ref',
    },
    children: getTagHast(reference.label, ctx),
  };
}

function getTagHast(tag: string, ctx: Context) {
  const processor = createRemarkProcessor([
    remarkRehype,
    latexMathToMml,
    [mmlToOutput, ctx],
  ]);
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
