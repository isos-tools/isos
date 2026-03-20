import { PluggableList } from 'unified';

import { trimVerbatim } from '../../plugins/code/trim-verbatim';
import { commentEnv } from '../../plugins/comment/extract-comment-envs';
import { extractTopMatter } from '../../plugins/cover/extract-top-matter';
import {
  fancyBoxedToSubSection,
  fancySectionToSection,
} from '../../plugins/fancy/fancy-section-to-section';
import { ignoreOptionalSidenoteArgs } from '../../plugins/footnotes/ignore-optional-args';
import { setSideNotes } from '../../plugins/footnotes/latexast-set-sidenotes';
import { warnOnHardcodedListLabels } from '../../plugins/lists/warn-hardcoded-list-labels';
// import { figureToImage } from '../../plugins/images/figure-to-image';
// import { inlineFilesFromContext } from '../../plugins/includes/inline-files-from-context';
import { equationLabelToId } from '../../plugins/maths/equation-label-to-id';
// import { extractFancyTitle } from './extract-fancytitle';
import { extractTheoremDefinitions } from '../../plugins/refs-and-counts/extract-theorem-definitions';
import { extractTocContents } from '../../plugins/table-of-contents/extract-toc-contents';
import { tableCaptionToData } from '../../plugins/tables/table-caption-to-data';
import { Context } from '../context';
import { insertParbreaksAroundBlockElements } from './block-elements';
import { convertEmToEmph } from './convert-em-to-emph';
import { convertHspace } from './convert-hspace';
import { documentClass } from './document-class';
import { expandEnvironments } from './expand-environments';
import { expandDocumentMacrosPlugin } from './expand-macros';
import { expandMathOperatorPlugin } from './expand-math-ops';
import { removeNewDocumentCommand } from './remove-new-document-command';

// import { replaceTildeWithSpace } from './replace-tilde-with-space';

export function createLatexastTransforms(ctx: Context): PluggableList {
  return [
    [documentClass, ctx],
    expandEnvironments,
    removeNewDocumentCommand,
    // [inlineFilesFromContext, ctx],
    [setSideNotes, ctx],
    [commentEnv, ctx],
    [extractTheoremDefinitions, ctx],
    [extractTopMatter, ctx],
    [extractTocContents, ctx],

    trimVerbatim,
    convertHspace,
    convertEmToEmph,
    // replaceTildeWithSpace,
    // figureToImage,
    expandDocumentMacrosPlugin,
    expandMathOperatorPlugin,
    equationLabelToId,
    ignoreOptionalSidenoteArgs,
    // [extractFancyTitle, ctx],
    insertParbreaksAroundBlockElements,
    tableCaptionToData,
    fancySectionToSection,
    fancyBoxedToSubSection,
    warnOnHardcodedListLabels,
  ];
}
