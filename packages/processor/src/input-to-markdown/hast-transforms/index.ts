import { PluggableList } from 'unified';

import { mintInlineToCode } from '../../plugins/code/mint-inline-to-code';
import { endashEmdashToDashes } from '../../plugins/endash-emdash';
import { figureToP } from '../../plugins/images/figure-to-p';
import { scaleRelToMissingMaths } from '../../plugins/missing-maths/scalerel-to-missing-maths';
import { tablePropertiesToTextDirective } from '../../plugins/tables/table-properties-to-directive';
import { Context } from '../context';
import { removeCenterEnv } from './remove-centre-env';

export function createHastTransforms(_ctx: Context): PluggableList {
  return [
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
