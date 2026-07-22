import { Element, ElementContent, Properties, Text } from 'hast';
import {
  BlockContent,
  DefinitionContent,
  Paragraph,
  PhrasingContent,
  Root,
} from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../markdown-to-mdx/context';
import {
  RefObject,
  createDefaultObjects,
} from '../refs-and-counts/default-objects';

export function floats(_ctx: Context) {
  return (tree: Root) => {
    const refs = createDefaultObjects();
    const floats = Object.values(refs).filter((o) => o.type === 'float');
    const floatNames = floats.map((o) => o.name);

    visit(tree, 'containerDirective', (node) => {
      if (floatNames.includes(node.name)) {
        const float = floats.find(
          (o) => o.name === node.name,
        ) as RefObject;
        createFloat(node, float);
      }
    });
  };
}

function createFloat(node: ContainerDirective, ctxObj: RefObject) {
  const id = node.attributes?.id;
  const properties: Properties = {
    id,
  };

  const className = [];
  if (node.name !== 'figure') {
    className.push(node.name);
  }
  if (Array.isArray(node.attributes?.className)) {
    className.push(...node.attributes.className);
  }
  if (className.length > 0) {
    properties.className = removeDupes(className);
  }

  const { caption, content } = separateContentAndCaption(node);
  const contentHast = getContentHast(content);
  const children: ElementContent[] = [];
  children.push(contentHast);

  const strong: Element = {
    type: 'element',
    tagName: 'strong',
    properties: {},
    children: [
      {
        type: 'text',
        value: ctxObj.heading || '',
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: [`${ctxObj.abbr}-count`, node.name],
          'data-id': id,
        },
        children: [],
      },
    ],
  };
  const captionHast = getCaptionHast(caption);

  const figCaption: Element = {
    type: 'element',
    tagName: 'figcaption',
    properties: {},
    children: [strong],
  };

  if (caption.length > 0) {
    strong.children.push({
      type: 'text',
      value: ':',
    });
    figCaption.children.push(
      {
        type: 'text',
        value: ' ',
      },
      ...captionHast,
    );
  }

  const newLine: Text = {
    type: 'text',
    value: '\n',
  };
  if (node.name === 'figure') {
    if (caption.length > 0) {
      children.push(newLine, figCaption);
    }
  } else {
    children.unshift(figCaption, newLine);
  }

  node.data = {
    ...(node.data || {}),
    hName: 'figure',
    hProperties: {
      ...(node.data?.hProperties || {}),
      ...properties,
    },
    hChildren: children,
  };
}

function separateContentAndCaption({ children }: ContainerDirective) {
  if (children.length > 1) {
    const lastP = children[children.length - 1] as Paragraph;

    if (!lastP.children.find((o) => o.type === 'image')) {
      const rest = children.slice(0, -1);

      const content: (
        | BlockContent
        | DefinitionContent
        | PhrasingContent
      )[] = [];
      if (rest.length === 1 && rest[0].type === 'paragraph') {
        content.push(...rest[0].children);
      } else {
        content.push(...rest);
      }
      return {
        caption: lastP.children as PhrasingContent[],
        content: content as (BlockContent | DefinitionContent)[],
      };
    }
  }

  return {
    caption: [] as PhrasingContent[],
    content: children as (BlockContent | DefinitionContent)[],
  };
}

function getCaptionHast(caption: PhrasingContent[]) {
  const captionHast = toHast({
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: caption,
      },
    ],
  }) as Element;
  const p = captionHast.children[0] as Element;
  return p.children;
}

function getContentHast(content: (BlockContent | DefinitionContent)[]) {
  const contentHast = toHast({
    type: 'root',
    children: content,
  }) as Element;

  const elem: ElementContent = {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['fig-content'],
    },
    children: contentHast.children,
  };

  return elem;
}

function removeDupes(arr: string[]) {
  return arr.reduce((acc: string[], s) => {
    if (Boolean(s) && !acc.includes(s)) {
      acc.push(s);
    }
    return acc;
  }, []);
}
