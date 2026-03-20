import { FileCache } from '../embed-includes/file-cache';
import { RefObjectsYaml } from '../plugins/refs-and-counts/default-objects';
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
  fileCache: FileCache;
  type: FileType;
  content: string;
  hasMakeTitle: boolean;
  sectionToHeading: Record<
    string,
    'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  >;
  frontmatter: {
    documentClass?: string;
    title: string;
    titleImage?: string;
    tableOfContentsPrefix?: string;
    date: string;
    author: Author[];
    abstract: string;
    theorems: RefObjectsYaml;
    'reference-location': string;
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
    frontmatter: {
      title: '',
      date: '',
      author: [],
      abstract: '',
      theorems: {},
      'reference-location': 'margin',
    },
  };
}

export function createTestContext(
  type: FileType,
  content: string,
  fileCache: FileCache,
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
    frontmatter: {
      title: '',
      date: '',
      author: [],
      abstract: '',
      theorems: {},
      'reference-location': 'margin',
    },
  };
}
