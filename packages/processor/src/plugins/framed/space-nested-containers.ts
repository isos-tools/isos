import { Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';

export function spaceNestedContainers() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'framed') {
        visit(
          node,
          'containerDirective',
          (_node, idx = 0, parent) => {
            if (parent) {
              const nextSibling = parent.children[idx + 1];
              if (nextSibling) {
                const newLine: Text = {
                  type: 'text',
                  value: '\n',
                };
                // @ts-expect-error
                parent.children.splice(idx + 1, 0, newLine);
              }
            }
          },
          true,
        );
      }
    });
  };
}
