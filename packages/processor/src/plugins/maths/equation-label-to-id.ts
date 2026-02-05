import * as Ast from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';
import kebabCase from 'lodash.kebabcase';

import { printRaw } from '@isos/unified-latex-util-print-raw';

export function equationLabelToId() {
  return (tree: Ast.Root) => {
    visit(tree, (node) => {
      if (node.type === 'mathenv') {
        const env = (node.env || {}) as Ast.Node;
        const id = extractMacro(node, 'label');

        if (
          env.type === 'string' &&
          ['equation', 'align'].includes(env.content)
        ) {
          const data: Record<string, string> = {};
          if (id) {
            data.id = kebabCase(extractText(id));
          }
          Object.assign(node, { data });
        }
      }
    });
  };
}

function extractMacro(mathEnv: Ast.Node, name: string): Ast.Macro | null {
  let macro = null;
  visit(mathEnv, (node, info) => {
    if (node.type === 'macro' && node.content === name) {
      macro = node;

      // remove macro
      const parent = info.parents[0];
      if (parent && parent.type === 'mathenv') {
        parent.content.splice(info.index || 0, 1);
      }
    }
  });
  return macro;
}

function extractText(macro: Ast.Macro) {
  const args = getArgsContent(macro);
  return printRaw(args[args.length - 1] || []).trim();
}
