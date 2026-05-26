import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('sections', async () => {
  const latex = String.raw`
    \section{Section1}

    a

    b

    \subsection{Subsection2}

    c

    d

    \section{Section3}

    e

    f

    \subsection{Subsection4}

    g

    h
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ## Section1

    a

    b

    ### Subsection2

    c

    d

    ## Section3

    e

    f

    ### Subsection4

    g

    h
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section id="section1">
      <h2><span class="count">1</span> Section1</h2>
      <p>a</p>
      <p>b</p>
    </section>
    <section id="subsection2">
      <h3><span class="count">1.1</span> Subsection2</h3>
      <p>c</p>
      <p>d</p>
    </section>
    <section id="section3">
      <h2><span class="count">2</span> Section3</h2>
      <p>e</p>
      <p>f</p>
    </section>
    <section id="subsection4">
      <h3><span class="count">2.1</span> Subsection4</h3>
      <p>g</p>
      <p>h</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('add section if none exist', async () => {
  const latex = String.raw`
    a

    b
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    a

    b
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section>
      <p>a</p>
      <p>b</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('section with id', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \begin{document}

    \section{Hello}
    \label{sec:hi}

    See \cref{sec:hi}.
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ## Hello {#sec-hi}

    See @sec-hi.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    noSections: false,
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <section id="sec-hi">
      <h2><span class="count">1</span> Hello</h2>
      <p>See <a href="#sec-hi" class="ref">Section 1</a>.</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const pandocHtml = await markdownToPandocHtml(expectedMarkdown);
  // console.log(pandocHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});
