import { Root } from 'hast';
import { visit } from 'unist-util-visit';

export function removePageStyle() {
  const macroNames = [
    'macro-pagestyle',
    'macro-thispagestyle',
    'macro-captionsetup',
    'macro-setlength',
  ];
  return (tree: Root) => {
    visit(tree, 'element', (node, idx = 0, parent) => {
      if (node.tagName === 'span') {
        const className = node.properties.className;
        if (Array.isArray(className)) {
          const macroName = className.find((s) =>
            String(s).startsWith('macro-'),
          );
          if (
            macroName !== undefined &&
            macroNames.includes(String(macroName))
          ) {
            parent?.children.splice(idx, 1);
          }
        }
      }
    });
  };
}
