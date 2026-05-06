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
    // console.dir(tree, { depth: null });
    visit(tree, (node, info) => {
      if (
        node.type === 'environment' &&
        !info.context.hasMathModeAncestor &&
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
        // console.log('hey!');
        node.content = wrapPars(node.content, {
          macrosThatBreakPars,
          environmentsThatDontBreakPars,
        });

        if (node.env === 'document') {
          hasDocumentEnv = true;
        }
      }

      // list items
      if (node.type === 'macro' && node.content === 'item') {
        const parent = info.parents[0];
        if (
          parent &&
          parent.type === 'environment' &&
          ['enumerate', 'itemize', 'description'].includes(parent.env)
        ) {
          const args = node.args || [];
          const lastArg = args[args.length - 1];
          if (lastArg) {
            lastArg.content = wrapPars(lastArg.content, {
              macrosThatBreakPars,
              environmentsThatDontBreakPars,
            });
          }
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
