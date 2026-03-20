import { BlockContent, Root } from 'mdast';
import { visit } from 'unist-util-visit';

import { Context } from '../../markdown-to-mdx/context';
import { createRemarkProcessor } from '../../remark-processor';

export function includeTocContents(ctx: Context) {
  return (tree: Root) => {
    const tocContents = ctx.frontmatter.tableOfContentsPrefix;

    visit(tree, 'root', (node) => {
      if (tocContents) {
        const contents = extractTocContents(tocContents);
        node.children.unshift(...contents);
      }
    });

    // console.dir(tree, { depth: null });
  };
}

export function extractTocContents(tocContents: string) {
  const processor = createRemarkProcessor();
  const mdast = processor.parse(tocContents);
  return mdast.children.map((child) => ({
    ...child,
    data: {
      hProperties: {
        className: ['toc-content'],
      },
    },
  }));
}

export function getTocContent(node: Root) {
  const tocContent: BlockContent[] = [];

  visit(node, 'paragraph', (node) => {
    const data = node.data || {};
    let { className } = data.hProperties || {};
    if (Array.isArray(className) && className.includes('toc-content')) {
      tocContent.push(node);
    }
  });

  return tocContent;
}
