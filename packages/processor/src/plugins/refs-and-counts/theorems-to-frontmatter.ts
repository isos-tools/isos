import { Context } from '../../input-to-markdown/context';
import {
  RefObject,
  RefObjectYaml,
  RefObjectsYaml,
  defaultObjects,
} from './default-objects';

export function theoremsToFrontmatter(ctx: Context) {
  const { theorems } = ctx.frontmatter;
  // console.log(theorems);
  return Object.entries(theorems).reduce(
    (acc: RefObjectsYaml, [name, theorem]) => {
      const obj = defaultObjects.find((o) => o.name === name);

      if (obj) {
        const result: RefObjectYaml = {};

        for (const [_key, value] of Object.entries(theorem)) {
          const key = _key as keyof RefObjectYaml;

          // defaults can be omitted
          if (value === obj[key]) {
            continue;
          }

          if (key === 'numberWithin') {
            // note: this conversion needs to be done at this stage
            // so the check above can pass even though we need to
            // convert the section to its heading.
            result[key] = ctx.sectionToHeading[value];
          } else {
            result[key] = value;
          }
        }

        if (Object.keys(result).length > 0) {
          acc[name] = result;
        }
      } else {
        // custom theorem
        const obj = { name, abbr: name, ...theorem } as RefObject;
        if (Array.isArray(acc.custom)) {
          acc.custom.push(obj);
        } else {
          acc.custom = [obj];
        }
      }

      return acc;
    },
    {},
  );
}
