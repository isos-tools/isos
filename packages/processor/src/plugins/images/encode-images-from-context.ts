import { Image, Root } from 'mdast';
import { dirname, join, parse, resolve } from 'pathe';
import { visit } from 'unist-util-visit';

import { Context } from '../../input-to-markdown/context';
import { Options } from '../../input-to-markdown/options';

// const supportedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

export function encodeImagesFromContext(ctx: Context, options: Options) {
  return async (tree: Root) => {
    // console.log(ctx.fileCache.getStore());
    // console.log('inlineImages', options.noInlineImages);
    if (options.noInlineImages) {
      return;
    }
    const nodes: Image[] = [];

    visit(tree, 'image', (node) => {
      nodes.push(node);
    });

    const dir = dirname(ctx.srcFilePath);

    for (const node of nodes) {
      const imagePath = resolve(dir, node.url);

      if (node.url.startsWith('data')) {
        // already inlined
        continue;
      }

      // with latex, if no extension is given, default to .pdf
      const fullPath =
        ctx.type === 'latex' ? normaliseImagePath(imagePath) : imagePath;

      const data = ctx.fileCache.getContent(fullPath);

      if (data !== null) {
        node.url = data;
        continue;
      }

      const error = ctx.fileCache.getError(fullPath);

      if (error !== null) {
        Object.assign(node, {
          type: 'textDirective',
          name: 'warn',
          children: [
            {
              type: 'text',
              value: data,
            },
          ],
        });
      }
    }
  };
}

function normaliseImagePath(imagePath: string) {
  const { dir, name, ext } = parse(imagePath);
  return join(dir, `${name}${ext || '.pdf'}`);
}
