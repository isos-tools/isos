import { Group, Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

export function convertEmToEmph() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, (node, info) => {
      if (!info.context.hasMathModeAncestor && node.type === 'group') {
        convertToMacro(node, 'em', 'emph');
        convertToMacro(node, 'bf', 'textbf');
      }
    });
  };
}

function convertToMacro(node: Group, from: string, to: string) {
  const firstChild = node.content[0];

  if (
    firstChild &&
    firstChild.type === 'macro' &&
    firstChild.content === from
  ) {
    Object.assign(node, {
      type: 'macro',
      content: to,
      args: [
        {
          type: 'argument',
          content: node.content.slice(
            node.content.findIndex((o) => o.type === 'string'),
          ),
        },
      ],
    });
  }
}
