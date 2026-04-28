import { PluginOptions as LatexConvertOptions } from '@unified-latex/unified-latex-to-hast';
import { PluginOptions as LatexParseOptions } from '@unified-latex/unified-latex-util-parse';
import { Options as HtmlConvertOptions } from 'rehype-remark';
import { PluggableList } from 'unified';

import { unescapeCitation } from '../plugins/bibliography/formatted-citation';
import { mintedToPre } from '../plugins/code/minted-to-pre';
import { descriptionToDl } from '../plugins/definition-list';
import {
  altToCaptionAttribute,
  captionAttributeToAlt,
} from '../plugins/images/formatted-caption';
import { createImage } from '../plugins/images/input-to-md/create-image';
import { imageToPandocFigure } from '../plugins/images/input-to-md/image-to-pandoc-figure';
import { subfigureWidth } from '../plugins/images/input-to-md/subfigure-width';
import {
  mathsMetaToPandocAttributes,
  pandocAttributesToMathsMeta,
} from '../plugins/maths/formatted-maths';
import { noteContentBelowMark } from '../plugins/notes/input-to-md/md-ast';
import { enumerateToOl } from '../plugins/ordered-list/enumerate-to-ol';
import {
  codeToTableCaption,
  tableCaptionToCode,
} from '../plugins/tables/formatted-table-caption';
import {
  createExSolSeparator,
  createTheoremHandlers,
} from '../plugins/theorems-proofs/input-to-md/latex-to-html';
import { Context } from './context';
import { createHastTransforms } from './hast-transforms';
import { createLatexastTransforms } from './latexast-transforms';
import { createMdastTransforms } from './mdast-transforms';
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

export const latexAstFromStringOptions: LatexParseOptions = {
  macros: {
    // signatures are defined in section 3 of:
    // https://ctan.math.washington.edu/tex-archive/macros/latex/contrib/l3packages/xparse.pdf
    def: { signature: 'm m' },
    // sidenote: { signature: 'm' },
    // title: { signature: 'om' },
    // underline: { signature: 'm' },
    // exsheetnumber: { signature: 'm' },
    textsuperscript: { signature: 'm' },
    textsubscript: { signature: 'm' },
    sout: { signature: 'm' },
    mintinline: { signature: 'm m' },
    scalerel: { signature: 'm m' },
    tag: { signature: 'm' },
    zcref: { signature: 'o m' },

    newframedtheorem: { signature: 'sO{}O{}momo' },
    newexsol: { signature: 'sO{}mmmmO{}' },
    numberwithin: { signature: 'm m' },
    // tcblower: { breakAround: true },
    counterwithin: { signature: 'm m' },
    // huge: { signature: 'm' },
    // Huge: { signature: 'm' },
    // large: { signature: 'm' },
    // Large: { signature: 'm' },

    footnote: { signature: 'o o m' },
    sidenote: { signature: 'o o m' },
    marginnote: { signature: 'o o m' },
    framedsidenote: { signature: 'o o m' },
    setsidenotes: { signature: 'm', renderInfo: { pgfkeysArgs: true } },
    postnote: { signature: 'o m' },
    printpostnotes: { signature: '' },
    sepfootnote: { signature: 'm' },
    sepfootnotecontent: { signature: 'm m' },

    setcounter: { signature: 'm m' },

    author: { signature: 'o m' },
    affil: { signature: 'o m' },
    orcidlink: { signature: 'm' },

    thispagestyle: { signature: 'm' },
    addtocontents: { signature: 'm m' },

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

    includecomment: { signature: 'm' },
    excludecomment: { signature: 'm' },

    caption: { signature: 's o m' },
    captionsetup: { signature: 'o m' },

    graphicspath: { signature: 'm' },
    includegraphics: {
      signature: 's o o m',
      renderInfo: { breakAround: true, pgfkeysArgs: true },
    },
  },
  environments: {
    tabularx: { signature: 'm o m', renderInfo: { alignContent: true } },
    comment: { signature: 'm' },
    subfigure: { signature: 'm m' },
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
      unescapeCitation,
    ],
  };
}

function createLatexToHastHandlers(ctx: Context): LatexConvertOptions {
  return {
    environmentReplacements: {
      ...createTheoremHandlers(ctx),
      minted: mintedToPre,
      subfigure: subfigureWidth,
      description: descriptionToDl,
      enumerate: enumerateToOl,
    },
    macroReplacements: {
      includegraphics: createImage,
      tcblower: createExSolSeparator,
    },
  };
}

function createLatexMdAstTransforms(ctx: Context): PluggableList {
  return [
    formatBreak,
    [imageToPandocFigure, ctx],
    [noteContentBelowMark, ctx],
  ];
}
