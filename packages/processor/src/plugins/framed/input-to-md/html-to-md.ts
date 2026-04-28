import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import { BlockContent } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';

export function createFramed(
  state: State,
  div: Element,
): ContainerDirective {
  // const children: BlockContent[] = [
  //   {
  //     type: 'paragraph',
  //     children: state.all(div) as PhrasingContent[],
  //   },
  // ];
  return {
    type: 'containerDirective',
    name: 'framed',
    children: state.all(div) as BlockContent[],
  };
}
