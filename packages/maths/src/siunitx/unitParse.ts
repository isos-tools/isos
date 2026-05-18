import TexError from '@mathjax/src/js/input/tex/TexError.js';
import TexParser from '@mathjax/src/js/input/tex/TexParser.js';

import { elementsOfInterpretedUnitInput } from './interpretedUnitInput';
import { IOptions } from './options/options';
import {
  IUnitMacroProcessResult,
  processUnitMacro,
} from './unitMacros';
import { IUnitPiece } from './unitPiece';
import { prefixSymbol, unitSymbol } from './units';

interface ParseUnitState {
  parser: TexParser;
  globalOptions: IOptions;
  localOptions: Partial<IOptions>;
  unitPieces: IUnitPiece[];
  nextModifier: IUnitPiece | null;
}

function mergeModifier(
  existing: IUnitPiece | null,
  addition: IUnitPiece,
): IUnitPiece {
  if (existing === null) {
    return addition;
  }
  return Object.assign(existing, addition);
}

function applyMacroResult(
  state: ParseUnitState,
  macro: string,
  processed: IUnitMacroProcessResult,
): void {
  if (processed.options !== undefined) {
    Object.assign(state.globalOptions, processed.options);
  }
  Object.assign(state.globalOptions, state.localOptions);

  switch (processed.type) {
    case 'next':
    case 'prefix':
      state.nextModifier = mergeModifier(
        state.nextModifier,
        processed.result,
      );
      break;
    case 'previous': {
      if (state.unitPieces.length === 0) {
        throw new TexError(
          'MissingPreviousMacro',
          'There is no previous macro for %1 to modify.',
          macro,
        );
      }
      Object.assign(
        state.unitPieces[state.unitPieces.length - 1],
        processed.result,
      );
      break;
    }
    case 'unit': {
      const unit = processed.result;
      if (state.nextModifier !== null) {
        Object.assign(unit, state.nextModifier);
        const siunitxOptions = state.parser.options.siunitx as IOptions;
        if (
          siunitxOptions['per-mode'] === 'repeated-symbol' ||
          state.globalOptions['sticky-per']
        ) {
          const keepDenominator =
            state.nextModifier.position === 'denominator';
          state.nextModifier = keepDenominator
            ? { position: 'denominator' }
            : null;
        } else {
          state.nextModifier = null;
        }
      }
      state.unitPieces.push(unit);
      break;
    }
  }
}

function elementToMacroResult(
  element:
    | { kind: 'macro'; macro: string }
    | { kind: 'superscript'; value: string }
    | { kind: 'subscript'; value: string },
  subParser: TexParser,
): { macro: string; processed: IUnitMacroProcessResult } {
  if (element.kind === 'macro') {
    return {
      macro: element.macro,
      processed: processUnitMacro(element.macro, subParser),
    };
  }
  if (element.kind === 'superscript') {
    return {
      macro: '^',
      processed: {
        type: 'previous',
        result: { power: +element.value, latexScriptPower: true },
      },
    };
  }
  return {
    macro: '_',
    processed: {
      type: 'previous',
      result: { qualifier: element.value },
    },
  };
}

function parseInterpretedUnits(
  parser: TexParser,
  text: string,
  globalOptions: IOptions,
  localOptions: Partial<IOptions>,
): IUnitPiece[] {
  const subParser = new TexParser('', parser.stack.env, parser.configuration);
  const state: ParseUnitState = {
    parser,
    globalOptions,
    localOptions,
    unitPieces: [],
    nextModifier: null,
  };

  for (const element of elementsOfInterpretedUnitInput(text, subParser)) {
    const { macro, processed } = elementToMacroResult(element, subParser);
    applyMacroResult(state, macro, processed);
  }

  return state.unitPieces;
}

function joinValues(values: IterableIterator<string>, joinString: string): string {
  return Array.from(values)
    .filter((value, index, array) => index === array.indexOf(value))
    .sort((a, b) => a.length - b.length)
    .join(joinString);
}

function processPrefixUnitCombo(text: string, unitPiece: IUnitPiece): void {
  const prefixes = joinValues(prefixSymbol.values(), '|');
  const units = joinValues(unitSymbol.values(), '|');
  const result = new RegExp('(' + prefixes + ')?(' + units + ')').exec(text);
  if (result === null) {
    return;
  }
  unitPiece.prefix = result[1] ?? '';
  unitPiece.symbol = result[2];
}

function readPlainTextScript(
  source: string,
  startIndex: number,
): { value: string; endIndex: number } {
  let index = startIndex;
  let next = source.charAt(index);
  let value = '';
  if (next === '{') {
    index++;
    while ((next = source.charAt(index)) !== '}') {
      value += next;
      index++;
    }
    index++;
  } else {
    value = next;
    index++;
  }
  return { value, endIndex: index };
}

function parsePlainTextUnits(
  parser: TexParser,
  text: string,
): IUnitPiece[] {
  const unitPieces: IUnitPiece[] = [];
  const subParser = new TexParser(
    text,
    parser.stack.env,
    parser.configuration,
  );
  subParser.i = 0;

  let isDenominator = false;
  let prefixUnit = '';
  let unitPiece: IUnitPiece = { position: 'numerator' };

  while (subParser.i < subParser.string.length) {
    switch (subParser.string.charAt(subParser.i)) {
      case '~':
      case '.':
        processPrefixUnitCombo(prefixUnit, unitPiece);
        unitPieces.push(unitPiece);
        prefixUnit = '';
        unitPiece = {
          position: isDenominator ? 'denominator' : 'numerator',
        };
        break;
      case '/':
        processPrefixUnitCombo(prefixUnit, unitPiece);
        unitPieces.push(unitPiece);
        prefixUnit = '';
        isDenominator = true;
        unitPiece = {
          position: isDenominator ? 'denominator' : 'numerator',
        };
        break;
      case '^': {
        subParser.i++;
        const script = readPlainTextScript(subParser.string, subParser.i);
        unitPiece.power = +script.value;
        subParser.i = script.endIndex;
        continue;
      }
      case '_': {
        subParser.i++;
        const script = readPlainTextScript(subParser.string, subParser.i);
        unitPiece.qualifier = script.value;
        subParser.i = script.endIndex;
        continue;
      }
      default:
        prefixUnit += subParser.string.charAt(subParser.i);
        break;
    }
    subParser.i++;
  }

  processPrefixUnitCombo(prefixUnit, unitPiece);
  unitPieces.push(unitPiece);
  return unitPieces;
}

export function parseUnit(
  parser: TexParser,
  text: string,
  globalOptions: IOptions,
  localOptions: Partial<IOptions>,
  isLiteral: boolean,
): IUnitPiece[] {
  if (!isLiteral) {
    return parseInterpretedUnits(parser, text, globalOptions, localOptions);
  }
  return parsePlainTextUnits(parser, text);
}
