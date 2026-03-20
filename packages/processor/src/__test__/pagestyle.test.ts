import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('thispagestyle macro', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \documentclass{article}
    \begin{document}
    \thispagestyle{empty}
    \end{document}
  `);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(``);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(``);

  expect(html).toBe(expectedHtml);
});
