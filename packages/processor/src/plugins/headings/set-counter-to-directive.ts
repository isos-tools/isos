import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import { toString } from 'hast-util-to-string';
import { RootContent, Text } from 'mdast';
import { LeafDirective } from 'mdast-util-directive';

import { Context } from '../../input-to-markdown/context';

export function createSetCounter(
  ctx: Context,
  _state: State,
  node: Element,
): RootContent[] {
  const section = toString(node.children[0]);
  const type = ctx.sectionToHeading[section];
  const value = toString(node.children[1]);
  const directive: LeafDirective = {
    type: 'leafDirective',
    name: 'set-counter',
    children: [],
    attributes: {
      type,
      value,
    },
  };
  const newLines: Text = {
    type: 'text',
    value: '\n\n',
  };
  return [directive, newLines];
}
