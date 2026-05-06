import { PluggableList } from 'unified';

import { createCallouts } from '../../plugins/callout/create-callouts';
import { codeHighlight } from '../../plugins/code/code-highlight';
import { cover } from '../../plugins/cover/cover';
import { divSyntax } from '../../plugins/div-syntax/mdx-divs';
import { dashesToEndashEmdash } from '../../plugins/endash-emdash';
import { framed } from '../../plugins/framed/md-to-mdx/md-ast';
import { appendices } from '../../plugins/headings/mdast-appendices';
import { headings } from '../../plugins/headings/mdx-headings';
import { setHeadingCounterToDiv } from '../../plugins/headings/set-counter-directive-to-div';
import { imageAttributes } from '../../plugins/images/md-to-mdx/image-attributes';
import { pandocImplicitFigures } from '../../plugins/images/md-to-mdx/pandoc-implicit-figures';
import { mathMetaToId } from '../../plugins/maths/math-meta-to-id';
import { notes } from '../../plugins/notes/md-to-mdx/md-ast';
import { headingSections } from '../../plugins/sections/heading-sections';
import { includeTocContents } from '../../plugins/table-of-contents/include-toc-contents';
import { tableCaptionToFigure } from '../../plugins/tables/table-caption-to-figure';
import {
  exSolSolutionDirective,
  theorems,
} from '../../plugins/theorems-proofs/md-to-mdx/md-ast';
import { warn } from '../../plugins/warn/warn';
import { Context } from '../context';
import { Options } from '../options';
import { escapeCharsForMdx } from './escape-mdx-chars';
import { extractFrontmatter } from './extract-frontmatter';
import { htmlToWarn } from './html-to-warn';
import { removeComments } from './remove-comments';

type NewOptions = {
  fragment?: boolean;
};

export function createMdastTransforms(
  ctx: Context,
  options?: Pick<Options, 'noSections' | 'includeTocContents'>,
  newOptions?: NewOptions,
): PluggableList {
  const plugins: PluggableList = [
    dashesToEndashEmdash,
    codeHighlight,
    imageAttributes,
    pandocImplicitFigures,
    mathMetaToId,
    tableCaptionToFigure,
    warn,
    removeComments,
    createCallouts,
    htmlToWarn,
    framed,
    setHeadingCounterToDiv,
    exSolSolutionDirective,
    appendices,
    [divSyntax, ctx],

    notes,
    [headings, ctx], // headingSections depends on this
  ];

  // TODO: remove this (a lot of tests will need updating)
  if (options && options.noSections === false) {
    plugins.push(headingSections); // theorems depends on this
  }

  if (!(newOptions && newOptions.fragment === true)) {
    plugins.push(
      [extractFrontmatter, ctx], // theorems depends on this
    );
  }

  // console.log(ctx.frontmatter);

  plugins.push([theorems, ctx], [cover, ctx]);

  if (options && options.includeTocContents === true) {
    plugins.push([includeTocContents, ctx]);
  }

  // should be last
  plugins.push(escapeCharsForMdx);

  return plugins;
}
