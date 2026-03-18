import {
  FootnoteDefinition,
  FootnoteReference,
  PhrasingContent,
  Root,
} from 'mdast';
import { TextDirective } from 'mdast-util-directive';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export function footnoteToRefDef() {
  return (tree: Root) => {
    let count = 0;
    // console.dir(tree, { depth: null });
    visit(tree, 'textDirective', (node, idx, parent) => {
      if (
        ['footnote', 'sidenote', 'framedsidenote', 'marginnote'].includes(
          node.name,
        )
      ) {
        ++count;

        const label = extractLabel(node);

        const reference: FootnoteReference = {
          type: 'footnoteReference',
          identifier: String(count),
          label: label || String(count),
        };

        Object.assign(node, reference);

        const contents = getContents(node);
        // console.log(contents);

        const definition: FootnoteDefinition = {
          type: 'footnoteDefinition',
          identifier: String(count),
          label: label || String(count),
          children: [{ type: 'paragraph', children: contents }],
        };

        const nextIdx = (idx || 0) + 1;
        parent?.children.splice(nextIdx, 0, definition);
      }
    });
    // console.dir(tree, { depth: null });

    // move footnote definitions to their own paragraphs
    visit(tree, 'paragraph', (node, idx = 0, parent) => {
      const definitions = node.children.filter((o) => {
        // @ts-expect-error
        return o.type === 'footnoteDefinition';
      });

      if (parent && definitions.length) {
        node.children = node.children.filter((o) => {
          // @ts-expect-error
          return o.type !== 'footnoteDefinition';
        });

        if (node.children.length > 0) {
          parent.children.splice(idx + 1, 0, ...definitions);
        } else {
          parent.children.splice(idx, 1, ...definitions);
        }
      }
    });
    // console.dir(tree, { depth: null });
  };
}

function extractLabel(footnote: TextDirective): string | null {
  let label = null;
  visit(footnote, 'textDirective', (node, idx = 0, parent) => {
    if (node.name === 'label') {
      label = toString(node);
      if (parent) {
        parent.children.splice(idx, 1);
      }
    }
  });
  return label;
}

function getContents(content: TextDirective) {
  const children = content.children.reduce((acc: PhrasingContent[], o) => {
    // @ts-expect-error
    if (o.type === 'paragraph') {
      // @ts-expect-error
      acc.push(...o.children);
    } else {
      acc.push(o);
    }
    return acc;
  }, []);

  return children.slice(
    children.findIndex((o) => !(o.type === 'text' && o.value === '\n')),
  );
}
