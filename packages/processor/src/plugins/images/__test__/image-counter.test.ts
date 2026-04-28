import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('image with counter', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \usepackage{graphicx}
    \usepackage{float}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \newtheorem{theorem}{Theorem}[section]
    \begin{document}

    \section{Hello} \label{hi}

    \begin{theorem} Some text \end{theorem}

    \includegraphics[alt={my \textbf{alt} text}]{image.pdf}

    \begin{figure}[H]
      \includegraphics[alt={my \textbf{alt} text}]{image.pdf}
      \caption{My \textbf{caption}}
    \end{figure}

    \begin{figure}[H]
      \includegraphics[alt={my \textbf{alt} text}]{image.pdf}
      \caption{My \textbf{caption}}
      \label{fig:line}
    \end{figure}

    \begin{figure}[H]
      \includegraphics[alt={my other \textbf{alt} text}]{image.pdf}
      \caption{My other \textbf{caption}}
      \label{fig:line2}
    \end{figure}

    Check out my~\cref{fig:line} and~\cref{fig:line2} and~\cref{hi}.
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: plain
        numberWithin: h2
    ---

    ## Hello {#hi}

    ::: {#thm-1}
    Some text
    :::

    ![](image.pdf){alt="my alt text"}

    ![My **caption**](image.pdf){alt="my alt text"}

    ![My **caption**](image.pdf){#fig-line alt="my alt text"}

    ![My other **caption**](image.pdf){#fig-line-2 alt="my other alt text"}

    Check out my @fig-line and @fig-line-2 and @hi.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    noSections: false,
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <section id="hi">
      <h2><span class="count">1</span> Hello</h2>
      <div class="plain theorem" id="thm-1">
        <p><span class="title"><strong>Theorem 1.1.</strong></span> Some text</p>
      </div>
      <p><img src="image.pdf" alt="my alt text" /></p>
      <figure>
        <div class="fig-content">
          <p><img src="image.pdf" alt="my alt text" /></p>
        </div>
        <figcaption><strong>Figure 1:</strong> My <strong>caption</strong></figcaption>
      </figure>
      <figure id="fig-line">
        <div class="fig-content">
          <p><img src="image.pdf" alt="my alt text" /></p>
        </div>
        <figcaption><strong>Figure 2:</strong> My <strong>caption</strong></figcaption>
      </figure>
      <figure id="fig-line-2">
        <div class="fig-content">
          <p><img src="image.pdf" alt="my other alt text" /></p>
        </div>
        <figcaption><strong>Figure 3:</strong> My other <strong>caption</strong></figcaption>
      </figure>
      <p>Check out my <a href="#fig-line" class="ref">Figure 2</a> and <a href="#fig-line-2" class="ref">Figure 3</a> and <a href="#hi" class="ref">Section 1</a>.</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('image with counterWithin', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \usepackage{graphicx}
    \usepackage{float}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \newtheorem{theorem}{Theorem}
    \counterwithin{theorem}{section}
    \counterwithin{figure}{theorem}
    \begin{document}

    \section{Hello} \label{hi}

    \begin{theorem} Some text \end{theorem}

    \begin{figure}[H]
      \centering
      \includegraphics[alt={my \textbf{alt} text}]{image.pdf}
      \caption{My \textbf{caption}}
    \end{figure}

    \begin{theorem} Some text \end{theorem}

    \begin{figure}[H]
      \centering
      \includegraphics[alt={my \textbf{alt} text}]{image.pdf}
      \caption{My \textbf{caption}}
    \end{figure}

    Check out my~\cref{hi}.
    \end{document}

  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: plain
        counterWithin: section
      figure:
        counterWithin: theorem
    ---

    ## Hello {#hi}

    ::: {#thm-1}
    Some text
    :::

    ![My **caption**](image.pdf){alt="my alt text"}

    ::: {#thm-2}
    Some text
    :::

    ![My **caption**](image.pdf){alt="my alt text"}

    Check out my @hi.
  `);

  expect(markdown).toBe(expectedMarkdown);

  // TODO: will prioritise later
  // const html = await testProcessor.md(markdown);
  // console.log(html);

  // const expectedHtml = unindentStringAndTrim(`
  //   <section id="hi">
  //     <h2><span class="count">1</span> Hello</h2>
  //     <div class="plain theorem" id="thm-1">
  //       <p><span class="title"><strong>Theorem 1.1</strong></span> Some text</p>
  //     </div>
  //     <figure><img src="image.pdf" alt="my alt text" />
  //       <figcaption><strong>Figure 1.1.1:</strong> My <strong>caption</strong></figcaption>
  //     </figure>
  //     <div class="plain theorem" id="thm-2">
  //       <p><span class="title"><strong>Theorem 1.2</strong></span> Some text</p>
  //     </div>
  //     <figure><img src="image.pdf" alt="my alt text" />
  //       <figcaption><strong>Figure 1.2.1:</strong> My <strong>caption</strong></figcaption>
  //     </figure>
  //     <p>Check out my <a href="#hi" class="ref">Section 1</a>.</p>
  //   </section>
  // `);

  // expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});
