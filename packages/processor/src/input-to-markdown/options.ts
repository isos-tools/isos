import { PluginOptions as LatexConvertOptions } from '@unified-latex/unified-latex-to-hast';
import { PluginOptions as LatexParseOptions } from '@unified-latex/unified-latex-util-parse';
import { Options as HtmlConvertOptions } from 'rehype-remark';
import { PluggableList } from 'unified';

import { mintedToPre } from '../plugins/code/minted-to-pre';
import { descriptionToDl } from '../plugins/definition-list';
import { footnoteMarkToRef } from '../plugins/footnotes/footnote-mark-text-to-ref-def';
import { footnoteToRefDef } from '../plugins/footnotes/footnote-to-ref-def';
import { createImage } from '../plugins/images/create-image';
import {
  altToCaptionAttribute,
  captionAttributeToAlt,
} from '../plugins/images/formatted-caption';
import { imageToPandocFigure } from '../plugins/images/image-to-pandoc-figure';
import {
  mathsMetaToPandocAttributes,
  pandocAttributesToMathsMeta,
} from '../plugins/maths/formatted-maths';
import { enumerateToOl } from '../plugins/ordered-list/enumberate-to-ol';
import {
  codeToTableCaption,
  tableCaptionToCode,
} from '../plugins/tables/formatted-table-caption';
import { createTheoremHandlers } from '../plugins/theorems-proofs/latex-ast-theorem';
import { Context } from './context';
import { createHastTransforms } from './hast-transforms';
import { createLatexastTransforms } from './latexast-transforms';
import { createMdastTransforms } from './mdast-transforms';
import { addFrontmatter } from './mdast-transforms/add-frontmatter';
import { formatBreak } from './mdast-transforms/format-break';
import { createRehypeRemarkHandlers } from './rehyperemark-handlers';
import { nbspToSpace } from './string-transforms/nbsp-to-space';
import { removeExcessNewline } from './string-transforms/remove-excess-newline';

export type Options = {
  srcFilePath: string;
  type: 'latex' | 'markdown';
  frontmatter: {};
  noInlineImages: boolean;
  input: {
    latexStringTransforms: Array<(latex: string) => string>;
    markdownStringTransforms: Array<(markdown: string) => string>;
    mdAstTransforms: PluggableList;
  };
  latexToMdAst: {
    latexAstFromStringOptions: LatexParseOptions;
    latexAstTransforms: PluggableList;
    latexAstToHtmlAstOptions: () => LatexConvertOptions;
    htmlAstTransforms: PluggableList;
    htmlAstToMdAstOptions: () => HtmlConvertOptions;
    mdAstTransforms: PluggableList;
  };
  markdownStringTransforms: Array<(markdown: string) => string>;
};

export const latexAstFromStringOptions = {
  macros: {
    // signatures are defined in section 3 of:
    // https://ctan.math.washington.edu/tex-archive/macros/latex/contrib/l3packages/xparse.pdf
    // sidenote: { signature: 'm' },
    // title: { signature: 'om' },
    // underline: { signature: 'm' },
    // exsheetnumber: { signature: 'm' },
    textsuperscript: { signature: 'm' },
    textsubscript: { signature: 'm' },
    sout: { signature: 'm' },
    mintinline: { signature: 'm m' },
    scalerel: { signature: 'm m' },

    newframedtheorem: { signature: 'sO{}O{}momo' },
    newhideabletheorem: { signature: 'sO{}O{}momo' },
    counterwithin: { signature: 'm m' },

    footnote: { signature: 'o o m' },
    sidenote: { signature: 'o o m' },
    marginnote: { signature: 'o o m' },
    framedsidenote: { signature: 'o o m' },
    setsidenotes: { signature: 'm' },

    setcounter: { signature: 'm m' },

    author: { signature: 'o m' },
    affil: { signature: 'o m' },
    orcidlink: { signature: 'm' },

    notebox: { signature: 'm' },
    tipbox: { signature: 'm' },
    warningbox: { signature: 'm' },
    cautionbox: { signature: 'm' },
    importantbox: { signature: 'm' },

    fancysection: {
      signature: 'm',
      renderInfo: { breakAround: true },
    },
    fancyboxed: { signature: 'm' },
  },
  environments: {
    tabularx: { signature: 'm o m', renderInfo: { alignContent: true } },
  },
};

export function createDefaultOptions(
  ctx: Context,
  opts?: Partial<Options>,
): Options {
  const noInlineImages = opts?.noInlineImages || false;
  return {
    ...ctx,
    noInlineImages,
    input: {
      // latexStringTransforms: [
      //   (str) => `${str}2`,
      //   (str) => `${str}.jpg`
      // ],
      latexStringTransforms: [],
      markdownStringTransforms: [
        tableCaptionToCode,
        altToCaptionAttribute,
        pandocAttributesToMathsMeta,
      ],
      mdAstTransforms: createMdastTransforms(ctx, { noInlineImages }),
    },
    latexToMdAst: {
      latexAstFromStringOptions,
      latexAstTransforms: createLatexastTransforms(ctx),
      latexAstToHtmlAstOptions: () => createLatexToHastHandlers(ctx),
      htmlAstTransforms: createHastTransforms(ctx),
      htmlAstToMdAstOptions: () => ({
        handlers: createRehypeRemarkHandlers(ctx),
      }),
      mdAstTransforms: createLatexMdAstTransforms(ctx),
    },
    markdownStringTransforms: [
      codeToTableCaption,
      captionAttributeToAlt,
      mathsMetaToPandocAttributes,
      nbspToSpace,
      removeExcessNewline,
    ],
  };
}

function createLatexToHastHandlers(ctx: Context): LatexConvertOptions {
  return {
    environmentReplacements: {
      ...createTheoremHandlers(ctx),
      minted: mintedToPre,
      description: descriptionToDl,
      enumerate: enumerateToOl,
    },
    macroReplacements: {
      includegraphics: createImage,
    },
  };
}

function createLatexMdAstTransforms(ctx: Context): PluggableList {
  return [
    [addFrontmatter, ctx],
    formatBreak,
    [imageToPandocFigure, ctx],
    footnoteMarkToRef,
    footnoteToRefDef,
  ];
}
