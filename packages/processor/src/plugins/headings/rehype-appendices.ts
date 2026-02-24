import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import { BlockContent, PhrasingContent } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';

export function createAppendices(
  state: State,
  div: Element,
): ContainerDirective {
  const children: BlockContent[] = [
    {
      type: 'paragraph',
      children: state.all(div) as PhrasingContent[],
    },
  ];
  return {
    type: 'containerDirective',
    name: 'appendices',
    children,
  };
}
