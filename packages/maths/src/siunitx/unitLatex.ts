import { IUnitOptions, QualifierMode } from './options/unitOptions';
import { IUnitPiece, hasDefinedPower } from './unitPiece';

const qualifierFormatters = new Map<
  QualifierMode,
  (qualifier: string, phrase?: string) => string
>([
  ['subscript', (qualifier) => '_{' + qualifier + '}'],
  ['bracket', (qualifier) => '(' + qualifier + ')'],
  ['combine', (qualifier) => qualifier],
  ['phrase', (qualifier, phrase) => (phrase ?? '') + qualifier],
]);

function unitDisplayPower(unitPiece: IUnitPiece, absPower: boolean): number {
  const positionSign = unitPiece.position === 'denominator' ? -1 : 1;
  const hasPower = hasDefinedPower(unitPiece);
  let rawPower = 1;
  if (hasPower) {
    rawPower = unitPiece.power as number;
  }

  if (hasPower && unitPiece.latexScriptPower) {
    return rawPower;
  }

  const signedPower = rawPower * positionSign;
  if (absPower) {
    return Math.abs(signedPower);
  }
  return signedPower;
}

export function unitLatex(
  unitPiece: IUnitPiece,
  options: IUnitOptions,
  absPower = false,
): { latex: string; superscriptPresent: boolean } {
  let latex = '';
  if (unitPiece.cancel) {
    latex += '\\cancel{';
  }
  if (unitPiece.highlight) {
    latex += `{\\color{${unitPiece.highlight}}`;
  }

  latex += options['unit-font-command'] + '{';
  if (
    options['power-half-as-sqrt'] &&
    unitPiece.power &&
    unitPiece.power === 0.5
  ) {
    latex += `\\sqrt{\\class{MathML-Unit}{${unitPiece.prefix}${unitPiece.symbol}}}`;
    unitPiece.power = undefined;
  } else {
    latex += `\\class{MathML-Unit}{${unitPiece.prefix}${unitPiece.symbol}}`;
  }

  if (unitPiece.qualifier) {
    latex += qualifierFormatters.get(options['qualifier-mode'])?.(
      unitPiece.qualifier,
      options['qualifier-phrase'],
    );
  }
  latex += '}';

  const power = unitDisplayPower(unitPiece, absPower);
  if (power !== 1) {
    latex += '^{' + power + '}';
  }
  if (unitPiece.cancel) {
    latex += '}';
  }
  if (unitPiece.highlight) {
    latex += '}';
  }

  return { latex, superscriptPresent: power !== 1 };
}

export function usesAbsolutePowerInUnitLatex(
  options: IUnitOptions,
  perForSingle: boolean,
): boolean {
  const mode = options['per-mode'];
  return (
    mode === 'fraction' ||
    mode === 'symbol' ||
    mode === 'repeated-symbol' ||
    mode === 'single-symbol' ||
    perForSingle
  );
}
