import { Macro, Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { Context } from '../../input-to-markdown/context';

export type Warning = {
  message: string;
  info: string;
};

export function defWarn(ctx: Context) {
  return (tree: Root) => {
    const defs = listDefs(tree);
    if (defs.length > 0) {
      const warn: Warning = {
        message: '\\def is not supported',
        info: `Replace all (${defs.length}) \\def commands with \\newcommand.  Try compiling with pdftex, it may warn you to use \\renewcommand if a command already exists.`,
      };
      ctx.frontmatter.preambleWarnings.push(warn);
    }
  };
}

function listDefs(tree: Root) {
  const defs: Macro[] = [];
  visit(tree, (node) => {
    if (node.type === 'macro' && node.content === 'def') {
      defs.push(node);
    }
  });
  return defs;
}
