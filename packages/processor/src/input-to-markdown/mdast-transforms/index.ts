import { PluggableList } from 'unified';

import { headingLabels } from '../../plugins/headings/mdast-heading-labels';
import { encodeImagesFromContext } from '../../plugins/images/encode-images-from-context';
import { deleteToDoubleTilde } from '../../plugins/strikethrough/delete-to-double-tilde';
import { theoremLabelAsId } from '../../plugins/theorems-proofs/theorem-label-as-id';
import { Context } from '../context';
import { Options } from '../options';
import { addFrontmatter } from './add-frontmatter';

export function createMdastTransforms(
  ctx: Context,
  options: Partial<Options>,
): PluggableList {
  return [
    // [inputToContents, ctx],

    deleteToDoubleTilde,
    headingLabels,
    [encodeImagesFromContext, ctx, options],
    [theoremLabelAsId, ctx],
    // () => (tree) => {
    //   console.dir(tree, { depth: null });
    // },
    [addFrontmatter, ctx],
  ];
}
