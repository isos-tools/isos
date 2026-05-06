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

test('workaround for textsize macros around whole document', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \documentclass{article}
    \begin{document}

    \Large{
      \section Alpha
      \begin{enumerate}
      \item Bravo
      \item Charlie
      \end{enumerate}
      Delta
    }

    \end{document}
  `);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ## Alpha

    1. Bravo

    2. Charlie

    Delta
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <ol>
      <li>
        <p>Bravo</p>
      </li>
      <li>
        <p>Charlie</p>
      </li>
    </ol>
    <p>Delta</p>
  `);

  expect(html).toBe(expectedHtml);
});
