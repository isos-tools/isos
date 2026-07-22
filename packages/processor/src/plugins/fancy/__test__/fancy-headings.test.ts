import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { pdfLatexToHtml } from '../../../test-utils/pdflatex-to-html';

test('heading with counter', async () => {
  const latex = String.raw`
    \fancysection{Hello}
    text.
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ## Hello {.unnumbered}

    text.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    noSections: false,
  });

  const expectedHtml = unindentStringAndTrim(`
    <section id="hello">
      <h2>Hello</h2>
      <p>text.</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug', async () => {
  const latex = String.raw`
    \newcommand{\R}{\mathbb{R}}
    \newcommand{\st}{\text{s.t.}}

    \begin{document}

    \section{Section 1}
    \begin{equation}
    \label{eq:S1}
    \exists M \in \R \st \forall x \in S, x \leq M.
    \end{equation}
    \section{Section 2}
    \subsection{Subsection 2.1}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ## Section 1

    $$
    \begin{equation}\label{eq-s-1}\exists M \in \mathbb{R} \text{s.t.} \forall x \in S, x \leq M.\end{equation}
    $$ {#eq-s-1}

    ## Section 2

    ### Subsection 2.1
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
    <h2 id="section-1"><span class="count">1</span> Section 1</h2>
    <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="eq-s-1"><mtext>(1)</mtext></mtd>
          <mtd>
            <mi mathvariant="normal">∃</mi>
            <mi>M</mi>
            <mo>∈</mo>
            <mrow data-mjx-texclass="ORD">
              <mi mathvariant="double-struck">R</mi>
            </mrow>
            <mtext>s.t.</mtext>
            <mi mathvariant="normal">∀</mi>
            <mi>x</mi>
            <mo>∈</mo>
            <mi>S</mi>
            <mo>,</mo>
            <mi>x</mi>
            <mo>≤</mo>
            <mi>M</mi>
            <mo>.</mo>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    <h2 id="section-2"><span class="count">2</span> Section 2</h2>
    <h3 id="subsection-21"><span class="count">2.1</span> Subsection 2.1</h3>
  `);

  expect(html).toBe(expectedHtml);
});
