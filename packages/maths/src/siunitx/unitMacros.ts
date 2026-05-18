import TexParser from '@mathjax/src/js/input/tex/TexParser.js';

import { siunitxError } from './error/errors';
import { IOptions } from './options/options';
import { UserDefinedUnitOptionsKey, UserDefinedUnitsKey } from './siunitx';
import { prefixSymbol, unitSymbolsWithShortcuts } from './units';
import { IUnitPiece } from './unitPiece';

export type UnitMacroProcessType = 'prefix' | 'unit' | 'previous' | 'next';

export interface IUnitMacroProcessResult {
  type: UnitMacroProcessType;
  result: IUnitPiece;
  options?: Partial<IOptions>;
}

const modifierMacroMap = new Map<
  string,
  (macro: string, parser: TexParser) => IUnitMacroProcessResult
>([
  ['square', () => ({ type: 'next', result: { power: 2 } })],
  ['cubic', () => ({ type: 'next', result: { power: 3 } })],
  ['squared', () => ({ type: 'previous', result: { power: 2 } })],
  ['cubed', () => ({ type: 'previous', result: { power: 3 } })],
  [
    'tothe',
    (_macro, parser) => ({
      type: 'previous',
      result: { power: +parser.GetArgument('tothe', true) },
    }),
  ],
  [
    'raiseto',
    (_macro, parser) => ({
      type: 'next',
      result: { power: +parser.GetArgument('raiseto') },
    }),
  ],
  ['per', () => ({ type: 'next', result: { position: 'denominator' } })],
  [
    'of',
    (_macro, parser) => ({
      type: 'previous',
      result: { qualifier: parser.GetArgument('of') },
    }),
  ],
  ['cancel', () => ({ type: 'next', result: { cancel: true } })],
  [
    'highlight',
    (_macro, parser) => ({
      type: 'next',
      result: { highlight: parser.GetArgument('highlight') },
    }),
  ],
]);

export function processUnitMacro(
  macro: string,
  parser: TexParser,
): IUnitMacroProcessResult {
  const name = macro.substring(1);
  const modifier = modifierMacroMap.get(name);
  if (modifier) {
    return modifier(name, parser);
  }

  if (prefixSymbol.has(name)) {
    return { type: 'prefix', result: { prefix: prefixSymbol.get(name) } };
  }

  const packageData = parser.configuration.packageData.get('siunitx');
  const userDefinedUnits = packageData[UserDefinedUnitsKey] as Map<
    string,
    string
  >;
  const macroKey = '\\' + name;
  if (userDefinedUnits.has(macroKey)) {
    const userDefinedUnitOptions = packageData[
      UserDefinedUnitOptionsKey
    ] as Map<string, Partial<IOptions>>;
    return {
      type: 'unit',
      result: { symbol: userDefinedUnits.get(macroKey) as string, prefix: '' },
      options: userDefinedUnitOptions.get(macroKey),
    };
  }

  if (unitSymbolsWithShortcuts.has(name)) {
    return {
      type: 'unit',
      result: {
        symbol: unitSymbolsWithShortcuts.get(name) as string,
        prefix: '',
      },
    };
  }

  throw siunitxError.NoInterpretationForUnitMacro('\\' + name);
}
