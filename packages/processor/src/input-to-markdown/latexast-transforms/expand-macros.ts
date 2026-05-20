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

// based on: https://github.com/siefkenj/unified-latex/blob/e3a07de05a5a57f8580768b40b4f53e92790f8ec/examples/expanding-or-replacing-macros.ts#L106-L131

export function expandMacros(ctx: Context) {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    const newcommands = listNewcommands(tree);

    const macroInfo = Object.fromEntries(
      newcommands.map((m) => [m.name, { signature: m.signature }]),
    );
    // Attach the arguments to each macro
    attachMacroArgs(tree, macroInfo);

    // Expand all macros in `\newcommand` definitions (dependencies first).
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

  const ordered = sortMacrosByDependency(filtered);

  for (const macro of ordered) {
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

  const numBroken = macros.length - filtered.length;
  if (numBroken > 0) {
    ctx.frontmatter.preambleWarnings.push({
      message: '\\newcommands with broken environments are not supported',
      info: `Remove (${numBroken}) \\newcommands which \\begin an environment but don't end it (or vice versa).  A supported alternative is \\newenvironment.`,
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

/** Expand definitions before dependents */
function sortMacrosByDependency(macros: MacroDef[]): MacroDef[] {
  const macroByName = new Map(macros.map((m) => [m.name, m]));
  const definedNames = new Set(macroByName.keys());
  const deps = new Map(
    macros.map((m) => [
      m.name,
      collectDefinedMacroRefs(m.body, definedNames),
    ]),
  );

  const sorted: MacroDef[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(name: string) {
    if (visited.has(name)) {
      return;
    }
    if (visiting.has(name)) {
      return;
    }
    visiting.add(name);
    for (const dep of deps.get(name) ?? []) {
      visit(dep);
    }
    visiting.delete(name);
    visited.add(name);
    const macro = macroByName.get(name);
    if (macro) {
      sorted.push(macro);
    }
  }

  for (const macro of macros) {
    visit(macro.name);
  }

  for (const macro of macros) {
    if (!visited.has(macro.name)) {
      sorted.push(macro);
    }
  }

  return sorted;
}

function collectDefinedMacroRefs(
  body: Node[],
  definedNames: Set<string>,
): string[] {
  const refs = new Set<string>();
  replaceNode(body, (node) => {
    if (match.anyMacro(node) && definedNames.has(node.content)) {
      refs.add(node.content);
    }
  });
  return [...refs];
}
