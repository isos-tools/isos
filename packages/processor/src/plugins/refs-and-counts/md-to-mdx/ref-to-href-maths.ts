import { Root } from 'hast';
import kebabCase from 'lodash.kebabcase';
import { visit } from 'unist-util-visit';

import { Context } from '../../../markdown-to-mdx/context';
import { Reference } from '../../bibliography/input-to-md/extract-bibliography';
import { createWarn } from '../../warn/hast-warn';

export function refToHrefMaths(ctx: Context) {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName === 'code' &&
        isMathsCode(node.properties.className)
      ) {
        const firstChild = node.children[0];
        if (firstChild?.type === 'text') {
          // if the maths code contains a \ref macro, replace with warning
          if (
            refMacroPattern.test(firstChild.value) &&
            typeof index === 'number' &&
            parent?.type === 'element' &&
            parent.tagName === 'pre'
          ) {
            Object.assign(parent, {
              tagName: 'p',
              properties: {
                className: ['maths'],
              },
              children: [createWarn('macro', 'ref')],
            });
            return;
          }

          firstChild.value = replaceCrefMacros(
            firstChild.value,
            ctx.frontmatter.refMap,
          );
        }
      }
    });
  };
}

function isMathsCode(className: unknown): boolean {
  return Array.isArray(className) && className.includes('language-math');
}

// `\ref{label}`
const refMacroPattern = /\\ref\{([^}]+)\}/;
// `\zcref[optional]{label}`
const zcrefMacroPattern = /\\zcref(?:\[[^\]]*\])?\{([^}]+)\}/g;
// `\cref{label}`
const crefMacroPattern = /\\cref\{([^}]+)\}/g;

function replaceCrefMacros(
  text: string,
  refMap: Record<string, Reference>,
) {
  for (const match of [...text.matchAll(zcrefMacroPattern)].reverse()) {
    text = replaceCrefMacroMatch(text, match, refMap);
  }
  for (const match of [...text.matchAll(crefMacroPattern)].reverse()) {
    text = replaceCrefMacroMatch(text, match, refMap);
  }
  return text;
}

function replaceCrefMacroMatch(
  text: string,
  match: RegExpMatchArray,
  refMap: Record<string, Reference>,
) {
  const ref = kebabCase(match[1]);
  const reference = refMap[ref];
  if (!reference || match.index === undefined) {
    return text;
  }
  const startIdx = match.index;
  const endIdx = startIdx + match[0].length;
  const href = `\\href{#${reference.id}}{${reference.label}}`;
  return text.slice(0, startIdx) + href + text.slice(endIdx);
}
