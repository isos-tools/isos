// // sort-imports-ignore
// import { SVG } from '@mathjax/src/js/output/svg.js';
// import type { OutputJax } from '@mathjax/src/js/core/OutputJax.js';

// import { MathJaxNewcmFont } from '@mathjax/mathjax-newcm-font/js/svg.js';
// import '@mathjax/mathjax-newcm-font/js/svg/dynamic/arrows.js';
// import '@mathjax/mathjax-newcm-font/js/svg/dynamic/double-struck.js';

// import { MathJaxFiraFont } from '@mathjax/mathjax-fira-font/js/svg.js';
// import '@mathjax/mathjax-fira-font/js/svg/dynamic/arrows.js';
// import '@mathjax/mathjax-fira-font/js/svg/dynamic/double-struck.js';

// import { MathsFont } from '../../mdx-state';

// type Output = OutputJax<HTMLElement, Text, Document>;

// type Fonts = Record<MathsFont, Output>;

// export const fonts: Partial<Fonts> = {
//   fira: new SVG({
//     ...MathJax.config.svg,
//     font: '[mathjax-fira]',
//     dynamicPrefix: '[mathjax-fira]/svg/dynamic',
//     fontData: MathJaxFiraFont,
//   }),
//   computerModern: new SVG({
//     ...MathJax.config.svg,
//     font: '[mathjax-newcm]',
//     dynamicPrefix: '[mathjax-newcm]/svg/dynamic',
//     fontData: MathJaxNewcmFont,
//   }),
// };

// const fontPackages = ['double-struck', 'arrows'];

// fontPackages.forEach((fontPackage) => {
//   // @ts-expect-error
//   MathJaxTermesFont.dynamicFiles[fontPackage].setup(fonts.termes.font);
//   // @ts-expect-error
//   MathJaxFiraFont.dynamicFiles[fontPackage].setup(fonts.fira.font);
// });
