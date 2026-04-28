import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import { PhrasingContent } from 'mdast';
import { TextDirective } from 'mdast-util-directive';

export function createSideNote(
  state: State,
  node: Element,
): TextDirective {
  // console.dir(node, { depth: null });
  return {
    type: 'textDirective',
    name: 'sidenote',
    children: state.all(node) as PhrasingContent[],
  };
}
