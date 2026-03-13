import kebabCase from 'lodash.kebabcase';
import { Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';

import { Context } from '../../input-to-markdown/context';
import { defaultTheorems } from './default-theorems';
import { createTheoremCounter } from './theorem-counter';

export function theoremLabelAsId(ctx: Context) {
  return (tree: Root) => {
    const { theorems } = ctx.frontmatter;
    const counter = createTheoremCounter();

    // console.dir(tree, { depth: null });
    visit(tree, 'containerDirective', (node) => {
      // console.dir(node, { depth: null });

      const klass = node.attributes?.class || '';
      const type = getTypeFromClass(klass, ctx);

      if (type !== undefined && type !== 'proof') {
        const label = extractLabelFromContainer(node);
        const theorem = theorems[type];

        if (theorem) {
          const typeKey = prepareTypeKey(theorem?.abbr || type);
          const attributes: Record<string, string> = {};

          if (node.attributes?.name) {
            attributes.name = node.attributes.name;
          }

          if (theorem.unnumbered) {
            attributes.class = [typeKey, 'unnumbered']
              .filter(Boolean)
              .join(' ');
          } else {
            const id =
              label !== null
                ? idFromLabel(label, typeKey, ctx)
                : idFromCount(counter.increment(type), typeKey);

            attributes.id = kebabCase(id);
          }

          node.attributes = attributes;
        }
      }
    });
  };
}

function prepareTypeKey(name: string) {
  return name.replace(/\*$/, '-star');
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

        if (parent) {
          // trim whitespace from neighbour
          const nextSibling = parent.children[(idx || 0) + 1];
          if (nextSibling && nextSibling.type === 'text') {
            nextSibling.value = nextSibling.value.trimStart();
          }

          // remove label textDirective from tree
          parent.children.splice(idx || 0, 1);
        }
      }
    }
  });

  return label;
}

function idFromLabel(label: string, typeKey: string = '', ctx: Context) {
  const { theorems } = ctx.frontmatter;
  const [key, value] = label.split(':');
  if (defaultTheorems.map((o) => o.abbr).includes(key)) {
    return `${key}-${value}`;
  } else if (theorems[key]) {
    return `${key}-${value}`;
  } else {
    return `${typeKey}-${label}`;
  }
}

function idFromCount(count: number, typeKey: string = '') {
  return `${typeKey}-${count}`;
}
