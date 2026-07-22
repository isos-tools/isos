import { ProcessorOptions } from '@mdx-js/mdx';
// import { Root } from 'hast';
// import { createSvg } from '../utils/icons';
import { PluggableList } from 'unified';

import { articleWrapper } from '../../plugins/article/article-wrapper';
import { atCitationToLink } from '../../plugins/bibliography/at-citation-to-link';
import { renderBibliography } from '../../plugins/bibliography/render-bibliography';
// import { visit } from 'unist-util-visit';

import { defListHastHandlers } from '../../plugins/definition-list';
import { addFooter } from '../../plugins/footer/add-footer';
import { appendices } from '../../plugins/headings/hast-appendices';
import { addDefaultAltText } from '../../plugins/images/md-to-mdx/default-image-alt';
import { latexMathToMml } from '../../plugins/maths/md-to-mdx/latex-to-mml';
import { mmlToOutput } from '../../plugins/maths/md-to-mdx/mml-to-output';
import { missingMathsImageToSvg } from '../../plugins/missing-maths/missing-maths-img-to-svg';
import { displayNoteContents } from '../../plugins/notes/md-to-mdx/html-ast';
import { addPreambleWarnings } from '../../plugins/preamble-warnings/add-preamble-warnings';
import { atReferenceToLink } from '../../plugins/refs-and-counts/md-to-mdx/at-reference-to-link';
import { addCounts } from '../../plugins/refs-and-counts/md-to-mdx/hast-add-counts';
import { refToHrefMaths } from '../../plugins/refs-and-counts/md-to-mdx/ref-to-href-maths';
import {
  exSolSolutionTitle,
  insertQed,
} from '../../plugins/theorems-proofs/md-to-mdx/html-ast';
import { Context } from '../context';
import { Options } from '../options';
import { removeEmptyParagraphs } from './remove-empty-paragraphs';

export const processorOptions: ProcessorOptions = {
  outputFormat: 'function-body',
  elementAttributeNameCase: 'html',
  providerImportSource: '@mdx-js/preact',
  remarkRehypeOptions: {
    handlers: {
      ...defListHastHandlers,
    },
  },
};

export function createRehypePlugins(
  ctx: Context,
  options: Pick<Options, 'noWrapper' | 'noFooter' | 'noSections'>,
) {
  // console.log(options);
  const plugins = createRehypeFragmentPlugins(ctx, options);

  if (!options.noFooter) {
    plugins.push([addFooter, ctx]);
  }

  if (!options.noWrapper) {
    plugins.push([articleWrapper, ctx]);
  }
  return plugins;
}

function createRehypeFragmentPlugins(
  ctx: Context,
  options: Partial<Options> = {},
): PluggableList {
  return [
    [addPreambleWarnings, ctx],

    addDefaultAltText,
    missingMathsImageToSvg,

    [displayNoteContents, ctx],
    insertQed,
    [renderBibliography, ctx],
    // TODO:
    // [
    // autolinkHeadings,
    // {
    //   content: createSvg('link-icon') as any,
    //   properties: { className: 'link' },
    // },
    // ],
    removeEmptyParagraphs,
    [appendices, ctx, options.noSections],
    latexMathToMml,

    // should be last
    [addCounts, ctx],
    [mmlToOutput, ctx], // depends on addCounts
    [atCitationToLink, ctx], // depends on addCounts
    [atReferenceToLink, ctx], // depends on addCounts
    [refToHrefMaths, ctx], // depends on addCounts
    [exSolSolutionTitle, ctx], // depends on addCounts

    // () => (tree: Root) => {
    //   console.dir(tree, { depth: null });
    // },
  ];
}
