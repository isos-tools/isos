// @ts-expect-error
import { Cite } from '@citation-js/core';

// import '@citation-js/plugin-bibtex';
// import '@citation-js/plugin-doi';
// import '@citation-js/plugin-csl';

// import type { ElementContent } from 'hast';
// import rehypeParse from 'rehype-parse';
// import rehypeStringify from 'rehype-stringify';
// import { unified } from 'unified';
// import { visit } from 'unist-util-visit';

// type BibItem = Record<string, string>;

// type CitationItem = {
//   citation: string;
//   bibliography: string;
// };

// type Options = {};

// const templateName = 'apa';
// const localeName = 'en-GB';

// const processor = unified().use(rehypeParse).use(rehypeStringify);

export async function getFormattedCitations(
  // @ts-expect-error
  bibItems: BibItem[],
  // @ts-expect-error
  options: Options = {},
) {
  const cite = await Cite.async(bibItems);
  console.log(cite);

  return 'hello';
  // // Format output
  // const ids: string[] = cite.getIds();

  // // console.log(ids);

  // return ids.reduce((acc: Record<string, CitationItem>, id) => {
  //   const citation = cite.format('citation', {
  //     entry: id,
  //     template: templateName,
  //     lang: localeName,
  //   });
  //   //.replace(/^\((.+)\)$/, '$1')

  //   const html = cite.format('bibliography', {
  //     entry: id,
  //     format: 'html',
  //     template: templateName,
  //     lang: localeName,
  //   });
  //   const parsed = processor.parse(html);
  //   const children: ElementContent[] = [];

  //   visit(parsed, 'element', (node) => {
  //     const className = String(node.properties.className || '');
  //     if (node.tagName === 'div' && className === 'csl-entry') {
  //       children.push(...node.children);
  //     }
  //     if (node.tagName === 'i') {
  //       node.tagName = 'em';
  //     }
  //   });

  //   const bibliography = processor
  //     .stringify({ type: 'root', children })
  //     .replace(/\\/g, '');

  //   acc[id] = { citation, bibliography };
  //   return acc;
  // }, {});
}
