import * as Ast from '@unified-latex/unified-latex-types';
import { replaceNode } from '@unified-latex/unified-latex-util-replace';

// import { printRaw } from '@isos/unified-latex-util-print-raw';

export function removeNewDocumentCommand() {
  return (tree: Ast.Root) => {
    replaceNode(tree, (node) => {
      if (node.type === 'macro' && node.content === 'NewDocumentCommand') {
        // TODO
        // attempt to support correctly parse custom commands created
        // by NewDocumentCommand using the defined signature

        // const args = node.args || [];
        // const command = printRaw(args[0].content);
        // const signature = printRaw(args[1].content);
        // console.log({ command, signature });

        return null;
      }
    });
  };
}
