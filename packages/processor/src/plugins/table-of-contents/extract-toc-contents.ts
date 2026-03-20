import { convertToMarkdown } from '@unified-latex/unified-latex-to-mdast';
import { Environment, Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../input-to-markdown/context';

export function extractTocContents(ctx: Context) {
  return (tree: Root) => {
    let first = true;
    visit(tree, (node, info) => {
      if (node.type === 'macro' && node.content === 'addtocontents') {
        if (Array.isArray(node.args) && node.args.length === 2) {
          const ext = printRaw(node.args[0].content);
          if (ext === 'toc') {
            if (first) {
              const md = convertToMarkdown(node.args[1].content);
              ctx.frontmatter.tableOfContentsPrefix = md;
              first = false;
            }
            const parent = info.parents[0] as Environment;
            const idx = info.index || 0;
            parent.content.splice(idx, 1);
          }
        }
      }
    });
  };
}
