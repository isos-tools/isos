import { ProcessorOptions } from '@mdx-js/mdx';
// import { Root } from 'hast';
// import { createSvg } from '../utils/icons';
import { PluggableList } from 'unified';

import { articleWrapper } from '../../plugins/article/article-wrapper';
// import { visit } from 'unist-util-visit';

import { defListHastHandlers } from '../../plugins/definition-list';
import { addFooter } from '../../plugins/footer/add-footer';
import { footNotesToSideNotes } from '../../plugins/footnotes/footnotes-to-sidenotes';
import { replaceFootnoteRefDefs } from '../../plugins/footnotes/replace-ref-def';
import { addDefaultAltText } from '../../plugins/images/default-image-alt';
import { addMathsRefsAndCount } from '../../plugins/maths/add-maths-refs-and-count';
import { mathTagToRefLabel } from '../../plugins/maths/math-tag-to-ref-label';
import { missingMathsImageToSvg } from '../../plugins/missing-maths/missing-maths-img-to-svg';
import { atReferenceToLink } from '../../plugins/refs-and-counts/at-reference-to-link';
import { addCounts } from '../../plugins/refs-and-counts/hast-add-counts';
import { exSolSolutionTitle } from '../../plugins/theorems-proofs/hast-exsol-solution-title';
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
  options: Pick<Options, 'noWrapper' | 'noFooter'>,
) {
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
  _options: Partial<Options> = {},
): PluggableList {
  return [
    addDefaultAltText,
    missingMathsImageToSvg,
    addMathsRefsAndCount,

    [replaceFootnoteRefDefs, ctx],
    [footNotesToSideNotes, ctx],
    // TODO:
    // [
    // autolinkHeadings,
    // {
    //   content: createSvg('link-icon') as any,
    //   properties: { className: 'link' },
    // },
    // ],
    removeEmptyParagraphs,

    // should be last
    [mathTagToRefLabel, ctx],
    [addCounts, ctx],
    [atReferenceToLink, ctx], // depends on addCounts
    [exSolSolutionTitle, ctx], // depends on addCounts

    // () => (tree: Root) => {
    //   // console.dir(tree, { depth: null });
    //   console.log(ctx.frontmatter.refMap);
    // },
  ];
}
