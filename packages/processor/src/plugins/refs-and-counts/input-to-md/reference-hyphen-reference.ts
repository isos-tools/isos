import { Root } from 'hast';
import { visit } from 'unist-util-visit';

export function referenceHyphenReference() {
  return (tree: Root) => {
    visit(tree, 'element', (node, idx, parent) => {
      if (node.tagName === 'span') {
        const className = node.properties.className;
        if (
          Array.isArray(className) &&
          String(className[1]).startsWith('macro-')
        ) {
          const name = String(className[1]).slice(6);
          if (['cref', 'zcref', 'autoref'].includes(name)) {
            if (idx !== undefined && parent?.type === 'element') {
              const prev = parent.children[idx - 1];
              if (prev?.type === 'text' && prev.value.endsWith('-')) {
                prev.value = prev.value + ' ';
              }

              const next = parent.children[idx + 1];
              if (next?.type === 'text' && next.value.startsWith('-')) {
                next.value = ' ' + next.value;
              }
            }
          }
        }
      }
    });
  };
}
