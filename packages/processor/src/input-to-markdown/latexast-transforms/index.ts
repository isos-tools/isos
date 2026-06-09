import { PluggableList } from 'unified';

import { extractBibliography } from '../../plugins/bibliography/extract-bibliography';
import { trimVerbatim } from '../../plugins/code/trim-verbatim';
import { commentEnv } from '../../plugins/comment/extract-comment-envs';
import { extractTopMatter } from '../../plugins/cover/extract-top-matter';
import {
  fancyBoxedToSubSection,
  fancySectionToSection,
} from '../../plugins/fancy/fancy-section-to-section';
import { extractHeadingDepths } from '../../plugins/headings/extract-heading-depths';
import { insertParbreaksAroundImage } from '../../plugins/images/input-to-md/space-around-images';
import { warnOnHardcodedListLabels } from '../../plugins/lists/warn-hardcoded-list-labels';
import { equationLabelToId } from '../../plugins/maths/equation-label-to-id';
import { extractNotes } from '../../plugins/notes/input-to-md/latex-ast';
import { defWarn } from '../../plugins/preamble-warnings/def-warn';
import { extractNumberWithin } from '../../plugins/refs-and-counts/input-to-md/number-within';
import { extractTocContents } from '../../plugins/table-of-contents/extract-toc-contents';
import { tableCaptionToData } from '../../plugins/tables/table-caption-to-data';
import { extractTheoremDefinitions } from '../../plugins/theorems-proofs/input-to-md/latex-ast';
import { Context } from '../context';
import { convertEmToEmph } from './convert-em-to-emph';
import { convertHspace } from './convert-hspace';
import { documentClass } from './document-class';
import { expandEnvironments } from './expand-environments';
import { expandMacros } from './expand-macros';
import { expandMathOperatorPlugin } from './expand-math-ops';
import { removeAtLetter } from './remove-atletter';
import { removeNewDocumentCommand } from './remove-new-document-command';
import { removeArticleTextSizes } from './remove-text-sizes';

export function createLatexastTransforms(ctx: Context): PluggableList {
  const transforms: PluggableList = [[documentClass, ctx]];

  transforms.push(
    // remove things before expansion
    removeAtLetter,
    removeNewDocumentCommand,
    commentEnv,
    removeArticleTextSizes,

    // expansion
    expandEnvironments,
    [expandMacros, ctx],
    expandMathOperatorPlugin,
  );

  // inline
  transforms.push(
    trimVerbatim,
    convertHspace,
    convertEmToEmph,
    equationLabelToId,
    insertParbreaksAroundImage,
    tableCaptionToData,
  );

  // block
  transforms.push(fancySectionToSection, fancyBoxedToSubSection);

  // TODO custom

  // extract data
  transforms.push(
    [extractHeadingDepths, ctx],
    [extractNotes, ctx],
    [extractNumberWithin, ctx],
    [extractTheoremDefinitions, ctx],
    [extractBibliography, ctx],
    [extractTopMatter, ctx],
    [extractTocContents, ctx],
  );

  // warnings
  transforms.push([defWarn, ctx], warnOnHardcodedListLabels);

  return transforms;

  // return [
  //   [documentClass, ctx],

  //   // remove things before expansion
  //   removeAtLetter,
  //   removeNewDocumentCommand,
  //   commentEnv,

  //   // expansion
  //   expandEnvironments,
  //   [expandMacros, ctx],
  //   expandMathOperatorPlugin,

  //   // not for fragment parsing
  //   // block
  //   [extractNotes, ctx],
  //   [theorems, ctx],
  //   [extractBibliography, ctx],
  //   [extractTopMatter, ctx],
  //   [extractTocContents, ctx],
  //   fancySectionToSection,
  //   fancyBoxedToSubSection,

  //   // inline
  //   trimVerbatim,
  //   convertHspace,
  //   convertEmToEmph,
  //   equationLabelToId,
  //   insertParbreaksAroundImage,
  //   tableCaptionToData,

  //   // warnings last
  //   [defWarn, ctx],
  //   warnOnHardcodedListLabels,
  // ];
}
