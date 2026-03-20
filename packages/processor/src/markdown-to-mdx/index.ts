import {
  ProcessorOptions,
  RunOptions,
  createProcessor,
  run,
} from '@mdx-js/mdx';
import { Node, Root } from 'mdast';

import { getTocContent } from '../plugins/table-of-contents/include-toc-contents';
import { createRemarkProcessor } from '../remark-processor';
import { processorOptions } from './hast-transforms';
import { Options } from './options';
import { createTableOfContents } from './sidebar';

export async function markdownToArticle(
  md: string,
  options: Options,
  _onStatus?: (status: string) => unknown,
) {
  // console.log(md);
  const mdAst = await getMdAst(md, options);
  // console.dir(mdAst, { depth: null });

  const procOptions: ProcessorOptions = {
    ...processorOptions,
    rehypePlugins: options.htmlAstTransforms,
  };
  return createMDX(mdAst, procOptions, options.mdxArticleRunOptions);
}

export async function markdownToTOC(md: string, options: Options) {
  const mdAst = await getMdAst(md, options);
  const tocContent = getTocContent(mdAst as Root);
  const toc = createTableOfContents(mdAst as Root);

  const root = {
    type: 'root',
    children: [...tocContent, toc],
  };

  return createMDX(root, processorOptions, options.mdxTOCRunOptions);
}

async function getMdAst(md: string, options: Options) {
  const markdown = markdownStringTransforms(
    md,
    options.markdownStringTransforms,
  );
  // console.log(markdown);

  const mdAstProcessor = createRemarkProcessor(options.mdAstTransforms);
  const mdAst = mdAstProcessor.parse(markdown);
  // console.dir(mdAst, { depth: null });

  return mdAstProcessor.run(mdAst);
}

function markdownStringTransforms(
  markdown: string,
  transforms: Options['markdownStringTransforms'],
) {
  return transforms.reduce((acc, fn) => fn(acc), markdown);
}

async function createMDX(
  mdAst: Node,
  options: ProcessorOptions,
  runOptions: RunOptions,
) {
  const processor = createProcessor(options);
  // @ts-expect-error: mdAst is not of type Program
  const esAst = await processor.run(mdAst);
  const mdxString = processor.stringify(esAst);
  return run(mdxString, runOptions);
}
