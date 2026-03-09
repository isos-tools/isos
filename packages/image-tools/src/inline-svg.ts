import { Element, Root } from 'hast';
import rehypeParse from 'rehype-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

export function inlineSvg(base64: string) {
  const decodedString = atob(fromUrl(base64));
  const processor = unified().use(rehypeParse);
  const ast = processor.parse(decodedString);
  return extractSvg(ast);
}

function fromUrl(base64: string) {
  return base64.replace(/^data:(.+?);base64,/, '');
}

function extractSvg(ast: Root): Element | null {
  let svg: Element | null = null;

  visit(ast, 'element', (node) => {
    if (node.tagName === 'svg') {
      delete node.properties.xmlns;
      svg = node;
    }
  });

  return svg;
}
