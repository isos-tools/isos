import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('maths with zcref references', async () => {
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
    (by\zcref{thm:one}and\zcref{thm:two}and\zcref{thm:three})
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
        style: definition
        heading: Theorem
        numberWithin: h2
    ---

    ## Alpha

    :::theorem[Bravo]{#thm-one}
    Charlie.
    :::

    :::theorem[Bravo]{#thm-two}
    Charlie.
    :::

    :::theorem[Bravo]{#thm-three}
    Charlie.
    :::

    $$
    \begin{aligned}(by\zcref{thm:one}and\zcref{thm:two}and\zcref{thm:three})\end{aligned}
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

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem style-definition" id="thm-one">
      <p><span class="title"><strong>Theorem 1.1 (Bravo).</strong></span> Charlie.</p>
    </div>
    <div class="theorem style-definition" id="thm-two">
      <p><span class="title"><strong>Theorem 1.2 (Bravo).</strong></span> Charlie.</p>
    </div>
    <div class="theorem style-definition" id="thm-three">
      <p><span class="title"><strong>Theorem 1.3 (Bravo).</strong></span> Charlie.</p>
    </div>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true" columnalign="right" columnspacing="" rowspacing="3pt" data-break-align="bottom">
        <mtr>
          <mtd>
            <mo stretchy="false">(</mo>
            <mi>b</mi>
            <mi>y</mi>
            <mrow href="#thm-one"><mtext>Theorem 1.1</mtext></mrow>
            <mi>a</mi>
            <mi>n</mi>
            <mi>d</mi>
            <mrow href="#thm-two"><mtext>Theorem 1.2</mtext></mrow>
            <mi>a</mi>
            <mi>n</mi>
            <mi>d</mi>
            <mrow href="#thm-three"><mtext>Theorem 1.3</mtext></mrow>
            <mo stretchy="false">)</mo>
          </mtd>
        </mtr>
      </mtable>
    </math></span></p>
  `);

  expect(html).toBe(expectedHtml);
});

test('maths with references in \\text', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}

    \usepackage[overload]{keytheorems}
    \usepackage{zref-clever}
    \usepackage[colorlinks,bookmarks=false]{hyperref}
    \zcsetup{noabbrev, cap, nameinlink}

    \begin{document}

    \begin{align}
      a &= b \label{eq:a}
    \end{align}

    \begin{align}
      c &= a & \text{from\zcref{eq:a}}
    \end{align}

    \begin{align}
      c &= a & \text{from\eqref{eq:a}}
    \end{align}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    $$
    \begin{align}a&= b \label{eq-a}\end{align}
    $$ {#eq-a}

    $$
    \begin{align}c&= a&\text{from\zcref{eq:a}}\end{align}
    $$

    $$
    \begin{align}c&= a&\text{from\eqref{eq:a}}\end{align}
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
      </mtable>
    </math></span></p>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true" columnalign="right left right" columnspacing="0em 2em" rowspacing="3pt" data-break-align="bottom top bottom">
        <mlabeledtr>
          <mtd><mtext>(2)</mtext></mtd>
          <mtd>
            <mi>c</mi>
          </mtd>
          <mtd>
            <mstyle indentshift="2em">
              <mi></mi>
              <mo>=</mo>
              <mi>a</mi>
            </mstyle>
          </mtd>
          <mtd>
            <mrow>
              <mtext>from</mtext>
              <mrow data-mjx-texclass="ORD">
                <mrow href="#eq-a"><mtext>Equation 1</mtext></mrow>
              </mrow>
            </mrow>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <pre class="warn"> <span class="warn"><strong>unhandled macro: eqref</strong></span> </pre>
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
    (by\cref{thm:one})
    $$

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      theorem:
        heading: Theorem
        numberWithin: h2
    ---

    ## Alpha

    :::theorem[Bravo]{#thm-one}
    Charlie.
    :::

    $$
    (by\cref{thm:one})
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
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem" id="thm-one">
      <p><span class="title"><strong>Theorem 1.1 (Bravo).</strong></span> Charlie.</p>
    </div>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mo stretchy="false">(</mo>
      <mi>b</mi>
      <mi>y</mi>
      <mrow href="#thm-one"><mtext>Theorem 1.1</mtext></mrow>
      <mo stretchy="false">)</mo>
    </math></span></p>
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
        heading: Theorem
        numberWithin: h2
    ---

    ## Alpha

    :::theorem[Bravo]{#thm-one}
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
    <div class="theorem" id="thm-one">
      <p><span class="title"><strong>Theorem 1.1 (Bravo).</strong></span> Charlie.</p>
    </div>
    <pre class="warn"> <span class="warn"><strong>unhandled macro: ref</strong></span> </pre>
  `);

  expect(html).toBe(expectedHtml);
});
