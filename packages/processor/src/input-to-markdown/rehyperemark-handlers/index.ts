import { Element } from 'hast';
import { Handle, State } from 'hast-util-to-mdast';
import { Image } from 'mdast';

import { createCitation } from '../../plugins/bibliography/citation';
import { displayQuoteToBlockQuote } from '../../plugins/blockquote';
import { callouts } from '../../plugins/callout/callouts';
import { createCallout } from '../../plugins/callout/rehype-remark-callout';
import { rehypeRemarkPre } from '../../plugins/code/rehype-remark-pre';
import { createMakeTitle } from '../../plugins/cover/create-maketitle';
import { defListHastToMdast } from '../../plugins/definition-list';
import { createFramed } from '../../plugins/framed/input-to-md/html-to-md';
import { createAppendices } from '../../plugins/headings/rehype-appendices';
import { createSetCounter } from '../../plugins/headings/set-counter-to-directive';
import { createFigure } from '../../plugins/images/input-to-md/create-figure';
import {
  createInlineMaths,
  createMaths,
} from '../../plugins/maths/input-to-md/maths';
import {
  createEndnote,
  createFootnote,
  createPrintEndnotes,
  createSidenote,
} from '../../plugins/notes/input-to-md/html-to-md';
import { createReference } from '../../plugins/refs-and-counts/input-to-md/reference';
import { rehypeRemarkDel } from '../../plugins/strikethrough/rehypre-remark-del';
import { superSubHandlers } from '../../plugins/super-sub';
import { createTheorem } from '../../plugins/theorems-proofs/input-to-md/html-to-md';
import { createWarn, createWarnNode } from '../../plugins/warn/mdast-warn';
import { Context } from '../context';
import { createLabel } from './label';
import { createTitle } from './title';

export function createRehypeRemarkHandlers(
  ctx: Context,
): Record<string, Handle> {
  return {
    ...defListHastToMdast,

    div(state: State, node: Element) {
      return divHandler(ctx, state, node);
    },
    span(state: State, node: Element) {
      return spanHandler(ctx, state, node);
    },

    sup: superSubHandlers.sup,
    sub: superSubHandlers.sub,
    pre: rehypeRemarkPre,
    del: rehypeRemarkDel,

    // table: tableWithSpaceAround,
    // center: centerHandler,
    // img: imgHandler,
    img(state: State, node: Element) {
      const { src, alt, title, ...props } = node.properties;
      const result: Image = {
        type: 'image',
        url: String(src || ''),
        alt: String(alt || ''),
        title: String(title || ''),
        data: props,
      };
      state.patch(node, result);
      return result;
    },

    figure: figureHandler,
  };
}

function spanHandler(ctx: Context, state: State, node: Element) {
  const { className } = node.properties;

  if (Array.isArray(className)) {
    if (className.includes('inline-math')) {
      const result = createInlineMaths(node);
      state.patch(node, result);
      return result;
    }

    if (className.includes('macro-title')) {
      const result = createTitle(state, node);
      state.patch(node, result);
      return result;
    }

    if (
      className.includes('macro-maketitle') ||
      className.includes('macro-fancytitle')
    ) {
      const result = createMakeTitle();
      state.patch(node, result);
      return result;
    }

    // cleverref / zref-clever
    if (
      className.includes('macro-cref') ||
      className.includes('macro-zcref') ||
      className.includes('macro-autoref')
    ) {
      const result = createReference(state, node);
      state.patch(node, result);
      return result;
    }

    if (className.includes('macro-label')) {
      const result = createLabel(state, node);
      state.patch(node, result);
      return result;
    }

    // footnotes/sidenotes
    if (className.includes('macro-footnote')) {
      const result = createFootnote(state, node);
      state.patch(node, result);
      return result;
    }

    if (className.includes('macro-sidenote')) {
      const result = createSidenote(state, node);
      state.patch(node, result);
      return result;
    }

    if (className.includes('macro-endnote')) {
      const result = createEndnote(state, node);
      state.patch(node, result);
      return result;
    }

    if (className.includes('macro-printendnotes')) {
      const result = createPrintEndnotes();
      state.patch(node, result);
      return result;
    }

    // bibliography
    if (className.includes('macro-cite')) {
      const result = createCitation(state, node);
      state.patch(node, result);
      return result;
    }

    if (
      className.find((klass) => {
        return callouts.find((callout) => {
          return String(klass) === `macro-${callout}box`;
        });
      })
    ) {
      const result = createCallout(state, node);
      state.patch(node, result);
      return result;
    }

    if (className.includes('macro-setcounter')) {
      const result = createSetCounter(ctx, state, node);
      // @ts-expect-error
      state.patch(node, result);
      return result;
    }

    if (className.includes('macro-warn')) {
      const result = createWarnNode(state, node);
      state.patch(node, result);
      return result;
    }

    // if (className.includes('macro-tcblower')) {
    //   const result: ThematicBreak = { type: 'thematicBreak' };
    //   state.patch(node, result);
    //   return result;
    // }

    // if (className.includes('macro-fancysection')) {
    //   const result = createFancySection(state, node);
    //   state.patch(node, result);
    //   return result;
    // }

    // if (className.includes('macro-fancytitle')) {
    //   const result = createFancyTitle(ctx);
    //   state.patch(node, result);
    //   return result;
    // }

    // if (className.includes('underline')) {
    //   const result = createUnderline(state, node);
    //   state.patch(node, result);
    //   return result;
    // }

    // do nothing
    if (
      className.includes('macro-centering') ||
      className.includes('macro-maketitle') ||
      className.includes('macro-newpage') ||
      className.includes('macro-newline') ||
      className.includes('macro-vfill') ||
      className.includes('macro-pagebreak') ||
      className.includes('macro-tableofcontents')
    ) {
      return state.all(node);
    }

    // unsupported
    const macroName = className.find((str) =>
      String(str).startsWith('macro-'),
    ) as string;

    const unsupported = ['macro-ref', 'macro-eqref'];
    if (unsupported.includes(macroName)) {
      const name = macroName.slice(6);
      const result = createWarn('macro', name);
      state.patch(node, result);
      return result;
    }
  }

  // silently pass through
  return state.all(node);
}

