// sort-imports-ignore
import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js';
import { MathML } from '@mathjax/src/js/input/mathml.js';
import { mathjax } from '@mathjax/src/js/mathjax.js';
import { SVG } from '@mathjax/src/js/output/svg.js';

import { MathJaxBbmFontExtension } from '@mathjax/mathjax-bbm-font-extension/js/svg.js';

import { MathJaxNewcmFont } from '@mathjax/mathjax-newcm-font/js/svg.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/arrows.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/calligraphic.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/double-struck.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/sans-serif.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/shapes.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/fraktur.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/script.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/monospace.js';
import '@mathjax/mathjax-newcm-font/js/svg/dynamic/math.js';

import { MathJaxFiraFont } from '@mathjax/mathjax-fira-font/js/svg.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/arrows.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/calligraphic.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/double-struck.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/sans-serif.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/shapes.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/fraktur.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/script.js';
import '@mathjax/mathjax-fira-font/js/svg/dynamic/monospace.js';
// import '@mathjax/mathjax-fira-font/js/svg/dynamic/math-other.js';

import { LayoutOptions } from '.';
import { MathsFont, MathsState } from '../../mdx-state';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const htmlDoc = mathjax.document('', {
  InputJax: new MathML(),
});

MathJaxNewcmFont.addExtension(MathJaxBbmFontExtension);
MathJaxFiraFont.addExtension(MathJaxBbmFontExtension);

const NewcmFont = new MathJaxNewcmFont();
const FiraFont = new MathJaxFiraFont();

const packages = [
  'arrows',
  'calligraphic',
  'double-struck',
  'sans-serif',
  'shapes',
  'fraktur',
  'script',
  'monospace',
  'math',
];

packages.forEach((name) => {
  // @ts-expect-error Property 'dynamicFiles' is protected
  MathJaxNewcmFont.dynamicFiles[name].setup(NewcmFont);

  if (name !== 'math') {
    // @ts-expect-error Property 'dynamicFiles' is protected
    MathJaxFiraFont.dynamicFiles[name].setup(FiraFont);
  }
});

const fontOptions = {
  displayOverflow: 'linebreak',
};

const fonts: Record<MathsFont, any> = {
  computerModern: new SVG({ ...fontOptions, fontData: NewcmFont }),
  fira: new SVG({ ...fontOptions, fontData: FiraFont }),
};

export function mmlToSvg(
  mml: string,
  options: MathsState,
  layoutOptions: LayoutOptions,
) {
  try {
    htmlDoc.outputJax = fonts[options.mathsFontName.value];
    htmlDoc.outputJax.setAdaptor(htmlDoc.adaptor);

    const htmlNode = htmlDoc.convert(mml, {
      // https://github.com/mathjax/MathJax/issues/3434
      containerWidth: mml.includes('\\begin{multiline}')
        ? layoutOptions.containerWidth
        : undefined,
    });
    const svg = htmlNode.children[0];

    const html = adaptor.outerHTML(svg);

    const match = html.match(/data-mjx-error="(.*?)"/);
    if (match !== null) {
      console.log('mathjax:', match[1]);
      return {
        error: true,
        html: `mathjax: ${match[1]}`,
      };
    }

    return {
      error: false,
      html,
    };
  } catch (err) {
    return {
      error: true,
      html: `mathjax: ${String(err)}`,
    };
  }
}
