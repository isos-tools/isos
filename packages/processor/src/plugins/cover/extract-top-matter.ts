import {
  Argument,
  Environment,
  Macro,
  Node,
  Root,
} from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';
import { Root as MdAstRoot } from 'mdast';
import rehypeRemark from 'rehype-remark';
import { unified } from 'unified';

import { unifiedLatexToHast } from '@isos/unified-latex-to-hast';
import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../input-to-markdown/context';
import { createHastTransforms } from '../../input-to-markdown/hast-transforms';
import { createRehypeRemarkHandlers } from '../../input-to-markdown/rehyperemark-handlers';
import { createRemarkProcessor } from '../../remark-processor';

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
            orcid: convertToMarkdown(getLastArg(node), ctx),
          };
          parent.content?.splice(idx, 1);
        }
      }
    });

    visit(tree, (node, info) => {
      if (node.type === 'macro') {
        if (['maketitle', 'fancytitle'].includes(node.content)) {
          ctx.hasMakeTitle = true;
        }

        const idx = info.index || 0;
        const parent = info.parents[0] as Environment;

        if (node.content === 'title') {
          const titleImage = extractTitleImage(node);
          if (titleImage !== null) {
            ctx.frontmatter.titleImage = convertToMarkdown(
              titleImage,
              ctx,
            );
          }
          const lastArg = getLastArg(node);
          const title = convertToMarkdown(lastArg, ctx);
          // remove line breaks from text
          const oneline = title.replace(/\\\n/gm, ' ');
          ctx.frontmatter.title = oneline;
          parent.content?.splice(idx, 1);
        }

        if (node.content === 'author') {
          const authIdx = getAuthBlkIdx(node);
          const name = convertToMarkdown(getLastArg(node), ctx);
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
            affiliation: convertToMarkdown(getLastArg(node), ctx),
          };
          parent.content?.splice(idx, 1);
        }

        if (node.content === 'date') {
          // console.log(getLastArg(node));
          ctx.frontmatter.date = convertToMarkdown(getLastArg(node), ctx);
          parent.content?.splice(idx, 1);
        }
      }

      if (node.type === 'environment' && node.env === 'abstract') {
        ctx.frontmatter.abstract = convertToMarkdown(node.content, ctx);
        const idx = info.index || 0;
        const parent = info.parents[0] as Environment;
        parent.content?.splice(idx, 1);
      }
    });
    // console.dir(tree, { depth: null });
    // console.log(ctx.frontmatter);
  };
}

// function extractTitleElements(node: Macro) {
//   const arg = getLastArg(node);
//   let title: Node[] | null = arg;

//   const titleImage = extractTitleImage(arg);

//   console.dir(node, { depth: null });
//   // console.log(getArgsContent(arg));

//   // visit(arg, (node) => {
//   //   if (node.type === 'macro' && ['huge', 'Huge'].includes(node.content)) {
//   //     // console.dir(node, { depth: null });
//   //     if (Array.isArray(node.args)) {
//   //       // console.log(node.args[0]);
//   //       const arg = node.args[0];
//   //       title = arg.content;
//   //     }
//   //   }
//   //   // if (node.type === 'macro' && node.content === 'includegraphics') {
//   //   //   if (Array.isArray(node.args)) {
//   //   //     const arg = node.args[node.args.length - 1];
//   //   //     titleImage = arg.content;
//   //   //   }
//   //   // }
//   // });

//   return { title, titleImage };
// }

function extractTitleImage(macro: Macro) {
  let titleImage: Node[] | null = null;

  visit(macro, (node, info) => {
    if (node.type === 'macro' && node.content === 'includegraphics') {
      if (Array.isArray(node.args)) {
        const arg = node.args[node.args.length - 1];
        titleImage = arg.content;

        // console.log(info);
        const parent = info.parents[0] as Argument;
        // console.log(parent);
        const idx = info.index || 0;
        parent.content?.splice(idx, 1);
      }
    }
  });

  return titleImage;
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

function convertToMarkdown(arg: Node[], ctx: Context) {
  const root: Root = {
    type: 'root',
    content: arg,
  };
  const hastTransforms = createHastTransforms(ctx);
  const htmlAst = unified()
    .use([unifiedLatexToHast, ...hastTransforms])
    .runSync(root);
  const handlers = createRehypeRemarkHandlers(ctx);
  const processor = createRemarkProcessor([[rehypeRemark, { handlers }]]);
  const mdAst = processor.runSync(htmlAst) as MdAstRoot;
  return processor.stringify(mdAst).trim();
}
