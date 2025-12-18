import * as Ast from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
// import { toString } from '@unified-latex/unified-latex-util-to-string';
import { visit } from '@unified-latex/unified-latex-util-visit';
import { Element, Text } from 'hast';
import { Handle, State } from 'hast-util-to-mdast';
import { InlineMath } from 'mdast-util-math';
import rehypeRemark from 'rehype-remark';
import remarkMath from 'remark-math';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

import { unifiedLatexToHast } from '@isos/unified-latex-to-hast';
import { printRaw } from '@isos/unified-latex-util-print-raw';

export function figureToImage() {
  return (tree: Ast.Root) => {
    // console.log('latex: figureToImage');
    // console.dir(tree, { depth: null });
    visit(tree, (node) => {
      if (node.type === 'environment' && node.env === 'figure') {
        const img = extractImage(node);
        if (img !== null) {
          const args = img.args || [];
          const label = extractLabel(node);
          if (label !== null) {
            const text = extractText(label);
            if (args[1]) {
              args[1].content.push({
                type: 'string',
                content: `id="${text}"`,
              });
            }
          }
          const caption = extractCaption(node);
          if (caption !== null) {
            const text = extractCaptionText(caption);
            if (args[1]) {
              args[1].content.push({
                type: 'string',
                content: `caption="${text}"`,
              });
            }
          }
        }
      }
    });
  };
}

function extractImage(figure: Ast.Node): Ast.Macro | null {
  let image = null;
  visit(figure, (node) => {
    if (node.type === 'macro' && node.content === 'includegraphics') {
      image = node;

      // remove image
      // const parent = info.parents[0];
      // if (parent && parent.type === 'environment') {
      //   parent.content.splice(info.index || 0, 1);
      // }
    }
  });
  return image;
}

function extractLabel(figure: Ast.Node): Ast.Macro | null {
  let label = null;
  visit(figure, (node, info) => {
    if (node.type === 'macro' && node.content === 'label') {
      label = node;

      // remove label
      const parent = info.parents[0];
      if (parent && parent.type === 'environment') {
        parent.content.splice(info.index || 0, 1);
      }
    }
  });
  return label;
}

function extractCaption(figure: Ast.Node): Ast.Macro | null {
  let caption = null;
  visit(figure, (node, info) => {
    if (node.type === 'macro' && node.content === 'caption') {
      caption = node;

      // remove caption
      // const parent = info.parents[0];
      // if (parent && parent.type === 'environment') {
      //   parent.content.splice(info.index || 0, 1);
      // }
    }
  });
  return caption;
}

function extractCaptionText(caption: Ast.Macro) {
  // necessary to convert to markdown and keep consistent maths formatting
  const handlers: Record<string, Handle> = {
    span(state: State, node: Element) {
      const { className } = node.properties;
      if (Array.isArray(className)) {
        if (className.includes('inline-math')) {
          const math = node.children[0] as Text;
          const result: InlineMath = {
            type: 'inlineMath',
            value: math.value,
          };
          state.patch(node, result);
          return result;
        }
      }
      return state.all(node);
    },
  };

  const processor = unified()
    .use(unifiedLatexToHast)
    .use(rehypeRemark, { handlers })
    .use(remarkMath)
    .use(remarkStringify);

  const args = getArgsContent(caption);
  const root: Ast.Root = {
    type: 'root',
    content: args[args.length - 1] || [],
  };
  const transformed = processor.runSync(root);
  return processor.stringify(transformed).trim();
}

function extractText(caption: Ast.Macro) {
  const args = getArgsContent(caption);
  return printRaw(args[args.length - 1] || []).trim();
}
