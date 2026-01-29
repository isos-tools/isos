import { convertToMarkdown } from '@unified-latex/unified-latex-to-mdast';
import {
  Environment,
  Macro,
  Root,
} from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../input-to-markdown/context';

export function extractTopMatter(ctx: Context) {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, (node, info) => {
      const idx = info.index || 0;
      const parent = info.parents[0] as Environment;

      if (node.type === 'macro') {
        if (node.content === 'orcidlink') {
          const author = info.parents[1] as Macro;
          const authIdx = getAuthBlkIdx(author);

          ctx.frontmatter.author[authIdx - 1] = {
            ...(ctx.frontmatter.author[authIdx - 1] || {}),
            orcid: extractMarkdown(node),
          };
          parent.content?.splice(idx, 1);
        }
      }
    });

    visit(tree, (node, info) => {
      if (node.type === 'macro') {
        const idx = info.index || 0;
        const parent = info.parents[0] as Environment;

        if (node.content === 'maketitle') {
          ctx.hasMakeTitle = true;
        }

        if (node.content === 'title') {
          ctx.frontmatter.title = extractMarkdown(node);
          parent.content?.splice(idx, 1);
        }

        if (node.content === 'author') {
          const authIdx = getAuthBlkIdx(node);
          const name = extractMarkdown(node);
          ctx.frontmatter.author[authIdx - 1] = {
            ...(ctx.frontmatter.author[authIdx - 1] || {}),
            name,
          };
          parent.content?.splice(idx, 1);
        }

        if (node.content === 'affil') {
          const authIdx = getAuthBlkIdx(node);
          ctx.frontmatter.author[authIdx - 1] = {
            ...(ctx.frontmatter.author[authIdx - 1] || {}),
            affiliation: extractMarkdown(node),
          };
          parent.content?.splice(idx, 1);
        }

        if (node.content === 'date') {
          ctx.frontmatter.date = extractMarkdown(node);
          parent.content?.splice(idx, 1);
        }
      }

      if (node.type === 'environment' && node.env === 'abstract') {
        ctx.frontmatter.abstract = convertToMarkdown(node.content);
        const idx = info.index || 0;
        const parent = info.parents[0] as Environment;
        parent.content?.splice(idx, 1);
      }
    });
    // console.dir(tree, { depth: null });
    // console.log(ctx.frontmatter);
  };
}

function getAuthBlkIdx(node: Macro) {
  if (Array.isArray(node.args) && node.args.length === 2) {
    const str = printRaw(node.args[0].content);
    const num = Number(str);
    if (Number.isInteger(num) && num > 0) {
      return num;
    }
  }
  return 1;
}

function extractMarkdown(node: Macro | Environment) {
  const args = getArgsContent(node);
  return convertToMarkdown(args[args.length - 1] || []).trim();
}
