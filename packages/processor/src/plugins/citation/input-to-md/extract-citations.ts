// import { Root } from '@unified-latex/unified-latex-types';
// import { pgfkeysArgToObject } from '@unified-latex/unified-latex-util-pgfkeys';
// import { toString } from '@unified-latex/unified-latex-util-to-string';
// import { visit } from '@unified-latex/unified-latex-util-visit';
// import kebabCase from 'lodash.kebabcase';

// import { getFormattedCitations } from '@isos/citations';
// import { printRaw } from '@isos/unified-latex-util-print-raw';

// import { Context } from '../../../input-to-markdown/context';

// export function extractCitations(ctx: Context) {
//   return async (tree: Root) => {
//     const citations: Record<string, string>[] = [];

//     visit(tree, (node) => {
//       if (node.type === 'environment' && node.env === 'biblist') {
//         for (const item of node.content) {
//           if (item.type === 'macro' && item.content === 'bib') {
//             const args = item.args || [];
//             const id = kebabCase(toString(args[0].content).trim());
//             const type = toString(args[1].content).trim();
//             const obj = pgfkeysArgToObject(args[2].content);

//             const cite = Object.entries(obj).reduce(
//               (acc: Record<string, string>, [k, v]) => {
//                 acc[k] = printRaw(v).trim();
//                 return acc;
//               },
//               {},
//             );

//             citations.push({ id, type, ...cite });
//           }
//         }
//       }
//     });

//     // console.log(citations);

//     // const refs = citations.map((o) => ({
//     //   id: o.id,
//     //   type: o.type,
//     //   ...o.cite,
//     // }));

//     // console.log(await getFormattedCitations(citations));
//   };
// }

// // async function convertToMarkdown(str: string) {
// //   const ctx = createTestContext('latex', str);
// //   const options = createDefaultOptions(ctx);
// //   // console.log(ctx.content);
// //   const markdown = await inputToMarkdown(ctx.content, options);
// //   // console.log(markdown);
// //   return markdown;
// // }
