import { Element, ElementContent, Root as HastRoot } from 'hast';
import { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { visit } from 'unist-util-visit';

import { inlineSvg } from '@isos/image-tools';

import { Author, Context } from '../../markdown-to-mdx/context';
import { createMdastTransforms } from '../../markdown-to-mdx/mdast-transforms';
import { createRemarkProcessor } from '../../remark-processor';

export function cover(ctx: Context) {
  return (tree: Root) => {
    const { frontmatter } = ctx;
    visit(tree, 'containerDirective', (node, idx = 0, parent) => {
      // console.dir(tree, { depth: null });

      if (node.name === 'make-title') {
        // console.log(frontmatter);
        const children: ElementContent[] = [];

        if (frontmatter.titleImage) {
          const titleImage = createTitleImage(frontmatter.titleImage);
          if (titleImage) {
            children.push({ type: 'text', value: '\n' }, titleImage);
          }
        }

        if (frontmatter.title) {
          const title = createTitle(frontmatter.title, ctx);
          if (title) {
            children.push(title);
          }
        }
        if (frontmatter.author.length) {
          const author = createAuthor(frontmatter.author, ctx);
          if (author) {
            children.push(author);
          }
        }
        if (frontmatter.date) {
          const date = createDate(frontmatter.date, ctx);
          if (date) {
            children.push(date);
          }
        }
        if (frontmatter.abstract) {
          const abstract = createAbstract(frontmatter.abstract, ctx);
          if (abstract) {
            children.push(abstract);
          }
        }

        if (children.length > 0) {
          Object.assign(node, {
            name: 'header',
            children: [],
            data: {
              hName: 'header',
              hChildren: children,
            },
          });
        } else {
          parent?.children.splice(idx, 1);
        }
      }
    });

    // console.dir(tree, { depth: null });
  };
}

function createTitleImage(titleImage: string): Element {
  const className = ['title-image'];
  if (titleImage.startsWith('data:image/svg+xml')) {
    const svg = inlineSvg(titleImage);
    if (svg !== null) {
      svg.properties.className = className;
      return svg;
    }
  }
  return {
    type: 'element',
    tagName: 'img',
    properties: {
      className,
      src: titleImage,
    },
    children: [],
  };
}

function createTitle(title: string, ctx: Context): Element {
  return {
    type: 'element',
    tagName: 'h1',
    properties: {},
    children: getInlineHast(title, ctx),
  };
}

function createAuthor(authors: Author[], ctx: Context): Element | null {
  if (authors.length === 1) {
    if (!authors[0].name.length) {
      return null;
    }
    return {
      type: 'element',
      tagName: 'p',
      properties: {
        className: ['author'],
      },
      children: [
        {
          type: 'text',
          value: 'Written by ',
        },
        ...createAuthorContent(authors[0], ctx),
      ],
    };
  }

  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['authors'],
    },
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [
          {
            type: 'text',
            value: 'Written by:',
          },
        ],
      },
      {
        type: 'element',
        tagName: 'ul',
        properties: {},
        children: authors.map((author) => ({
          type: 'element',
          tagName: 'li',
          properties: {},
          children: createAuthorContent(author, ctx),
        })),
      },
    ],
  };
}

function createAuthorContent(
  author: Author,
  ctx: Context,
): ElementContent[] {
  const children = getInlineHast(author.name, ctx);

  if (author.orcid) {
    children.push(
      {
        type: 'text',
        value: ' ',
      },
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: `https://orcid.org/${author.orcid}`,
          target: '_blank',
          className: ['orcid'],
        },
        children: [
          {
            type: 'text',
            value: 'ORCID Link',
          },
        ],
      },
    );
  }

  if (author.affiliation) {
    children.push(
      {
        type: 'text',
        value: ', ',
      },
      {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['affiliation'],
        },
        children: getInlineHast(author.affiliation, ctx),
      },
    );
  }

  return children;
}

function createDate(date: string, ctx: Context): Element {
  // const time: Element = {
  //   type: 'element',
  //   tagName: 'time',
  //   properties: {
  //     datetime: '2025-05-29',
  //   },
  //   children: [],
  // }
  return {
    type: 'element',
    tagName: 'p',
    properties: {
      className: ['date'],
    },
    children: getInlineHast(date, ctx),
  };
}

function createAbstract(abstract: string, ctx: Context): Element {
  return {
    type: 'element',
    tagName: 'aside',
    properties: {
      'aria-labelledby': 'h-abstract',
      className: 'abstract',
    },
    children: [
      {
        type: 'element',
        tagName: 'h2',
        properties: {
          id: 'h-abstract',
        },
        children: [
          {
            type: 'text',
            value: 'Abstract',
          },
        ],
      },
      ...getBlockHast(abstract, ctx),
    ],
  };
}

function getBlockHast(str: string, ctx: Context) {
  const transforms = createMdastTransforms(ctx, undefined, {
    fragment: true,
  });
  const processor = createRemarkProcessor(transforms);
  const parsed = processor.parse(str);
  const transformed = processor.runSync(parsed) as Root;
  const hast = toHast({
    type: 'root',
    children: transformed.children,
  }) as HastRoot;
  return hast.children as Element[];
}

function getInlineHast(str: string, ctx: Context) {
  const hast = getBlockHast(str, ctx);
  if (!hast.length) {
    return [];
  }
  const p = hast[0] as Element;
  return p.children;
}
