import { Element, ElementContent, Node, Parent, Root } from 'hast';
import remarkRehype from 'remark-rehype';
import { visit } from 'unist-util-visit';

import { Context } from '../../markdown-to-mdx/context';
import { createRemarkProcessor } from '../../remark-processor';
import { formatAppendixCount } from '../headings/format-appendix-count';
import {
  HeadingCounter,
  createHeadingCounter,
} from '../headings/heading-counter';
import {
  TheoremCounter,
  createTheoremCounter,
} from '../theorems-proofs/theorem-counter';
import { formatCount } from './format-count';

// Inject counts for numbered headings and theorems
// Doing this in hast so I have access to remarkRehype attributes

export function addCounts(ctx: Context) {
  return (tree: Root) => {
    const theoremCounter = createTheoremCounter();
    const headingCounter = createHeadingCounter();
    const appendixCounter = createHeadingCounter();
    const theoremStore: Record<string, string> = {};

    // console.dir(tree, { depth: null });

    visit(tree, 'element', (node, idx, parent) => {
      if (node.tagName === 'div') {
        const className = node.properties.className;
        if (Array.isArray(className) && className[0] === 'set-counter') {
          applySetCounter(node, headingCounter);

          // remove div
          if (parent && idx !== undefined) {
            const element = parent as Element;
            element.children.splice(idx, 1);
          }
        }
      } else if (node.tagName === 'span') {
        const className = node.properties.className;

        if (Array.isArray(className)) {
          switch (className[0]) {
            case 'heading-count':
              return applyHeadingCount(
                node,
                ctx,
                appendixCounter,
                headingCounter,
                parent,
                idx,
              );
            case 'thm-count':
            case 'eq-count':
            case 'fig-count':
            case 'tbl-count':
            case 'lst-count':
              return applyCount(
                node,
                ctx,
                headingCounter,
                theoremCounter,
                theoremStore,
              );
          }
        }
      }
    });

    // console.log(ctx.frontmatter.refMap);
  };
}

function applySetCounter(node: Element, headingCounter: HeadingCounter) {
  const type = String(node.properties['data-type'] || '');
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(type)) {
    const value = node.properties['data-value'];
    const depth = Number(type.slice(1));
    headingCounter.setCount(depth, Number(value) + 1);
  }
}

function applyHeadingCount(
  node: Element,
  ctx: Context,
  appendixCounter: HeadingCounter,
  headingCounter: HeadingCounter,
  parent?: Node,
  idx?: number,
) {
  const className = node.properties.className;

  if (!Array.isArray(className)) {
    return;
  }
  if (className.includes('unnumbered')) {
    Object.assign(node, { type: 'text', value: '' });
  } else if (node.properties['data-appendix'] === true) {
    // Special case for appendices
    const headingDepth = Number(String(className[1]).slice(-1));
    appendixCounter.increment(headingDepth);
    const counts = appendixCounter.getCounts(headingDepth);
    const value = formatAppendixCount(counts);

    const _id = node.properties['data-id'];
    if (_id) {
      const type = headingDepth === 2 ? 'appendix' : 'section';
      const ctxObj = ctx.frontmatter.theorems[type];
      const id = String(_id);
      const label = `${ctxObj.heading} ${value}`;
      ctx.frontmatter.refMap[id] = { id, label };
    }

    Object.assign(node, {
      properties: {
        className: 'count',
      },
      children: [{ type: 'text', value }],
    });
  } else {
    // Count headings
    const headingDepth = Number(String(className[1]).slice(-1));
    headingCounter.increment(headingDepth);

    if (headingDepth < 2 || headingDepth > 4) {
      Object.assign(node, { type: 'text', value: '' });
    } else {
      const counts = headingCounter.getCounts(headingDepth);
      const value = formatCount(counts);

      const _id = node.properties['data-id'];
      if (_id) {
        const id = String(_id);
        const label = `Section ${value}`;
        ctx.frontmatter.refMap[id] = { id, label };
      }

      Object.assign(node, {
        properties: {
          className: 'count',
        },
        children: [{ type: 'text', value }],
      });

      // add space after span.count
      if (parent && idx !== undefined && parent.type === 'element') {
        const element = parent as Element;
        element.children.splice(idx + 1, 0, {
          type: 'text',
          value: ' ',
        });
      }
    }
  }
}

function applyCount(
  node: Element,
  ctx: Context,
  headingCounter: HeadingCounter,
  theoremCounter: TheoremCounter,
  theoremStore: Record<string, string>,
) {
  const className = node.properties.className;

  if (!Array.isArray(className)) {
    return;
  }
  const refName = String(className[1]);
  // const refName2 =
  // console.log(className[1]);
  // console.log(ctx.frontmatter);
  const ctxRef = ctx.frontmatter.theorems[refName];

  if (ctxRef) {
    const { referenceCounter, unnumbered } = ctxRef;
    const id = String(node.properties['data-id'] || '');
    const tag = String(node.properties['data-tag'] || '');
    let value = '';

    if (!unnumbered) {
      const countName = referenceCounter || refName;
      const countRef = ctx.frontmatter.theorems[countName];
      const counts: number[] = [];

      if (countRef.numberWithin) {
        const depth = Number(countRef.numberWithin.slice(1));

        const str = headingCounter.getCounts(depth).join('');
        if (theoremStore[countName] !== str) {
          theoremStore[countName] = str;
          theoremCounter.reset(countName);
        }

        if (!tag) {
          const headingCounts = headingCounter.getCounts(depth);
          const count = theoremCounter.increment(countName);
          counts.push(...headingCounts, count);
        }

        // TODO: counterWithin
        // } else if (counterWithin) {
        //   const depth = latexSectionToDepth(counterWithin);

        //   if (newSection && depth >= headingDepth) {
        //     theoremCounter.reset(countName);
        //     newSection = false;
        //   }

        //   const count = theoremCounter.increment(countName);
        //   counts.push(...headingCounter.getCounts(depth), count);
      } else if (!tag) {
        counts.push(theoremCounter.increment(countName));
      }

      const count =
        countRef.type === 'float'
          ? formatCount(counts.slice(counts.findIndex((n) => n > 0)))
          : formatCount(counts);

      value = ` ${count}`;

      if (id) {
        if (className[0] === 'eq-count' && tag) {
          const label = `${ctxRef.heading} (${tag})`;
          ctx.frontmatter.refMap[id] = { id, label };
        } else {
          const label = `${ctxRef.heading} ${count}`;
          ctx.frontmatter.refMap[id] = { id, label };
        }
      }
    }

    if (className[0] === 'eq-count') {
      if (tag) {
        Object.assign(node, {
          type: 'element',
          tagName: 'span',
          properties: {
            className: ['eq-count'],
          },
          children: getTagHast(`(${tag})`),
        });
      } else {
        Object.assign(node, {
          type: 'text',
          value: `(${value.trim()})`,
        });
      }
    } else {
      Object.assign(node, { type: 'text', value });
    }
  }
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
