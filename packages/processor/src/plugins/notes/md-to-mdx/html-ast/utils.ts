import { Element } from 'hast';

import { Note } from './extract-note-contents';

export function dlFromNotes(notes: Note[]): Element {
  return {
    type: 'element',
    tagName: 'dl',
    properties: {},
    children: notes.reduce((acc: Element[], { sup, contents }) => {
      const dt: Element = {
        type: 'element',
        tagName: 'dt',
        properties: {},
        children: [sup],
      };
      const dd: Element = {
        type: 'element',
        tagName: 'dd',
        properties: {},
        children: contents,
      };
      acc.push(dt, dd);
      return acc;
    }, []),
  };
}

export function getIdFromSup(node: Element) {
  if (node.children.length > 0) {
    const link = node.children[0];
    if (
      link.type === 'element' &&
      link.tagName === 'a' &&
      typeof link.properties.href === 'string' &&
      link.properties.href[0] === '#'
    ) {
      return link.properties.href.slice(1);
    }
  }
  return null;
}
