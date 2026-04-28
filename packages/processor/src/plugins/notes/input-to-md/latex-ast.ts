import { Argument, Node, Root } from '@unified-latex/unified-latex-types';
import { pgfkeysArgToObject } from '@unified-latex/unified-latex-util-pgfkeys';
import { toString } from '@unified-latex/unified-latex-util-to-string';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { Context } from '../../../input-to-markdown/context';
import { createWarn } from '../../warn/latexast-warn';
import { configByMacroName, noteConfig, printMacros } from '../config';

export type NoteMap = Record<string, Node[]>;

export function extractNotes(ctx: Context) {
  let counter = 0;

  return (tree: Root) => {
    const macroNames = noteConfig.flatMap((o) => o.macros);
    const noteMap: NoteMap = {};

    // footnotes as sidenotes
    let footnoteAsSidenote = false;
    visit(tree, (node) => {
      if (node.type === 'macro' && node.content === 'usepackage') {
        const args = node.args || [];
        const lastArg = args[args.length - 1];
        const packageName = toString(lastArg.content);

        if (packageName === 'snotez') {
          const { footnote } = pgfkeysArgToObject(args[0]);

          if (Array.isArray(footnote)) {
            if (footnote.length === 0 || toString(footnote) === 'true') {
              footnoteAsSidenote = true;
            }
          }
        }
      }
    });

    // inline notes
    visit(tree, (node) => {
      if (node.type === 'macro') {
        if (macroNames.includes(node.content)) {
          const name = getName(node.content, footnoteAsSidenote);
          const config = configByMacroName(name);

          // console.log({ name, config });

          if (config) {
            const args = node.args || [];
            const firstArg = args[0];
            const mark =
              getKey(firstArg) || `${config.prefix}-${++counter}`;

            if (noteMap[mark]) {
              Object.assign(
                node,
                createWarn(
                  `Multiply defined ${config.name} mark: ${mark}`,
                ),
              );
            } else {
              const lastArg = args[args.length - 1];
              noteMap[mark] = lastArg.content;

              node.content = config.name;
              firstArg.content = [{ type: 'string', content: mark }];
              lastArg.content = [];

              // console.log(name, node);
            }
          }
        }
      }
    });

    // separated notes
    visit(tree, (node, info) => {
      if (node.type === 'macro') {
        if (node.content === 'sepfootnotecontent') {
          const args = node.args || [];
          const mark = getKey(args[0]);

          if (noteMap[mark]) {
            Object.assign(
              node,
              createWarn(
                `Multiply defined \\sepfootnotecontent mark: ${mark}`,
              ),
            );
          } else {
            const lastArg = args[args.length - 1];
            noteMap[mark] = lastArg.content;

            // remove macro
            const parent = info.parents[0] as Root;
            const idx = info.index;
            if (parent && idx !== undefined) {
              parent.content.splice(idx, 1);
            }
          }
        }

        if (node.content === 'sepfootnote') {
          node.content = getName('footnote', footnoteAsSidenote);
        }

        if (printMacros.includes(node.content)) {
          node.content = 'printendnotes';
        }
      }
    });

    ctx.notes = noteMap;
    // console.log('notes:', notes);
  };
}

function getKey(arg: Argument) {
  const str = toString(arg.content);
  if (/^\d+$/.test(str)) {
    return String(Number(str));
  }
  return str;
}

function getName(name: string, asSidenote: boolean) {
  return name === 'footnote' && asSidenote ? 'sidenote' : name;
}
