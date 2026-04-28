import { Element } from 'hast';
import { State } from 'hast-util-to-mdast';
import { PhrasingContent, RootContent } from 'mdast';
import { LeafDirective, TextDirective } from 'mdast-util-directive';

export function createFootnote(
  state: State,
  node: Element,
): TextDirective {
  return {
    type: 'textDirective',
    name: 'footnote',
    children: removeLeadingTrailingSpace(state.all(node)),
  };
}

export function createSidenote(
  state: State,
  node: Element,
): TextDirective {
  return {
    type: 'textDirective',
    name: 'sidenote',
    children: removeLeadingTrailingSpace(state.all(node)),
  };
}

export function createEndnote(state: State, node: Element): TextDirective {
  return {
    type: 'textDirective',
    name: 'endnote',
    children: removeLeadingTrailingSpace(state.all(node)),
  };
}

export function createPrintEndnotes(): LeafDirective {
  return {
    type: 'leafDirective',
    name: 'printendnotes',
    children: [],
  };
}

function removeLeadingTrailingSpace(children: RootContent[]) {
  // console.log(children);
  const firstChild = children[0];
  if (firstChild && firstChild.type === 'text') {
    firstChild.value = firstChild.value.trimStart();
  }
  const lastChild = children[children.length - 1];
  if (lastChild && lastChild.type === 'text') {
    lastChild.value = lastChild.value.trimEnd();
  }
  return children as PhrasingContent[];
}
