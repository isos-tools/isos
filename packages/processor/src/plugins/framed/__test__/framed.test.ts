import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('framed environment', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \newtheorem{definition}{Definition}
    \begin{document}

    \begin{framed}
    \begin{definition} A \emph{matrix}.
    \end{definition}
    \vspace*{-4mm}
    \end{framed}

    \end{document}
  `);

  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      definition:
        heading: Definition
    ---

    ::::framed
    :::definition
    A *matrix*.
    :::
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="framed">
      <div class="theorem definition">
        <p><span class="title"><strong>Definition 1.</strong></span> A <em>matrix</em>.</p>
      </div>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \documentclass{article}
    \usepackage{framed}
    \usepackage{amsthm}
    \newtheorem{exercise}{Exercise}
    \begin{document}

    \begin{framed}
    \begin{exercise}
    Verify and explain
    \end{exercise}
    These results are summarised
    \end{framed}

    \end{document}
  `);

  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      exercise:
        heading: Exercise
    ---

    ::::framed
    :::exercise
    Verify and explain
    :::

    These results are summarised
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="framed">
      <div class="theorem exercise">
        <p><span class="title"><strong>Exercise 1.</strong></span> Verify and explain</p>
      </div>
      <p>These results are summarised</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
