import { Element, Root, Text } from 'hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../../markdown-to-mdx/context';
import { RefObject } from '../../refs-and-counts/default-objects';

export function exSolSolutionTitle(ctx: Context) {
  return (tree: Root) => {
    // console.log(tree);
    // console.dir(tree, { depth: null });
    visit(tree, 'element', (node) => {
      if (node.tagName === 'div') {
        const className = node.properties.className;
        if (
          Array.isArray(className) &&
          className.find((o) => String(o).startsWith('hideable'))
        ) {
          const title = copyTitle(node);
          if (title !== null) {
            const theorem = getTheorem(title, ctx);
            if (theorem !== null) {
              const newTitle = replaceTitle(title, theorem);
              prependToSolution(node, newTitle, theorem);
            }
          }
        }
      }
    });
  };
}

export function insertQed() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'div') {
        const className = node.properties.className;
        if (Array.isArray(className) && className.includes('proof')) {
          const qed: Element = {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['qed'],
            },
            children: [
              {
                type: 'text',
                value: ' q.e.d.',
              },
            ],
          };

          const last = node.children[node.children.length - 1];

          if (last && last.type === 'element' && last.tagName === 'p') {
            last.children.push(qed);
          } else {
            node.children.push({
              type: 'element',
              tagName: 'p',
              properties: {},
              children: [qed],
            });
          }
        }
      }
    });
  };
}

function copyTitle(theorem: Element) {
  let title: Element | null = null;
  visit(theorem, 'element', (node) => {
    if (node.tagName === 'span') {
      if (node.properties.class === 'title') {
        title = structuredClone(node);
      }
    }
  });

  return title;
}

function getTheorem(title: Element, ctx: Context) {
  const { theorems } = ctx.frontmatter;
  let thm: Partial<RefObject> | null = null;
  visit(title, (node) => {
    // @ts-expect-error
    const properties = node.properties || {};

    if (
      Array.isArray(properties.className) &&
      properties.className.length > 1
    ) {
      const name = properties.className[1];
      const theorem = theorems[name];
      if (theorem && !Array.isArray(theorem)) {
        thm = {
          heading: theorem.heading,
          lowerTitle: theorem.lowerTitle,
          hideable: theorem.hideable,
        };
      }
    }
  });

  return thm;
}

function replaceTitle(title: Element, thm: Partial<RefObject>) {
  visit(title, 'text', (node) => {
    if (node.value === thm.heading) {
      node.value = thm.lowerTitle || '';
    }
  });
  return title;
}

function prependToSolution(
  theorem: Element,
  title: Element,
  thm: Partial<RefObject>,
) {
  visit(theorem, 'element', (node) => {
    if (node.tagName === 'div') {
      const className = node.properties.className;
      if (
        Array.isArray(className) &&
        className.includes('exsol-solution')
      ) {
        // node.properties['data-title'] = thm.heading;
        node.properties['data-lowertitle'] = thm.lowerTitle;
        node.properties['data-hideable'] = thm.hideable;
        const firstP = node.children[0];
        const space: Text = { type: 'text', value: ' ' };
        if (firstP.type === 'element' && firstP.tagName === 'p') {
          firstP.children.unshift(title, space);
        } else {
          node.children.unshift({
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [title, space],
          });
        }
      }
    }
  });
}
