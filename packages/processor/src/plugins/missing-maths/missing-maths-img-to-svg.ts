import { Element, Root } from 'hast';
import rehypeParse from 'rehype-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export function missingMathsImageToSvg() {
  return (tree: Root) => {
    // console.log('hast: addDefaultAltText');
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        if (
          typeof node.properties.alt !== 'string' ||
          node.properties.alt === ''
        ) {
          node.properties.alt = 'Image';
        }

        const classNames = node.properties.class;
        if (
          Array.isArray(classNames) &&
          classNames.includes('missing-maths')
        ) {
          const src = String(node.properties.src);
          if (src.startsWith('data:image/svg+xml')) {
            const decodedString = atob(fromUrl(src));
            const processor = unified().use(rehypeParse);
            const ast = processor.parse(decodedString);

            const svg = extractSvg(ast);
            // console.log(svg);

            if (svg !== null) {
              const code = wrapSvg(svg);
              code.properties['aria-label'] = node.properties.alt;
              Object.assign(node, code);
            }
          }
        }
      }
    });
  };
}

function fromUrl(base64: string) {
  return base64.replace(/^data:(.+?);base64,/, '');
}

function extractSvg(ast: Root) {
  let svg = null;

  visit(ast, 'element', (node) => {
    if (node.tagName === 'svg') {
      delete node.properties.xmlns;
      node.properties.className = ['missing-maths'];
      svg = node;
    }
  });

  return svg;
}

function wrapSvg(svg: Element): Element {
  return {
    type: 'element',
    tagName: 'code',
    properties: {
      className: ['maths'],
    },
    children: [svg],
  };
}
