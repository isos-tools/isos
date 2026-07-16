import * as Ast from '@unified-latex/unified-latex-types';
// import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';
import kebabCase from 'lodash.kebabcase';

import { printRaw } from '@isos/unified-latex-util-print-raw';

export function equationLabelToId() {
  return (tree: Ast.Root) => {
    visit(tree, (node) => {
      if (node.type === 'mathenv') {
        const labels = sanitiseLabels(node);

        // const env = printRaw(node.env);
        // console.log(env);

        if (labels.length === 1 && !printRaw(node.env).endsWith('*')) {
          const id = labels[0];
          const data: Record<string, string> = {};
          data.id = kebabCase(id);
          Object.assign(node, { data });
        }
      }
    });
  };
}

function sanitiseLabels(mathEnv: Ast.Node): string[] {
  const labels: string[] = [];
  visit(mathEnv, (node) => {
    if (node.type === 'macro' && node.content === 'label') {
      const args = node.args || [];
      const lastArg = args[args.length - 1];
      if (lastArg) {
        const text = kebabCase(printRaw(lastArg).trim());
        if (text) {
          lastArg.content = [
            {
              type: 'string',
              content: kebabCase(text),
            },
          ];
          labels.push(text);
        }
      }
    }
  });
  return labels;
}
