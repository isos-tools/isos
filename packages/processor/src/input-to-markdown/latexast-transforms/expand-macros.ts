import { Macro, Node, Root } from '@unified-latex/unified-latex-types';
import { attachMacroArgs } from '@unified-latex/unified-latex-util-arguments';
import {
  createMacroExpander,
  expandMacrosExcludingDefinitions,
  listNewcommands,
} from '@unified-latex/unified-latex-util-macros';
import { match } from '@unified-latex/unified-latex-util-match';
import { replaceNode } from '@unified-latex/unified-latex-util-replace';

// https://github.com/siefkenj/unified-latex/blob/e3a07de05a5a57f8580768b40b4f53e92790f8ec/examples/expanding-or-replacing-macros.ts#L106-L131

export function expandMacros() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    const newcommands = listNewcommands(tree);

    const macroInfo = Object.fromEntries(
      newcommands.map((m) => [m.name, { signature: m.signature }]),
    );
    // Attach the arguments to each macro
    attachMacroArgs(tree, macroInfo);

    // Expand all macros in `\newcommand` definitions with those from previous `\newcommand` definitions
    expandMacroDefinitions(newcommands);

    // Expand all macros, except `\newcommand` definitions.
    expandMacrosExcludingDefinitions(tree, newcommands);

    // remove `\newcommand`s
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

function expandMacroDefinitions(
  macros: {
    name: string;
    body: Node[];
    definition: Macro;
  }[],
) {
  const expanderCache = new Map<string, (macro: Macro) => Node[]>();

  for (const macro of macros) {
    replaceNode(macro.body, (node) => {
      if (!match.anyMacro(node)) {
        return;
      }
      const macroName = node.content;
      const expander = expanderCache.get(macroName);
      if (!expander) {
        return;
      }
      return expander(node);
    });

    expanderCache.set(macro.name, createMacroExpander(macro.body));
  }
}
