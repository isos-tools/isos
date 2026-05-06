import { Root } from '@unified-latex/unified-latex-types';
import { replaceNode } from '@unified-latex/unified-latex-util-replace';

const sizes = [
  'tiny',
  'scriptsize',
  'footnotesize',
  'small',
  'normalsize',
  'large',
  'Large',
  'LARGE',
  'huge',
  'Huge',
];

export function removeArticleTextSizes() {
  return (tree: Root) => {
    replaceNode(tree, (node, info) => {
      if (
        node.type === 'macro' &&
        sizes.includes(node.content) &&
        !info.context.hasMathModeAncestor
      ) {
        const args = node.args || [];
        const lastArg = args[args.length - 1];
        if (lastArg) {
          return lastArg.content;
        }
      }
    });
  };
}
