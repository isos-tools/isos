// // sort-imports-ignore
// // @ts-expect-error
// import { startup } from '@mathjax/src/components/src/startup/init.js';
// // @ts-expect-error
// import { checkSre } from '@mathjax/src/components/src/a11y/util.js';
// // @ts-expect-error
// import { OutputUtil } from '@mathjax/src/components/src/output/util.js';
// // import { CONFIG } from '@mathjax/src/js/components/loader.js';
// import { SVG } from '@mathjax/src/js/output/svg.js';
// import { insert } from '@mathjax/src/js/util/Options.js';
// import { MathJaxNewcmFont } from '@mathjax/mathjax-newcm-font/js/svg.js';
// import { MathJaxFiraFont } from '@mathjax/mathjax-fira-font/js/svg.js';
// import { mathjax } from '@mathjax/src/js/mathjax.js';

// import { MathsFont } from '../../mdx-state';
// import { loadPackages } from './packages';
// import { fonts } from './fonts';

// export function loadMathJax(initialMathsFont: MathsFont) {
//   // const paths = CONFIG.paths || {};
//   // const basePath = 'https://cdn.jsdelivr.net/npm';
//   // paths.mathJax = `${basePath}/mathjax@4.0.0-beta.7`;
//   // paths['mathjax-termes'] = `${basePath}/mathjax-termes-font`;
//   // paths['mathjax-fira'] = `${basePath}/mathjax-fira-font`;

//   MathJax.config.startup.typeset = false;

//   const packages = loadPackages();
//   insert(MathJax.config.tex, { packages });

//   MathJax.config.tex.inlineMath = [['$', '$']];

//   const output = {
//     fonts: {
//       'mathjax-fira': { svg_ts: { MathJaxFiraFont } },
//       'mathjax-newcm': { svg_ts: { MathJaxNewcmFont } },
//     },
//   };
//   insert(MathJax._, { output }, false);

//   MathJax.setFont = (name: MathsFont) => {
//     const html = MathJax.startup.document;
//     html.outputJax = fonts[name];
//     html.outputJax.setAdaptor(html.adaptor);
//     return mathjax.handleRetriesFor(() => html.rerender());
//   };

//   if (initialMathsFont === 'computerModern') {
//     OutputUtil.config('svg', SVG, 'mathjax-newcm', MathJaxNewcmFont);
//     OutputUtil.loadFont(checkSre(startup), 'svg', 'mathjax-newcm', true);
//   } else {
//     OutputUtil.config('svg', SVG, 'mathjax-fira', MathJaxFiraFont);
//     OutputUtil.loadFont(checkSre(startup), 'svg', 'mathjax-fira', true);
//   }

//   // MathJax.config.svg.scale = 1.25;
// }
