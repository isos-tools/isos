import {
  Argument,
  Macro,
  Root,
  String,
} from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../../input-to-markdown/context';
import {
  RefObject,
  RefObjects,
  createDefaultObjects,
} from '../../refs-and-counts/default-objects';

export function extractTheoremDefinitions(ctx: Context) {
  return (tree: Root) => {
    const defaultObjects = createDefaultObjects();
    const theorems = extract(tree);
    ctx.frontmatter.theorems = { ...defaultObjects, ...theorems };
  };
}

function extract(tree: Root) {
  let style: RefObject['style'] = 'plain';
  let theorems: RefObjects = {};

  visit(tree, (node) => {
    if (node.type === 'macro') {
      if (node.content === 'theoremstyle') {
        const args = getArgsContent(node);
        style = printRaw(
          args[args.length - 1] || [],
        ) as RefObject['style'];
      }

      if (node.content === 'newtheorem') {
        const theorem = extractTheorem(node, style);
        // console.log(theorem);
        if (theorem !== null) {
          theorems = {
            ...theorems,
            [theorem.name]: {
              ...(theorems[theorem.name] || {}),
              ...theorem,
            },
          };
        }
      }

      if (node.content === 'newframedtheorem') {
        const theorem = extractFramedTheorem(node, style);
        if (theorem !== null) {
          theorems = {
            ...theorems,
            [theorem.name]: {
              ...(theorems[theorem.name] || {}),
              ...theorem,
            },
          };
        }
      }

      if (node.content === 'newexsol') {
        const theorem = extractExSol(node, style);
        if (theorem !== null) {
          theorems = {
            ...theorems,
            [theorem.name]: {
              ...(theorems[theorem.name] || {}),
              ...theorem,
            },
          };
        }
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
  style: RefObject['style'],
): RefObject | null {
  const theorem = extractTheorem(node, style);
  if (theorem !== null) {
    theorem.framed = true;
  }
  return theorem;
}

function extractExSol(node: Macro, style: RefObject['style']): RefObject {
  const _args = node.args || [];
  const args = _args.map((arg: Argument) => ({
    openMark: arg.openMark,
    content: printRaw(arg.content),
  }));

  const theorem: RefObject = {
    type: 'theorem',
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

// Theorem definitions are defined in section 3.4 of:
// https://anorien.csc.warwick.ac.uk/mirrors/CTAN/info/amscls-doc/Author_Handbook_ProcColl.pdf

function extractTheorem(
  node: Macro,
  style: RefObject['style'],
): RefObject | null {
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
      type: 'theorem',
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
      type: 'theorem',
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
      type: 'theorem',
      style,
      name: args[0].content,
      heading: args[2].content,
      referenceCounter: args[1].content,
      unnumbered,
    };
  }

  return null;
}
