import {
  Argument,
  Macro,
  Root,
  String,
} from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../input-to-markdown/context';
import { Theorem } from '../theorems-proofs/default-theorems';
import { createDefaultObjectsYaml } from './default-objects';

export function extractTheoremDefinitions(ctx: Context) {
  return (tree: Root) => {
    let style: Theorem['style'] = 'plain';
    let theorems = createDefaultObjectsYaml();

    visit(tree, (node) => {
      if (node.type === 'macro') {
        if (node.content === 'theoremstyle') {
          const args = getArgsContent(node);
          style = printRaw(
            args[args.length - 1] || [],
          ) as Theorem['style'];
        }

        if (node.content === 'newtheorem') {
          const { name, ...theorem } = extractTheorem(node, style);

          theorems = {
            ...theorems,
            [name]: {
              ...(theorems[name] || {}),
              ...theorem,
              type: 'theorem',
            },
          };
        }

        if (node.content === 'newframedtheorem') {
          const { name, ...theorem } = extractFramedTheorem(node, style);

          theorems = {
            ...theorems,
            [name]: {
              ...(theorems[name] || {}),
              ...theorem,
              type: 'theorem',
            },
          };
        }

        if (node.content === 'newhideabletheorem') {
          const { name, ...theorem } = extractHideableTheorem(node, style);

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
            if (
              name.type === 'string' &&
              counterWithin.type === 'string'
            ) {
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

    ctx.frontmatter.theorems = theorems;

    // console.log('extractTheoremDefinitions', ctx.frontmatter.theorems);
  };
}

function extractFramedTheorem(
  node: Macro,
  style: Theorem['style'],
): Theorem {
  const theorem = extractTheorem(node, style);
  theorem.framed = true;
  return theorem;
}

const defaultHideableOptions: Partial<Theorem> = {
  hideable: 'clicktoshow',
  framed: true,
};

function extractHideableTheorem(
  node: Macro,
  style: Theorem['style'],
): Theorem {
  const theorem = {
    ...extractTheorem(node, style),
    ...defaultHideableOptions,
  };

  const args = node.args || [];
  if (args[1].openMark === '[') {
    const params = parsePgf(args[1]);
    if (params.hide === 'true' || params.emptybox === 'true') {
      theorem.hideable = 'hide';
    }
    if (params.show === 'true') {
      theorem.hideable = 'show';
    }
    if (params.isos) {
      theorem.hideable = params.isos as Theorem['hideable'];
    }

    if (params.framed === 'false') {
      delete theorem.framed;
    }
  }

  return theorem;
}

function parsePgf(arg: Argument) {
  const str = printRaw(arg)
    .trim()
    .replace(/^\[\s*/, '')
    .replace(/\s*\]$/, '');

  return str.split(/\s*,\s*/).reduce((acc: Record<string, string>, s) => {
    const [k, v] = s.split('=');
    if (k) {
      acc[k] = v ? v.replace(/^\{\s*/, '').replace(/\s*\}$/, '') : 'true';
    }
    return acc;
  }, {});
}

// Theorem definitions are defined in section 3.4 of:
// https://anorien.csc.warwick.ac.uk/mirrors/CTAN/info/amscls-doc/Author_Handbook_ProcColl.pdf

function extractTheorem(node: Macro, style: Theorem['style']): Theorem {
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

  throw new Error('theorem definition not supported');
}
