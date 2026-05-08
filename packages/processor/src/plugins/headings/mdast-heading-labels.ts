import kebabCase from 'lodash.kebabcase';
import { Root, RootContent, Text } from 'mdast';
import { TextDirective } from 'mdast-util-directive';
import { visit } from 'unist-util-visit';

import {
  hasAttributes,
  parseAttributes,
  serialiseAttributes,
} from '../../parse-attributes';

export function headingLabels() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, 'heading', (node, idx = 0, parent) => {
      const parentChildren = parent?.children || [];
      const label = getLabel(parentChildren, idx + 1);

      if (label === null) {
        return;
      }

      // extract id
      const text = label.children[0] as Text;
      const id = kebabCase(text.value);

      // append to heading text
      const lastChild = node.children[node.children.length - 1];
      if (lastChild && lastChild.type === 'text') {
        if (hasAttributes(lastChild.value)) {
          const { text, attributes } = parseAttributes(lastChild.value);
          attributes.id = id;
          lastChild.value = `${text} ${serialiseAttributes(attributes)}`;
        } else {
          lastChild.value += ` ${serialiseAttributes({ id })}`;
        }
      } else {
        node.children.push({
          type: 'text',
          value: ` ${serialiseAttributes({ id })}`,
        });
      }
    });
  };
}

function getLabel(
  children: RootContent[],
  idx: number,
): TextDirective | null {
  let label = null;

  if (children.length > 0) {
    const nIdx = children.slice(idx).findIndex((o) => o.type !== 'text');
    if (nIdx !== -1) {
      const first = children[idx + nIdx];

      if (first.type === 'textDirective' && first.name === 'label') {
        label = first;
        children.splice(idx + nIdx, 1);
      }

      if (first.type === 'paragraph') {
        const pIdx = first.children.findIndex((o) => o.type !== 'text');
        if (pIdx !== -1) {
          const pFirst = first.children[pIdx];
          if (pFirst.type === 'textDirective' && pFirst.name === 'label') {
            label = pFirst;
            first.children.splice(pIdx, 1);
          }
        }
      }
    }
  }

  return label;
}
