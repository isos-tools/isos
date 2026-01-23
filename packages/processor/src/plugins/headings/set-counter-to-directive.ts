import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import { toString } from 'hast-util-to-string';
import { LeafDirective } from 'mdast-util-directive';

import { Context } from '../../input-to-markdown/context';

export function createSetCounter(
  ctx: Context,
  _state: State,
  node: Element,
): LeafDirective {
  const section = toString(node.children[0]);
  const type = ctx.sectionToHeading[section];
  const value = toString(node.children[1]);
  return {
    type: 'leafDirective',
    name: 'set-counter',
    children: [],
    attributes: {
      type,
      value,
    },
  };
}
