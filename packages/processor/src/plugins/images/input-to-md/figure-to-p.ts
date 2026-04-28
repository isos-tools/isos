import { Element, Root, Text } from 'hast';
import { Handle, State } from 'hast-util-to-mdast';
import { toString } from 'hast-util-to-string';
// import * as _ from 'lodash';
import kebabCase from 'lodash.kebabcase';
import { InlineMath } from 'mdast-util-math';
import rehypeRemark from 'rehype-remark';
import remarkMath from 'remark-math';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import remarkGfm from '../../remark-gfm';

export function figureToP() {
  return (tree: Root) => {
    // console.log('hast: figureToP');
    // if (process.NODE_ENV === 'test') {
    //   console.dir(tree, { depth: null });
    // } else {
    //   console.dir(_.cloneDeep(tree), { depth: null });
    // }

    for (const env of ['subfigure', 'figure']) {
      visit(tree, (node) => {
        if (node.type === 'element' && node.tagName === 'div') {
          const { className } = node.properties;
          if (
            Array.isArray(className) &&
            className[0] === 'environment' &&
            className[1] === env
          ) {
            const label = extractLabel(node);
            const caption = extractCaption(node);
            // console.log({ label, caption });

            // console.log(env, node.properties);

            // console.log(caption?.children);

            if (containsSingleImage(node)) {
              const img = extractSingleImage(node);
              if (img !== null) {
                if (label !== '') {
                  img.properties.id = label;
                }
                if (caption !== null) {
                  img.properties.title = convertToMarkdown(caption);

                  const { className } = caption.properties;
                  if (Array.isArray(className)) {
                    if (className.includes('unnumbered')) {
                      img.properties.class = 'unnumbered';
                    }
                  }

                  // console.log(node.properties);

                  const { width } = node.properties;
                  if (width) {
                    img.properties.width = width;
                  }
                }

                Object.assign(node, {
                  tagName: 'p',
                  children: [img],
                });
              }
              // console.log('hey!');
            } else {
              // create figure element
              Object.assign(node, { tagName: 'figure' });

              if (label !== '') {
                node.properties.id = label;
              }

              if (caption !== null) {
                node.children.push({
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: [
                    {
                      type: 'element',
                      tagName: 'p',
                      properties: {},
                      children: [caption],
                    },
                  ],
                });
              }
            }
          }
        }
      });
    }
  };
}

function containsSingleImage(figure: Element) {
  // return false;

  // console.dir(figure, { depth: null });

  // reduce noise by converting to markdown
  // then check for a single image
  // const md = convertToMarkdown(figure);
  // const test = /^!\[(.*?)\]\(.+?\)$/.test(md);
  // // console.log(md, test);
  // return test;

  // console.log(convertToMarkdown(figure));

  // const trimmedChildren = figure.children.filter(
  //   (o) => !(o.type === 'text' && o.value.trim() === ''),
  // );

  // if (trimmedChildren.length !== 1) {
  //   return false;
  // }

  // if (trimmedChildren[0].type !== 'element') {
  //   return false;
  // }

  // const elem = trimmedChildren[0];

  // if (elem.tagName === 'img') {
  //   return true;
  // }

  let textCount = 0;
  let imageCount = 0;
  visit(figure, (node) => {
    if (node.type === 'element' && node.tagName === 'img') {
      ++imageCount;
    }
    if (node.type === 'text' && /\S/.test(node.value)) {
      ++textCount;
    }
  });
  return imageCount === 1 && textCount === 0;
}

function extractSingleImage(figure: Element): Element | null {
  let image = null;
  visit(figure, 'element', (node, idx = 0, parent) => {
    if (node.tagName === 'img') {
      image = node;

      // remove image
      parent?.children.splice(idx, 1);
    }
  });
  return image;
}

function extractCaption(figure: Element): Element | null {
  // console.dir(figure, { depth: null });
  let caption = null;
  visit(figure, 'element', (node, idx = 0, parent) => {
    const { className } = node.properties;

    if (Array.isArray(className) && className.includes('macro-caption')) {
      // console.log(node.children);
      if (toString(node.children[0]) === '*') {
        className.push('unnumbered');
      }

      node.children = [node.children[node.children.length - 1]];
      caption = node;

      // remove caption
      parent?.children.splice(idx, 1);
    }
  });
  // console.dir(caption, { depth: null });
  return caption;
}

function extractLabel(figure: Element): string {
  let label = null;
  visit(figure, 'element', (node, idx = 0, parent) => {
    const { className } = node.properties;

    if (Array.isArray(className) && className.includes('macro-label')) {
      label = toString(node);

      // remove label
      parent?.children.splice(idx, 1);
    }
  });
  return kebabCase(label || '');
}

function convertToMarkdown(elem: Element) {
  // necessary to convert to markdown and keep consistent maths formatting
  const handlers: Record<string, Handle> = {
    span(state: State, node: Element) {
      const { className } = node.properties;
      // maths
      if (Array.isArray(className)) {
        if (className.includes('inline-math')) {
          const math = node.children[0] as Text;
          const result: InlineMath = {
            type: 'inlineMath',
            value: math?.value || '',
          };
          state.patch(node, result);
          return result;
        }
        // references
        if (
          className.includes('macro-cref') ||
          className.includes('macro-zcref') ||
          className.includes('macro-autoref')
        ) {
          const id = kebabCase(toString(node));
          const result: Text = {
            type: 'text',
            value: id ? `@${id}` : '',
          };
          state.patch(node, result);
          return result;
        }
      }
      return state.all(node);
    },
  };

  const processor = unified()
    .use(rehypeRemark, { handlers })
    .use(remarkMath)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkStringify);

  const transformed = processor.runSync({
    type: 'root',
    children: [elem],
  });
  return processor.stringify(transformed).trim();
}
