import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('maths with references', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{amsthm}

    \usepackage[overload]{keytheorems}
    \usepackage{zref-clever}
    \usepackage[colorlinks,bookmarks=false]{hyperref}
    \zcsetup{noabbrev, cap, nameinlink}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[section]

    \begin{document}

    \section{Alpha}

    \begin{theorem}[Bravo] Charlie.
    \label{thm:one}
    \end{theorem}

    \begin{theorem}[Bravo] Charlie.
    \label{thm:two}
    \end{theorem}

    \begin{theorem}[Bravo] Charlie.
    \label{thm:three}
    \end{theorem}

    $$
    \begin{aligned}
    (by~\zcref{thm:one}~and~\zcref{thm:two}~and~\zcref{thm:three})
    \end{aligned}
    $$

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      theorem:
        numberWithin: h2
    ---

    ## Alpha

    ::: {#thm-one name="Bravo"}
    Charlie.
    :::

    ::: {#thm-two name="Bravo"}
    Charlie.
    :::

    ::: {#thm-three name="Bravo"}
    Charlie.
    :::

    $$
    \begin{aligned}(by~\zcref{thm:one}~and~\zcref{thm:two}~and~\zcref{thm:three})\end{aligned}
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="definition theorem" id="thm-one">
      <p><span class="title"><strong>Theorem 1.1 (Bravo).</strong></span> Charlie.</p>
    </div>
    <div class="definition theorem" id="thm-two">
      <p><span class="title"><strong>Theorem 1.2 (Bravo).</strong></span> Charlie.</p>
    </div>
    <div class="definition theorem" id="thm-three">
      <p><span class="title"><strong>Theorem 1.3 (Bravo).</strong></span> Charlie.</p>
    </div>
    <p class="maths"><code class="latex">\begin{aligned}(by~\href{#thm-one}{Theorem 1.1}~and~\href{#thm-two}{Theorem 1.2}~and~\href{#thm-three}{Theorem 1.3})\end{aligned}</code></p>
  `);

  expect(html).toBe(expectedHtml);
});

test('maths with cleveref references', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{amsthm}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \usepackage[colorlinks,bookmarks=false]{hyperref}

    \newtheorem{theorem}{Theorem}[section]

    \begin{document}

    \section{Alpha}

    \begin{theorem}[Bravo] Charlie.
    \label{thm:one}
    \end{theorem}

    $$
    (by~\cref{thm:one})
    $$

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      theorem:
        style: plain
        numberWithin: h2
    ---

    ## Alpha

    ::: {#thm-one name="Bravo"}
    Charlie.
    :::

    $$
    (by~\cref{thm:one})
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="plain theorem" id="thm-one">
      <p><span class="title"><strong>Theorem 1.1 (Bravo).</strong></span> Charlie.</p>
    </div>
    <p class="maths"><code class="latex">(by~\href{#thm-one}{Theorem 1.1})</code></p>
  `);

  expect(html).toBe(expectedHtml);
});

test('maths with ref', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{amsthm}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \usepackage[colorlinks,bookmarks=false]{hyperref}

    \newtheorem{theorem}{Theorem}[section]

    \begin{document}

    \section{Alpha}

    \begin{theorem}[Bravo] Charlie.
    \label{thm:one}
    \end{theorem}

    $$
    (by~\ref{thm:one})
    $$

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      theorem:
        style: plain
        numberWithin: h2
    ---

    ## Alpha

    ::: {#thm-one name="Bravo"}
    Charlie.
    :::

    $$
    (by~\ref{thm:one})
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="plain theorem" id="thm-one">
      <p><span class="title"><strong>Theorem 1.1 (Bravo).</strong></span> Charlie.</p>
    </div>
    <p class="maths"> <span class="warn"><strong>unhandled macro: ref</strong></span> </p>
  `);

  expect(html).toBe(expectedHtml);
});
