import { ElementContent, Properties, Text } from 'hast';
import { Paragraph, PhrasingContent, Root } from 'mdast';
import { ContainerDirective } from 'mdast-util-directive';
import { toHast } from 'mdast-util-to-hast';
import { visit } from 'unist-util-visit';

import { Context } from '../../../markdown-to-mdx/context';
import { RefObject } from '../../refs-and-counts/default-objects';

export function theorems(ctx: Context) {
  return (tree: Root) => {
    const { theorems } = ctx.frontmatter;

    visit(tree, 'containerDirective', (node) => {
      const ref = theorems[node.name];
      if (ref && ref.type === 'theorem') {
        // console.log({ theorem });
        createTheorem(node, ref);
      }
    });
  };
}

function createTheorem(node: ContainerDirective, theorem: RefObject) {
  const theoremName = node.name;
  const id = node.attributes?.id || undefined;
  const className = ['theorem', theoremName];
  if (theorem.style) {
    className.push(`style-${theorem.style}`);
  }
  if (theorem.framed) {
    className.push('framed');
  }
  if (theorem.hideable) {
    className.push(`hideable-${theorem.hideable}`);
  }

  const properties: Properties = {
    className: removeDupes(className).map((s) =>
      s.replace(/\*$/, '-star'),
    ),
  };

  if (theoremName !== 'proof' && !theorem.unnumbered) {
    // TODO: check label list
    properties.id = node.attributes?.id;
  }

  node.data = {
    ...(node.data || {}),
    hProperties: {
      ...(node.data?.hProperties || {}),
      ...properties,
    },
  };

  const customName = node.children.find(
    (o) => o.type === 'paragraph' && o.data?.directiveLabel,
  ) as Paragraph | undefined;

  if (customName) {
    node.children = node.children.filter(
      (o) => !(o.type === 'paragraph' && o.data?.directiveLabel),
    );
  }

  const label = createTitle(theorem, theoremName, customName, id);
  const title = createTitleElements(theorem, label);
  const firstP = node.children[0];

  if (firstP && firstP.type === 'paragraph') {
    firstP.children.unshift(...title);
  } else {
    node.children.unshift({
      type: 'paragraph',
      children: title,
    });
  }
}

export function exSolSolutionDirective() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'solution') {
        node.data = {
          hProperties: {
            className: ['exsol-solution'],
          },
        };
      }
    });
  };
}

function createTitle(
  theorem: RefObject,
  theoremName: string,
  name?: Paragraph,
  id?: string,
) {
  if (theoremName === 'proof') {
    if (name) {
      return name.children;
    } else {
      return [
        {
          type: 'text',
          value: name || theorem.heading || '',
        },
      ] as PhrasingContent[];
    }
  }

  const result: PhrasingContent[] = [
    {
      type: 'text',
      value: theorem.heading || '',
    },
    {
      type: 'text',
      value: '',
      data: {
        hName: 'span',
        hProperties: {
          className: ['thm-count', theoremName],
          ['data-id']: id || null,
        },
        hChildren: [],
      },
    },
  ];

  if (name) {
    result.push(
      {
        type: 'text',
        value: ' (',
      },
      ...name.children,
      {
        type: 'text',
        value: ')',
      },
    );
  }

  return result;
}

function createTitleElements(
  theorem: RefObject,
  label: PhrasingContent[],
) {
  switch (theorem.style) {
    case 'remark':
      return createRemarkTitle(label);
    default:
      return createDefinitionTitle(label);
  }
}

function createDefinitionTitle(
  label: PhrasingContent[],
): PhrasingContent[] {
  const period: Text = {
    type: 'text',
    value: '.',
  };

  const title: PhrasingContent = {
    type: 'strong',
    children: [...label, period],
  };

  const space: Text = {
    type: 'text',
    value: ' ',
  };

  return [
    {
      ...title,
      data: {
        hName: 'span',
        hProperties: {
          class: 'title',
        },
        hChildren: [toHast(title)] as ElementContent[],
      },
    },
    space,
  ];
}

function createRemarkTitle(label: PhrasingContent[]): PhrasingContent[] {
  const title: PhrasingContent = {
    type: 'emphasis',
    children: label,
  };

  const periodSpace: Text = {
    type: 'text',
    value: '. ',
  };

  return [
    {
      ...title,
      data: {
        hName: 'span',
        hProperties: {
          class: 'title',
        },
        hChildren: [toHast(title), periodSpace] as ElementContent[],
      },
    },
  ];
}

function removeDupes(arr: string[]) {
  return arr.reduce((acc: string[], s) => {
    if (Boolean(s) && !acc.includes(s)) {
      acc.push(s);
    }
    return acc;
  }, []);
}
