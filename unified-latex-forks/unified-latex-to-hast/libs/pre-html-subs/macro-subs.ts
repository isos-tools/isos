import { xcolorMacroToHex } from '@unified-latex/unified-latex-ctan/package/xcolor';
import * as Ast from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { VisitInfo } from '@unified-latex/unified-latex-util-visit';

import { htmlLike } from '@isos/unified-latex-util-html-like';
import { printRaw } from '@isos/unified-latex-util-print-raw';

/**
 * Factory function that generates html-like macros that wrap their contents.
 */
function factory(
  tag: string,
  attributes?: Record<string, string>,
): (macro: Ast.Macro) => Ast.Macro {
  return (macro) => {
    if (!macro.args) {
      throw new Error(
        `Found macro to replace but couldn't find content ${printRaw(
          macro,
        )}`,
      );
    }
    // Assume the meaningful argument is the last argument. This
    // ensures that we can convert for default packages as well as
    // packages like beamer, which may add optional arguments.
    const args = getArgsContent(macro);
    const content = args[args.length - 1] || [];
    return htmlLike({ tag, content, attributes });
  };
}

type Attrs = {
  className: string;
};

function createHeading(tag: string, attrs: Attrs) {
  return (macro: Ast.Macro) => {
    const args = getArgsContent(macro);
    const starred = !!args[0];
    let className = attrs.className;
    if (starred) {
      className += ' starred';
    }
    return htmlLike({
      tag,
      content: args[args.length - 1] || [],
      attributes: { className },
    });
  };
}

export const macroReplacements: Record<
  string,
  (node: Ast.Macro, info: VisitInfo) => Ast.Node
> = {
  emph: factory('em', { className: 'emph' }),
  textrm: factory('span', { className: 'textrm' }),
  textsf: factory('span', { className: 'textsf' }),
  texttt: factory('span', { className: 'texttt' }),
  textsl: factory('span', { className: 'textsl' }),
  textit: factory('i', { className: 'textit' }),
  textbf: factory('b', { className: 'textbf' }),
  sout: factory('del', { className: 'sout' }),
  textsuperscript: factory('sup'),
  textsubscript: factory('sub'),
  underline: factory('span', { className: 'underline' }),
  mbox: factory('span', { className: 'mbox' }),
  phantom: factory('span', { className: 'phantom' }),
  part: createHeading('h1', { className: 'section-part' }),
  chapter: createHeading('h2', { className: 'section-chapter' }),
  section: createHeading('h3', { className: 'section-section' }),
  subsection: createHeading('h4', { className: 'section-subsection' }),
  subsubsection: createHeading('h5', {
    className: 'section-subsubsection',
  }),
  paragraph: createHeading('h6', { className: 'section-paragraph' }),
  subparagraph: createHeading('h6', { className: 'section-subparagraph' }),
  appendix: createHeading('h2', { className: 'appendix' }),
  smallskip: () =>
    htmlLike({
      tag: 'br',
      attributes: { className: 'smallskip' },
    }),
  medskip: () =>
    htmlLike({
      tag: 'br',
      attributes: { className: 'medskip' },
    }),
  bigskip: () =>
    htmlLike({
      tag: 'br',
      attributes: { className: 'bigskip' },
    }),
  '\n': () =>
    htmlLike({
      tag: 'br',
      attributes: { className: 'literal-newline' },
    }),
  url: (node) => {
    const args = getArgsContent(node);
    const url = printRaw(args[0] || '#');
    return htmlLike({
      tag: 'a',
      attributes: {
        className: 'url',
        href: url,
      },
      content: [{ type: 'string', content: url }],
    });
  },
  href: (node) => {
    const args = getArgsContent(node);
    const url = printRaw(args[1] || '#');
    return htmlLike({
      tag: 'a',
      attributes: {
        className: 'href',
        href: url,
      },
      content: args[2] || [],
    });
  },
  hyperref: (node) => {
    const args = getArgsContent(node);
    const url = '#' + printRaw(args[0] || '');
    return htmlLike({
      tag: 'a',
      attributes: {
        className: 'href',
        href: url,
      },
      content: args[1] || [],
    });
  },
  '\\': () =>
    htmlLike({
      tag: 'br',
      attributes: { className: 'linebreak' },
    }),
  vspace: (node) => {
    const args = getArgsContent(node);
    return htmlLike({
      tag: 'div',
      attributes: {
        className: 'vspace',
        'data-amount': printRaw(args[1] || []),
      },
      content: [],
    });
  },
  hspace: (node) => {
    const args = getArgsContent(node);
    return htmlLike({
      tag: 'span',
      attributes: {
        className: 'vspace',
        'data-amount': printRaw(args[1] || []),
      },
      content: [],
    });
  },
  textcolor: (node) => {
    const args = getArgsContent(node);
    const computedColor = xcolorMacroToHex(node);
    const color = computedColor.hex;

    if (color) {
      return htmlLike({
        tag: 'span',
        attributes: { style: `color: ${color};` },
        content: args[2] || [],
      });
    } else {
      // If we couldn't compute the color, it's probably a named
      // color that wasn't supplied. In this case, we fall back to a css variable
      return htmlLike({
        tag: 'span',
        attributes: {
          style: `color: var(${computedColor.cssVarName});`,
        },
        content: args[2] || [],
      });
    }
  },
  textsize: (node) => {
    const args = getArgsContent(node);
    const textSize = printRaw(args[0] || []);
    return htmlLike({
      tag: 'span',
      attributes: {
        className: `textsize-${textSize}`,
      },
      content: args[1] || [],
    });
  },
  makebox: (node) => {
    const args = getArgsContent(node);
    return htmlLike({
      tag: 'span',
      attributes: {
        className: `latex-box`,
        style: 'display: inline-block;',
      },
      content: args[3] || [],
    });
  },
  noindent: () => ({ type: 'string', content: '' }),
  includegraphics: (node) => {
    const args = getArgsContent(node);
    const src = printRaw(args[args.length - 1] || []);
    return htmlLike({
      tag: 'img',
      attributes: {
        className: 'includegraphics',
        src,
      },
      content: [],
    });
  },
};
