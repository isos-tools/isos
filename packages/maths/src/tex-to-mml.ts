import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js';
import { STATE } from '@mathjax/src/js/core/MathItem.js';
import { SerializedMmlVisitor } from '@mathjax/src/js/core/MmlTree/SerializedMmlVisitor.js';
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js';
import { TeX } from '@mathjax/src/js/input/tex.js';
import { mathjax } from '@mathjax/src/js/mathjax.js';

// TeX packages
import '@mathjax/src/js/input/tex/base/BaseConfiguration.js';
import '@mathjax/src/js/input/tex/gensymb/GensymbConfiguration.js';
import '@mathjax/src/js/input/tex/color/ColorConfiguration.js';
import '@mathjax/src/js/input/tex/html/HtmlConfiguration.js';
import '@mathjax/src/js/input/tex/cancel/CancelConfiguration.js';
import '@mathjax/src/js/input/tex/ams/AmsConfiguration.js';
import '@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import '@mathjax/src/js/input/tex/configmacros/ConfigMacrosConfiguration.js';
import '@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js';
import '@mathjax/src/js/input/tex/textcomp/TextcompConfiguration.js';
import '@mathjax/src/js/input/tex/color/ColorConfiguration.js';
import '@mathjax/src/js/input/tex/extpfeil/ExtpfeilConfiguration.js';
import '@mathjax/src/js/input/tex/upgreek/UpgreekConfiguration.js';
import '@mathjax/src/js/input/tex/mathtools/MathtoolsConfiguration.js';
import '@mathjax/src/js/input/tex/bbm/BbmConfiguration.js';
import '@mathjax/src/js/input/tex/tagformat/TagFormatConfiguration.js';
import './siunitx/siunitx';

const adaptor = liteAdaptor();
const visitor = new SerializedMmlVisitor();
RegisterHTMLHandler(adaptor);

const packages = [
  'base',
  'tagformat',
  'siunitx',
  'gensymb',
  'color',
  'html',
  'cancel',
  'ams',
  'newcommand',
  'configmacros',
  'boldsymbol',
  'textcomp',
  'extpfeil',
  'upgreek',
  'mathtools',
  'bbm',
];

export function texToMml(latex: string) {
  const TO_INCREMENT = 'eq-count';

  try {
    const tex = new TeX({
      tags: 'ams',
      packages,
      inlineMath: [['$', '$']],
      macros: {
        pounds: '\\textsterling',
        bm: ['{\\boldsymbol #1}', 1],
        colonequals: '\\coloneq',
        hdots: '\\ldots',
        ensuremath: ['#1', 1],
        ref: [`\\href{#1}{}`, 1],
        eqref: [`\\href{#1}{}`, 1],
      },
      tagformat: {
        number: () => TO_INCREMENT,
        tag: (tag: string) => tag,
        id: (id: string) => id,
      },
      preFilters: [
        // @ts-expect-error
        ({ math }) => {
          math.math = math.math.replace(
            /\\(cref|zcref|autoref){/g,
            '\\ref{',
          );
        },
      ],
      postFilters: [
        // @ts-expect-error
        ({ data }) => {
          const labels = data.tags.labels;

          const rows = data.getList('mlabeledtr');
          for (const row of rows) {
            if (row.childNodes.length > 0) {
              const tag = row.childNodes[0];
              const id = tag.attributes.get('id');
              tag.attributes.unset('id');
              tag.attributes.set('class', 'eq-count');

              let tagValue = '';
              if (typeof id === 'string' && labels[id]) {
                tag.attributes.set('data-id', id);
                tagValue = labels[id].tag;
              } else {
                tagValue = String(id);
              }

              if (tagValue === TO_INCREMENT) {
                tag.childNodes = [];
              } else {
                tag.attributes.set('data-tag', tagValue);
              }
            }
          }
        },
      ],
    });

    const mmlDoc = mathjax.document('', {
      InputJax: tex,
    });

    const mmlNode = mmlDoc.convert(latex, { end: STATE.CONVERT });
    const mml = visitor.visitTree(mmlNode);
    // console.log(mml);
    return {
      error: false,
      mml,
    };
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log('mathjax tex error:', err);
    }
    return {
      error: true,
      mml: `mathjax tex error: ${String(err)}`,
    };
  }
}
