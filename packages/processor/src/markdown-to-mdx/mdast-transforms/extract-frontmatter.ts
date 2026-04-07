import merge from 'lodash.merge';
import { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import { parse } from 'yaml';

import { createHeadingDepths } from '../../plugins/headings/heading-depths';
import {
  RefObjectsYaml,
  createDefaultObjectsYaml,
} from '../../plugins/refs-and-counts/default-objects';
import { Context, Frontmatter } from '../context';

export function extractFrontmatter(ctx: Context) {
  return (tree: Root) => {
    const fmStrings: string[] = [];

    visit(tree, 'yaml', (node, idx, parent) => {
      fmStrings.push(node.value);
      parent?.children.splice(idx || 0, 1);
    });

    ctx.frontmatter.theorems = createDefaultObjectsYaml();

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
        const { custom = [], ...theorems } = fm.theorems;
        const customObj = custom.reduce(
          (acc: RefObjectsYaml, { name, ...theorem }) => {
            acc[name] = { ...theorem, type: 'theorem' };
            return acc;
          },
          {},
        );

        ctx.frontmatter.theorems = merge(
          ctx.frontmatter.theorems,
          theorems || {},
          customObj,
        );
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
    Object.entries(ctx.frontmatter.theorems).forEach(([name, theorem]) => {
      if (!Array.isArray(theorem)) {
        if (theorem.numberWithin) {
          const thm = ctx.frontmatter.theorems[name];
          if (depths[theorem.numberWithin]) {
            thm.numberWithin = depths[theorem.numberWithin];
          }
        }
      }
    });
  };
}
