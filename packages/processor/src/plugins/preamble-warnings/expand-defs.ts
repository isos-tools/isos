import { Macro, Node, Root } from '@unified-latex/unified-latex-types';
import { createMacroExpander } from '@unified-latex/unified-latex-util-macros';
import { match } from '@unified-latex/unified-latex-util-match';
import { replaceNode } from '@unified-latex/unified-latex-util-replace';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

// https://github.com/siefkenj/unified-latex/blob/e3a07de05a5a57f8580768b40b4f53e92790f8ec/examples/expanding-or-replacing-macros.ts#L106-L131

// https://tex.stackexchange.com/questions/655#662
// unified-latex currently can't parse this functionality of `\def`
// so forcing authors to update to `\newcommand`

// https://github.com/schneeschmelze/l2tabu-english
// CTAN l2tabuen Section 1.1
// it is also included in the 'Deadly Sins' here

export function expandDefs() {
  return (tree: Root) => {
    const defs = listDefs(tree);
    // console.log(defs);

    // Expand all macros in `\def` definitions with those from previous `\def` definitions
    expandMacroDefinitions(defs);

    // Expand all macros, except `\def` definitions.
    expandMacrosExcludingDefinitions(tree, defs);

    // remove `\def`s
    const defsUsed = Object.fromEntries(
      defs.map((x) => [x.definition.content, true]),
    );
    replaceNode(tree, (node) => {
      if (match.anyMacro(node) && defsUsed[node.content]) {
        return null;
      }
    });
  };
}

type NewCommandSpec = {
  name: string;
  body: Node[];
  definition: Macro;
};

function listDefs(tree: Root) {
  const defs: NewCommandSpec[] = [];
  // console.dir(tree, { depth: null });
  visit(tree, (node) => {
    if (node.type === 'macro' && node.content === 'def') {
      const args = node.args || [];
      if (args.length === 2) {
        const name = normalizeCommandName(printRaw(args[0].content));
        const body = args[1].content;
        defs.push({ name, body, definition: node });
      }
    }
  });
  return defs;
}

function normalizeCommandName(str: string): string {
  str = str.trim();
  return str.startsWith('\\') ? str.slice(1) : str;
}

function expandMacroDefinitions(macros: NewCommandSpec[]) {
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

function expandMacrosExcludingDefinitions(
  tree: Root,
  macros: NewCommandSpec[],
) {
  const expanderCache = new Map(
    macros.map((spec) => [spec.name, createMacroExpander(spec.body)]),
  );
  replaceNode(tree, (node, info) => {
    if (!match.anyMacro(node)) {
      return;
    }
    const macroName = node.content;
    const expander = expanderCache.get(macroName);
    if (!expander) {
      return;
    }
    if (
      info.parents.some((o) => o.type === 'macro' && o.content === 'def')
    ) {
      return;
    }
    return expander(node);
  });
}
