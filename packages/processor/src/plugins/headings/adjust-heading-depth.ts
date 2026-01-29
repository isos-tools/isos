import { Root } from 'hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../input-to-markdown/context';

export function adjustHeadingDepth(ctx: Context) {
  return (tree: Root) => {
    const hasPart = hasPartHeading(tree);
    const { documentClass: doc } = ctx.frontmatter;
    ctx.sectionToHeading = createHeadingDepths(doc || '', hasPart);

    visit(tree, 'element', (node) => {
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
        const className = node.properties.className;

        if (Array.isArray(className)) {
          const classes = className.map(String);
          const klass = classes.find((s) => s.startsWith('section-'));

          if (klass) {
            const headingType = klass.replace(/^section-/, '');
            node.tagName = ctx.sectionToHeading[headingType];
          }

          if (classes.includes('starred')) {
            node.children.push({
              type: 'text',
              value: ' {.unnumbered}',
            });
          }
        }
      }
    });

    // swap sections to headings in theorem definitions
    Object.entries(ctx.frontmatter.theorems).forEach(([name, theorem]) => {
      if (!Array.isArray(theorem)) {
        if (theorem.numberWithin) {
          const thm = ctx.frontmatter.theorems[name];
          thm.numberWithin = ctx.sectionToHeading[theorem.numberWithin];
        }
      }
    });
  };
}

function hasPartHeading(tree: Root) {
  let hasPart = false;
  visit(tree, 'element', (node) => {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName)) {
      const className = node.properties.className;
      if (Array.isArray(className)) {
        const klass = className
          .map(String)
          .find((s) => s.startsWith('section-'));
        if (klass) {
          const headingType = klass.replace(/^section-/, '');
          if (headingType === 'part') {
            hasPart = true;
          }
        }
      }
    }
  });
  return hasPart;
}

function createHeadingDepths(
  documentClass: string,
  hasPart: boolean,
): Context['sectionToHeading'] {
  if (['report', 'book'].includes(documentClass)) {
    if (hasPart) {
      return {
        title: 'h1',
        part: 'h2',
        chapter: 'h3',
        section: 'h4',
        subsection: 'h5',
        subsubsection: 'h6',
      };
    } else {
      return {
        title: 'h1',
        chapter: 'h2',
        section: 'h3',
        subsection: 'h4',
        subsubsection: 'h5',
        paragraph: 'h6',
      };
    }
  } else {
    return {
      title: 'h1',
      section: 'h2',
      subsection: 'h3',
      subsubsection: 'h4',
      paragraph: 'h5',
      subparagraph: 'h6',
    };
  }
}
