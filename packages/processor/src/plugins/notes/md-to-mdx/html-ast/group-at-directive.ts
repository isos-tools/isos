import { Element, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

import { Context } from '../../../../markdown-to-mdx/context';
import { Note, NoteMap } from './extract-note-contents';
import { dlFromNotes, getIdFromSup } from './utils';

export function groupAtDirective(
  tree: Root,
  ctx: Context,
  noteMap: NoteMap,
  names: string[],
) {
  const notes: Note[] = [];

  visit(tree, 'element', (node) => {
    if (node.tagName === 'sup') {
      const name = node.properties.className;
      if (typeof name === 'string' && names.includes(name)) {
        const id = getIdFromSup(node);
        if (id) {
          const element = noteMap[id];
          if (element) {
            notes.push(element);

            // add reference
            ctx.frontmatter.refMap[id] = {
              id,
              label: `Note ${toString(node)}`,
            };
          }
        }
      }
    }

    if (
      node.tagName === 'div' &&
      node.properties.className === 'printendnotes'
    ) {
      const aside: Element = {
        type: 'element',
        tagName: 'aside',
        properties: {
          className: ['notes'],
        },
        children: [
          {
            type: 'element',
            tagName: 'h2',
            properties: {},
            children: [{ type: 'text', value: 'Notes' }],
          },
          dlFromNotes(notes),
        ],
      };
      Object.assign(node, aside);

      // empty notes array
      notes.length = 0;
    }
  });
}
