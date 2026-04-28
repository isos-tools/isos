import { Root } from 'hast';

import { Context } from '../../../../markdown-to-mdx/context';
import { displaySidenotes } from './display-sidenotes';
import { extractNoteContents } from './extract-note-contents';
import { groupAtDirective } from './group-at-directive';
import { groupBelowParagraphs } from './group-below-p';

export type NotesOverride =
  | 'default'
  | 'sidenotesAsFootnotes'
  | 'footnotesAsSidenotes'
  | 'inlineAll';

export function displayNoteContents(
  ctx: Context,
  override: NotesOverride = 'default',
) {
  return (tree: Root) => {
    const noteMap = extractNoteContents(tree);

    if (override === 'sidenotesAsFootnotes') {
      groupBelowParagraphs(tree, ctx, noteMap, ['footnote', 'sidenote']);
      groupAtDirective(tree, ctx, noteMap, ['endnote']);
      return;
    }

    if (override === 'footnotesAsSidenotes') {
      displaySidenotes(tree, ctx, noteMap, ['footnote', 'sidenote']);
      groupAtDirective(tree, ctx, noteMap, ['endnote']);
      return;
    }

    if (override === 'inlineAll') {
      groupBelowParagraphs(tree, ctx, noteMap, [
        'footnote',
        'sidenote',
        'endnote',
      ]);
      return;
    }

    groupBelowParagraphs(tree, ctx, noteMap, ['footnote']);
    displaySidenotes(tree, ctx, noteMap, ['sidenote']);
    groupAtDirective(tree, ctx, noteMap, ['endnote']);
  };
}
