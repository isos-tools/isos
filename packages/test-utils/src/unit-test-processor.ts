import { resolve } from 'pathe';
import { createElement } from 'preact';
import renderToString from 'preact-render-to-string';
import formatHtml from 'pretty';

import { createMockWatcher, fs } from '@isos/fs/node';
import {
  InputToMarkdownOptions,
  MarkdownToMdxOptions,
  MdxDefaultState,
  createFileCache,
  createInputToMarkdownOptions,
  createInputToMarkdownTestContext,
  createMarkdownToMdxContext,
  createMarkdownToMdxOptions,
  createMdxState,
  inputToMarkdown,
  markdownToArticle,
  markdownToTOC,
} from '@isos/processor';
import { createProcessor } from '@isos/processor/input-to-markdown';

import { unindentStringAndTrim } from './unindent-string';

export { unindentStringAndTrim } from './unindent-string';

fs.createWatcher = createMockWatcher;

export const testProcessor = {
  latex: latexToMarkdown,
  md: markdownToHtml,
  mdToMd: markdownToMarkdown,
  mdToToc: markdownToTableOfContents,
  fixture: fixtureToMarkdown,
};

const testOptions = {
  noInlineImages: true,
};

const testHtmlOptions = {
  noWrapper: true,
  noSections: true,
  noFooter: true,
};

async function latexToMarkdown(
  latex: string,
  options?: Partial<InputToMarkdownOptions>,
) {
  const prepared = unindentStringAndTrim(latex);
  const fileCache = createFileCache(fs);
  const ctx = createInputToMarkdownTestContext(
    'latex',
    prepared,
    fileCache,
  );
  const opts = createInputToMarkdownOptions(ctx, {
    ...testOptions,
    ...options,
  });
  const markdown = await inputToMarkdown(ctx.content, opts);
  return markdown;
}

type Opts = Partial<InputToMarkdownOptions> &
  Partial<MarkdownToMdxOptions> & {
    state: Partial<MdxDefaultState>;
  };

async function markdownToHtml(
  md: string,
  { state, ...options }: Partial<Opts> = {},
) {
  // input-to-markdown
  const prepared = unindentStringAndTrim(md);
  const fileCache = createFileCache(fs);
  const ctx = createInputToMarkdownTestContext(
    'markdown',
    prepared,
    fileCache,
  );
  const opts = createInputToMarkdownOptions(ctx, {
    ...testOptions,
    ...options,
  });
  const markdown = await inputToMarkdown(ctx.content, opts);

  // markdown-to-jsx
  const mdxState = createMdxState();
  const { mathsAsTex, syntaxHighlight } = state?.maths || {};

  mdxState.maths.mathsAsTex.value =
    mathsAsTex !== undefined ? mathsAsTex : true;
  mdxState.maths.syntaxHighlight.value =
    syntaxHighlight !== undefined ? syntaxHighlight : false;

  const htmlCtx = createMarkdownToMdxContext();
  const htmlOptions = createMarkdownToMdxOptions(mdxState, htmlCtx, {
    ...testHtmlOptions,
    ...options,
  });
  const component = await markdownToArticle(markdown, htmlOptions);

  // jsx-to-html
  const element = createElement(component.default, {});
  const str = renderToString(element);
  return formatHtml(str);
}

async function markdownToTableOfContents(
  md: string,
  { state, ...options }: Partial<Opts> = {},
) {
  const prepared = unindentStringAndTrim(md);
  const fileCache = createFileCache(fs);
  const ctx = createInputToMarkdownTestContext(
    'markdown',
    prepared,
    fileCache,
  );
  const opts = createInputToMarkdownOptions(ctx, {
    ...testOptions,
    ...options,
  });
  const markdown = await inputToMarkdown(ctx.content, opts);
  const mdxState = createMdxState();
  const { mathsAsTex, syntaxHighlight } = state?.maths || {};

  mdxState.maths.mathsAsTex.value =
    mathsAsTex !== undefined ? mathsAsTex : true;
  mdxState.maths.syntaxHighlight.value =
    syntaxHighlight !== undefined ? syntaxHighlight : false;

  const htmlCtx = createMarkdownToMdxContext();
  const htmlOptions = createMarkdownToMdxOptions(mdxState, htmlCtx, {
    ...testHtmlOptions,
    ...options,
    includeTocContents: true,
  });
  const component = await markdownToTOC(markdown, htmlOptions);
  // @ts-expect-error
  const element = createElement(component.default);
  const str = renderToString(element);
  return formatHtml(str);
}

async function markdownToMarkdown(md: string) {
  const prepared = unindentStringAndTrim(md);
  const fileCache = createFileCache(fs);
  const ctx = createInputToMarkdownTestContext(
    'markdown',
    prepared,
    fileCache,
  );
  const options = createInputToMarkdownOptions(ctx, testOptions);
  return inputToMarkdown(ctx.content, options);
}

async function fixtureToMarkdown(
  fixturePath: string,
  _options?: Partial<InputToMarkdownOptions>,
) {
  // const srcFilePath = getAbsoluteFixturePath(fixturePath);
  // const fileCache = createFileCache(fs);
  // const ctx = await createContext(srcFilePath, fileCache);
  // console.log(fileCache.getStore());
  // await embedIncludes(ctx, fs);
  // console.log('content:', ctx.content);
  // const opts = createDefaultOptions(ctx, { ...testOptions, ...options });
  // return inputToMarkdown(ctx.content, opts);
  return new Promise<string>((resolve, reject) => {
    const srcFilePath = getAbsoluteFixturePath(fixturePath);
    const options = { ...testOptions, ..._options };
    const processor = createProcessor(
      srcFilePath,
      fs,
      {
        onComplete({ markdown }) {
          resolve(markdown);
        },
        onError: reject,
        onLoading: () => {},
        onStatus: () => {},
      },
      options,
    );
    processor.process();
  });
}

function getAbsoluteFixturePath(fixturePath: string) {
  const __dirname = import.meta.dirname;
  return resolve(__dirname, '../../processor/fixtures', fixturePath);
}
