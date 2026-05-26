import { Root } from 'hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../input-to-markdown/context';

export function adjustHeadingDepth(ctx: Context) {
  return (tree: Root) => {
    const { sectionToHeading } = ctx;
    // console.log(sectionToHeading);
    visit(tree, 'element', (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        const className = node.properties.className;

        if (Array.isArray(className)) {
          const classes = className.map(String);
          const klass = classes.find((s) => s.startsWith('section-'));

          if (klass) {
            const headingType = klass.replace(/^section-/, '');
            node.tagName = sectionToHeading[headingType];
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
