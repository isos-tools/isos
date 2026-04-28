import { PluggableList } from 'unified';

import { extractBibliography } from '../../plugins/bibliography/extract-bibliography';
import { trimVerbatim } from '../../plugins/code/trim-verbatim';
import { commentEnv } from '../../plugins/comment/extract-comment-envs';
import { extractTopMatter } from '../../plugins/cover/extract-top-matter';
import {
  fancyBoxedToSubSection,
  fancySectionToSection,
} from '../../plugins/fancy/fancy-section-to-section';
import { insertParbreaksAroundImage } from '../../plugins/images/input-to-md/block-elements';
import { warnOnHardcodedListLabels } from '../../plugins/lists/warn-hardcoded-list-labels';
import { equationLabelToId } from '../../plugins/maths/equation-label-to-id';
import { extractNotes } from '../../plugins/notes/input-to-md/latex-ast';
import { defWarn } from '../../plugins/preamble-warnings/def-warn';
import { extractTocContents } from '../../plugins/table-of-contents/extract-toc-contents';
import { tableCaptionToData } from '../../plugins/tables/table-caption-to-data';
import { theorems } from '../../plugins/theorems-proofs/input-to-md/latex-ast';
import { Context } from '../context';
import { convertEmToEmph } from './convert-em-to-emph';
import { convertHspace } from './convert-hspace';
import { documentClass } from './document-class';
import { expandEnvironments } from './expand-environments';
import { expandMacros } from './expand-macros';
import { expandMathOperatorPlugin } from './expand-math-ops';
import { removeAtLetter } from './remove-atletter';
import { removeNewDocumentCommand } from './remove-new-document-command';

export function createLatexastTransforms(ctx: Context): PluggableList {
  return [
    [documentClass, ctx],

    // remove things before expansion
    removeAtLetter,
    removeNewDocumentCommand,

    // expansion
    expandEnvironments,
    [expandMacros, ctx],
    expandMathOperatorPlugin,

    [extractNotes, ctx],
    [commentEnv, ctx],
    [theorems, ctx],
    [extractBibliography, ctx],
    [extractTopMatter, ctx],
    [extractTocContents, ctx],

    trimVerbatim,
    convertHspace,
    convertEmToEmph,
    [defWarn, ctx],
    equationLabelToId,
    insertParbreaksAroundImage,
    tableCaptionToData,
    fancySectionToSection,
    fancyBoxedToSubSection,
    warnOnHardcodedListLabels,
  ];
}
