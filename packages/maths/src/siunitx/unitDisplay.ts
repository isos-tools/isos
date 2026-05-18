import TexParser from '@mathjax/src/js/input/tex/TexParser.js';

import { siunitxError } from './error/errors';
import { IOptions } from './options/options';
import { IUnitOptions } from './options/unitOptions';
import {
  unitLatex,
  usesAbsolutePowerInUnitLatex,
} from './unitLatex';
import {
  IUnitPiece,
  countNumeratorDenominatorPieces,
  hasLatexScriptPowerInPieces,
  isDenominatorPiece,
  signedUnitPower,
} from './unitPiece';

function resolveDisplayOptions(
  unitPieces: IUnitPiece[],
  options: IOptions,
): IOptions {
  if (!hasLatexScriptPowerInPieces(unitPieces)) {
    return options;
  }
  // LaTeX2e siunitx: `^` uses symbol division (m/s^{2}), not power mode (m s^{-2}).
  return { ...options, 'per-mode': 'symbol' };
}

function openColorWrapper(options: IOptions): {
  prefix: string;
  closeColor: boolean;
} {
  if (options['unit-color'] !== '') {
    return { prefix: `{\\color{${options['unit-color']}}`, closeColor: true };
  }
  if (options.color !== '') {
    return { prefix: `{\\color{${options.color}}`, closeColor: true };
  }
  return { prefix: '', closeColor: false };
}

function shouldUsePerForSingle(
  unitPieces: IUnitPiece[],
  options: IOptions,
): boolean {
  if (unitPieces.length < 2 || options['per-mode'] !== 'single-symbol') {
    return false;
  }
  const negativePowerCount = unitPieces.filter(
    (piece) => Math.sign(signedUnitPower(piece)) === -1,
  ).length;
  return negativePowerCount === 1;
}

function usesFractionOrSymbolLayout(
  options: IOptions,
  perForSingle: boolean,
  numeratorCount: number,
  denominatorCount: number,
): boolean {
  const mode = options['per-mode'];
  if (
    mode === 'fraction' ||
    mode === 'symbol' ||
    mode === 'repeated-symbol' ||
    perForSingle
  ) {
    return true;
  }
  return mode === 'single-symbol' && denominatorCount === 1 && numeratorCount > 0;
}

function displayLiteralUnits(
  unitPieces: IUnitPiece[],
  options: IUnitOptions,
): string {
  let latex = '';
  const firstDenominator = unitPieces.find(
    (piece) => piece.position === 'denominator',
  );

  for (const piece of unitPieces) {
    if (piece === firstDenominator) {
      latex += ' / ';
    }
    if (latex !== '') {
      latex += options['inter-unit-product'];
    }
    latex += unitLatex(piece, options).latex;
  }
  return latex;
}

function appendToFractionPart(
  target: 'numerator' | 'denominator',
  parts: { numerator: string; denominator: string },
  pieceLatex: string,
  options: IOptions,
  perMode: IOptions['per-mode'],
  superscriptPresent: boolean,
): { lastNumeratorHadSuperscript: boolean } {
  let lastNumeratorHadSuperscript = false;
  if (target === 'denominator') {
    if (parts.denominator !== '') {
      if (perMode === 'repeated-symbol') {
        if (superscriptPresent) {
          parts.denominator += options['per-symbol-script-correction'];
        }
        parts.denominator += options['per-symbol'];
      } else {
        parts.denominator += options['inter-unit-product'];
      }
    }
    parts.denominator += pieceLatex;
  } else {
    if (parts.numerator !== '') {
      parts.numerator += options['inter-unit-product'];
    }
    parts.numerator += pieceLatex;
    lastNumeratorHadSuperscript = superscriptPresent;
  }
  return { lastNumeratorHadSuperscript };
}

