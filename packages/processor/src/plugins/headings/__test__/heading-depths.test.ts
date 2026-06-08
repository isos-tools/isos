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
    <h2 id="bravo"><span class="count">Chapter 1:</span> Bravo</h2>
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
    hasPart: true
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
    <h2 id="bravo"><span class="count">Part 1:</span> Bravo</h2>
    <h3 id="charlie"><span class="count">Chapter 1:</span> Charlie</h3>
    <h4 id="delta"><span class="count">1.1</span> Delta</h4>
    <h5 id="echo"><span class="count">1.1.1</span> Echo</h5>
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
        style: definition
        heading: Theorem
        numberWithin: h2
      lemma:
        style: definition
        heading: Lemma
        referenceCounter: theorem
    ---

    :::make-title
    :::

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    ## My section

    :::theorem
    Some text
    :::

    :::lemma
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
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 0.1.</strong></span> Some text</p>
    </div>
    <div class="theorem lemma style-definition">
      <p><span class="title"><strong>Lemma 0.2.</strong></span> Some text</p>
    </div>
    <h2 id="my-section"><span class="count">1</span> My section</h2>
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 1.1.</strong></span> Some text</p>
    </div>
    <div class="theorem lemma style-definition">
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
        style: definition
        heading: Theorem
        numberWithin: h3
      lemma:
        style: definition
        heading: Lemma
        referenceCounter: theorem
    ---

    :::make-title
    :::

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    ### My section

    :::theorem
    Some text
    :::

    :::lemma
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
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 0.0.1.</strong></span> Some text</p>
    </div>
    <div class="theorem lemma style-definition">
      <p><span class="title"><strong>Lemma 0.0.2.</strong></span> Some text</p>
    </div>
    <h3 id="my-section"><span class="count">0.1</span> My section</h3>
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 0.1.1.</strong></span> Some text</p>
    </div>
    <div class="theorem lemma style-definition">
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
    \newtheorem{theorem}{Theorem}[section]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \maketitle
    \part{Alpha}
    \chapter{Bravo}
    \section{Charlie}
    \begin{theorem}
      This is a theorem.
    \end{theorem}
    \begin{lemma}
      This is a lemma.
    \end{lemma}
    \begin{equation}
      a(b)
    \end{equation}
    \begin{equation}
      a(b)
    \end{equation}
    \chapter{Bravo}
    \section{Delta}
    \begin{theorem}
      This is a theorem.
    \end{theorem}
    \begin{lemma}
      This is a lemma.
    \end{lemma}
    \begin{equation}
      a(b)
    \end{equation}
    \begin{equation}
      a(b)
    \end{equation}
    \part{Echo}
    \chapter{Foxtrot}
    \section{Golf}
    \begin{theorem}
      This is a theorem.
    \end{theorem}
    \begin{lemma}
      This is a lemma.
    \end{lemma}
    \begin{equation}
      a(b)
    \end{equation}
    \begin{equation}
      a(b)
    \end{equation}
    \chapter{Bravo}
    \section{Hotel}
    \begin{theorem}
      This is a theorem.
    \end{theorem}
    \begin{lemma}
      This is a lemma.
    \end{lemma}
    \begin{equation}
      a(b)
    \end{equation}
    \begin{equation}
      a(b)
    \end{equation}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: Alpha
    documentClass: report
    hasPart: true
    theorems:
      theorem:
        style: definition
        heading: Theorem
        numberWithin: h4
      lemma:
        style: definition
        heading: Lemma
        referenceCounter: theorem
    ---

    :::make-title
    :::

    ## Alpha

    ### Bravo

    #### Charlie

    :::theorem
    This is a theorem.
    :::

    :::lemma
    This is a lemma.
    :::

    $$
    \begin{equation}a(b)\end{equation}
    $$

    $$
    \begin{equation}a(b)\end{equation}
    $$

    ### Bravo

    #### Delta

    :::theorem
    This is a theorem.
    :::

    :::lemma
    This is a lemma.
    :::

    $$
    \begin{equation}a(b)\end{equation}
    $$

    $$
    \begin{equation}a(b)\end{equation}
    $$

    ## Echo

    ### Foxtrot

    #### Golf

    :::theorem
    This is a theorem.
    :::

    :::lemma
    This is a lemma.
    :::

    $$
    \begin{equation}a(b)\end{equation}
    $$

    $$
    \begin{equation}a(b)\end{equation}
    $$

    ### Bravo

    #### Hotel

    :::theorem
    This is a theorem.
    :::

    :::lemma
    This is a lemma.
    :::

    $$
    \begin{equation}a(b)\end{equation}
    $$

    $$
    \begin{equation}a(b)\end{equation}
    $$
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <header>
      <h1>Alpha</h1>
    </header>
    <h2 id="alpha"><span class="count">Part 1:</span> Alpha</h2>
    <h3 id="bravo"><span class="count">Chapter 1:</span> Bravo</h3>
    <h4 id="charlie"><span class="count">1.1</span> Charlie</h4>
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 1.1.1.</strong></span> This is a theorem.</p>
    </div>
    <div class="theorem lemma style-definition">
      <p><span class="title"><strong>Lemma 1.1.2.</strong></span> This is a lemma.</p>
    </div>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(1.1)</span></p>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(1.2)</span></p>
    <h3 id="bravo-1"><span class="count">Chapter 2:</span> Bravo</h3>
    <h4 id="delta"><span class="count">2.1</span> Delta</h4>
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 2.1.1.</strong></span> This is a theorem.</p>
    </div>
    <div class="theorem lemma style-definition">
      <p><span class="title"><strong>Lemma 2.1.2.</strong></span> This is a lemma.</p>
    </div>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(2.1)</span></p>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(2.2)</span></p>
    <h2 id="echo"><span class="count">Part 2:</span> Echo</h2>
    <h3 id="foxtrot"><span class="count">Chapter 3:</span> Foxtrot</h3>
    <h4 id="golf"><span class="count">3.1</span> Golf</h4>
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 3.1.1.</strong></span> This is a theorem.</p>
    </div>
    <div class="theorem lemma style-definition">
      <p><span class="title"><strong>Lemma 3.1.2.</strong></span> This is a lemma.</p>
    </div>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(3.1)</span></p>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(3.2)</span></p>
    <h3 id="bravo-2"><span class="count">Chapter 4:</span> Bravo</h3>
    <h4 id="hotel"><span class="count">4.1</span> Hotel</h4>
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 4.1.1.</strong></span> This is a theorem.</p>
    </div>
    <div class="theorem lemma style-definition">
      <p><span class="title"><strong>Lemma 4.1.2.</strong></span> This is a lemma.</p>
    </div>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(4.1)</span></p>
    <p class="maths env-equation"><code class="latex">\begin{equation}a(b)\end{equation}</code><span class="eq-count">(4.2)</span></p>
  `);

  expect(html).toBe(expectedHtml);
});
