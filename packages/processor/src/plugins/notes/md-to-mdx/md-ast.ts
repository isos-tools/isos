import { Link, Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

import { noteConfig } from '../config';

type Footnote = {
  count: number;
  id?: string;
};

export function notes() {
  return (tree: Root) => {
    let counter = 0;
    const noteDefinitions = noteConfig.map((o) => o.definition);
    const noteNames = noteConfig.map((o) => o.name);
    const noteMap: Record<string, Footnote> = {};

    visit(tree, 'containerDirective', (node) => {
      if (noteDefinitions.includes(node.name)) {
        const mark = extractDirectiveMark(node);
        const config = noteConfig.find((o) => o.definition === node.name);

        if (mark && config) {
          const count = ++counter;
          const id = node.attributes?.id || undefined;
          noteMap[mark] = { count, id };

          const supMark = createSupMark({
            count,
            href: `#${config.prefix}-ref-${id || mark}`,
            id: id || `${config.prefix}-def-${mark}`,
            name: config.name,
          });
          addSupMark(node, supMark);

          node.data = {
            hName: 'aside',
            hProperties: {
              className: config.name,
            },
          };
        }
      }
    });

    visit(tree, 'textDirective', (node) => {
      if (noteNames.includes(node.name)) {
        const mark = toString(node.children);
        const config = noteConfig.find((o) => o.name === node.name);

        if (mark && noteMap[mark] && config) {
          const { count, id } = noteMap[mark];
          const supMark = createSupMark({
            count,
            href: '#' + (id || `${config.prefix}-def-${mark}`),
            id: `${config.prefix}-ref-${id || mark}`,
            name: config.name,
          });
          Object.assign(node, supMark);
        }
      }
    });

    visit(tree, 'leafDirective', (node) => {
      if (node.name === 'printendnotes') {
        node.data = {
          hProperties: {
            className: node.name,
          },
        };
      }
    });
  };
}

function extractDirectiveMark(node: ContainerDirective) {
  let mark = '';

  node.children = node.children.filter((child) => {
    if (child.type === 'paragraph' && child.data) {
      const { directiveLabel } = child.data || {};
      if (directiveLabel === true) {
        mark = toString(child);
        return false;
      }
    }
    return true;
  });

  return mark;
}

function addSupMark(node: ContainerDirective, supMark: Link) {
  if (node.children.length > 0) {
    const firstChild = node.children[0];
    if (firstChild.type === 'paragraph') {
      firstChild.children.unshift(supMark);
      return;
    }
  }
  node.children.unshift({
    type: 'paragraph',
    children: [supMark],
  });
}

type Options = {
  count: number;
  href: string;
  id: string;
  name: string;
};

function createSupMark({ count, href, id, name }: Options): Link {
  const value = String(count);
  return {
    type: 'link',
    url: href,
    children: [{ type: 'text', value }],
    data: {
      hName: 'sup',
      hProperties: {
        href: undefined,
        className: name,
      },
      hChildren: [
        {
          type: 'element',
          tagName: 'a',
          properties: {
            id,
            href,
          },
          children: [{ type: 'text', value }],
        },
      ],
    },
  };
}
