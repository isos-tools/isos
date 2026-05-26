export type RefObject = {
  type: 'section' | 'theorem' | 'float' | 'equation' | 'appendix';
  name: string;
  heading: string;
  style?: 'plain' | 'definition' | 'remark';
  abbr?: string;
  numberWithin?: string;
  counterWithin?: string;
  referenceCounter?: string;
  unnumbered?: boolean;
  framed?: boolean;
  hideable?: 'show' | 'hide' | 'clicktoshow';
  lowerTitle?: string;
  increment?: 'alpha';
};

export type RefObjects = Record<string, RefObject>;

export function createDefaultObjects() {
  return defaultObjects.reduce((acc: RefObjects, obj) => {
    acc[obj.name] = obj;
    return acc;
  }, {});
}

const defaultObjects: RefObject[] = [
  // section
  {
    type: 'section',
    name: 'section',
    heading: 'Section',
    abbr: 'sec',
  },
  // equation
  {
    type: 'equation',
    name: 'equation',
    heading: 'Equation',
    numberWithin: 'chapter',
    abbr: 'eq',
  },
  // floats
  // https://quarto.org/docs/authoring/cross-references-divs.html#figures-and-tables
  {
    type: 'float',
    name: 'figure',
    heading: 'Figure',
    numberWithin: 'chapter',
    abbr: 'fig',
  },
  {
    type: 'float',
    name: 'table',
    heading: 'Table',
    numberWithin: 'chapter',
    abbr: 'tbl',
  },
  // TODO: https://quarto.org/docs/authoring/cross-references-divs.html#listings
  // {
  //   type: 'float',
  //   name: 'listing',
  //   heading: 'Listing',
  //   abbr: 'lst',
  // },
  // appendix
  {
    type: 'appendix',
    name: 'appendix',
    heading: 'Appendix',
    increment: 'alpha',
    abbr: 'app',
  },
  // Theorems & Proofs
  // https://quarto.org/docs/authoring/cross-references.html#theorems-and-proofs
  {
    type: 'theorem',
    name: 'proof',
    heading: 'Proof',
    style: 'remark',
  },
  // {
  //   type: 'theorem',
  //   name: 'theorem',
  //   heading: 'Theorem',
  //   style: 'definition',
  //   abbr: 'thm',
  // },
  // {
  //   type: 'theorem',
  //   name: 'lemma',
  //   heading: 'Lemma',
  //   style: 'definition',
  //   abbr: 'lem',
  // },
  // {
  //   type: 'theorem',
  //   name: 'corollary',
  //   heading: 'Corollary',
  //   style: 'definition',
  //   abbr: 'cor',
  // },
  // {
  //   type: 'theorem',
  //   name: 'proposition',
  //   heading: 'Proposition',
  //   style: 'definition',
  //   abbr: 'prp',
  // },
  // {
  //   type: 'theorem',
  //   name: 'conjecture',
  //   heading: 'Conjecture',
  //   style: 'definition',
  //   abbr: 'cnj',
  // },
  // {
  //   type: 'theorem',
  //   name: 'definition',
  //   heading: 'Definition',
  //   style: 'definition',
  //   abbr: 'def',
  // },
  // {
  //   type: 'theorem',
  //   name: 'example',
  //   heading: 'Example',
  //   style: 'definition',
  //   abbr: 'exm',
  // },
  // {
  //   type: 'theorem',
  //   name: 'exercise',
  //   heading: 'Exercise',
  //   style: 'definition',
  //   abbr: 'exr',
  // },
  // {
  //   type: 'theorem',
  //   name: 'solution',
  //   heading: 'Solution',
  //   style: 'remark',
  //   abbr: 'sol',
  // },
  // {
  //   type: 'theorem',
  //   name: 'remark',
  //   heading: 'Remark',
  //   style: 'remark',
  //   abbr: 'rem',
  // },
];

// https://quarto.org/docs/authoring/cross-references.html#callouts

// export const callOuts: Record<string, string> = {
//   nte: 'note',
//   tip: 'tip',
//   wrn: 'warning',
//   imp: 'important',
//   cau: 'caution',
// };
