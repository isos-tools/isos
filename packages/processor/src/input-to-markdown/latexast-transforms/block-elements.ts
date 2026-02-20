import {
  Argument,
  Node,
  Parbreak,
  Root,
} from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

const parBreak: Parbreak = {
  type: 'parbreak',
};

export function insertParbreaksAroundBlockElements() {
  return (tree: Root) => {
    visit(tree, (node, info) => {
      if (shouldGetParBreaks(node)) {
        const parent = (info.parents[0] || {}) as Root;
        const children = parent.content || [];

        parent.content = children.reduce((acc: Node[], child) => {
          if (shouldGetParBreaks(child)) {
            acc.push(parBreak, child, parBreak);
          } else {
            acc.push(child);
          }
          // if (
          //   idx > 0 &&
          //   shouldGetParBreaks(child) &&
          //   !isParBreak(children[idx - 1])
          // ) {
          //   acc.push(parBreak, parBreak);
          // }
          // acc.push(child);
          // if (
          //   idx < children.length - 1 &&
          //   shouldGetParBreaks(child) &&
          //   !isParBreak(children[idx + 1])
          // ) {
          //   acc.push(parBreak, parBreak);
          // }
          return acc;
        }, []);

        // console.log(parent.content);
      }
    });
  };
}

function shouldGetParBreaks(node: Node | Argument) {
  return (
    isHeading(node) ||
    isDisplayMath(node) ||
    isEnumerate(node) ||
    isItemize(node) ||
    isFigure(node) ||
    isImage(node) ||
    isTable(node) ||
    isCallout(node)
  );
}

const headingMacros = [
  'part',
  'chapter',
  'section',
  'subsection',
  'subsubsection',
  'paragraph',
  'subparagraph',
];

function isHeading(node: Node | Argument) {
  return node.type === 'macro' && headingMacros.includes(node.content);
}

function isDisplayMath(node: Node | Argument) {
  return node.type === 'displaymath' || node.type === 'mathenv';
}

function isEnumerate(node: Node | Argument) {
  return node.type === 'environment' && node.env === 'enumerate';
}

function isItemize(node: Node | Argument) {
  return node.type === 'environment' && node.env === 'itemize';
}

function isFigure(node: Node | Argument) {
  return node.type === 'environment' && node.env === 'figure';
}

function isImage(node: Node | Argument) {
  return node.type === 'macro' && node.content === 'includegraphics';
}

// function isCenter(node: Node | Argument) {
//   return node.type === 'macro' && node.content === 'html-tag:center';
// }

function isTable(node: Node | Argument) {
  return (
    node.type === 'environment' &&
    (node.env === 'tabular' || node.env === 'tabularx')
  );
}

const callouts = [
  'notebox',
  'tipbox',
  'warningbox',
  'cautionbox',
  'importantbox',
];
function isCallout(node: Node | Argument) {
  return node.type === 'macro' && callouts.includes(node.content);
}

// function isParBreak(node?: Node) {
//   return node?.type === 'parbreak';
// }
