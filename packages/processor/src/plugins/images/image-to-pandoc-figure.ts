import { InlineCode, Root } from 'mdast';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import strip from 'strip-markdown';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { Context } from '../../input-to-markdown/context';
import { serialiseAttributes } from './formatted-caption';

export function imageToPandocFigure(_ctx: Context) {
  return (tree: Root) => {
    // console.log(ctx.base64Images);
    // console.log('mdast: imageToPandocFigure');
    // console.dir(tree, { depth: null });
    visit(tree, 'image', (node, idx = 0, parent) => {
      node.alt = getText(node.alt);
      const children = parent?.children || [];
      const data = (node.data || {}) as Record<string, string>;
      const attrs: Record<string, string> = {
        alt: getText(node.alt),
        caption: node.title || '',
        ...data,
      };

      const inlineCode: InlineCode = {
        type: 'inlineCode',
        value: serialiseAttributes(attrs),
      };

      if (inlineCode.value) {
        children.splice(idx + 1, 0, inlineCode);
        node.alt = null;
        node.title = null;
      }
    });
  };
}

function getText(markdown?: string | null) {
  if (!markdown) return '';

  const processor = unified()
    .use(remarkParse)
    .use(strip)
    .use(remarkStringify);

  return String(processor.processSync(markdown)).trim();
}
