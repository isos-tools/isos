import { Root } from 'hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../../input-to-markdown/context';

export function addTheoremClass(ctx: Context) {
  return (tree: Root) => {
    const theorems = ctx.frontmatter.theorems;

    const theoremNames = Object.entries(theorems)
      .filter(([_k, v]) => v.type === 'theorem')
      .map(([k, _v]) => k);

    visit(tree, 'element', (node) => {
      if (node.tagName === 'div') {
        const { className } = node.properties;
        if (
          Array.isArray(className) &&
          className.length === 2 &&
          className[0] === 'environment'
        ) {
          const theoremType = String(className[1]);
          if (theoremNames.includes(theoremType)) {
            node.properties.className = ['theorem', theoremType];
          }
        }
      }
    });
  };
}
