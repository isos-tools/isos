import TexError from '@mathjax/src/js/input/tex/TexError.js';
import TexParser from '@mathjax/src/js/input/tex/TexParser.js';

/** One syntactic element in an interpreted (backslash-macro) unit argument. */
export type InterpretedUnitElement =
  | { kind: 'macro'; macro: string }
  | { kind: 'superscript'; value: string }
  | { kind: 'subscript'; value: string };

function isSkippableSpace(text: string, index: number): boolean {
  const ch = text[index];
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}

/**
 * Reads the script argument after `^` or `_` (`2`, `{2}`, `{-2}`, etc.).
 */
export function readScriptValue(
  text: string,
  start: number,
): { value: string; nextIndex: number } {
  if (start >= text.length) {
    throw new TexError(
      'MissingScriptValue',
      'Missing script argument in unit input',
    );
  }

  if (text[start] === '{') {
    let i = start + 1;
    let depth = 1;
    let value = '';
    while (i < text.length && depth > 0) {
      const ch = text[i];
      if (ch === '{') {
        depth++;
      } else if (ch === '}') {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
      if (depth > 0) {
        value += ch;
      }
      i++;
    }
    if (depth > 0) {
      throw new TexError(
        'MissingCloseBrace',
        'Could not find closing "}" for script argument in unit input',
      );
    }
    return { value, nextIndex: i };
  }

  return { value: text[start], nextIndex: start + 1 };
}

/**
 * Walks interpreted unit input, yielding siunitx macros (via MathJax argument
 * parsing) and LaTeX script constructs (`^`, `_`) without treating scripts as
 * TeX superscripts on the preceding token.
 *
 * Uses `subParser.i` as the sole cursor so macros that consume braced
 * arguments (e.g. `\tothe{5}`) stay in sync with `processUnitMacro`.
 */
export function* elementsOfInterpretedUnitInput(
  text: string,
  subParser: TexParser,
): Generator<InterpretedUnitElement> {
  subParser.string = text;
  subParser.i = 0;

  while (subParser.i < subParser.string.length) {
    while (
      subParser.i < subParser.string.length &&
      isSkippableSpace(subParser.string, subParser.i)
    ) {
      subParser.i++;
    }
    if (subParser.i >= subParser.string.length) {
      break;
    }

    const ch = subParser.string.charAt(subParser.i);
    if (ch === '^' || ch === '_') {
      subParser.i++;
      const { value, nextIndex } = readScriptValue(
        subParser.string,
        subParser.i,
      );
      subParser.i = nextIndex;
      yield ch === '^'
        ? { kind: 'superscript', value }
        : { kind: 'subscript', value };
      continue;
    }

    if (ch === '\\') {
      const macro = subParser.GetArgument('unit');
      yield { kind: 'macro', macro };
      continue;
    }

    throw new TexError(
      'InvalidUnitInput',
      'Unexpected character %1 in interpreted unit input',
      ch,
    );
  }
}
