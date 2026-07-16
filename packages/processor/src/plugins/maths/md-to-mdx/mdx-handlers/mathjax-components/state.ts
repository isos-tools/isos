// import { createContext } from 'preact';

// import { MathsFont } from '../../mdx-state';
// import { loadMathJax } from './load-mathjax';

// export type MathJaxComponentState = {
//   queueMathJaxRender: (
//     element: HTMLSpanElement,
//     mathsFont: MathsFont,
//   ) => Promise<void>;
// };

// export const MathsElementsContext = createContext(createState());

// function createState(): MathJaxComponentState {
//   const state = {
//     initialised: false,
//     priority: [] as HTMLElement[],
//     rest: [] as HTMLElement[],
//   };

//   return {
//     async queueMathJaxRender(
//       element: HTMLSpanElement,
//       mathsFont: MathsFont,
//     ) {
//       if (await hasPriority(element)) {
//         state.priority.push(element);
//       } else {
//         state.rest.push(element);
//       }

//       debounce(async () => {
//         const priority = [...state.priority];
//         const rest = [...state.rest];

//         state.priority = [];
//         state.rest = [];

//         if (!state.initialised) {
//           loadMathJax(mathsFont);
//           state.initialised = true;
//         }

//         await MathJax.startup.promise;

//         if (priority.length) {
//           await MathJax.typesetPromise(priority);
//           console.log(
//             `mathjax: typeset ${priority.length} priority items`,
//           );
//         }

//         if (rest.length) {
//           await MathJax.typesetPromise(rest);
//           console.log(`mathjax: typeset ${rest.length} items`);

//           // for (const elements of chunk(rest, 200)) {
//           //   await MathJax.typesetPromise(elements);
//           //   console.log(`mathjax: typeset ${elements.length} items`);
//           // }

//           // await Promise.all(
//           //   chunk(rest, 200).map(async (elements) => {
//           //     await MathJax.typesetPromise(elements);
//           //     console.log(`mathjax: typeset ${elements.length} items`);
//           //   }),
//           // );
//         }
//       }, 100);
//     },
//   };
// }

// function hasPriority(element: HTMLElement): Promise<boolean> {
//   return new Promise((resolve) => {
//     const observer = new IntersectionObserver(([entry]) => {
//       const { y } = entry.boundingClientRect;
//       const height = entry.rootBounds?.height || 0;
//       const isPriority = y > 0 && y < height * 2;
//       resolve(isPriority);
//       observer.unobserve(entry.target);
//     });
//     observer.observe(element);
//   });
// }

// let timer: ReturnType<typeof setTimeout>;

// function debounce(fn: () => unknown, delay: number) {
//   clearTimeout(timer);
//   timer = setTimeout(fn, delay);
// }

// // function chunk(list: HTMLElement[], size: number) {
// //   return list.reduce((acc: HTMLElement[][], item, idx) => {
// //     if (idx % size === 0) {
// //       acc.push([item]);
// //     } else {
// //       acc[acc.length - 1].push(item);
// //     }
// //     return acc;
// //   }, []);
// // }
