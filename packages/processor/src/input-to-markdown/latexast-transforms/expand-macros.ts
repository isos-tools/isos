import { Macro, Node, Root } from '@unified-latex/unified-latex-types';
import { attachMacroArgs } from '@unified-latex/unified-latex-util-arguments';
import {
  createMacroExpander,
  listNewcommands,
  newcommandMatcher,
} from '@unified-latex/unified-latex-util-macros';
import { match } from '@unified-latex/unified-latex-util-match';
import { replaceNode } from '@unified-latex/unified-latex-util-replace';

import { Context } from '../context';

// https://github.com/siefkenj/unified-latex/blob/e3a07de05a5a57f8580768b40b4f53e92790f8ec/examples/expanding-or-replacing-macros.ts#L106-L131

export function expandMacros(ctx: Context) {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    const newcommands = listNewcommands(tree);

    const macroInfo = Object.fromEntries(
      newcommands.map((m) => [m.name, { signature: m.signature }]),
    );
    // Attach the arguments to each macro
    attachMacroArgs(tree, macroInfo);

    // Expand all macros in `\newcommand` definitions with those from previous `\newcommand` definitions
    const expanded = expandMacroDefinitions(newcommands, ctx);

    // Expand all macros, except `\newcommand` definitions.
    expandMacrosExcludingDefinitions(tree, expanded);

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

type MacroDef = {
  name: string;
  body: Node[];
  definition: Macro;
};

function expandMacroDefinitions(macros: MacroDef[], ctx: Context) {
  const expanderCache = new Map<string, (macro: Macro) => Node[]>();

  const filtered = macros.filter((m) =>
    m.body.every(
      (o) => !(o.type === 'macro' && ['begin', 'end'].includes(o.content)),
    ),
  );

  for (const macro of filtered) {
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

  const brokenEnvs = macros.length - filtered.length;
  if (brokenEnvs > 0) {
    ctx.frontmatter.preambleWarnings.push({
      message: '\\newcommands with broken environments are not supported',
      info: `Remove (${brokenEnvs}) \\newcommands which \\begin an environment but don't end it (or vice versa).  A supported alternative is \\newenvironment.`,
    });
  }

  return filtered;
}

function expandMacrosExcludingDefinitions(tree: Root, macros: MacroDef[]) {
  const expanderCache = new Map(
    macros.map((spec) => [spec.name, createMacroExpander(spec.body)]),
  );
  // console.log(expanderCache);
  replaceNode(tree, (node, info) => {
    if (!match.anyMacro(node)) {
      return;
    }
    if (info.parents.some((o) => newcommandMatcher(o))) {
      return;
    }
    const macroName = node.content;
    const expander = expanderCache.get(macroName);
    if (!expander) {
      return;
    }
    const result = expander(node);
    // console.log(node, result);
    return result;
  });
}
