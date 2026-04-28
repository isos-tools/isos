import {
  Argument,
  Macro,
  Root,
  String,
} from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';

// import { wrapPars } from '@isos/unified-latex-to-hast';
import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../../input-to-markdown/context';
import { createDefaultObjectsYaml } from '../../refs-and-counts/default-objects';
import { Theorem } from '../default-theorems';

export function theorems(ctx: Context) {
  return (tree: Root) => {
    const { custom, ...obj } = extractTheoremDefinitions(tree);
    // console.log('theorem definitions:', theorems);
    ctx.frontmatter.theorems = obj;
  };
}

function extractTheoremDefinitions(tree: Root) {
  let style: Theorem['style'] = 'plain';
  let theorems = createDefaultObjectsYaml();

  visit(tree, (node) => {
    if (node.type === 'macro') {
      if (node.content === 'theoremstyle') {
        const args = getArgsContent(node);
        style = printRaw(args[args.length - 1] || []) as Theorem['style'];
      }

      if (node.content === 'numberwithin') {
        const args = extractNumberWithin(node);
        if (args !== null) {
          const { name, numberWithin } = args;
          theorems = {
            ...theorems,
            [name]: {
              ...(theorems[name] || {}),
              numberWithin,
            },
          };
        }
      }

      if (node.content === 'newtheorem') {
        const thm = extractTheorem(node, style);
        if (thm !== null) {
          const { name, ...theorem } = thm;
          theorems = {
            ...theorems,
            [name]: {
              ...(theorems[name] || {}),
              ...theorem,
              type: 'theorem',
            },
          };
        }
      }

      if (node.content === 'newframedtheorem') {
        const thm = extractFramedTheorem(node, style);
        if (thm !== null) {
          const { name, ...theorem } = thm;
          theorems = {
            ...theorems,
            [name]: {
              ...(theorems[name] || {}),
              ...theorem,
              type: 'theorem',
            },
          };
        }
      }

      if (node.content === 'newexsol') {
        const { name, ...theorem } = extractExSol(node, style);

        theorems = {
          ...theorems,
          [name]: {
            ...(theorems[name] || {}),
            ...theorem,
            type: 'theorem',
          },
        };
      }

      if (node.content === 'counterwithin') {
        const args = getArgsContent(node);
        if (args[0] !== null && args[1] !== null) {
          const [name] = args[0];
          const [counterWithin] = args[1];
          if (name.type === 'string' && counterWithin.type === 'string') {
            theorems = {
              ...theorems,
              [name.content]: {
                ...(theorems[name.content] || {}),
                counterWithin: counterWithin.content,
              },
            };
          }
        }
      }
    }
  });

  return theorems;
}

function extractFramedTheorem(
  node: Macro,
  style: Theorem['style'],
): Theorem | null {
  const theorem = extractTheorem(node, style);
  if (theorem !== null) {
    theorem.framed = true;
  }
  return theorem;
}

function extractExSol(node: Macro, style: Theorem['style']): Theorem {
  const _args = node.args || [];
  const args = _args.map((arg: Argument) => ({
    openMark: arg.openMark,
    content: printRaw(arg.content),
  }));

  const theorem: Theorem = {
    style,
    framed: true,
    unnumbered: args[0].content === '*',
    hideable: normaliseFlag(args[1].content),
    name: args[2].content,
    heading: args[3].content,
    lowerTitle: args[4].content,
  };

  const match = args[5].content.match(/number within=(\S+)/);

  if (match !== null) {
    theorem.numberWithin = match[1];
  }

  return theorem;
}

function normaliseFlag(flag: string) {
  switch (flag) {
    case 'emptybox':
    case 'hide':
      return 'hide';
    case 'show':
      return 'show';
    default:
      return 'clicktoshow';
  }
}

function extractNumberWithin(node: Macro) {
  // const args = getArgsContent(node);
  const args = node.args || [];
  // console.dir(args, { depth: null });

  if (args.length !== 2) {
    return null;
  }

  const [name, numberWithin] = args;

  if (
    name.content[0].type !== 'string' ||
    numberWithin.content[0].type !== 'string'
  ) {
    return null;
  }

  return {
    name: name.content[0].content,
    numberWithin: numberWithin.content[0].content,
  };
}

// Theorem definitions are defined in section 3.4 of:
// https://anorien.csc.warwick.ac.uk/mirrors/CTAN/info/amscls-doc/Author_Handbook_ProcColl.pdf

function extractTheorem(
  node: Macro,
  style: Theorem['style'],
): Theorem | null {
  const _args = node.args || [];

  // starred
  const firstArgContent = _args[0].content[0] as String;
  const unnumbered = firstArgContent?.content === '*';

  // \newtheorem args
  const args = _args
    .slice(_args.findIndex((o) => o.openMark === '{'))
    .filter((o) => o.content.length > 0)
    .map((arg: Argument) => ({
      openMark: arg.openMark,
      content: printRaw(arg.content),
    }));

  if (
    args.length === 2 &&
    args[0].openMark === '{' &&
    args[1].openMark === '{'
  ) {
    return {
      style,
      name: args[0].content,
      heading: args[1].content,
      unnumbered,
    };
  }

  if (
    args.length === 3 &&
    args[0].openMark === '{' &&
    args[1].openMark === '{' &&
    args[2].openMark === '['
  ) {
    return {
      style,
      name: args[0].content,
      heading: args[1].content,
      numberWithin: args[2].content,
      unnumbered,
    };
  }

  if (
    args.length === 3 &&
    args[0].openMark === '{' &&
    args[1].openMark === '[' &&
    args[2].openMark === '{'
  ) {
    return {
      style,
      name: args[0].content,
      heading: args[2].content,
      referenceCounter: args[1].content,
      unnumbered,
    };
  }

  return null;
}
