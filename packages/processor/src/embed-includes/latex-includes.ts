import * as Ast from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { unifiedLatexFromString } from '@unified-latex/unified-latex-util-parse';
import { unifiedLatexStringCompiler } from '@unified-latex/unified-latex-util-to-string';
import { visit } from '@unified-latex/unified-latex-util-visit';
import { dirname, join, parse, resolve } from 'pathe';
import { unified } from 'unified';

import { Fs } from '@isos/fs/types';
import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../input-to-markdown/context';

export async function embedLatexIncludes(ctx: Context, fs: Fs) {
  const subFiles: string[] = [];
  const latexAstRoot = await getLatexAst(ctx.content, fs, ctx, subFiles);

  // start remove
  const processor = unified()
    // @ts-expect-error
    .use(unifiedLatexStringCompiler, {
      pretty: true,
      useTabs: true,
      // forceNewlineEnding: true,
      printWidth: 200,
    });

  ctx.content = String(processor.stringify(latexAstRoot));
  // end remove

  return { latexAstRoot, subFiles };
}

async function getLatexAst(
  input: string,
  fs: Fs,
  ctx: Context,
  subFiles: string[],
) {
  const processor = unified()
    // @ts-expect-error
    .use(unifiedLatexFromString, {
      macros: {
        graphicspath: { signature: 'm' },
      },
    })
    .use(recursivelyIncludeFiles, ctx, fs, subFiles);
  const parsed = processor.parse(input);
  const transformed = await processor.run(parsed);

  return transformed as Ast.Root;
}

function recursivelyIncludeFiles(
  ctx: Context,
  fs: Fs,
  subFiles: string[],
) {
  return async (tree: Ast.Root) => {
    // console.log(tree);

    const srcDir = dirname(ctx.srcFilePath);
    const includePaths: string[] = [];

    visit(tree, (node) => {
      if (node.type === 'macro') {
        if (isInclude(node)) {
          const fullPath = getFullPath(node, srcDir, '.tex');
          includePaths.push(fullPath);
          subFiles.push(fullPath);
        }

        // let graphicspath float through files
        if (node.content === 'graphicspath') {
          const args = getArgsContent(node as Ast.Macro);
          const lastArg = args[args.length - 1] || [];
          const group = lastArg.find((o) => o.type === 'group') || {
            type: 'group',
            content: [],
          };
          const content = group.content as Ast.String[];
          ctx.graphicsPath = printRaw(content);
        }

        if (isImage(node)) {
          const args = getArgsContent(node as Ast.Macro);
          const lastArg = args[args.length - 1] || [];
          // prepend graphicspath to image file paths
          lastArg.unshift({ type: 'string', content: ctx.graphicsPath });

          const fullPath = getFullPath(node, srcDir, '.pdf');
          subFiles.push(fullPath);
        }
      }
    });

    const contents: Record<string, Ast.Root | null> = {};

    for (const includePath of includePaths) {
      try {
        // the recursive bit
        contents[includePath] = await getLatexAst(
          await fs.readTextFile(includePath),
          fs,
          ctx,
          subFiles,
        );
      } catch (err) {
        contents[includePath] = null;
      }
    }

    visit(tree, (node, info) => {
      if (node.type === 'macro' && isInclude(node)) {
        const fullPath = getFullPath(node, srcDir, '.tex');
        const ast = contents[fullPath];
        if (ast) {
          const idx = info.index || 0;
          const parent = info.parents[0] as Ast.Environment;
          parent.content.splice(idx, 1, ...ast.content);
        } else {
          // TODO: add warning element
        }
      }
    });
  };
}

function isInclude(node: Ast.Macro) {
  return ['input', 'include'].includes(node.content);
}

function isImage(node: Ast.Macro) {
  return ['includegraphics'].includes(node.content);
}

function getFullPath(node: Ast.Macro, srcDir: string, defaultExt: string) {
  const args = getArgsContent(node as Ast.Macro);
  const fullPath = printRaw(args[args.length - 1] || []);
  const { dir, name, ext } = parse(fullPath);
  return resolve(srcDir, dir, `${name}${ext || defaultExt}`);
}
