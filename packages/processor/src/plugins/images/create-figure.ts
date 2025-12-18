import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import kebabCase from 'lodash.kebabcase';
import { BlockContent } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';

export function createFigure(
  state: State,
  figure: Element,
): ContainerDirective {
  // console.log('rehypeRemark: createFigure');
  const attributes: Record<string, string> = {};
  const id = kebabCase(String(figure.properties.id || ''));
  if (id) {
    attributes.id = id;
  } else {
    attributes.class = 'fig';
  }

  const children = state.all(figure) as BlockContent[];

  // console.dir(children, { depth: null });

  return {
    type: 'containerDirective',
    name: ' ', // Pandoc divs
    attributes,
    children,
  };
}
