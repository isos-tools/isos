import { convertToMarkdown } from '@unified-latex/unified-latex-to-mdast';
import * as Ast from '@unified-latex/unified-latex-types';
import { getArgsContent } from '@unified-latex/unified-latex-util-arguments';
import { visit } from '@unified-latex/unified-latex-util-visit';

import { printRaw } from '@isos/unified-latex-util-print-raw';

export function tableCaptionToData() {
  return (tree: Ast.Root) => {
    // console.log('tableCaptionToData');
    visit(tree, (node) => {
      if (node.type === 'environment' && node.env === 'table') {
        // console.dir(node, { depth: null });
        const tabular = extractTabular(node);
        if (tabular === null) {
          return;
        }
        // @ts-expect-error
        tabular.data = {};
        const caption = extractCaption(node);
        if (caption !== null) {
          const captionText = extractCaptionText(caption);

          // @ts-expect-error
          tabular.data.caption = captionText;
        }
        const label = extractLabel(node);
        if (label) {
          const labelText = extractLabelText(label);

          // @ts-expect-error
          tabular.data.id = labelText;
        }
      }
    });
  };
}

function extractTabular(table: Ast.Node): Ast.Macro | null {
  let tabular = null;
  visit(table, (node) => {
    if (node.type === 'environment' && node.env === 'tabular') {
      tabular = node;
    }
  });
  return tabular;
}

function extractCaption(table: Ast.Node): Ast.Macro | null {
  let caption = null;
  visit(table, (node, info) => {
    if (node.type === 'macro' && node.content === 'caption') {
      caption = node;

      // remove caption
      const parent = info.parents[0];
      if (parent && parent.type === 'environment') {
        parent.content.splice(info.index || 0, 1);
      }
    }
  });
  return caption;
}

function extractCaptionText(caption: Ast.Macro) {
  const args = getArgsContent(caption);
  return convertToMarkdown(args[args.length - 1] || []).trim();
}

function extractLabel(table: Ast.Node): Ast.Macro | null {
  let caption = null;
  visit(table, (node, info) => {
    if (node.type === 'macro' && node.content === 'label') {
      caption = node;

      // remove label
      const parent = info.parents[0];
      if (parent && parent.type === 'environment') {
        parent.content.splice(info.index || 0, 1);
      }
    }
  });
  return caption;
}

function extractLabelText(caption: Ast.Macro) {
  const args = getArgsContent(caption);
  return printRaw(args[args.length - 1] || []).trim();
}
