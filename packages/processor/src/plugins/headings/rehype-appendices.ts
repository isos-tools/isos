import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import { BlockContent } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';

export function createAppendices(
  state: State,
  div: Element,
): ContainerDirective {
  return {
    type: 'containerDirective',
    name: 'appendices',
    children: state.all(div) as BlockContent[],
  };
}
