import { PluggableList } from 'unified';

import { headingLabels } from '../../plugins/headings/mdast-heading-labels';
import { encodeImagesFromContext } from '../../plugins/images/input-to-md/encode-images-from-context';
import { deleteToDoubleTilde } from '../../plugins/strikethrough/delete-to-double-tilde';
import { theoremLabelAsId } from '../../plugins/theorems-proofs/input-to-md/md-ast';
import { Context } from '../context';
import { Options } from '../options';
import { addFrontmatter } from './add-frontmatter';
import { lostLabelToWarn } from './lost-label-to-warn';

export function createMdastTransforms(
  ctx: Context,
  options: Partial<Options>,
): PluggableList {
  return [
    // [inputToContents, ctx],
    // () => (tree) => {
    //   console.dir(tree, { depth: 6 });
    // },

    deleteToDoubleTilde,
    headingLabels,
    [encodeImagesFromContext, ctx, options],
    [addFrontmatter, ctx],

    // last attempt to attach a label to a container
    [theoremLabelAsId, ctx],
    lostLabelToWarn,
  ];
}
