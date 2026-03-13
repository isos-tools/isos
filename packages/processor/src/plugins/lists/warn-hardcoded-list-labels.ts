import * as Ast from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

export function warnOnHardcodedListLabels() {
  return (tree: Ast.Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, (node, info) => {
      if (node.type === 'macro' && node.content === 'item') {
        const parent = info.parents[0];
        if (
          parent.type === 'environment' &&
          ['enumerate', 'itemize'].includes(parent.env)
        ) {
          // console.log(node);
          const args = node.args || [];
          const labelArg = args[1];
          if (labelArg && labelArg.content.length > 0) {
            // console.log(labelArg);
            const contentArg = args[3];
            if (contentArg) {
              const warnArg: Ast.Argument = {
                type: 'argument',
                content: [
                  {
                    type: 'string',
                    content: `hardcoded item labels are not supported in ${parent.env} lists`,
                  },
                ],
                openMark: '{',
                closeMark: '}',
              };
              const warnMacro: Ast.Macro = {
                type: 'macro',
                content: 'warn',
                args: [warnArg],
              };
              contentArg.content.unshift(warnMacro);
            }
          }
        }
        // node.content = 'subsection';
      }
    });
  };
}
