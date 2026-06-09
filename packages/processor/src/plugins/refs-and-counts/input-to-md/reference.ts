import { Element, Text } from 'hast';
import { State } from 'hast-util-to-mdast';
import { toString } from 'hast-util-to-string';
import kebabCase from 'lodash.kebabcase';

export function createReference(_state: State, node: Element): Text {
  const id = kebabCase(toString(node));
  // console.log('id:', id);
  return {
    type: 'text',
    value: id ? `@${id}` : '',
  };
}

// function findRefLabel(node: Element) {
//   const parents = toString(node.children || []) as Parent[];
//   const parent = parents.find((child) => {
//     const children = child.children || [];
//     return children.length > 0;
//   });

//   if (parent === undefined) {
//     return '';
//   }

//   const text = (parent.children[0] || {}) as Text;
//   return kebabCase(text.value || '');
// }
