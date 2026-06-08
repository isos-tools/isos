import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { parse } from 'yaml';

import { createHeadingDepths } from '../../plugins/headings/heading-depths';
import {
  RefObjects,
  createDefaultObjects,
} from '../../plugins/refs-and-counts/default-objects';
import { Context, Frontmatter } from '../context';

export function extractFrontmatter(ctx: Context) {
  return (tree: Root) => {
    const fmStrings: string[] = [];

    visit(tree, 'yaml', (node, idx, parent) => {
      fmStrings.push(node.value);
      parent?.children.splice(idx || 0, 1);
    });

    ctx.frontmatter.theorems = createDefaultObjects();

    if (fmStrings.length) {
      const combined = fmStrings.join('\n\n');
      const fm = parse(combined) as Frontmatter;

      // console.log(combined);
      // console.log(fm);

      if (fm.title) {
        ctx.frontmatter.title = fm.title;
      }
      if (fm.titleImage) {
        ctx.frontmatter.titleImage = fm.titleImage;
      }
      if (fm.date) {
        ctx.frontmatter.date = fm.date;
      }
      if (fm.author) {
        const author = Array.isArray(fm.author) ? fm.author : [fm.author];
        ctx.frontmatter.author = author;
      }
      if (fm.tableOfContentsPrefix) {
        ctx.frontmatter.tableOfContentsPrefix = fm.tableOfContentsPrefix;
      }
      if (fm.abstract) {
        ctx.frontmatter.abstract = fm.abstract;
      }

      if (fm.documentClass) {
        ctx.frontmatter.documentClass = fm.documentClass;
      }

      if (fm.hasPart) {
        ctx.frontmatter.hasPart = fm.hasPart;
      }

      if (fm.theorems) {
        // console.log(fm.theorems);
        const theorems = Object.entries(fm.theorems).reduce(
          (acc: RefObjects, [name, theorem]) => {
            acc[name] = {
              ...theorem,
              type: 'theorem',
              name,
            };
            return acc;
          },
          {},
        );
        ctx.frontmatter.theorems = {
          ...ctx.frontmatter.theorems,
          ...theorems,
        };
      }

      if (fm.equation) {
        ctx.frontmatter.theorems.equation = {
          ...ctx.frontmatter.theorems.equation,
          ...fm.equation,
        };
      }

      if (fm.figure) {
        ctx.frontmatter.theorems.figure = {
          ...ctx.frontmatter.theorems.figure,
          ...fm.figure,
        };
      }

      if (fm.table) {
        ctx.frontmatter.theorems.table = {
          ...ctx.frontmatter.theorems.table,
          ...fm.table,
        };
      }

      if (fm['reference-location']) {
        ctx.frontmatter.referenceLocation = fm['reference-location'];
      }

      if (fm.references) {
        ctx.frontmatter.references = fm.references;
        const { refMap } = ctx.frontmatter;
        const references = Object.fromEntries(
          fm.references.map((o, i) => {
            const id = `bib-${o.id}`;
            const ref = { id, label: `Reference ${i + 1}` };
            return [id, ref];
          }),
        );
        ctx.frontmatter.refMap = { ...refMap, ...references };
      }

      if (fm.preambleWarnings) {
        ctx.frontmatter.preambleWarnings = fm.preambleWarnings;
      }
      // console.log(ctx.frontmatter);
    }

    // convert section to heading in theorem.numberWithin
    const { documentClass, hasPart } = ctx.frontmatter;
    const depths = createHeadingDepths(documentClass, hasPart);
    Object.values(ctx.frontmatter.theorems).forEach((theorem) => {
      if (theorem.numberWithin) {
        if (depths[theorem.numberWithin]) {
          theorem.numberWithin = depths[theorem.numberWithin];
        }
      }
      // }
    });
  };
}
