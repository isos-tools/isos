import { Ast, Root } from '@unified-latex/unified-latex-types';
import { attachMacroArgs } from '@unified-latex/unified-latex-util-arguments';
import {
  expandMacros,
  expandMacrosExcludingDefinitions,
  listNewcommands,
} from '@unified-latex/unified-latex-util-macros';
import { match } from '@unified-latex/unified-latex-util-match';
import { replaceNode } from '@unified-latex/unified-latex-util-replace';

// https://github.com/siefkenj/unified-latex/blob/e3a07de05a5a57f8580768b40b4f53e92790f8ec/examples/expanding-or-replacing-macros.ts#L106-L131

/**
 * Plugin that expands the specified macros by name. These macros must be defined in the document via
 * `\newcommand...` or equivalent.
 */
export function expandDocumentMacrosPlugin() {
  return (tree: Root) => {
    // console.log(tree);
    const newcommands = listNewcommands(tree);
    // console.dir(newcommands, { depth: null });

    const macroInfo = Object.fromEntries(
      newcommands.map((m) => [m.name, { signature: m.signature }]),
    );
    // Attach the arguments to each macro before we process it!
    attachMacroArgs(tree, macroInfo);

    // Expand all macros in `\newcommand` definitions
    const newCommandTree: Ast = {
      type: 'root',
      content: newcommands.map((o) => o.definition),
    };
    expandMacros(newCommandTree, newcommands);

    // Expand all macros, except ones mentioned in actual `\newcommand` commands.
    expandMacrosExcludingDefinitions(tree, newcommands);

    // Finally, let's remove the `\newcommand`s from the tree.
    // Our document could have used `\newcommand` or `\NewDocumentCommand`, etc. We will remove
    // all of these.
    const newcommandsUsed = Object.fromEntries(
      newcommands.map((x) => [x.definition.content, true]),
    );
    replaceNode(tree, (node) => {
      if (match.anyMacro(node) && newcommandsUsed[node.content]) {
        return null;
      }
    });
  };
}