function divHandler(ctx: Context, state: State, node: Element) {
  const { className } = node.properties;

  if (Array.isArray(className)) {
    if (className.includes('display-math')) {
      const result = createMaths(node);
      state.patch(node, result);
      return result;
    }

    if (className.includes('theorem')) {
      const theoremType = String(className[className.length - 1]);
      const theorem = ctx.frontmatter.theorems[theoremType];

      if (theorem && theorem.type === 'theorem') {
        const result = createTheorem(state, node, theoremType, ctx);
        state.patch(node, result);
        return result;
      }

      // unhandled
      // const result = createWarn(node, 'theorem', theoremType);
      // state.patch(node, result);
      // return result;
    }

    if (className.includes('environment')) {
      const classes = className.filter((name) => name !== 'environment');
      const environmentName = String(classes[0]);

      if (environmentName === 'displayquote') {
        return displayQuoteToBlockQuote(state, node);
      }

      // if (environmentName === 'tikzpicture') {
      //   const result: Text = { type: 'text', value: '' };
      //   state.patch(node, result);
      //   return result;
      // }

      if (['framed', 'mdframed'].includes(environmentName)) {
        const result = createFramed(state, node);
        // console.log(result);
        state.patch(node, result);
        // console.log(state);
        return result;
      }

      if (environmentName === 'appendices') {
        const result = createAppendices(state, node);
        state.patch(node, result);
        return result;
      }

      // do nothing
      if (environmentName === 'table') {
        return state.all(node);
      }

      // unsupported
      const unsupported = ['eqnarray', 'eqnarray*', 'tikzpicture'];
      if (unsupported.includes(environmentName)) {
        const result = createWarn('environment', environmentName);
        state.patch(node, result);
        return result;
      }

      // unhandled
      // const result = createWarn(node, 'environment', environmentName);
      // state.patch(node, result);
      // return result;
    }
  }

  // silently pass through
  return state.all(node);
}

function figureHandler(state: State, node: Element) {
  const { className } = node.properties;

  if (Array.isArray(className)) {
    if (className.includes('environment')) {
      const classes = className.filter((name) => name !== 'environment');
      const environmentName = String(classes[0]);

      if (environmentName === 'figure') {
        // console.dir(node, { depth: null });
        const result = createFigure(state, node);
        state.patch(node, result);
        return result;
      }
    }
  }

  return state.all(node);
}

// function centerHandler(state: State, node: Element) {
//   return [
//     {
//       type: 'text',
//       value: '\n\n',
//     },
//     {
//       type: 'containerDirective',
//       name: 'center',
//       children: [
//         {
//           type: 'paragraph',
//           children: state.all(node) as PhrasingContent[],
//         },
//       ],
//     },
//     {
//       type: 'text',
//       value: '\n\n',
//     },
//   ];
// }
