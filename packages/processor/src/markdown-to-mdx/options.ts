import { RunOptions } from '@mdx-js/mdx';
import { PluggableList } from 'unified';

import { altToCaptionAttribute } from '../plugins/images/formatted-caption';
import { pandocAttributesToMathsMeta } from '../plugins/maths/formatted-maths';
import { tableCaptionToDirective } from '../plugins/tables/formatted-table-caption';
import { Context } from './context';
import { createRehypePlugins } from './hast-transforms';
import { createMdastTransforms } from './mdast-transforms';
import { createRunOptions, createSidebarRunOptions } from './mdx-handlers';
import { MdxState } from './mdx-handlers/mdx-state';

export type Options = {
  noWrapper: boolean;
  noSections: boolean;
  noIcons: boolean;
  noFooter: boolean;
  markdownStringTransforms: Array<(markdown: string) => string>;
  mdAstTransforms: PluggableList;
  htmlAstTransforms: PluggableList;
  mdxArticleRunOptions: RunOptions;
  mdxTOCRunOptions: RunOptions;
};

// export const defaultOptions: Options = {
//   noWrapper: false,
//   noSections: false,
// };

export function createDefaultOptions(
  mdxState: MdxState,
  ctx: Context,
  opts?: Partial<Options>,
): Options {
  const noWrapper = opts?.noWrapper || false;
  const noSections = opts?.noSections || false;
  const noIcons = opts?.noIcons || false;
  const noFooter = opts?.noFooter || false;
  return {
    noWrapper,
    noSections,
    noIcons,
    noFooter,
    // markdownStringTransforms: [
    //   (str) => `${str}2`,
    //   (str) => `${str}.jpg`
    // ],
    markdownStringTransforms: [
      altToCaptionAttribute,
      pandocAttributesToMathsMeta,
      tableCaptionToDirective,
    ],
    mdAstTransforms: createMdastTransforms(ctx, { noSections }),
    htmlAstTransforms: createRehypePlugins(ctx, {
      noWrapper,
      noFooter,
      noSections,
    }),
    mdxArticleRunOptions: createRunOptions(mdxState, { noIcons }),
    mdxTOCRunOptions: createSidebarRunOptions(mdxState),
  };
}
