import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('maths', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}

    \section{Hello}

    $$
    x^2 - 5 x + 6 = 0
    $$

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ## Hello

    $$
    x^{2} - 5 x + 6 = 0
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    // state: {
    //   maths: {
    //     mathsAsTex: false,
    //     mathsFontName: 'termes',
    //     syntaxHighlight: false,
    //   },
    // },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="hello"><span class="count">1</span> Hello</h2>
    <p class="maths"><code class="latex">x^{2} - 5 x + 6 = 0</code></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths equations', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \begin{document}

    \section{Hello}

    \begin{equation}
    \label{eq:myref1}
    x^2 - 5 x + 6 = 0
    \end{equation}

    \begin{equation}
    x^2 - 5 x + 6 = 0
    \end{equation}

    \begin{equation}
    \label{eq:myref3}
    x^2 - 5 x + 6 = 0
    \end{equation}

    Check out \autoref{eq:myref1} and \autoref{eq:myref2} and \autoref{eq:myref3}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ## Hello

    $$
    \begin{equation}x^{2} - 5 x + 6 = 0\end{equation}
    $$ {#eq-myref-1}

    $$
    \begin{equation}x^{2} - 5 x + 6 = 0\end{equation}
    $$

    $$
    \begin{equation}x^{2} - 5 x + 6 = 0\end{equation}
    $$ {#eq-myref-3}

    Check out @eq-myref-1 and @eq-myref-2 and @eq-myref-3.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    // state: {
    //   maths: {
    //     mathsAsTex: false,
    //     mathsFontName: 'termes',
    //     syntaxHighlight: false,
    //   },
    // },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="hello"><span class="count">1</span> Hello</h2>
    <p id="eq-myref-1" class="maths env-equation"><code class="latex">\begin{equation}x^{2} - 5 x + 6 = 0\end{equation}</code><span class="eq-count">(1)</span></p>
    <p class="maths env-equation"><code class="latex">\begin{equation}x^{2} - 5 x + 6 = 0\end{equation}</code><span class="eq-count">(2)</span></p>
    <p id="eq-myref-3" class="maths env-equation"><code class="latex">\begin{equation}x^{2} - 5 x + 6 = 0\end{equation}</code><span class="eq-count">(3)</span></p>
    <p>Check out <a href="#eq-myref-1" class="ref">Equation 1</a> and <span class="warn"><strong>unknown ref:</strong> <code>eq-myref-2</code></span> and <a href="#eq-myref-3" class="ref">Equation 3</a>.</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('dont label unnumbered equations', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \newcommand{\R}{\mathbb{R}}
    \begin{document}

    \begin{equation*}\label{S1}
    \exists M \in \R \st \forall x \in S, x \leq M.
    \end{equation*}

    \begin{equation}\label{S2}
    \forall x \in S, \exists M \in \R, x \leq M
    \end{equation}

    Difference between (\cref{S1}) and (\cref{S2}).

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \begin{equation*}\exists M \in \mathbb{R} \st \forall x \in S, x \leq M.\end{equation*}
    $$

    $$
    \begin{equation}\forall x \in S, \exists M \in \mathbb{R}, x \leq M\end{equation}
    $$ {#s-2}

    Difference between (@s-1) and (@s-2).
  `);

  expect(markdown).toBe(expectedMarkdown);

  // TODO: linaria fails here
  // const html = await testProcessor.md(markdown);
  // console.log(html);

  // const expectedHtml = unindentStringAndTrim(String.raw`

  // `);

  // expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths with \\pounds', async () => {
  const latex = String.raw`
    i.e.  $\pounds 1$ wins
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    i.e. $\pounds 1$ wins
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsAsTex: false,
        mathsFontName: 'computerModern',
        syntaxHighlight: false,
      },
    },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>i.e. <code class="maths"><svg style="vertical-align: -0.079ex;" xmlns="http://www.w3.org/2000/svg" width="2.828ex" height="1.624ex" role="img" focusable="false" viewBox="0 -683 1250 718" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="MJX-1-NCM-N-A3" d="M515 529C515 501 537 479 565 479C592 479 614 502 614 529C614 617 536 683 448 683C388 683 340 655 305 598C275 550 260 494 260 430C260 413 262 390 266 361L118 361L118 323L272 323L285 254C292 217 296 188 298 166C268 183 238 192 208 192C135 192 62 154 62 85C62 27 108-22 166-22C261-22 358 8 373 78L398 56C433 26 472-5 502-17C532-29 558-35 580-35C662-35 688 62 688 150L654 150C654 81 607 24 540 24C520 24 500 29 479 38C431 60 419 72 375 108C375 137 366 208 347 323L496 323L496 361L342 361C339 386 337 409 337 430C337 470 340 505 346 536C357 591 389 649 448 649C504 649 550 617 569 578L565 578C538 578 515 556 515 529M166 11C126 11 96 45 96 85C96 135 153 159 208 159C239 159 269 150 300 132L301 117C305 53 231 11 166 11Z"></path><path id="MJX-1-NCM-N-31" d="M269 666C228 624 168 603 89 603L89 564C141 564 184 572 217 588L217 82C217 64 213 52 204 47C195 42 170 39 130 39L95 39L95 0C120 2 174 3 257 3C340 3 394 2 419 0L419 39L384 39C343 39 318 42 310 47C302 52 297 64 297 82L297 636C297 660 295 666 269 666Z"></path></defs><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math" data-latex="\pounds 1"><g data-mml-node="mtext" data-latex="\textsterling"><use data-c="A3" xlink:href="#MJX-1-NCM-N-A3"></use></g><g data-mml-node="mn" data-latex="1" transform="translate(750,0)"><use data-c="31" xlink:href="#MJX-1-NCM-N-31"></use></g></g></g></svg></code> wins</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('labelled align environments', async () => {
  const latex = String.raw`
    \begin{align}
    x.\label{I8}
    \end{align}

    Difference between (\autoref{I8}).
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \begin{align}x.\end{align}
    $$ {#i-8}

    Difference between (@i-8).
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p id="i-8" class="maths env-equation"><code class="latex">\begin{align}
    x.
    \end{align}</code><span class="eq-count">(1)</span></p>
    <p>Difference between (<a href="#i-8" class="ref">Equation 1</a>).</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('hspace', async () => {
  const latex = String.raw`
    \[
    \hspace{-5mm}
    \]

    \[
    \hspace*{-5mm}
    \]
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \hspace{-5mm}
    $$

    $$
    \hspace{-5mm}
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    // state: {
    //   // @ts-expect-error
    //   maths: {
    //     mathsAsTex: false,
    //     mathsFontName: 'computerModern',
    //     syntaxHighlight: false,
    //   },
    // },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><code class="latex">\hspace{-5mm}</code></p>
    <p class="maths"><code class="latex">\hspace{-5mm}</code></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});
