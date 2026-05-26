import { FileCache } from '../embed-includes/file-cache';
import { Reference } from '../plugins/bibliography/extract-bibliography';
import { NoteMap } from '../plugins/notes/input-to-md/latex-ast';
import { Warning } from '../plugins/preamble-warnings/def-warn';
import { RefObjects } from '../plugins/refs-and-counts/default-objects';
import { FileType, parseFilePath } from './utils/parse-file-path';

type Author = {
  name: string;
  orcid?: string;
  affiliation?: string;
};

export type Context = {
  srcFilePath: string;
  includePaths: string[];
  graphicsPath: string;
  imagePaths: string[];
  fileCache?: FileCache;
  type: FileType;
  content: string;
  hasMakeTitle: boolean;
  sectionToHeading: Record<
    string,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >;
  notes: NoteMap;
  frontmatter: {
    documentClass?: string;
    title: string;
    titleImage?: string;
    tableOfContentsPrefix?: string;
    date: string;
    author: Author[];
    abstract: string;
    theorems: RefObjects;
    equation?: RefObjects;
    figure?: RefObjects;
    table?: RefObjects;
    'reference-location': 'below' | 'margin' | 'document';
    references: Reference[];
    preambleWarnings: Warning[];
  };
};

export async function createContext(
  srcFilePath: string,
  fileCache: FileCache,
): Promise<Context> {
  const { type } = parseFilePath(srcFilePath);

  // await fileCache.upsert(srcFilePath);
  // const content = fileCache.getContent(srcFilePath);

  // if (content === null) {
  //   throw new Error(`No file exists: ${srcFilePath}`);
  // }

  return {
    srcFilePath,
    includePaths: [],
    graphicsPath: '',
    imagePaths: [],
    fileCache,
    type,
    content: '',
    hasMakeTitle: false,
    sectionToHeading: {},
    notes: {},
    frontmatter: {
      title: '',
      date: '',
      author: [],
      abstract: '',
      theorems: {},
      'reference-location': 'below',
      references: [],
      preambleWarnings: [],
    },
  };
}

export function createTestContext(
  type: FileType,
  content: string,
  fileCache?: FileCache,
): Context {
  return {
    srcFilePath: 'test',
    includePaths: [],
    graphicsPath: '',
    imagePaths: [],
    fileCache,
    type,
    content,
    hasMakeTitle: false,
    sectionToHeading: {},
    notes: {},
    frontmatter: {
      title: '',
      date: '',
      author: [],
      abstract: '',
      theorems: {},
      'reference-location': 'below',
      references: [],
      preambleWarnings: [],
    },
  };
}
