import { Element, Parents, Text } from 'hast';
import { State } from 'hast-util-to-mdast';
import { PhrasingContent, RootContent } from 'mdast';
import { TextDirective } from 'mdast-util-directive';

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

export function createFootnoteMark(
  state: State,
  node: Element,
): TextDirective {
  const children = state.all(node) as PhrasingContent[];
  if (children.length === 0) {
    return {
      type: 'textDirective',
      name: 'warn',
      children: [
        { type: 'text', value: 'footnote mark has no identifier' },
      ] as PhrasingContent[],
    };
  }
  // console.dir(children, { depth: null });
  return {
    type: 'textDirective',
    name: 'footnote-mark',
    children: state.all(node) as PhrasingContent[],
  };
}

export function createFootnoteText(
  state: State,
  node: Element,
  parents?: Parents,
): TextDirective {
  const attributes: TextDirective['attributes'] = {};
  if (node.children.length > 1) {
    const firstChild = node.children[0];
    if (firstChild && firstChild.type === 'element') {
      const text = firstChild.children[0] as Text;
      if (text && text.type === 'text') {
        attributes.mark = text.value;
      }
    }
  }

  if (!attributes.mark) {
    return {
      type: 'textDirective',
      name: 'warn',
      children: [
        { type: 'text', value: 'footnote text has no identifier' },
      ] as PhrasingContent[],
    };
  }

  const lastChild = node.children[node.children.length - 1] as Element;
  const span = state.handlers.span(
    state,
    lastChild,
    parents,
  ) as RootContent[];
  // const filtered = span.filter((o) => o.type !== 'break');

  return {
    type: 'textDirective',
    name: 'footnote-text',
    attributes,
    children: removeLeadingTrailingSpace(span) as PhrasingContent[],
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
