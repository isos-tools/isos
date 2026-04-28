// import { Element, ElementContent, Root } from 'hast';
// import { visit } from 'unist-util-visit';

// export function replaceFootnoteDefinitions() {
//   return (tree: Root) => {
//     visit(tree, 'element', (node) => {
//       if (node.tagName === 'section') {
//         const { className } = node.properties;
//         if (Array.isArray(className) && className.includes('footnotes')) {
//           const ol = node.children.find((o) => {
//             return o.type === 'element' && o.tagName === 'ol';
//           }) as Element;
//           if (ol) {
//             const listItems = ol.children.filter((o) => {
//               return o.type === 'element' && o.tagName === 'li';
//             }) as Element[];
//             listItems.forEach((listItem) => {
//               const id = String(listItem.properties.id || '');
//               listItem.properties.id = id.replace(/^user-content-/, '');
//               replaceSup(listItem);
//               replaceBackLink(listItem);
//             });
//             Object.assign(node, {
//               properties: {
//                 className: ['footnotes'],
//               },
//               children: [
//                 {
//                   type: 'element',
//                   tagName: 'h2',
//                   children: [
//                     {
//                       type: 'text',
//                       value: 'Footnotes',
//                     },
//                   ],
//                 },
//                 {
//                   type: 'element',
//                   tagName: 'ol',
//                   children: listItems.map((o) => ({
//                     type: 'element',
//                     tagName: 'li',
//                     properties: {
//                       id: o.properties.id,
//                     },
//                     children: o.children,
//                   })),
//                 },
//               ],
//             });
//           }
//         }
//       }
//     });
//   };
// }

// function replaceSup(node: Element) {
//   const firstP = node.children.find(
//     (o) => o.type === 'element' && o.tagName === 'p',
//   ) as Element;

//   const extracted = firstP.children.find(isSup) as Element;
//   console.log(firstP.children, extracted);
//   // const href = String(extracted.properties.href || '');
//   // const refId = href.replace(/^#user-content-fnref-(.+)$/, '$1');

//   // firstP.children = [
//   //   ...firstP.children.filter((o) => !isSup(o)),
//   //   createSup(refId),
//   // ];
// }

// function isSup(node: ElementContent) {
//   return node.type === 'element' && node.tagName === 'sup';
// }

// function createSup(identifier: string): Element {
//   return {
//     type: 'element',
//     tagName: 'sup',
//     properties: {
//       href: `#fn-${identifier}`,
//       // ariaLabel: 'Back to reference 2',
//       // className: [ 'footnote-backref' ]
//     },
//     children: [{ type: 'text', value: '↩' }],
//   };
// }

// function replaceBackLink(node: Element) {
//   const lastP = node.children.findLast(
//     (o) => o.type === 'element' && o.tagName === 'p',
//   ) as Element;

//   const extracted = lastP.children.find(isBackRef) as Element;
//   const href = String(extracted.properties.href || '');
//   const refId = href.replace(/^#user-content-fnref-(.+)$/, '$1');

//   lastP.children = [
//     ...lastP.children.filter((o) => !isBackRef(o)),
//     createBackLink(refId),
//   ];
// }

// function isBackRef(node: ElementContent) {
//   if (node.type === 'element' && node.tagName === 'a') {
//     const { className } = node.properties;
//     if (
//       Array.isArray(className) &&
//       className.includes('data-footnote-backref')
//     ) {
//       return true;
//     }
//   }
//   return false;
// }

// function createBackLink(identifier: string): Element {
//   return {
//     type: 'element',
//     tagName: 'a',
//     properties: {
//       href: `#fn-ref-${identifier}`,
//       // ariaLabel: 'Back to reference 2',
//       // className: [ 'footnote-backref' ]
//     },
//     children: [{ type: 'text', value: '↩' }],
//   };
// }
