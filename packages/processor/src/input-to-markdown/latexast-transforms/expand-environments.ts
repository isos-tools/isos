import * as Ast from '@unified-latex/unified-latex-types';
import {
  PluginOptions,
  unifiedLatexFromString,
} from '@unified-latex/unified-latex-util-parse';
import { visit } from '@unified-latex/unified-latex-util-visit';
import { Processor, unified } from 'unified';

import { printRaw } from '@isos/unified-latex-util-print-raw';

import { latexAstFromStringOptions as options } from '../options';

export function expandEnvironments() {
  // @ts-expect-error
  const processor = unified().use(unifiedLatexFromString, options);

  return (tree: Ast.Root) => {
    // processor with environment signatures extracted from \newenvironment
    const environments = listEnvironments(tree);
    const optionsWithEnv = mergeEnvOptions(options, environments);
    const envProcessor = unified().use(
      // @ts-expect-error
      unifiedLatexFromString,
      optionsWithEnv,
    );

    visit(tree, (node, info) => {
      if (node.type === 'environment' && environments[node.env]) {
        const env = environments[node.env];

        let tex = '';
        if (env.numArgs === undefined) {
          const body = printRaw(node.content);
          tex = [env.begin, body, env.end].filter(Boolean).join(' ');
        } else {
          tex = expandEnvParameters(envProcessor, env, node);
        }

        const parsed = processor.parse(tex) as Ast.Root;
        const parent = info.parents[0];
        const idx = info.index;
        if (
          parent &&
          idx !== undefined &&
          (parent.type === 'root' || parent.type === 'environment')
        ) {
          const newEnv: Ast.Environment = {
            type: 'environment',
            env: node.env,
            position: node.position,
            content: parsed.content,
          };
          parent.content.splice(idx, 1, newEnv);
        }
      }
    });

    // console.dir(tree, { depth: null });
  };
}

function expandEnvParameters(
  processor: Processor,
  env: EnvSpec,
  node: Ast.Environment,
) {
  const reParsed = processor.parse(printRaw(node)) as Ast.Root;
  const { args = [], content } = reParsed.content[0] as Ast.Environment;
  const params = args.map((o) => printRaw(o.content));
  const numArgs = Math.min(env.numArgs || 0, 9);

  let begin = env.begin;
  let end = env.end;
  for (let idx = 0; idx < numArgs; idx++) {
    if (params[idx] !== undefined) {
      const regex = new RegExp(`#{1,2}${idx + 1}`, 'g');
      begin = begin.replace(regex, params[idx]);
      end = end.replace(regex, params[idx]);
    }
  }

  const body = printRaw(content);
  return [begin, body, end].filter(Boolean).join(' ');
}

function mergeEnvOptions(
  options: PluginOptions = {},
  environments: Record<string, EnvSpec>,
) {
  const envs = Object.entries(environments).reduce(
    (acc: Ast.EnvInfoRecord, [name, spec]) => {
      if (spec.signature !== undefined) {
        acc[name] = { signature: spec.signature };
      }
      return acc;
    },
    {},
  );
  return {
    ...options,
    environments: {
      ...(options.environments || {}),
      ...envs,
    },
  };
}

type EnvSpec = {
  begin: string;
  end: string;
  numArgs?: number;
  signature?: string;
};

function listEnvironments(tree: Ast.Ast) {
  const environments: Record<string, EnvSpec> = {};

  visit(tree, (node) => {
    if (node.type === 'macro' && node.content === 'newenvironment') {
      const name = getArgString(node, 2);
      const begin = getArgString(node, 5);
      const end = getArgString(node, 6);
      const env: EnvSpec = { begin, end };

      // optional environment parameters
      const numArgsStr = getArgString(node, 3);
      if (numArgsStr !== '') {
        env.numArgs = Number(numArgsStr);
        const firstArgDefault = getArgString(node, 4);
        env.signature = getSignature(env.numArgs, firstArgDefault);
      }

      environments[name] = env;
    }
  });

  return environments;
}

function getArgString(node: Ast.Macro, idx: number): string {
  if (!node.args?.length || !node.args[idx]) {
    return '';
  }
  return printRaw(node.args[idx].content).trim();
}

function getSignature(numArgs: number, firstArgDefault: string) {
  const optionalArgs = Array.from({ length: numArgs }).fill('o');
  if (firstArgDefault !== '' && optionalArgs.length > 0) {
    optionalArgs[0] = `O{${firstArgDefault}}`;
  }
  return optionalArgs.join(' ');
}