function displayFractionOrSymbolUnits(
  unitPieces: IUnitPiece[],
  options: IOptions,
  perForSingle: boolean,
  denominatorCount: number,
): string {
  const parts = { numerator: '', denominator: '' };
  const absPower = usesAbsolutePowerInUnitLatex(options, perForSingle);
  let lastNumeratorHadSuperscript = false;

  for (const piece of unitPieces) {
    const latexResult = unitLatex(piece, options, absPower);
    if (isDenominatorPiece(piece)) {
      appendToFractionPart(
        'denominator',
        parts,
        latexResult.latex,
        options,
        options['per-mode'],
        latexResult.superscriptPresent,
      );
    } else {
      const result = appendToFractionPart(
        'numerator',
        parts,
        latexResult.latex,
        options,
        options['per-mode'],
        latexResult.superscriptPresent,
      );
      lastNumeratorHadSuperscript = result.lastNumeratorHadSuperscript;
    }
  }

  if (parts.numerator === '' && parts.denominator !== '') {
    parts.numerator = '1';
  }
  if (parts.denominator === '') {
    return parts.numerator;
  }

  let denominator = parts.denominator;
  if (
    denominatorCount > 1 &&
    options['per-mode'] === 'symbol' &&
    options['bracket-unit-denominator']
  ) {
    denominator = '(' + denominator + ')';
  }

  const mode = options['per-mode'];
  if (mode === 'fraction') {
    return (
      options['fraction-command'] +
      '{' +
      parts.numerator +
      '}{' +
      denominator +
      '}'
    );
  }

  if (
    mode === 'repeated-symbol' ||
    mode === 'symbol' ||
    perForSingle ||
    mode === 'single-symbol'
  ) {
    return (
      parts.numerator +
      (lastNumeratorHadSuperscript
        ? options['per-symbol-script-correction']
        : '') +
      options['per-symbol'] +
      denominator
    );
  }

  throw siunitxError.DenominatorParsingError(denominator, mode);
}

function sortForPowerPositiveFirst(unitPieces: IUnitPiece[]): IUnitPiece[] {
  return [...unitPieces].sort((x, y) => {
    let a: number | IUnitPiece =
      x.power !== null && x.power !== undefined ? x : 1;
    if (x.position === 'denominator') {
      a = -a;
    }
    let b: number | IUnitPiece =
      y.power !== null && y.power !== undefined ? y : 1;
    if (y.position === 'denominator') {
      b = -b;
    }
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  });
}

function displayPowerModeUnits(
  unitPieces: IUnitPiece[],
  options: IOptions,
): string {
  const pieces =
    options['per-mode'] === 'power-positive-first'
      ? sortForPowerPositiveFirst(unitPieces)
      : unitPieces;

  let latex = '';
  for (const piece of pieces) {
    if (latex !== '') {
      latex += options['inter-unit-product'];
    }
    latex += unitLatex(piece, options).latex;
  }
  return latex;
}

function displayInterpretedUnits(
  unitPieces: IUnitPiece[],
  options: IOptions,
  perForSingle: boolean,
): string {
  const counts = countNumeratorDenominatorPieces(unitPieces);
  if (
    usesFractionOrSymbolLayout(
      options,
      perForSingle,
      counts.numeratorCount,
      counts.denominatorCount,
    )
  ) {
    return displayFractionOrSymbolUnits(
      unitPieces,
      options,
      perForSingle,
      counts.denominatorCount,
    );
  }
  return displayPowerModeUnits(unitPieces, options);
}

export function displayUnits(
  _parser: TexParser,
  unitPieces: IUnitPiece[],
  options: IOptions,
  isLiteral: boolean,
): string {
  const displayOptions = resolveDisplayOptions(unitPieces, options);
  const { prefix, closeColor } = openColorWrapper(displayOptions);
  let texString = prefix;

  const perForSingle = shouldUsePerForSingle(unitPieces, displayOptions);
  if (isLiteral) {
    texString += displayLiteralUnits(unitPieces, displayOptions);
  } else {
    texString += displayInterpretedUnits(
      unitPieces,
      displayOptions,
      perForSingle,
    );
  }

  if (closeColor) {
    texString += '}';
  }
  return texString;
}
