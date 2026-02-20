import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import {
  BlockContent,
  Paragraph,
  PhrasingContent,
  ThematicBreak,
} from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';

import { Context } from '../../input-to-markdown/context';

export function createTheorem(
  state: State,
  div: Element,
  type: string,
  ctx: Context,
): ContainerDirective {
  const attributes: Record<string, string> = {
    class: type,
  };

  if (typeof div.properties.name === 'string') {
    attributes.name = div.properties.name;
  }

  // console.log(state.all(div));

  const children = state
    .all(div)
    .reduce(
      (acc: (Paragraph | ContainerDirective | ThematicBreak)[], child) => {
        if (['containerDirective', 'paragraph'].includes(child.type)) {
          acc.push(child as Paragraph | ContainerDirective);
        } else if (child.type === 'break') {
          acc.push({
            type: 'paragraph',
            children: [],
          });
        } else if (child.type === 'thematicBreak') {
          acc.push(child, {
            type: 'paragraph',
            children: [],
          });
        } else {
          const last = acc[acc.length - 1];

          if (last?.type !== 'paragraph') {
            acc.push({
              type: 'paragraph',
              children: [child as PhrasingContent],
            });
          } else {
            last.children.push(child as PhrasingContent);
          }
        }

        return acc;
      },
      [],
    );

  // console.log(children);
  const theorem = ctx.frontmatter.theorems[type];

  if (theorem?.hideable) {
    const idx = children.findIndex((o) => o.type === 'thematicBreak');

    if (idx !== -1) {
      const upper = children.slice(0, idx);
      const lower = children.slice(idx + 1);

      if (theorem?.hideable === 'hide') {
        return {
          type: 'containerDirective',
          name: ' ', // Pandoc divs
          attributes,
          children: upper as BlockContent[],
        };
      } else {
        const clickToShow = {
          type: 'containerDirective',
          name: 'solution',
          // attributes: {
          //   title: theorem.lowerTitle,
          // },
          children: lower,
        };

        return {
          type: 'containerDirective',
          name: ' ', // Pandoc divs
          attributes,
          children: [
            ...upper,
            children[idx],
            clickToShow,
          ] as BlockContent[],
        };
      }
    }

    // console.log(children);
  }

  return {
    type: 'containerDirective',
    name: ' ', // Pandoc divs
    attributes,
    children,
  };
}
