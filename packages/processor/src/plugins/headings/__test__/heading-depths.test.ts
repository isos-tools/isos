import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('headings with article documentclass', async () => {
  const latex = String.raw`
    \documentclass{article}
    \title{Alpha}

    \begin{document}

    \maketitle
    \section*{Bravo}
    \subsection{Charlie}
    \subsubsection{Delta}
    \paragraph{Echo}
    \subparagraph{Foxtrot}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    title: Alpha
    ---

    :::make-title
    :::

    ## Bravo {.unnumbered}

    ### Charlie

    #### Delta

    ##### Echo

    ###### Foxtrot
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <header>
      <h1>Alpha</h1>
    </header>
    <h2 id="bravo">Bravo</h2>
    <h3 id="charlie"><span class="count">0.1</span> Charlie</h3>
    <h4 id="delta"><span class="count">0.1.1</span> Delta</h4>
    <h5 id="echo">Echo</h5>
    <h6 id="foxtrot">Foxtrot</h6>
  `);

  expect(html).toBe(expectedHtml);
});

test('headings with report documentclass', async () => {
  const latex = String.raw`
    \documentclass{report}
    \title{Alpha}

    \begin{document}

    \maketitle
    \chapter{Bravo}
    \section{Charlie}
    \subsection{Delta}
    \subsubsection{Echo}
    \paragraph{Foxtrot}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    title: Alpha
    documentClass: report
    ---

    :::make-title
    :::

    ## Bravo

    ### Charlie

    #### Delta

    ##### Echo

    ###### Foxtrot
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <header>
      <h1>Alpha</h1>
    </header>
    <h2 id="bravo"><span class="count">1</span> Bravo</h2>
    <h3 id="charlie"><span class="count">1.1</span> Charlie</h3>
    <h4 id="delta"><span class="count">1.1.1</span> Delta</h4>
    <h5 id="echo">Echo</h5>
    <h6 id="foxtrot">Foxtrot</h6>
  `);

  expect(html).toBe(expectedHtml);
});

test('headings with report documentclass and part', async () => {
  const latex = String.raw`
    \documentclass{report}
    \title{Alpha}

    \begin{document}

    \maketitle
    \part{Bravo}
    \chapter{Charlie}
    \section{Delta}
    \subsection{Echo}
    \subsubsection{Foxtrot}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    title: Alpha
    documentClass: report
    ---

    :::make-title
    :::

    ## Bravo

    ### Charlie

    #### Delta

    ##### Echo

    ###### Foxtrot
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <header>
      <h1>Alpha</h1>
    </header>
    <h2 id="bravo"><span class="count">1</span> Bravo</h2>
    <h3 id="charlie"><span class="count">1.1</span> Charlie</h3>
    <h4 id="delta"><span class="count">1.1.1</span> Delta</h4>
    <h5 id="echo">Echo</h5>
    <h6 id="foxtrot">Foxtrot</h6>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorem with article documentclass', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \title{Alpha}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[section]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \maketitle
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    title: Alpha
    theorems:
      theorem:
        numberWithin: h2
      lemma:
        referenceCounter: theorem
    ---

    :::make-title
    :::

    ::: {#thm-1}
    Some text
    :::

    ::: {#lem-1}
    Some text
    :::

    ## My section

    ::: {#thm-2}
    Some text
    :::

    ::: {#lem-2}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <header>
      <h1>Alpha</h1>
    </header>
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 0.1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-1">
      <p><span class="title"><strong>Lemma 0.2.</strong></span> Some text</p>
    </div>
    <h2 id="my-section"><span class="count">1</span> My section</h2>
    <div class="definition theorem" id="thm-2">
      <p><span class="title"><strong>Theorem 1.1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-2">
      <p><span class="title"><strong>Lemma 1.2.</strong></span> Some text</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorem with report documentclass', async () => {
  const latex = String.raw`
    \documentclass{report}
    \usepackage{amsthm}
    \title{Alpha}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[section]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \maketitle
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    title: Alpha
    documentClass: report
    theorems:
      theorem:
        numberWithin: h3
      lemma:
        referenceCounter: theorem
    ---

    :::make-title
    :::

    ::: {#thm-1}
    Some text
    :::

    ::: {#lem-1}
    Some text
    :::

    ### My section

    ::: {#thm-2}
    Some text
    :::

    ::: {#lem-2}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <header>
      <h1>Alpha</h1>
    </header>
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 0.0.1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-1">
      <p><span class="title"><strong>Lemma 0.0.2.</strong></span> Some text</p>
    </div>
    <h3 id="my-section"><span class="count">0.1</span> My section</h3>
    <div class="definition theorem" id="thm-2">
      <p><span class="title"><strong>Theorem 0.1.1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-2">
      <p><span class="title"><strong>Lemma 0.1.2.</strong></span> Some text</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorem with report documentclass and part', async () => {
  const latex = String.raw`
    \documentclass{report}
    \usepackage{amsthm}
    \title{Alpha}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[part]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \maketitle
    \part{In the beginning}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    title: Alpha
    documentClass: report
    theorems:
      theorem:
        numberWithin: h2
      lemma:
        referenceCounter: theorem
    ---

    :::make-title
    :::

    ## In the beginning

    ::: {#thm-1}
    Some text
    :::

    ::: {#lem-1}
    Some text
    :::

    #### My section

    ::: {#thm-2}
    Some text
    :::

    ::: {#lem-2}
    Some text
    :::

  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <header>
      <h1>Alpha</h1>
    </header>
    <h2 id="in-the-beginning"><span class="count">1</span> In the beginning</h2>
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 1.1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-1">
      <p><span class="title"><strong>Lemma 1.2.</strong></span> Some text</p>
    </div>
    <h4 id="my-section"><span class="count">1.0.1</span> My section</h4>
    <div class="definition theorem" id="thm-2">
      <p><span class="title"><strong>Theorem 1.3.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-2">
      <p><span class="title"><strong>Lemma 1.4.</strong></span> Some text</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
