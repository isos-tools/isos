import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('framed environment', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \begin{framed}
    \begin{definition} A \emph{matrix}.
    \end{definition}
    \vspace*{-4mm}
    \end{framed}
  `);

  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::::framed
    ::: {#def-1}
    A *matrix*.
    :::
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="framed">
      <div class="definition" id="def-1">
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
    ::::framed
    ::: {#exr-1}
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
      <div class="definition exercise" id="exr-1">
        <p><span class="title"><strong>Exercise 1.</strong></span> Verify and explain</p>
      </div>
      <p>These results are summarised</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
