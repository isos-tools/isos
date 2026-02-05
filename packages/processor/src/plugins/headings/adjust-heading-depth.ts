import { Root } from 'hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../input-to-markdown/context';
import { createHeadingDepths } from './heading-depths';

export function adjustHeadingDepth(ctx: Context) {
  return (tree: Root) => {
    const hasPart = hasPartHeading(tree);
    const { documentClass: doc } = ctx.frontmatter;
    ctx.sectionToHeading = createHeadingDepths(doc || '', hasPart);

    visit(tree, 'element', (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        const className = node.properties.className;

        if (Array.isArray(className)) {
          const classes = className.map(String);
          const klass = classes.find((s) => s.startsWith('section-'));

          if (klass) {
            const headingType = klass.replace(/^section-/, '');
            node.tagName = ctx.sectionToHeading[headingType];
          }

          if (classes.includes('starred')) {
            node.children.push({
              type: 'text',
              value: ' {.unnumbered}',
            });
          }
        }
      }
    });
  };
}

function hasPartHeading(tree: Root) {
  let hasPart = false;
  visit(tree, 'element', (node) => {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
      const className = node.properties.className;
      if (Array.isArray(className)) {
        const klass = className
          .map(String)
          .find((s) => s.startsWith('section-'));
        if (klass) {
          const headingType = klass.replace(/^section-/, '');
          if (headingType === 'part') {
            hasPart = true;
          }
        }
      }
    }
  });
  return hasPart;
}
