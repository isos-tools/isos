import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('ignore email addresses', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{hyperref}
    \begin{document}

    Please send comments to \href{mailto:jim.belk@glasgow.ac.uk}{jim.belk@glasgow.ac.uk}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Please send comments to <jim.belk@glasgow.ac.uk>.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Please send comments to <a href="mailto:jim.belk@glasgow.ac.uk" target="_blank">jim.belk@glasgow.ac.uk</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('prefix for theorems not required', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \usepackage[overload]{keytheorems}
    \usepackage{zref-clever}
    \usepackage[colorlinks]{hyperref}
    \zcsetup{noabbrev, nameinlink, cap}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[subsection]
    \newtheorem{definition}[theorem]{Definition}

    \begin{document}

    \section{Revision}\label{revision}

    \subsection{Functions}

    \begin{definition} \label{hello}
    Alpha
    \end{definition}
    % \clearpage

    \subsection{Polynomials}

    \begin{definition} \label{hello2}
    Bravo
    \begin{equation} \label{one}
      x
    \end{equation}
    \end{definition}
    % \clearpage

    See \zcref{revision}, \zcref{hello}, \zcref{hello2} and \autoref{one}.

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
        numberWithin: h3
      definition:
        style: definition
        heading: Definition
        referenceCounter: theorem
    ---

    ## Revision {#revision}

    ### Functions

    :::definition{#hello}
    Alpha
    :::

    ### Polynomials

    :::definition{#hello-2}
    Bravo

    $$
    \begin{equation}\label{one}x\end{equation}
    $$ {#one}
    :::

    See @revision, @hello, @hello-2 and @one.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, {
    state: {
      maths: {
        mathsRendering: 'mathml',
      },
    },
  });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="revision"><span class="count">1</span> Revision</h2>
    <h3 id="functions"><span class="count">1.1</span> Functions</h3>
    <div class="theorem definition style-definition" id="hello">
      <p><span class="title"><strong>Definition 1.1.1.</strong></span> Alpha</p>
    </div>
    <h3 id="polynomials"><span class="count">1.2</span> Polynomials</h3>
    <div class="theorem definition style-definition" id="hello-2">
      <p><span class="title"><strong>Definition 1.2.1.</strong></span> Bravo</p>
      <p class="maths"><span class="mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
      <mtable displaystyle="true">
        <mlabeledtr>
          <mtd id="one"><mtext>(1)</mtext></mtd>
          <mtd>
            <mi>x</mi>
          </mtd>
        </mlabeledtr>
      </mtable>
    </math></span></p>
    </div>
    <p>See <a href="#revision" class="ref">Section 1</a>, <a href="#hello" class="ref">Definition 1.1.1</a>, <a href="#hello-2" class="ref">Definition 1.2.1</a> and <a href="#one" class="ref">Equation 1</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('reference hypen reference', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage[overload]{keytheorems}
    \usepackage{zref-clever}
    \usepackage[colorlinks,bookmarks=false]{hyperref}
    \zcsetup{noabbrev, cap, nameinlink}
    \begin{document}

    \section{Alpha}
    \label{sec:alpha}

    \section{Bravo}
    \label{sec:bravo}

    \section{Charlie}
    \label{sec:charlie}

    Theory developed in \zcref{sec:alpha}-\zcref{sec:charlie}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ## Alpha {#sec-alpha}

    ## Bravo {#sec-bravo}

    ## Charlie {#sec-charlie}

    Theory developed in @sec-alpha - @sec-charlie.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="sec-alpha"><span class="count">1</span> Alpha</h2>
    <h2 id="sec-bravo"><span class="count">2</span> Bravo</h2>
    <h2 id="sec-charlie"><span class="count">3</span> Charlie</h2>
    <p>Theory developed in <a href="#sec-alpha" class="ref">Section 1</a> - <a href="#sec-charlie" class="ref">Section 3</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});
