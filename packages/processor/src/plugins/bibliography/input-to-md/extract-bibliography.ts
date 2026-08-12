import { Root } from '@unified-latex/unified-latex-types';
// import { expandUnicodeLigatures } from '@unified-latex/unified-latex-util-ligatures';
import { toString } from '@unified-latex/unified-latex-util-to-string';
import { visit } from '@unified-latex/unified-latex-util-visit';
import kebabCase from 'lodash.kebabcase';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { inputToMarkdown } from '../../../input-to-markdown';
import {
  Context,
  createTestContext,
} from '../../../input-to-markdown/context';
import { createDefaultOptions } from '../../../input-to-markdown/options';

export type Reference = {
  id: string;
  label: string;
};

export function extractBibliography(ctx: Context) {
  return async (tree: Root) => {
    const references: Reference[] = [];

    visit(tree, (node, info) => {
      if (node.type === 'environment' && node.env === 'thebibliography') {
        for (const item of node.content) {
          if (item.type === 'macro' && item.content === 'bibitem') {
            const args = item.args || [];

            let id = '';
            const thirdArg = args[3];
            if (thirdArg) {
              id = kebabCase(toString(thirdArg.content).trim());
            }

            if (id) {
              let label = '';
              const lastArg = args[args.length - 1];
              if (lastArg) {
                // expandUnicodeLigatures(lastArg);
                // console.log(lastArg.content);
                label = printRaw(lastArg).trim();
              }

              if (label) {
                references.push({ id, label });
              }
            }
          }
        }

        // remove thebibliography
        const parent = info.parents[0];
        if (parent.type === 'environment') {
          parent.content.splice(info.index || 0, 1);
        }
      }
    });

    // console.log(references);

    for (const o of references) {
      o.label = await convertToMarkdown(o.label);
    }

    ctx.frontmatter.references = references;

    // console.log(ctx.frontmatter.references);
  };
}

async function convertToMarkdown(str: string) {
  const ctx = createTestContext('latex', str);
  const options = createDefaultOptions(ctx);
  // console.log(ctx.content);
  const markdown = await inputToMarkdown(ctx.content, options);
  // console.log(markdown);
  return markdown;
}
