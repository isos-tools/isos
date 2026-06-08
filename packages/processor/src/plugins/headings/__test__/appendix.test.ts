import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('appendix', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{appendix}
    \begin{document}

    \section{The 1st section}

    \begin{appendices}
      \section{The 1st appendix}
      \section{The 2nd appendix}
      \subsection{The subsection}
    \end{appendices}

    \begin{appendices}
      \section{The 3rd appendix}
      \section{The 4th appendix}
    \end{appendices}

    \section{The 2nd section}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ## The 1st section

    :::appendices
    ## The 1st appendix

    ## The 2nd appendix

    ### The subsection
    :::

    :::appendices
    ## The 3rd appendix

    ## The 4th appendix
    :::

    ## The 2nd section
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="the-1st-section"><span class="count">1</span> The 1st section</h2>
    <h2 id="the-1st-appendix"><span class="count">A</span> The 1st appendix</h2>
    <h2 id="the-2nd-appendix"><span class="count">B</span> The 2nd appendix</h2>
    <h3 id="the-subsection"><span class="count">B.1</span> The subsection</h3>
    <h2 id="the-3rd-appendix"><span class="count">C</span> The 3rd appendix</h2>
    <h2 id="the-4th-appendix"><span class="count">D</span> The 4th appendix</h2>
    <h2 id="the-2nd-section"><span class="count">2</span> The 2nd section</h2>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('appendix with book documentClass', async () => {
  const latex = String.raw`
    \documentclass{book}
    \usepackage{appendix}
    \begin{document}

    \chapter{The 1st chapter}

    \begin{appendices}
      \chapter{The 1st appendix}
      \chapter{The 2nd appendix}
      \section{The section}
    \end{appendices}

    \begin{appendices}
      \chapter{The 3rd appendix}
      \chapter{The 4th appendix}
    \end{appendices}

    \chapter{The 2nd chapter}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    documentClass: book
    ---

    ## The 1st chapter

    :::appendices
    ## The 1st appendix

    ## The 2nd appendix

    ### The section
    :::

    :::appendices
    ## The 3rd appendix

    ## The 4th appendix
    :::

    ## The 2nd chapter
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="the-1st-chapter"><span class="count">Chapter 1:</span> The 1st chapter</h2>
    <h2 id="the-1st-appendix">Appendix <span class="count">A</span>: The 1st appendix</h2>
    <h2 id="the-2nd-appendix">Appendix <span class="count">B</span>: The 2nd appendix</h2>
    <h3 id="the-section"><span class="count">B.1</span> The section</h3>
    <h2 id="the-3rd-appendix">Appendix <span class="count">C</span>: The 3rd appendix</h2>
    <h2 id="the-4th-appendix">Appendix <span class="count">D</span>: The 4th appendix</h2>
    <h2 id="the-2nd-chapter"><span class="count">Chapter 2:</span> The 2nd chapter</h2>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('appendix with labels and references', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{appendix}
    \usepackage[colorlinks=true,bookmarks=false,linkcolor=blue]{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \AtBeginEnvironment{appendices}{\crefalias{section}{appendix}}
    \begin{document}

    \section{The 1st section}
    \label{alpha}

    \cref{alpha}, \cref{bravo}, \cref{charlie}, \cref{delta} and \cref{echo}.

    \begin{appendices}
      \section{The 1st appendix}
      \label{bravo}
      \section{The 2nd appendix}
    \end{appendices}

    \begin{appendices}
      \section{The 3rd appendix}
      \section{The 4th appendix}
      \label{charlie}
      \subsection{The subsection}
      \label{delta}
    \end{appendices}

    \section{The 2nd section}
    \label{echo}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return

  const expectedMarkdown = unindentStringAndTrim(`
    ## The 1st section {#alpha}

    @alpha, @bravo, @charlie, @delta and @echo.

    :::appendices
    ## The 1st appendix {#bravo}

    ## The 2nd appendix
    :::

    :::appendices
    ## The 3rd appendix

    ## The 4th appendix {#charlie}

    ### The subsection {#delta}

    :::

    ## The 2nd section {#echo}

  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> The 1st section</h2>
    <p><a href="#alpha" class="ref">Section 1</a>, <a href="#bravo" class="ref">Appendix A</a>, <a href="#charlie" class="ref">Appendix D</a>, <a href="#delta" class="ref">Section D.1</a> and <a href="#echo" class="ref">Section 2</a>.</p>
    <h2 id="bravo"><span class="count">A</span> The 1st appendix</h2>
    <h2 id="the-2nd-appendix"><span class="count">B</span> The 2nd appendix</h2>
    <h2 id="the-3rd-appendix"><span class="count">C</span> The 3rd appendix</h2>
    <h2 id="charlie"><span class="count">D</span> The 4th appendix</h2>
    <h3 id="delta"><span class="count">D.1</span> The subsection</h3>
    <h2 id="echo"><span class="count">2</span> The 2nd section</h2>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});
