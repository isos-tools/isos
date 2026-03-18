import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('new environment command', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \documentclass{article}

    \newenvironment{rems}{\paragraph{Remarks}\begin{enumerate}}{\end{enumerate}}

    \begin{document}

    \begin{rems}
      \item a.
      \item b.
      \item c.
    \end{rems}

    \end{document}
  `);

  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ##### Remarks

    1) a.

    2) b.

    3) c.
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);

  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <h5 id="remarks">Remarks</h5>
    <ol>
      <li>
        <p>a.</p>
      </li>
      <li>
        <p>b.</p>
      </li>
      <li>
        <p>c.</p>
      </li>
    </ol>
  `);

  expect(html).toBe(expectedHtml);
});
