import { Parbreak, Root } from '@unified-latex/unified-latex-types';
import { visit } from '@unified-latex/unified-latex-util-visit';

const parBreak: Parbreak = {
  type: 'parbreak',
};

export function insertParbreaksAroundImage() {
  return (tree: Root) => {
    // console.dir(tree, { depth: null });
    visit(tree, (node, info) => {
      if (node.type === 'macro' && node.content === 'includegraphics') {
        const parent = info.parents[0];
        const idx = info.index;

        if (parent && parent.type === 'environment' && idx) {
          const prev = idx > 0 ? idx - 1 : null;
          const next = idx < parent.content.length - 1 ? idx + 1 : null;
          const res = [];

          if (prev !== null && parent.content[prev].type !== 'parbreak') {
            res.push(parBreak);
          }

          res.push(node);

          if (next !== null && parent.content[next].type !== 'parbreak') {
            res.push(parBreak);
          }

          parent.content.splice(idx, 1, ...res);
        }
      }
    });
  };
}
