import { Element } from 'hast';
import { Text } from 'mdast';
import { InlineMath, Math } from 'mdast-util-math';

export function createInlineMaths(node: Element): InlineMath {
  const math = node.children[0] as Text;
  return {
    type: 'inlineMath',
    value: math?.value || '',
  };
}

export function createMaths(node: Element): Math {
  const math = node.children[0] as Text;
  const result: Math = {
    type: 'math',
    value: math?.value || '',
  };
  const meta = [];
  const id = String(node.properties.id || '');
  if (id) {
    meta.push(`#${id}`);
  }

  if (id) {
    result.meta = ` {${meta.join(' ')}}`;
  }
  return result;
}
