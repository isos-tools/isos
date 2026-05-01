import { ElementContent } from 'hast';
import { Root } from 'mdast';
import { refractor } from 'refractor';
import matlab from 'refractor/matlab';
import { visit } from 'unist-util-visit';

refractor.register(matlab);

export function codeHighlight() {
  return (tree: Root) => {
    visit(tree, 'inlineCode', (node) => {
      const match = node.value.match(/^{(.+)}\s+'(.*)'\s*$/);
      if (match !== null) {
        const root = refractor.highlight(match[2], match[1]);
        node.data = {
          hProperties: {
            className: `language-${match[1]}`,
          },
          hChildren: root.children as ElementContent[],
        };
      }
    });

    visit(tree, 'code', (node) => {
      if (node.lang) {
        const root = refractor.highlight(node.value, node.lang);
        node.data = {
          hProperties: {
            className: `language-${node.lang}`,
          },
          hChildren: root.children as ElementContent[],
        };
      }
    });
  };
}
