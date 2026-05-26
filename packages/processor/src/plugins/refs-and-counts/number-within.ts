import { Macro, Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';
import merge from 'lodash.merge';

import { Context } from '../../input-to-markdown/context';
import { createDefaultObjects } from './default-objects';

export function extractNumberWithin(ctx: Context) {
  return (tree: Root) => {
    const { sectionToHeading } = ctx;
    const refs = createDefaultObjects();
    // console.log(refs);
    const theorems = {};
    const floats = {};
    const equations = {};

    visit(tree, (node) => {
      if (
        node.type === 'macro' &&
        ['numberwithin', 'counterwithin'].includes(node.content)
      ) {
        const args = extract(node);
        if (args !== null) {
          const name = args.name;
          const ref = refs[name];

          if (ref) {
            const key = node.content;
            const value = args[key];
            const config = {
              [name]: {
                [normaliseKey(key)]: sectionToHeading[value] || value,
              },
            };
            switch (ref.type) {
              case 'theorem':
                Object.assign(theorems, config);
                break;
              case 'float':
                Object.assign(floats, config);
                break;
              case 'equation':
                Object.assign(equations, config);
                break;
            }
          }
        }
      }
    });

    const result = { theorems, ...floats, ...equations };
    merge(ctx.frontmatter, result);
    // console.log(ctx.frontmatter);
  };
}

function normaliseKey(key: string) {
  switch (key) {
    case 'numberwithin':
      return 'numberWithin';
    case 'counterwithin':
      return 'counterWithin';
    default:
      return key;
  }
}

function extract(node: Macro) {
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
    [node.content]: numberWithin.content[0].content,
  };
}
