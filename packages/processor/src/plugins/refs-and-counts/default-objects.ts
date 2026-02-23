export type RefObject = {
  type: 'theorem' | 'float' | 'equation' | 'appendix';
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

export const defaultObjects: RefObject[] = [
  // Theorems & Proofs
  // https://quarto.org/docs/authoring/cross-references.html#theorems-and-proofs
  {
    type: 'theorem',
    name: 'theorem',
    heading: 'Theorem',
    style: 'definition',
    abbr: 'thm',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'lemma',
    heading: 'Lemma',
    style: 'definition',
    abbr: 'lem',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'corollary',
    heading: 'Corollary',
    style: 'definition',
    abbr: 'cor',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'proposition',
    heading: 'Proposition',
    style: 'definition',
    abbr: 'prp',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'conjecture',
    heading: 'Conjecture',
    style: 'definition',
    abbr: 'cnj',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'definition',
    heading: 'Definition',
    style: 'definition',
    abbr: 'def',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'example',
    heading: 'Example',
    style: 'definition',
    abbr: 'exm',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'exercise',
    heading: 'Exercise',
    style: 'definition',
    abbr: 'exr',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'solution',
    heading: 'Solution',
    style: 'remark',
    abbr: 'sol',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'remark',
    heading: 'Remark',
    style: 'remark',
    abbr: 'rem',
    unnumbered: false,
  },
  {
    type: 'theorem',
    name: 'proof',
    heading: 'Proof',
    style: 'remark',
  },
  // equation
  {
    type: 'equation',
    name: 'equation',
    heading: 'Equation',
    abbr: 'eq',
    unnumbered: false,
  },
  // floats
  {
    type: 'float',
    name: 'figure',
    heading: 'Figure',
    abbr: 'fig',
    unnumbered: false,
    numberWithin: 'chapter',
  },
  {
    type: 'float',
    name: 'table',
    heading: 'Table',
    abbr: 'tbl',
    unnumbered: false,
    numberWithin: 'chapter',
  },
  {
    type: 'float',
    name: 'section',
    heading: 'Section',
    abbr: 'sec',
    unnumbered: false,
  },
  // appendix
  {
    type: 'appendix',
    name: 'appendix',
    heading: 'Appendix',
    abbr: 'app',
    unnumbered: false,
    increment: 'alpha',
  },
  // TODO: listing
  // https://quarto.org/docs/authoring/cross-references-divs.html#listings
  // {
  //   name: 'listing',
  //   heading: 'Listing',
  //   abbr: 'lst',
  //   unnumbered: false,
  // },
];

export type RefObjectYaml = Partial<Omit<RefObject, 'name'>>;
export type RefObjectsYaml = Record<string, RefObjectYaml> & {
  custom?: RefObject[];
};

export function createDefaultObjectsYaml() {
  return defaultObjects.reduce((acc: RefObjectsYaml, { name, ...obj }) => {
    acc[name] = obj;
    return acc;
  }, {});
}

// https://quarto.org/docs/authoring/cross-references.html#callouts

// export const callOuts: Record<string, string> = {
//   nte: 'note',
//   tip: 'tip',
//   wrn: 'warning',
//   imp: 'important',
//   cau: 'caution',
// };
