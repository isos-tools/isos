import { Context } from '../../input-to-markdown/context';
import { RefObject } from '../refs-and-counts/default-objects';

export function theoremsToFrontmatter(ctx: Context) {
  const { theorems } = ctx.frontmatter;

  return Object.values(theorems)
    .filter((o) => o.type === 'theorem')
    .map(({ type, ...theorem }) => {
      if (theorem.unnumbered === false) {
        delete theorem.unnumbered;
      }
      if (theorem.style === 'plain') {
        delete theorem.style;
      }
      if (theorem.numberWithin) {
        theorem.numberWithin = ctx.sectionToHeading[theorem.numberWithin];
      }
      return theorem;
    })
    .reduce(
      (
        acc: Record<string, Omit<RefObject, 'name' | 'type'>>,
        { name, ...theorem },
      ) => {
        if (name !== 'proof') {
          acc[prepareName(name)] = theorem;
        }
        return acc;
      },
      {},
    );
}

function prepareName(name: string) {
  return name.replace(/\*$/, '-star');
}
