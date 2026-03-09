import { convertToMarkdown } from '@unified-latex/unified-latex-to-mdast';
import {
  Environment,
  Macro,
  Node,
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
            orcid: extractMarkdown(getLastArg(node)),
          };
          parent.content?.splice(idx, 1);
        }
      }
    });

    visit(tree, (node, info) => {
      if (node.type === 'macro') {
        const idx = info.index || 0;
        const parent = info.parents[0] as Environment;

        if (['maketitle', 'fancytitle'].includes(node.content)) {
          ctx.hasMakeTitle = true;
        }

        if (node.content === 'title') {
          const lastArg = getLastArg(node);
          // console.dir(lastArg, { depth: null });
          const { title, titleImage } = extractTitleElements(lastArg);
          ctx.frontmatter.title = extractMarkdown(title);
          if (titleImage !== null) {
            ctx.frontmatter.titleImage = extractMarkdown(titleImage);
          }
          parent.content?.splice(idx, 1);
        }

        if (node.content === 'author') {
          const authIdx = getAuthBlkIdx(node);
          const name = extractMarkdown(getLastArg(node));
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
            affiliation: extractMarkdown(getLastArg(node)),
          };
          parent.content?.splice(idx, 1);
        }

        if (node.content === 'date') {
          ctx.frontmatter.date = extractMarkdown(getLastArg(node));
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

function extractTitleElements(arg: Node[]) {
  let title: Node[] | null = arg;
  let titleImage: Node[] | null = null;

  visit(arg, (node) => {
    if (node.type === 'macro' && ['huge', 'Huge'].includes(node.content)) {
      // console.dir(node, { depth: null });
      if (Array.isArray(node.args)) {
        // console.log(node.args[0]);
        const arg = node.args[0];
        title = arg.content;
      }
    }
    if (node.type === 'macro' && node.content === 'includegraphics') {
      if (Array.isArray(node.args)) {
        const arg = node.args[node.args.length - 1];
        titleImage = arg.content;
      }
    }
  });

  return { title, titleImage };
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

function getLastArg(node: Macro | Environment) {
  const args = getArgsContent(node);
  return args[args.length - 1] || [];
}

function extractMarkdown(arg: Node[]) {
  const result = convertToMarkdown(arg).trim();
  return result;
}
