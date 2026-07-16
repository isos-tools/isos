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

export type MathsFont = 'computerModern' | 'fira';

export type MmlToSvgOptions = {
  font: MathsFont;
  display: boolean;
  width?: number;
};

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

export function mmlToSvg(mml: string, options?: Partial<MmlToSvgOptions>) {
  try {
    const outputOptions = {
      displayOverflow: 'linebreak',
      fontCache: 'none',
      postFilters: [
        ({ data }) => {
          data.attributes.display = options?.display ? 'true' : 'false';
        },
      ],
    };
    const fonts: Record<MathsFont, any> = {
      computerModern: new SVG({
        ...outputOptions,
        scale: 1.08,
        fontData: NewcmFont,
      }),
      fira: new SVG({
        ...outputOptions,
        scale: 1.2,
        fontData: FiraFont,
      }),
    };

    htmlDoc.outputJax = fonts[options?.font || 'computerModern'];
    htmlDoc.outputJax.setAdaptor(htmlDoc.adaptor);

    const htmlNode = htmlDoc.convert(mml, {
      // https://github.com/mathjax/MathJax/issues/3434
      containerWidth: options?.width || undefined,
      // em: 50,
      // ex: 50,
      // display: false,
      // scale: 20,
      // lineWidth: 10,
      // lineHeight: 10,
      // lineSpacing: 10,
    });

    if (htmlNode?.children?.length > 0) {
      const svg = htmlNode.children[0];
      const html = adaptor.outerHTML(svg);

      const match = html.match(/data-mjx-error="(.*?)"/);
      if (match !== null) {
        if (process.env.NODE_ENV !== 'test') {
          console.log('mathjax svg error:', match[1]);
        }
        return {
          error: true,
          html: `mathjax svg error: ${match[1]}`,
        };
      }
      return {
        error: false,
        html: htmlNode,
      };
    }
    return {
      error: false,
      html: '',
    };
  } catch (err) {
    return {
      error: true,
      html: `mathjax mml error: ${String(err)}`,
    };
  }
}
