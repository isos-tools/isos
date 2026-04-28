import * as Ast from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';
import { Plugin } from 'unified';

import { wrapPars } from './wrap-pars';

type PluginOptions = {
  macrosThatBreakPars?: string[];
  environmentsThatDontBreakPars?: string[];
};

/**
 * Unified plugin to wrap paragraphs in `\html-tag:p{...}` macros.
 * Because `-` and `:` cannot occur in regular macros, there is no risk of
 * a conflict.
 */
export const unifiedLatexWrapPars: Plugin<
  PluginOptions[],
  Ast.Root,
  Ast.Root
> = function unifiedLatexWrapPars(options) {
  const { macrosThatBreakPars, environmentsThatDontBreakPars } =
    options || {};
  return (tree) => {
    let hasDocumentEnv = false;
    visit(tree, (node) => {
      if (
        node.type === 'environment' &&
        ![
          'enumerate',
          'itemize',
          'description',
          'table',
          'tabular',
          'tabularx',
          'verbatim',
          'minted',
        ].includes(node.env)
      ) {
        node.content = wrapPars(node.content, {
          macrosThatBreakPars,
          environmentsThatDontBreakPars,
        });

        if (node.env === 'document') {
          hasDocumentEnv = true;
        }
      }
    });

    if (!hasDocumentEnv) {
      tree.content = wrapPars(tree.content, {
        macrosThatBreakPars,
        environmentsThatDontBreakPars,
      });
    }
  };
};
