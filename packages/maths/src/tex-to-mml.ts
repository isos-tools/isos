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
import './siunitx/siunitx';

const adaptor = liteAdaptor();
const visitor = new SerializedMmlVisitor();
RegisterHTMLHandler(adaptor);

const packages = [
  'base',
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

const tex = new TeX({
  packages,
  macros: {
    pounds: '\\textsterling',
    bm: ['{\\boldsymbol #1}', 1],
    colonequals: '\\coloneq',
    hdots: '\\ldots',
    ensuremath: ['#1', 1],
  },
});

const mmlDoc = mathjax.document('', {
  InputJax: tex,
});

export function texToMml(latex: string) {
  try {
    // https://docs.mathjax.org/en/latest/advanced/typeset.html
    // multiply-defined labels
    tex.reset();

    const mmlNode = mmlDoc.convert(latex, { end: STATE.CONVERT });
    return {
      error: false,
      mml: visitor.visitTree(mmlNode),
    };
  } catch (err) {
    return {
      error: true,
      mml: `mathjax error: ${String(err)}`,
    };
  }
}
