import { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

export function extractFootnoteDefinitions(tree: Root): Element[] | null {
  let definitions: Element[] | null = null;
  visit(tree, 'element', (node, idx, parent) => {
    if (node.tagName === 'section') {
      const { className } = node.properties;

      if (Array.isArray(className) && className.includes('footnotes')) {
        const ol = node.children.find(
          (o) => o.type === 'element' && o.tagName === 'ol',
        ) as Element;
        if (ol) {
          definitions = ol.children.filter(
            (o) => o.type === 'element' && o.tagName === 'li',
          ) as Element[];

          // remove definitions section from tree
          parent?.children.splice(idx || 0, 1);
        }
      }
    }
  });
  return definitions;
}
