import { FootnoteDefinition, FootnoteReference, Root } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export function footnoteMarkToRef() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, 'textDirective', (node) => {
      if (node.name === 'footnote-mark') {
        // console.log(node);
        const id = toString(node.children);

        const mark: FootnoteReference = {
          type: 'footnoteReference',
          identifier: id,
          label: id,
        };

        Object.assign(node, mark);
      }

      if (node.name === 'footnote-text') {
        // console.log(node);
        const mark = node.attributes?.mark || '';
        const definition: FootnoteDefinition = {
          type: 'footnoteDefinition',
          identifier: mark,
          label: mark,
          children: [{ type: 'paragraph', children: node.children }],
        };

        Object.assign(node, definition);
      }
    });
    // console.dir(tree, { depth: null });
  };
}
