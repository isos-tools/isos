import { PluggableList } from 'unified';

import { mintInlineToCode } from '../../plugins/code/mint-inline-to-code';
import { endashEmdashToDashes } from '../../plugins/endash-emdash';
import { adjustHeadingDepth } from '../../plugins/headings/adjust-heading-depth';
import { figureToP } from '../../plugins/images/input-to-md/figure-to-p';
import { scaleRelToMissingMaths } from '../../plugins/missing-maths/scalerel-to-missing-maths';
import { tablePropertiesToTextDirective } from '../../plugins/tables/table-properties-to-directive';
import { addTheoremClass } from '../../plugins/theorems-proofs/input-to-md/html-ast';
import { Context } from '../context';
import { centerEnvToDiv } from './centre-env-to-div';
import { removePageStyle } from './remove-page-style';

export function createHastTransforms(ctx: Context): PluggableList {
  const transforms: PluggableList = [removePageStyle];

  // inline
  transforms.push(
    endashEmdashToDashes,
    mintInlineToCode,
    scaleRelToMissingMaths,
  );

  // block
  transforms.push(
    [adjustHeadingDepth, ctx],
    [addTheoremClass, ctx],
    figureToP,
    tablePropertiesToTextDirective,
    centerEnvToDiv,
    // () => {
    //   return (tree) => {
    //     console.dir(tree, { depth: null });
    //   };
    // },
  );

  return transforms;
}
