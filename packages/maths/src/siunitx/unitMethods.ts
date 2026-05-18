import { MmlNode } from '@mathjax/src/js/core/MmlTree/MmlNode.js';
import TexParser from '@mathjax/src/js/input/tex/TexParser.js';

import { siunitxError } from './error/errors';
import { IOptions, findOptions } from './options/options';
import { displayUnits } from './unitDisplay';
import { parseUnit } from './unitParse';

export type { IUnitPiece } from './unitPiece';
export { displayUnits } from './unitDisplay';
export { parseUnit } from './unitParse';

export function processUnit(parser: TexParser): MmlNode {
  const globalOptions: IOptions = {
    ...(parser.options.siunitx as IOptions),
  };
  const localOptions = findOptions(parser, globalOptions);

  const parseUnits =
    (localOptions['parse-units'] === undefined ||
      localOptions['parse-units'] === true) &&
    globalOptions['parse-units'] === true;

  if (!parseUnits) {
    return parser.mml();
  }

  const text = parser.GetArgument('unit');
  const isLiteral = text.indexOf('\\') === -1;

  if (globalOptions['forbid-literal-units']) {
    throw siunitxError.LiteralUnitsForbidden(text);
  }

  const unitPieces = parseUnit(
    parser,
    text,
    globalOptions,
    localOptions,
    isLiteral,
  );
  const texString = displayUnits(parser, unitPieces, globalOptions, isLiteral);

  return new TexParser(texString, parser.stack.env, parser.configuration).mml();
}
