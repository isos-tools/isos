import { Element, Text } from 'hast';
import { State } from 'hast-util-to-mdast';
import { toString } from 'hast-util-to-string';
import kebabCase from 'lodash.kebabcase';

export function createCitation(_state: State, node: Element): Text {
  const [_cite, _id] = node.children;
  const id = kebabCase(toString(_id));
  const cite = toString(_cite);
  return {
    type: 'text',
    value: id ? `[@${id} ${cite}]` : '',
  };
}
