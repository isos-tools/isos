import { Element, Root, Text } from 'hast';
// import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';

import { Context } from '../../markdown-to-mdx/context';
import { Theorem } from './default-theorems';

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
  let thm: Partial<Theorem> | null = null;
  visit(title, (node) => {
    // @ts-expect-error
    const properties = node.properties || {};

    if (properties['data-id']) {
      const id = properties['data-id'];
      const abbr = id.split('-')[0];
      const { theorems } = ctx.frontmatter;
      const theorem = Object.values(theorems).find(
        (o) => !Array.isArray(o) && o.abbr === abbr,
      );
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

function replaceTitle(title: Element, thm: Partial<Theorem>) {
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
  thm: Partial<Theorem>,
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
          node.children.unshift(title, space);
        }
      }
    }
  });
}
