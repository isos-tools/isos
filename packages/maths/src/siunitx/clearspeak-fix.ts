import type { DOMAdaptor } from '@mathjax/src/js/core/DOMAdaptor.js';
import { AbstractMmlTokenNode, MmlNode } from '@mathjax/src/js/core/MmlTree/MmlNode.js';
import { SerializedMmlVisitor } from '@mathjax/src/js/core/MmlTree/SerializedMmlVisitor.js';
import { chooseAdaptor } from '@mathjax/src/js/adaptors/chooseAdaptor.js';
import { STATE } from '@mathjax/src/js/core/MathItem.js';
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js';
import { MathML } from '@mathjax/src/js/input/mathml.js';
import { mathjax } from '@mathjax/src/js/mathjax.js';

// Transform MathML to reduce Clearspeak “empty” for layout-only spacing tokens.

const adaptor = chooseAdaptor();
RegisterHTMLHandler(adaptor as DOMAdaptor<HTMLElement, Text, Document>);

const mmlDoc = mathjax.document('', {
  InputJax: new MathML(),
});

const visitor = new SerializedMmlVisitor();

export function clearspeakFix(mml: string): string {
  const root = mmlDoc.convert(mml, { end: STATE.CONVERT });
  const fixes = collectSpacingFixes(root);
  for (const fix of fixes) {
    if (fix.kind === 'remove') {
      fix.parent.removeChild(fix.node);
    } else {
      const ms = fix.node.factory.create('mspace', { width: fix.width }, []);
      fix.parent.replaceChild(ms, fix.node);
    }
  }
  return visitor.visitTree(root);
}

type Child = { parent: MmlNode; node: MmlNode }
type RemoveNode = Child & { kind: 'remove'; };
type MspaceNode = Child & { kind: 'mspace'; width: string };
type SpacingFix = (RemoveNode | MspaceNode)

function collectSpacingFixes(root: MmlNode) {
  const out: SpacingFix[] = [];

  root.walkTree((node: MmlNode) => {
    if (!node.isToken || !node.parent) {
      return;
    }
    const parent = node.parent;
    if (node.isKind('mtext')) {
      const tokenNode = node as AbstractMmlTokenNode
      const text = tokenNode.getText();

      if (text.length === 0 || spacingOnlyEmSum(text) !== null) {
        out.push({ kind: 'remove', parent, node });
      }

    } else if (node.isKind('mo')) {
      const tokenNode = node as AbstractMmlTokenNode
      const text = tokenNode.getText();

      if (text.length !== 0) {
        const sum = spacingOnlyEmSum(text);
        if (sum !== null) {
          out.push({ kind: 'mspace', parent, node, width: formatEm(sum) });
        }
      }
    }
  });

  return out;
}

// Em widths for Unicode spaces MathJax uses in `mo` / `mtext` for TeX glue.

const emSpacing = new Map<string, number>([
  ['\u2000', 0.5],
  ['\u2001', 1],
  ['\u2002', 0.5],
  ['\u2003', 1],
  ['\u2004', 0.333],
  ['\u2005', 0.25],
  ['\u2006', 0.167],
  ['\u2007', 0.556],
  ['\u2008', 0.278],
  ['\u2009', 0.167],
  ['\u200A', 0.083],
  ['\u200B', 0],
  ['\u00A0', 0.25],
  [' ', 0.25],
]);

function spacingOnlyEmSum(text: string): number | null {
  if (text.length === 0) {
    return 0;
  }
  let sum = 0;
  for (const ch of text) {
    const em = emSpacing.get(ch);
    if (em === undefined) {
      return null;
    }
    sum += em;
  }
  return sum;
}

function formatEm(sum: number): string {
  if (sum === 0) {
    return '0em';
  }
  const rounded = Math.round(sum * 1000) / 1000;
  return `${rounded}em`;
}
