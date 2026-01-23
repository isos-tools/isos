import { PluggableList } from 'unified';

import { mintInlineToCode } from '../../plugins/code/mint-inline-to-code';
import { endashEmdashToDashes } from '../../plugins/endash-emdash';
import { adjustHeadingDepth } from '../../plugins/headings/adjust-heading-depth';
import { figureToP } from '../../plugins/images/figure-to-p';
import { scaleRelToMissingMaths } from '../../plugins/missing-maths/scalerel-to-missing-maths';
import { tablePropertiesToTextDirective } from '../../plugins/tables/table-properties-to-directive';
import { Context } from '../context';
import { removeCenterEnv } from './remove-centre-env';
import { removePageStyle } from './remove-page-style';

export function createHastTransforms(ctx: Context): PluggableList {
  return [
    [adjustHeadingDepth, ctx],
    removePageStyle,
    endashEmdashToDashes,
    mintInlineToCode,
    figureToP,
    tablePropertiesToTextDirective,
    removeCenterEnv,
    scaleRelToMissingMaths,
    // () => {
    //   return (tree) => {
    //     console.dir(tree, { depth: null });
    //   };
    // },
  ];
}
