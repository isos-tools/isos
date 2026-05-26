import kebabCase from 'lodash.kebabcase';
import { Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';

import { Context } from '../../../input-to-markdown/context';

export function theoremLabelAsId(ctx: Context) {
  return (tree: Root) => {
    const { theorems } = ctx.frontmatter;
    // const counter = createTheoremCounter();

    visit(tree, 'containerDirective', (node) => {
      // console.dir(node, { depth: null });

      const klass = node.attributes?.class || '';
      const type = getTypeFromClass(klass, ctx);
      // console.log({ klass, type });

      if (type !== undefined) {
        const label = extractLabelFromContainer(node);
        const theorem = theorems[type];

        if (theorem) {
          const attributes: Record<string, string> = {};

          if (node.attributes?.name) {
            node.children.unshift({
              type: 'paragraph',
              data: {
                directiveLabel: true,
              },
              children: [
                {
                  type: 'text',
                  value: node.attributes.name,
                },
              ],
            });
          }

          if (theorem.unnumbered) {
            // attributes.class = 'unnumbered';
          } else if (label !== null && type !== 'proof') {
            attributes.id = kebabCase(label);
          }

          node.attributes = attributes;
        }
      }
    });
    // console.dir(tree, { depth: null });
  };
}

function getTypeFromClass(str: string, ctx: Context) {
  const { theorems } = ctx.frontmatter;
  const names = Object.keys(theorems);
  return str.split(' ').find((s) => names.includes(s));
}

function extractLabelFromContainer(
  node: ContainerDirective,
): string | null {
  let label: string | null = null;

  visit(node, 'textDirective', (node, idx, parent) => {
    if (node.name === 'label') {
      const text = node.children[0];
      if (
        text &&
        text.type === 'text' &&
        typeof text.value === 'string' &&
        text.value.trim() !== ''
      ) {
        label = text.value;

        if (parent && idx !== undefined) {
          // trim whitespace from neighbours
          const prevSibling = parent.children[idx - 1];
          if (prevSibling && prevSibling.type === 'text') {
            prevSibling.value = prevSibling.value.trimEnd();
          }
          const nextSibling = parent.children[idx + 1];
          if (nextSibling && nextSibling.type === 'text') {
            nextSibling.value = nextSibling.value.trimStart();
          }

          // remove label textDirective from tree
          parent.children.splice(idx, 1);
        }
      }
    }
  });

  return label;
}
