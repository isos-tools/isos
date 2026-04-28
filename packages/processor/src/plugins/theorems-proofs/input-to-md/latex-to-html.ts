import {
  Environment,
  Macro,
  Node,
  String,
} from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { expandUnicodeLigatures } from '@unified-latex/unified-latex-util-ligatures';
import kebabCase from 'lodash.kebabcase';

import { htmlLike } from '@isos/unified-latex-util-html-like';
import { printRaw } from '@isos/unified-latex-util-print-raw';

import { Context } from '../../../input-to-markdown/context';

type Handlers = Record<string, (node: Environment) => Macro | null>;

export function createTheoremHandlers(ctx: Context) {
  const { custom, ...theorems } = ctx.frontmatter.theorems;
  // console.log(theorems);
  return Object.entries(theorems).reduce(
    (acc: Handlers, [name, theorem]) => {
      if (theorem?.type === 'theorem') {
        acc[name] = createTheorem;
      }
      return acc;
    },
    {},
  );
}

export function createExSolSeparator() {
  return htmlLike({ tag: 'hr' });
}

function createTheorem(node: Environment): Macro {
  const name = extractName(node);
  const attributes: {
    className: string[];
    name?: string;
  } = {
    className: ['theorem'],
  };

  if (node.env && node.env !== 'theorem') {
    attributes.className.push(node.env);
  }

  if (name.length) {
    attributes.name = name;
  }

  return htmlLike({
    tag: 'div',
    attributes,
    content: node.content,
  });
}

function extractName(node: Environment) {
  const args = getArgsContent(node);
  const arg = args[args.length - 1] || [];
  const transformed = convertRefsToAt(arg);
  expandUnicodeLigatures(transformed);
  const name = printRaw(transformed).trim();
  // console.log(name, node.args);
  // console.dir(node.args, { depth: null });
  if (name !== '') {
    return name;
  }

  // amsthm environments: conjecture, exercise and solution are not set in:
  // https://github.com/siefkenj/unified-latex/blob/main/packages/unified-latex-ctan/package/mathtools/provides.ts#L209-L217
  // TODO: environments should all be defined by \newtheorem or as yaml theorems

  const first = node.content[0];
  if (first && first.type === 'macro' && first.content === 'html-tag:p') {
    const args = first.args || [];
    if (args.length > 0) {
      const startIdx = 0;
      const argContent = args[0].content;
      if (
        argContent[startIdx].type === 'string' &&
        argContent[startIdx].content === '['
      ) {
        const endIdx = argContent.findIndex(
          (o) => o.type === 'string' && o.content === ']',
        );
        if (endIdx !== -1) {
          const name = argContent.slice(startIdx + 1, endIdx);
          argContent.splice(startIdx, endIdx + 1);
          return printRaw(name);
        }
      }
    }
  }

  return '';
}

function convertRefsToAt(arg: Node[]) {
  return arg.map((elem) => {
    if (
      elem.type === 'macro' &&
      ['cref', 'zcref', 'autoref'].includes(elem.content)
    ) {
      const args = elem.args || [];
      const lastArg = args[args.length - 1];
      const str = printRaw(lastArg.content);
      const id = kebabCase(str);
      const string: String = {
        type: 'string',
        content: `@${id}`,
      };
      return string;
    } else {
      return elem;
    }
  });
}
