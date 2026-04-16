import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('footnote', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}



    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return

  const expectedMarkdown = unindentStringAndTrim(String.raw`

  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);
  // return

  const expectedHtml = unindentStringAndTrim(String.raw`

  `);

  expect(html).toBe(expectedHtml);
});
