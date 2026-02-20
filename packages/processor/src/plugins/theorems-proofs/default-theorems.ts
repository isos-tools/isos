import { defaultObjects } from '../refs-and-counts/default-objects';

export type Theorem = {
  name: string;
  heading: string;
  type?: 'theorem' | 'float' | 'equation';
  style?: 'plain' | 'definition' | 'remark';
  abbr?: string;
  numberWithin?: string;
  counterWithin?: string;
  referenceCounter?: string;
  unnumbered?: boolean;
  framed?: boolean;
  hideable?: 'show' | 'hide' | 'clicktoshow';
  lowerTitle?: string;
};

// https://quarto.org/docs/authoring/cross-references.html#theorems-and-proofs
const names = [
  'theorem',
  'lemma',
  'corollary',
  'proposition',
  'conjecture',
  'definition',
  'example',
  'exercise',
  'solution',
  'remark',
  'proof',
];

export const defaultTheorems: Theorem[] = defaultObjects.filter((o) => {
  return names.includes(o.name);
});

// https://quarto.org/docs/authoring/cross-references.html#callouts

// export const callOuts: Record<string, string> = {
//   nte: 'note',
//   tip: 'tip',
//   wrn: 'warning',
//   imp: 'important',
//   cau: 'caution',
// };
