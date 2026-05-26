import { Root } from 'mdast';
import { stringify } from 'yaml';

import { theoremsToFrontmatter } from '../../plugins/refs-and-counts/theorems-to-frontmatter';
import { Context } from '../context';

export function addFrontmatter(ctx: Context) {
  return (tree: Root) => {
    const {
      documentClass,
      date,
      title,
      titleImage,
      author,
      abstract,
      tableOfContentsPrefix,
      preambleWarnings,
      equation,
      figure,
      table,
    } = ctx.frontmatter;

    // console.log(ctx.frontmatter);
    const toExport: Record<string, any> = {};

    if (ctx.hasMakeTitle) {
      if (title) {
        toExport.title = title;
      }

      if (titleImage) {
        toExport.titleImage = titleImage;
      }

      if (date) {
        toExport.date = date;
      }

      if (author.length > 0) {
        const authors = author.filter((o) => o.name !== '');
        if (authors.length > 1) {
          toExport.author = authors;
        } else if (authors.length > 0) {
          toExport.author = authors[0];
        }
      }
    }

    if (abstract) {
      toExport.abstract = abstract;
    }

    if (documentClass) {
      toExport.documentClass = documentClass;
    }

    if (tableOfContentsPrefix) {
      toExport.tableOfContentsPrefix = tableOfContentsPrefix;
    }

    if (ctx.frontmatter['reference-location'] !== 'below') {
      toExport['reference-location'] =
        ctx.frontmatter['reference-location'];
    }

    if (ctx.frontmatter.references.length) {
      toExport.references = ctx.frontmatter.references;
    }

    if (preambleWarnings.length) {
      toExport.preambleWarnings = preambleWarnings;
    }

    if (equation) {
      toExport.equation = equation;
    }

    if (figure) {
      toExport.figure = figure;
    }

    if (table) {
      toExport.table = table;
    }

    const theoremsYaml = theoremsToFrontmatter(ctx);
    if (Object.keys(theoremsYaml).length > 0) {
      toExport.theorems = theoremsYaml;
    }

    if (Object.keys(toExport).length > 0) {
      tree.children.unshift({
        type: 'yaml',
        value: stringify(toExport).trim(),
      });
    }

    // console.log(toExport);
  };
}
