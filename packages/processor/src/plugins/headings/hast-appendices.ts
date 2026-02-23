import { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../markdown-to-mdx/context';

export function appendices(ctx: Context, noSections: boolean) {
  return (tree: Root) => {
    const { documentClass } = ctx.frontmatter;
    const isLong = ['report', 'book'].includes(String(documentClass));

    visit(tree, 'element', (node, idx = 0, parent) => {
      if (node.tagName === 'section') {
        const className = node.properties.className;
        if (
          Array.isArray(className) &&
          className.find((o) => String(o) === 'appendices')
        ) {
          adjustChapterHeadings(node, isLong);

          if (noSections === true) {
            parent?.children.splice(idx, 1, ...node.children);
          }
        }
      }
    });
  };
}

function adjustChapterHeadings(node: Element, isLong: boolean) {
  visit(node, 'element', (node) => {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
      const first = node.children[0];
      if (first?.type === 'element') {
        const { className } = first.properties;
        if (
          Array.isArray(className) &&
          className.includes('heading-count')
        ) {
          first.properties['data-appendix'] = true;
          node.children.splice(1, 0, {
            type: 'text',
            value: ' ',
          });
        }
      }
    }

    if (isLong && node.tagName === 'h2') {
      const first = node.children[0];
      if (first?.type === 'element') {
        const { className } = first.properties;
        if (
          Array.isArray(className) &&
          className.includes('heading-count')
        ) {
          node.children.splice(0, 0, {
            type: 'text',
            value: 'Appendix ',
          });
          node.children.splice(2, 0, {
            type: 'text',
            value: ': ',
          });
        }
      }
    }
  });
}
