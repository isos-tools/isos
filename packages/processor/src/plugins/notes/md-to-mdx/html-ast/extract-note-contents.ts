import { Element, ElementContent, Root } from 'hast';
import { BuildVisitor, visit } from 'unist-util-visit';

import { noteConfig } from '../../config';

export type Note = {
  sup: Element;
  contents: ElementContent[];
};

export type NoteMap = Record<string, Note>;

export function extractNoteContents(tree: Root) {
  const noteContents: NoteMap = {};
  visit(tree, 'element', aside(noteContents), true);
  // console.dir(tree, { depth: null });
  return noteContents;
}

type Visitor = BuildVisitor<Root, 'element'>;

function aside(noteContents: NoteMap): Visitor {
  const noteNames = noteConfig.map((o) => o.name);
  return (node, idx = 0, parent) => {
    if (node.tagName === 'aside') {
      const { className } = node.properties;
      if (typeof className === 'string' && noteNames.includes(className)) {
        const sup = extractAsideSup(node);
        if (sup !== null) {
          const id = getId(sup);
          if (id !== null && parent) {
            noteContents[id] = { sup, contents: node.children };

            // remove the subsequent line break
            let hasBreak = false;
            const next = parent.children[idx + 1];
            if (next && next.type === 'text' && next.value === '\n') {
              hasBreak = true;
            }

            parent.children.splice(idx, hasBreak ? 2 : 1);
          }
        }
      }
    }
  };
}

function extractAsideSup(node: Element) {
  let sup: Element | null = null;
  if (node.children.length > 0) {
    const firstP = node.children[0];
    if (firstP.type === 'element' && firstP.tagName === 'p') {
      const elem = firstP.children[0];
      if (elem.type === 'element' && elem.tagName === 'sup') {
        delete elem.properties.className;
        sup = elem;
        firstP.children.splice(0, 1);
      }
    }
  }
  return sup;
}

function getId(node: Element) {
  let id: string | null = null;
  if (node.children.length > 0) {
    const a = node.children[0];
    if (a.type === 'element' && a.tagName === 'a') {
      if (typeof a.properties?.id === 'string') {
        id = a.properties?.id;
      }
    }
  }
  return id;
}
