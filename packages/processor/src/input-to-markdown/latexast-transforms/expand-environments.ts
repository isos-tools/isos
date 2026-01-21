import * as Ast from '@unified-latex/unified-latex-types';
import { unifiedLatexFromString } from '@unified-latex/unified-latex-util-parse';
import { visit } from '@unified-latex/unified-latex-util-visit';
import { unified } from 'unified';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { latexAstFromStringOptions } from '../options';

export function expandEnvironments() {
  const processor = unified()
    // @ts-expect-error
    .use(unifiedLatexFromString, latexAstFromStringOptions);

  return (tree: Ast.Root) => {
    const environments = listEnvironments(tree);

    visit(tree, (node) => {
      if (node.type === 'environment' && environments[node.env]) {
        const { begin, end } = environments[node.env];
        const body = printRaw(node.content);
        const tex = [begin, body, end].filter(Boolean).join('\n');
        const parsed = processor.parse(tex) as Ast.Root;
        node.content = parsed.content;
      }
    });

    // console.dir(tree, { depth: null });
  };
}

type EnvSpec = {
  begin: string;
  end: string;
};

function listEnvironments(tree: Ast.Ast) {
  const environments: Record<string, EnvSpec> = {};

  visit(tree, (node) => {
    if (node.type === 'macro' && node.content === 'newenvironment') {
      const name = getArgString(node, 2);
      const begin = getArgString(node, 5);
      const end = getArgString(node, 6);
      environments[name] = { begin, end };
    }
  });

  return environments;
}

function getArgString(node: Ast.Macro, idx: number): string {
  if (!node.args?.length) {
    return '';
  }
  return printRaw(node.args[idx]?.content).trim();
}
