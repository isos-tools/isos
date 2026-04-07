import { Root } from '@unified-latex/unified-latex-types';
import { findExpl3AndAtLetterRegionsInArray } from '@unified-latex/unified-latex-util-catcode';

export function removeAtLetter() {
  return (tree: Root) => {
    // console.log(tree.content);

    const { atLetterOnly } = findExpl3AndAtLetterRegionsInArray(
      tree.content,
    );

    for (let i = atLetterOnly.length - 1; i >= 0; i--) {
      const { start, end } = atLetterOnly[i];
      tree.content.splice(start, end - start);
    }

    // console.log(tree.content);
  };
}
