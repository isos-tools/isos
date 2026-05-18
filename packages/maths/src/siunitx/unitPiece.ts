export interface IUnitPiece {
  symbol?: string;
  prefix?: string;
  position?: 'numerator' | 'denominator';
  power?: number;
  /** Set when power came from LaTeX `^` / `_` scripts (not siunitx modifiers). */
  latexScriptPower?: boolean;
  qualifier?: string;
  cancel?: boolean;
  highlight?: string;
}

export function hasDefinedPower(piece: IUnitPiece): boolean {
  return piece.power !== undefined && piece.power !== null;
}

export function isDenominatorPiece(piece: IUnitPiece): boolean {
  if (piece.position === 'denominator') {
    return true;
  }
  return hasDefinedPower(piece) && piece.power! < 0;
}

export function signedUnitPower(piece: IUnitPiece): number {
  const sign = piece.position === 'denominator' ? -1 : 1;
  if (!hasDefinedPower(piece)) {
    return sign;
  }
  return piece.power! * sign;
}

export function countNumeratorDenominatorPieces(unitPieces: IUnitPiece[]): {
  numeratorCount: number;
  denominatorCount: number;
} {
  let numeratorCount = 0;
  let denominatorCount = 0;
  for (const piece of unitPieces) {
    if (isDenominatorPiece(piece)) {
      denominatorCount++;
    } else {
      numeratorCount++;
    }
  }
  return { numeratorCount, denominatorCount };
}

export function hasLatexScriptPowerInPieces(unitPieces: IUnitPiece[]): boolean {
  return unitPieces.some(
    (piece) => piece.latexScriptPower && hasDefinedPower(piece),
  );
}
