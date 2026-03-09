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

    // encode title image in frontmatter
    const { titleImage } = ctx.frontmatter;
    if (titleImage) {
      const fullPath = getFullPath(ctx, titleImage);
      const data = ctx.fileCache.getContent(fullPath);
      if (data !== null) {
        ctx.frontmatter.titleImage = data;
      }
    }

    visit(tree, 'image', (node) => {
      nodes.push(node);
    });

    for (const node of nodes) {
      if (node.url.startsWith('data')) {
        // already inlined
        continue;
      }

      // with latex, if no extension is given, default to .pdf
      const fullPath = getFullPath(ctx, node.url);

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

    // console.dir(tree, { depth: null });
  };
}

function getFullPath(ctx: Context, url: string) {
  const dir = dirname(ctx.srcFilePath);
  const imagePath = resolve(dir, url);

  // with latex, if no extension is given, default to .pdf
  return ctx.type === 'latex' ? normaliseImagePath(imagePath) : imagePath;
}

function normaliseImagePath(imagePath: string) {
  const { dir, name, ext } = parse(imagePath);
  return join(dir, `${name}${ext || '.pdf'}`);
}
