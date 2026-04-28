import { Element, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import { BuildVisitor, visit } from 'unist-util-visit';

import { Context } from '../../../../markdown-to-mdx/context';
import { Note, NoteMap } from './extract-note-contents';
import { dlFromNotes, getIdFromSup } from './utils';

type Visitor = BuildVisitor<Root, 'element'>;

export function groupBelowParagraphs(
  tree: Root,
  ctx: Context,
  noteMap: NoteMap,
  names: string[],
) {
  visit(tree, 'element', paragraph(ctx, noteMap, names), true);
}

function paragraph(
  ctx: Context,
  noteMap: NoteMap,
  names: string[],
): Visitor {
  return (p, idx = 0, parent) => {
    if (p.tagName === 'p') {
      const notes: Note[] = [];

      visit(p, 'element', (node) => {
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
                  label: `Footnote ${toString(node)}`,
                };
              }
            }
          }
        }
      });

      if (notes.length && parent) {
        const aside: Element = {
          type: 'element',
          tagName: 'aside',
          properties: {
            className: ['footnotes'],
          },
          children: [dlFromNotes(notes)],
        };
        parent.children.splice(idx + 1, 0, aside);
      }
    }
  };
}
