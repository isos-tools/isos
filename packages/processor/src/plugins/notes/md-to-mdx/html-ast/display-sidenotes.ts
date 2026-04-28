import { Element, ElementContent, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

import { Context } from '../../../../markdown-to-mdx/context';
import { Note, NoteMap } from './extract-note-contents';
import { getIdFromSup } from './utils';

export function displaySidenotes(
  tree: Root,
  ctx: Context,
  noteMap: NoteMap,
  names: string[],
) {
  visit(tree, 'element', (node) => {
    if (node.tagName === 'sup') {
      const name = node.properties.className;
      if (typeof name === 'string' && names.includes(name)) {
        const id = getIdFromSup(node);
        if (id) {
          const note = noteMap[id];
          if (note) {
            // indicate document has sidenotes
            ctx.hasSideNotes = true;

            // add reference
            ctx.frontmatter.refMap[id] = {
              id,
              label: `Sidenote ${toString(node)}`,
            };

            Object.assign(node, createSidenote(node, note));
          }
        }
      }
    }
  });
}

function createSidenote(node: Element, note: Note): ElementContent {
  return {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['sidenote'],
    },
    children: [
      {
        type: 'element',
        tagName: 'sup',
        properties: {
          className: undefined,
        },
        children: node.children,
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['sidenote-label'],
        },
        children: [
          {
            type: 'text',
            value: ' (sidenote: ',
          },
        ],
      },
      {
        type: 'element',
        tagName: 'small',
        properties: {
          className: ['sidenote-content'],
        },
        children: createSidenoteContent(note),
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['sidenote-label'],
        },
        children: [
          {
            type: 'text',
            value: ')',
          },
        ],
      },
    ],
  };
}

function createSidenoteContent(note: Note): ElementContent[] {
  const firstChild = note.contents[0];

  if (firstChild.type === 'element' && firstChild.tagName === 'p') {
    firstChild.children.unshift(note.sup);
  } else {
    note.contents.unshift({
      type: 'element',
      tagName: 'p',
      properties: {},
      children: [note.sup],
    });
  }

  return note.contents.map((child) => {
    if (child.type === 'element') {
      // No sidenote block elements
      if (['p', 'div'].includes(child.tagName)) {
        child.tagName = 'span';
      }

      // Display maths gets in-sidenote class
      if (child.tagName === 'pre') {
        child.properties.className = 'in-sidenote';
      }
    }
    return child;
  }, []);
}
