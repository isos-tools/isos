// export type Options = {
//   noEmbedAssetUrl: boolean;
//   noSyntaxHighlight: boolean;
// };
import { Reference } from '../plugins/bibliography/extract-bibliography';
import { Warning } from '../plugins/preamble-warnings/def-warn';
import { RefObjectsYaml } from '../plugins/refs-and-counts/default-objects';

// export type Context = {
//   cacheDir: string;
//   hasSidenotes: boolean;
//   figureCounter: number;
//   refStore: Record<string, string>;
//   options: Options;
// };

export type Author = {
  name: string;
  orcid?: string;
  affiliation?: string;
};

export type Frontmatter = {
  title: string;
  titleImage?: string;
  date: string;
  author: Author | Author[];
  tableOfContentsPrefix?: string;
  abstract: string;
  documentClass?: string;
  hasPart?: boolean;
  theorems: RefObjectsYaml;
  'reference-location': 'below' | 'margin' | 'document';
  references: Reference[];
  preambleWarnings: Warning[];
};

export type Context = {
  frontmatter: {
    title: string;
    titleImage?: string;
    date: string;
    author: Author[];
    tableOfContentsPrefix?: string;
    abstract: string;
    theorems: RefObjectsYaml;
    refMap: Record<string, Reference>;
    referenceLocation: string;
    documentClass?: string;
    hasPart?: boolean;
    references: Reference[];
    preambleWarnings: Warning[];
  };
  hasSideNotes: boolean;
};

export function createContext(): Context {
  return {
    frontmatter: {
      title: '',
      date: '',
      author: [],
      abstract: '',
      theorems: {},
      refMap: {},
      referenceLocation: 'below',
      references: [],
      preambleWarnings: [],
    },
    hasSideNotes: false,
    // cacheDir: '',
    // hasSidenotes: false,
    // figureCounter: 0,
    // refStore: {},
    // options: {
    //   noEmbedAssetUrl: false,
    //   noSyntaxHighlight: false,
    // },
  };
}
