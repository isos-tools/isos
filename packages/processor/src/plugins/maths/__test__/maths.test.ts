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

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ## Hello

    $$
    \begin{equation}\label{eq-myref-1}x^{2} - 5 x + 6 = 0\end{equation}
    $$ {#eq-myref-1}

    $$
    \begin{equation}x^{2} - 5 x + 6 = 0\end{equation}
    $$

    $$
    \begin{equation}\label{eq-myref-3}x^{2} - 5 x + 6 = 0\end{equation}
    $$ {#eq-myref-3}

    Check out @eq-myref-1 and @eq-myref-2 and @eq-myref-3.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="hello"><span class="count">1</span> Hello</h2>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="eq-myref-1"><mtext>(1)</mtext></mtd>
          <mtd>
            <msup>
              <mi>x</mi>
              <mrow data-mjx-texclass="ORD">
                <mn>2</mn>
              </mrow>
            </msup>
            <mo>−</mo>
            <mn>5</mn>
            <mi>x</mi>
            <mo>+</mo>
            <mn>6</mn>
            <mo>=</mo>
            <mn>0</mn>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd><mtext>(2)</mtext></mtd>
          <mtd>
            <msup>
              <mi>x</mi>
              <mrow data-mjx-texclass="ORD">
                <mn>2</mn>
              </mrow>
            </msup>
            <mo>−</mo>
            <mn>5</mn>
            <mi>x</mi>
            <mo>+</mo>
            <mn>6</mn>
            <mo>=</mo>
            <mn>0</mn>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="eq-myref-3"><mtext>(3)</mtext></mtd>
          <mtd>
            <msup>
              <mi>x</mi>
              <mrow data-mjx-texclass="ORD">
                <mn>2</mn>
              </mrow>
            </msup>
            <mo>−</mo>
            <mn>5</mn>
            <mi>x</mi>
            <mo>+</mo>
            <mn>6</mn>
            <mo>=</mo>
            <mn>0</mn>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
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
    \begin{equation*}\label{s-1}\exists M \in \mathbb{R} \st \forall x \in S, x \leq M.\end{equation*}
    $$

    $$
    \begin{equation}\label{s-2}\forall x \in S, \exists M \in \mathbb{R}, x \leq M\end{equation}
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
        mathsRendering: 'svg',
      },
    },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>i.e. <mjx-container class="MathJax" jax="SVG" overflow="scale" display="false" style="font-size: 108%;"><svg xmlns="http://www.w3.org/2000/svg" width="2.828ex" height="1.624ex" role="img" focusable="false" viewBox="0 -683 1250 718" style="vertical-align: -0.079ex;">
          <g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)">
            <g data-mml-node="math">
              <g data-mml-node="mtext">
                <path data-c="A3" d="M515 529C515 501 537 479 565 479C592 479 614 502 614 529C614 617 536 683 448 683C388 683 340 655 305 598C275 550 260 494 260 430C260 413 262 390 266 361L118 361L118 323L272 323L285 254C292 217 296 188 298 166C268 183 238 192 208 192C135 192 62 154 62 85C62 27 108-22 166-22C261-22 358 8 373 78L398 56C433 26 472-5 502-17C532-29 558-35 580-35C662-35 688 62 688 150L654 150C654 81 607 24 540 24C520 24 500 29 479 38C431 60 419 72 375 108C375 137 366 208 347 323L496 323L496 361L342 361C339 386 337 409 337 430C337 470 340 505 346 536C357 591 389 649 448 649C504 649 550 617 569 578L565 578C538 578 515 556 515 529M166 11C126 11 96 45 96 85C96 135 153 159 208 159C239 159 269 150 300 132L301 117C305 53 231 11 166 11Z"></path>
              </g>
              <g data-mml-node="mn" transform="translate(750,0)">
                <path data-c="31" d="M269 666C228 624 168 603 89 603L89 564C141 564 184 572 217 588L217 82C217 64 213 52 204 47C195 42 170 39 130 39L95 39L95 0C120 2 174 3 257 3C340 3 394 2 419 0L419 39L384 39C343 39 318 42 310 47C302 52 297 64 297 82L297 636C297 660 295 666 269 666Z"></path>
              </g>
            </g>
          </g>
        </svg></mjx-container> wins</p>
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
    \begin{align}x.\label{i-8}\end{align}
    $$ {#i-8}

    Difference between (@i-8).
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom">
        <mlabeledtr>
          <mtd id="i-8"><mtext>(1)</mtext></mtd>
          <mtd>
            <mi>x</mi>
            <mo>.</mo>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
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

test('expand newcommand inside newcommand', async () => {
  const latex = String.raw`
    \documentclass{article}

    \usepackage{amsmath}

    \newcommand\pd\partial

    \begin{document}

    \newcommand\curldet[3]{\frac{\pd}{\pd y}}

    \renewcommand\curldet[3]{\frac{\pd}{\pd y}}

    Hello $\curldet{a}{b}{c}$

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Hello $\frac{\partial}{\partial y}$
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
    <p>Hello <code class="latex">\frac{\partial}{\partial y}</code></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths equation with tag', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \begin{document}
    \begin{equation}
      a+b\tag{$*$}
    \end{equation}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \begin{equation}a+b\tag{$*$}\end{equation}
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd><mtext>(</mtext>
            <mrow data-mjx-texclass="ORD">
              <mo>∗</mo>
            </mrow>
          <mtext>)</mtext></mtd>
          <mtd>
            <mi>a</mi>
            <mo>+</mo>
            <mi>b</mi>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths equations with labels and tags', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \begin{document}

    \begin{equation}\label{eq:einstein1}
      E=mc^2
    \end{equation}

    Hello, \cref{eq:einstein1}.

    \begin{equation}\label{eq:einstein2}
      E=mc^2\tag{hello$E$}
    \end{equation}

    Hello, \cref{eq:einstein2}.

    \begin{equation}\label{eq:einstein3}
      E=mc^2
    \end{equation}

    Hello, \cref{eq:einstein3}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \begin{equation}\label{eq-einstein-1}E=mc^{2}\end{equation}
    $$ {#eq-einstein-1}

    Hello, @eq-einstein-1.

    $$
    \begin{equation}\label{eq-einstein-2}E=mc^{2}\tag{hello$E$}\end{equation}
    $$ {#eq-einstein-2}

    Hello, @eq-einstein-2.

    $$
    \begin{equation}\label{eq-einstein-3}E=mc^{2}\end{equation}
    $$ {#eq-einstein-3}

    Hello, @eq-einstein-3.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="eq-einstein-1"><mtext>(1)</mtext></mtd>
          <mtd>
            <mi>E</mi>
            <mo>=</mo>
            <mi>m</mi>
            <msup>
              <mi>c</mi>
              <mrow data-mjx-texclass="ORD">
                <mn>2</mn>
              </mrow>
            </msup>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <p>Hello, <a href="#eq-einstein-1" class="ref">Equation 1</a>.</p>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="eq-einstein-2"><mtext>(</mtext>
            <mrow>
              <mtext>hello</mtext>
              <mrow data-mjx-texclass="ORD">
                <mi>E</mi>
              </mrow>
            </mrow>
          <mtext>)</mtext></mtd>
          <mtd>
            <mi>E</mi>
            <mo>=</mo>
            <mi>m</mi>
            <msup>
              <mi>c</mi>
              <mrow data-mjx-texclass="ORD">
                <mn>2</mn>
              </mrow>
            </msup>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <p>Hello, <a href="#eq-einstein-2" class="ref">Equation hello<span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML">
      <mi>E</mi>
    </math></span></a>.</p>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="eq-einstein-3"><mtext>(2)</mtext></mtd>
          <mtd>
            <mi>E</mi>
            <mo>=</mo>
            <mi>m</mi>
            <msup>
              <mi>c</mi>
              <mrow data-mjx-texclass="ORD">
                <mn>2</mn>
              </mrow>
            </msup>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <p>Hello, <a href="#eq-einstein-3" class="ref">Equation 2</a>.</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths equation in book documentclass', async () => {
  const latex = String.raw`
    \documentclass{book}
    \begin{document}
    \chapter{Differential systems}
    \begin{equation}
    x_0
    \end{equation}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    documentClass: book
    ---

    ## Differential systems

    $$
    \begin{equation}x_{0}\end{equation}
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="differential-systems"><span class="count">Chapter 1:</span> Differential systems</h2>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd><mtext>(1.1)</mtext></mtd>
          <mtd>
            <msub>
              <mi>x</mi>
              <mrow data-mjx-texclass="ORD">
                <mn>0</mn>
              </mrow>
            </msub>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths eqnarray', async () => {
  const latex = String.raw`
    \documentclass{article}

    \begin{document}

    $$
    x^2 - 5 x + 6 = 0
    $$

    \begin{eqnarray*}
    \dot{x} & = & y\\
    \dot{y} & = & -\nu y-\omega ^2 x.
    \end{eqnarray*}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    x^{2} - 5 x + 6 = 0
    $$

    :warn[**unhandled environment: eqnarray\***]
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><code class="latex">x^{2} - 5 x + 6 = 0</code></p>
    <p> <span class="warn"><strong>unhandled environment: eqnarray*</strong></span> </p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths equation numberwithin', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath, amsthm}
    \usepackage[colorlinks=true,bookmarks=false,linkcolor=blue]{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \numberwithin{equation}{section}
    \begin{document}

    \begin{equation}\label{eq:1}
      x
    \end{equation}

    See \autoref{eq:1}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    equation:
      numberWithin: h2
    ---

    $$
    \begin{equation}\label{eq-1}x\end{equation}
    $$ {#eq-1}

    See @eq-1.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="eq-1"><mtext>(0.1)</mtext></mtd>
          <mtd>
            <mi>x</mi>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <p>See <a href="#eq-1" class="ref">Equation 0.1</a>.</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('empty maths', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}

    $a$

    $ $

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $a$

    $ $
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p><code class="latex">a</code></p>
    <p><code class="latex"> </code></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths environments not wrapped in pars', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}

    $$
    \begin{array}{c} a_{11} \end{array}
    $$

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \begin{array}{c}a_{11}\end{array}
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><code class="latex">\begin{array}{c}a_{11}\end{array}</code></p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('maths align with all labels', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{amsfonts}

    \usepackage[overload]{keytheorems}
    \usepackage{zref-clever}
    \usepackage[colorlinks,bookmarks=false]{hyperref}
    \zcsetup{noabbrev, cap, nameinlink}

    \begin{document}

    \begin{align}
      a &= b \label{eq:a}\\
      b &= c\\
      c &= d\tag{$*$}\\
      d &= e\label{eq:b}\tag{$x$}\\
      e &= f.\label{eq:c}
    \end{align}

    See $a = b$ \autoref{eq:a}, \autoref{eq:b} and \autoref{eq:c}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \begin{align}a&= b \label{eq-a}\\ b&= c\\ c&= d\tag{$*$}\\ d&= e\label{eq-b}\tag{$x$}\\ e&= f.\label{eq-c}\end{align}
    $$

    See $a = b$ @eq-a, @eq-b and @eq-c.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true" columnalign="right left" columnspacing="0em" rowspacing="3pt" data-break-align="bottom top">
        <mlabeledtr>
          <mtd id="eq-a"><mtext>(1)</mtext></mtd>
          <mtd>
            <mi>a</mi>
          </mtd>
          <mtd>
            <mstyle indentshift="2em">
              <mi></mi>
              <mo>=</mo>
              <mi>b</mi>
            </mstyle>
          </mtd>
        </mlabeledtr>
        <mlabeledtr>
          <mtd><mtext>(2)</mtext></mtd>
          <mtd>
            <mi>b</mi>
          </mtd>
          <mtd>
            <mstyle indentshift="2em">
              <mi></mi>
              <mo>=</mo>
              <mi>c</mi>
            </mstyle>
          </mtd>
        </mlabeledtr>
        <mlabeledtr>
          <mtd><mtext>(</mtext>
            <mrow data-mjx-texclass="ORD">
              <mo>∗</mo>
            </mrow>
          <mtext>)</mtext></mtd>
          <mtd>
            <mi>c</mi>
          </mtd>
          <mtd>
            <mstyle indentshift="2em">
              <mi></mi>
              <mo>=</mo>
              <mi>d</mi>
            </mstyle>
          </mtd>
        </mlabeledtr>
        <mlabeledtr>
          <mtd id="eq-b"><mtext>(</mtext>
            <mrow data-mjx-texclass="ORD">
              <mi>x</mi>
            </mrow>
          <mtext>)</mtext></mtd>
          <mtd>
            <mi>d</mi>
          </mtd>
          <mtd>
            <mstyle indentshift="2em">
              <mi></mi>
              <mo>=</mo>
              <mi>e</mi>
            </mstyle>
          </mtd>
        </mlabeledtr>
        <mlabeledtr>
          <mtd id="eq-c"><mtext>(3)</mtext></mtd>
          <mtd>
            <mi>e</mi>
          </mtd>
          <mtd>
            <mstyle indentshift="2em">
              <mi></mi>
              <mo>=</mo>
              <mi>f</mi>
              <mo>.</mo>
            </mstyle>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <p>See <span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML">
      <mi>a</mi>
      <mo>=</mo>
      <mi>b</mi>
    </math></span> <a href="#eq-a" class="ref">Equation 1</a>, <a href="#eq-b" class="ref">Equation <span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML">
      <mi>x</mi>
    </math></span></a> and <a href="#eq-c" class="ref">Equation 3</a>.</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('inline maths with breaks', async () => {
  const latex = String.raw`
    \documentclass{article}
    \newcommand{\bL}{\mathbf{L}}
    \newcommand{\bq}{\mathbf{q}}
    \begin{document}

    a $\bL_\bq:[0,T)\rightarrow V$ b

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    a $\mathbf{L}_{\mathbf{q}}:[0,T)\rightarrow V$ b
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      // @ts-expect-error
      maths: {
        mathsRendering: 'svg',
      },
    },
  });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>a <mjx-container class="MathJax" jax="SVG" overflow="scale" display="false" style="font-size: 108%;"><svg xmlns="http://www.w3.org/2000/svg" width="2.724ex" height="2.347ex" role="img" focusable="false" viewBox="0 -750 1204.2 1037.2" style="vertical-align: -0.65ex;">
          <g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)">
            <g data-mml-node="math">
              <g data-mml-node="msub">
                <g data-mml-node="TeXAtom" data-mjx-texclass="ORD">
                  <g data-mml-node="mi">
                    <path data-c="1D40B" d="M643 274L596 274C588 205 571 47 392 47L289 47L289 639L424 639L424 686C380 683 271 683 222 683C178 683 77 683 39 686L39 639L147 639L147 47L39 47L39 0L612 0Z"></path>
                  </g>
                </g>
                <g data-mml-node="TeXAtom" transform="translate(725,-150) scale(0.707)" data-mjx-texclass="ORD">
                  <g data-mml-node="TeXAtom" data-mjx-texclass="ORD">
                    <g data-mml-node="mi">
                      <path data-c="1D42A" d="M601-194L601-147L532-147L532 450L491 450L438 371C403 420 347 450 287 450C141 450 38 361 38 222C38 81 139-6 278-6C327-6 372 8 418 48L418-147L349-147L349-194L475-191M424 142C424 124 424 121 409 100C369 41 318 30 288 30C226 30 166 88 166 221C166 363 240 410 300 410C376 410 424 331 424 281Z"></path>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg><mjx-break size="4"> </mjx-break><svg xmlns="http://www.w3.org/2000/svg" width="6.496ex" height="2.262ex" role="img" focusable="false" viewBox="0 -750 2871.4 1000" style="vertical-align: -0.566ex;">
          <g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)">
            <g data-mml-node="math">
              <g data-mml-node="mo">
                <path data-c="3A" d="M192 375C192 405 169 431 139 431C109 431 86 405 86 375C86 345 109 319 139 319C169 319 192 345 192 375M192 56C192 86 169 112 139 112C109 112 86 86 86 56C86 26 109 0 139 0C169 0 192 26 192 56Z"></path>
              </g>
              <g data-mml-node="mo" transform="translate(555.8,0)">
                <path data-c="5B" d="M233-202L159-202L159 702L233 702C248 702 256 710 256 726C256 742 248 750 233 750L114 750L114-250L233-250C248-250 256-242 256-226C256-214 245-202 233-202Z"></path>
              </g>
              <g data-mml-node="mn" transform="translate(833.8,0)">
                <path data-c="30" d="M249-22C390-22 460 92 460 320C460 473 428 575 365 625C330 652 291 666 250 666C109 666 39 551 39 320C39 136 88-22 249-22M361 524C368 489 371 425 371 332C371 240 367 172 360 128C347 48 310 8 249 8C226 8 203 17 182 34C155 57 139 104 132 176C129 201 128 253 128 332C128 419 131 480 136 513C145 568 163 603 191 618C213 630 232 636 249 636C314 636 350 583 361 524Z"></path>
              </g>
              <g data-mml-node="mo" transform="translate(1333.8,0)">
                <path data-c="2C" d="M139 106C107 106 86 82 86 50C86 20 109-5 139-5C153-5 165-1 174 8L175 0C175-63 154-117 112-160C105-168 101-174 101-178C101-188 105-193 114-193C123-193 135-181 152-158C186-110 203-57 203 0C203 53 185 106 139 106Z"></path>
              </g>
              <g data-mml-node="mi" transform="translate(1778.4,0)">
                <path data-c="1D447" d="M344 631C344 628 343 621 340 611L208 83C204 68 200 59 197 55C188 44 154 39 94 39C63 39 49 42 49 16C49 5 56 0 69 0C120 0 192 4 235 3L317 2C331 2 386 0 403 0C420 0 428 8 428 24C428 34 416 39 391 39C339 39 309 41 300 46C297 48 295 52 295 58L430 603C433 617 436 626 439 629C443 635 467 638 511 638C566 638 604 634 623 625C642 616 652 595 652 561C652 543 649 517 644 483C642 475 641 469 641 464C641 453 646 447 657 447C666 447 672 456 675 473L702 645C703 650 704 656 704 662C704 672 694 677 673 677L125 677C99 677 97 674 89 655L30 481C27 472 25 466 24 462C24 452 29 447 40 447C48 447 55 455 60 470C85 543 110 588 133 607C159 628 209 638 282 638L321 638C332 638 344 639 344 631Z"></path>
              </g>
              <g data-mml-node="mo" transform="translate(2482.4,0)">
                <path data-c="29" d="M78-245C138-199 188-131 229-40C268 47 288 129 288 208L288 292C288 371 268 453 229 540C188 631 138 699 78 745C75 747 72 748 71 748C62 748 57 743 57 734C57 730 59 726 62 723C114 683 156 617 187 526C214 447 228 369 228 292L228 208C228 131 214 53 187-26C156-117 114-183 62-223C59-227 57-231 57-234C57-243 62-248 71-248C72-248 75-247 78-245Z"></path>
              </g>
            </g>
          </g>
        </svg><mjx-break size="4"> </mjx-break><svg xmlns="http://www.w3.org/2000/svg" width="4.633ex" height="2.262ex" role="img" focusable="false" viewBox="0 -750 2047.8 1000" style="vertical-align: -0.566ex;">
          <g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)">
            <g data-mml-node="math">
              <g data-mml-node="mo">
                <path data-c="2192" d="M932 234C939 237 943 243 943 250C943 257 939 263 932 266C884 282 839 316 797 368C769 403 750 444 741 491C738 504 730 510 717 510C701 510 693 502 693 485L694 483L694 482C711 395 755 326 828 274L82 274C66 274 58 266 58 250C58 234 66 226 82 226L828 226C755 174 711 105 694 18L694 17L693 15C693-2 701-10 717-10C730-10 738-4 741 9C750 56 769 97 797 132C839 184 884 218 932 234Z"></path>
              </g>
              <g data-mml-node="mi" transform="translate(1277.8,0)">
                <path data-c="1D449" d="M671 680C652 680 592 683 573 683C558 683 550 675 550 660C550 650 557 645 570 644C598 643 612 633 612 616C612 607 607 595 598 580L300 107L234 619C234 636 255 644 298 644C318 644 327 651 327 668C327 678 321 683 309 683C287 683 209 680 187 680C167 680 99 683 79 683C64 683 56 675 56 660C56 649 66 644 85 644C102 644 114 642 122 640C138 635 137 633 140 614L218 4C221-13 229-22 242-22C255-22 265-15 273-2L629 564C652 600 674 623 696 632C711 639 730 643 752 644C763 645 768 652 769 667C770 678 764 683 752 683C737 683 686 680 671 680Z"></path>
              </g>
            </g>
          </g>
        </svg></mjx-container> b</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});
