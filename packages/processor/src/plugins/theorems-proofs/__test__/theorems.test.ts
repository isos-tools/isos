import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';
// @ts-ignore
// import { pdfLatexToHtml } from '../../../test-utils/pdflatex-to-html';

test('theorem', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \begin{document}
    \begin{theorem}
    An \verb|example\n| of \emph{this}!
    \end{theorem}
    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 1.</strong> An<code> example\\n</code> of<em> this</em>!</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: definition
        heading: Theorem
    ---

    :::theorem
    An \`example\\n\` of *this*!
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);

  // const expectedQuartoHtml = unindentStringAndTrim(`
  //   <div id="thm-1" class="theorem">
  //     <p><span class="theorem-title"><strong>Theorem 1</strong></span> An <code>example\\n</code> of <em>this</em>!</p>
  //   </div>
  // `);

  // expect(quartoHtml).toBe(expectedQuartoHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 1.</strong></span> An <code>example\\n</code> of <em>this</em>!</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorem with name', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \begin{document}
    \begin{theorem}[Pythagorean]
    Cras mattis.

    Cras justo odio.
    \end{theorem}
    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: definition
        heading: Theorem
    ---

    :::theorem[Pythagorean]
    Cras mattis.

    Cras justo odio.
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 1 (Pythagorean).</strong></span> Cras mattis.</p>
      <p>Cras justo odio.</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorem with math in the name', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \newcommand{\R}{\mathbb{R}}
    \begin{document}
    \begin{theorem}[Order for $ \R $]
    a
    \end{theorem}
    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: definition
        heading: Theorem
    ---

    :::theorem[Order for $\\mathbb{R}$]
    a
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 1 (Order for <code class="latex">\\mathbb{R}</code>).</strong></span> a</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorem with id', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \begin{document}

    \begin{theorem}[Ho ha] \label{thm:line}
    Cras mattis.

    Cras justo odio.
    \end{theorem}

    See~\cref{thm:line}.
    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 1.</strong> Cras mattis.</p>
  //   <p>Cras justo odio.</p>
  //   <p>See Theorem 1.</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: definition
        heading: Theorem
    ---

    :::theorem[Ho ha]{#thm-line}
    Cras mattis.

    Cras justo odio.
    :::

    See @thm-line.
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);

  // const expectedQuartoHtml = unindentStringAndTrim(`
  //   <div id="thm-line" class="theorem">
  //     <p><span class="theorem-title"><strong>Theorem 1 (ho ha)</strong></span> Cras mattis.</p>
  //     <p>Cras justo odio.</p>
  //   </div>
  //   <p>See <a href="#thm-line" class="quarto-xref">Theorem 1</a>.</p>
  // `);

  // expect(quartoHtml).toBe(expectedQuartoHtml);

  const html = await testProcessor.md(markdown);
  // // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="theorem style-definition" id="thm-line">
      <p><span class="title"><strong>Theorem 1 (Ho ha).</strong></span> Cras mattis.</p>
      <p>Cras justo odio.</p>
    </div>
    <p>See <a href="#thm-line" class="ref">Theorem 1</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorems with section counter', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[section]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 0.1.</strong> Some text</p>
  //   <p><strong>Lemma 0.2.</strong> Some text</p>
  //   <p><strong>1</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Theorem 1.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.2.</strong> Some text</p>
  //   <p><strong>1.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.3.</strong> Some text</p>
  //   <p><strong>Lemma 1.4.</strong> Some text</p>
  //   <p><strong>2</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Theorem 2.1.</strong> Some text</p>
  //   <p><strong>Lemma 2.2.</strong> Some text</p>
  //   <p><strong>2.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 2.3.</strong> Some text</p>
  //   <p><strong>Lemma 2.4.</strong> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
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

    ### My subsection

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

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <section>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section">
      <h2><span class="count">1</span> My section</h2>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection">
      <h3><span class="count">1.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.3.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.4.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section-1">
      <h2><span class="count">2</span> My section</h2>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 2.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 2.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection-1">
      <h3><span class="count">2.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 2.3.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 2.4.</strong></span> Some text</p>
      </div>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorems with subsection counter', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[subsection]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  // const latexHtml = await pdfLatexToHtml(latex);
  // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 0.0.2.</strong> Some text</p>
  //   <p><strong>1</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Theorem 1.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.0.2.</strong> Some text</p>
  //   <p><strong>1.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.1.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.2.</strong> Some text</p>
  //   <p><strong>2</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Theorem 2.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 2.0.2.</strong> Some text</p>
  //   <p><strong>2.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 2.1.1.</strong> Some text</p>
  //   <p><strong>Lemma 2.1.2.</strong> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
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

    ### My subsection

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

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <section>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section">
      <h2><span class="count">1</span> My section</h2>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection">
      <h3><span class="count">1.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section-1">
      <h2><span class="count">2</span> My section</h2>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 2.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 2.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection-1">
      <h3><span class="count">2.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 2.1.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 2.1.2.</strong></span> Some text</p>
      </div>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorems with subsubsection counter', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[subsubsection]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsubsection{My subsubsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 0.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 0.0.0.2.</strong> Some text</p>
  //   <p><strong>1</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Theorem 1.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.0.0.2.</strong> Some text</p>
  //   <p><strong>1.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.1.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.0.2.</strong> Some text</p>
  //   <p><strong>1.1.1</strong></p>
  //   <p><strong>My subsubsection</strong></p>
  //   <p><strong>Theorem 1.1.1.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.1.2.</strong> Some text</p>
  //   <p><strong>1.2</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.2.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.2.0.2.</strong> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
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

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    #### My subsubsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);
  // return

  const expectedHtml = unindentStringAndTrim(`
    <section>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 0.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 0.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section">
      <h2><span class="count">1</span> My section</h2>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection">
      <h3><span class="count">1.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsubsection">
      <h4><span class="count">1.1.1</span> My subsubsection</h4>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.1.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.1.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection-1">
      <h3><span class="count">1.2</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.2.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.2.0.2.</strong></span> Some text</p>
      </div>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorems with paragraph counter', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[paragraph]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsubsection{My subsubsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  // const latexHtml = await pdfLatexToHtml(latex);
  // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 0.0.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 0.0.0.0.2.</strong> Some text</p>
  //   <p><strong>1</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Theorem 1.0.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.0.0.0.2.</strong> Some text</p>
  //   <p><strong>1.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.1.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.0.0.2.</strong> Some text</p>
  //   <p><strong>1.1.1</strong></p>
  //   <p><strong>My subsubsection</strong></p>
  //   <p><strong>Theorem 1.1.1.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.1.0.2.</strong> Some text</p>
  //   <p><strong>1.2</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.2.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.2.0.0.2.</strong> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: definition
        heading: Theorem
        numberWithin: h5
      lemma:
        style: definition
        heading: Lemma
        referenceCounter: theorem
    ---

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

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    #### My subsubsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <section>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 0.0.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 0.0.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section">
      <h2><span class="count">1</span> My section</h2>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.0.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.0.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection">
      <h3><span class="count">1.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsubsection">
      <h4><span class="count">1.1.1</span> My subsubsection</h4>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.1.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.1.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection-1">
      <h3><span class="count">1.2</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.2.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.2.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorems with subparagraph counter', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[subparagraph]
    \newtheorem{lemma}[theorem]{Lemma}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \section{My section}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subsubsection{My subsubsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \paragraph{My paragraph}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \subparagraph{My subparagraph}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \end{document}
  `;

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 0.0.0.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 0.0.0.0.0.2.</strong> Some text</p>
  //   <p><strong>1</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Theorem 1.0.0.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.0.0.0.0.2.</strong> Some text</p>
  //   <p><strong>1.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.1.0.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.0.0.0.2.</strong> Some text</p>
  //   <p><strong>1.1.1</strong></p>
  //   <p><strong>My subsubsection</strong></p>
  //   <p><strong>Theorem 1.1.1.0.0.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.1.0.0.2.</strong> Some text</p>
  //   <p><strong>My paragraph</strong></p>
  //   <p><strong>Theorem 1.1.1.0.0.3.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.1.0.0.4.</strong> Some text</p>
  //   <p><strong>My subparagraph</strong></p>
  //   <p><strong>Theorem 1.1.1.0.0.5.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.1.0.0.6.</strong> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: definition
        heading: Theorem
        numberWithin: h6
      lemma:
        style: definition
        heading: Lemma
        referenceCounter: theorem
    ---

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

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    #### My subsubsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    ##### My paragraph

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    ###### My subparagraph

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <section>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 0.0.0.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 0.0.0.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section">
      <h2><span class="count">1</span> My section</h2>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.0.0.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.0.0.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsection">
      <h3><span class="count">1.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.0.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.0.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subsubsection">
      <h4><span class="count">1.1.1</span> My subsubsection</h4>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.1.0.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.1.0.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-paragraph">
      <h5>My paragraph</h5>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.1.1.0.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.1.1.0.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-subparagraph">
      <h6>My subparagraph</h6>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.1.1.1.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.1.1.1.2.</strong></span> Some text</p>
      </div>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorems with reference and section counters', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[subsection]
    \newtheorem{lemma}{Lemma}[section]
    \newtheorem{corollary}[theorem]{Corollary}
    \newtheorem{proposition}[theorem]{Proposition}
    \newtheorem{conjecture}[lemma]{Conjecture}
    \newtheorem{definition}{Definition}
    \newtheorem*{example}{Example}
    \newtheorem{exercise}[theorem]{Exercise}
    \theoremstyle{remark}
    \newtheorem{solution}[lemma]{Solution}
    \newtheorem*{remark}{Remark}

    \begin{document}
    \section{My section}
    \subsection{My subsection}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \section*{My section}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{remark} Some text \end{remark}
    \subsection{My subsection}
    \begin{solution} Some text \end{solution}
    \begin{exercise} Some text \end{exercise}
    \begin{proof} Some text \end{proof}
    \begin{solution} Some text \end{solution}
    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>1</strong></p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>1.1</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><strong>Theorem 1.1.1.</strong> Some text</p>
  //   <p><strong>Lemma 1.1.</strong> Some text</p>
  //   <p><strong>Corollary 1.1.2.</strong> Some text</p>
  //   <p><strong>Proposition 1.1.3.</strong> Some text</p>
  //   <p><strong>Conjecture 1.2.</strong> Some text</p>
  //   <p><strong>My section</strong></p>
  //   <p><strong>Definition 1.</strong> Some text</p>
  //   <p><strong>Example.</strong> Some text</p>
  //   <p><strong>Exercise 1.1.4.</strong> Some text</p>
  //   <p><em>Remark.</em> Some text</p>
  //   <p><strong>1.2</strong></p>
  //   <p><strong>My subsection</strong></p>
  //   <p><em>Solution</em> 1.3<em>.</em> Some text</p>
  //   <p><strong>Exercise 1.2.1.</strong> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p><em>Solution</em> 1.4<em>.</em> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: definition
        heading: Theorem
        numberWithin: h3
      lemma:
        style: definition
        heading: Lemma
        numberWithin: h2
      corollary:
        style: definition
        heading: Corollary
        referenceCounter: theorem
      proposition:
        style: definition
        heading: Proposition
        referenceCounter: theorem
      conjecture:
        style: definition
        heading: Conjecture
        referenceCounter: lemma
      definition:
        style: definition
        heading: Definition
      example:
        style: definition
        heading: Example
        unnumbered: true
      exercise:
        style: definition
        heading: Exercise
        referenceCounter: theorem
      solution:
        style: remark
        heading: Solution
        referenceCounter: lemma
      remark:
        style: remark
        heading: Remark
        unnumbered: true
    ---

    ## My section

    ### My subsection

    :::theorem
    Some text
    :::

    :::lemma
    Some text
    :::

    :::corollary
    Some text
    :::

    :::proposition
    Some text
    :::

    :::conjecture
    Some text
    :::

    ## My section {.unnumbered}

    :::definition
    Some text
    :::

    :::example
    Some text
    :::

    :::exercise
    Some text
    :::

    :::remark
    Some text
    :::

    ### My subsection

    :::solution
    Some text
    :::

    :::exercise
    Some text
    :::

    :::proof
    Some text
    :::

    :::solution
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <section id="my-section">
      <h2><span class="count">1</span> My section</h2>
    </section>
    <section id="my-subsection">
      <h3><span class="count">1.1</span> My subsection</h3>
      <div class="theorem style-definition">
        <p><span class="title"><strong>Theorem 1.1.1.</strong></span> Some text</p>
      </div>
      <div class="theorem lemma style-definition">
        <p><span class="title"><strong>Lemma 1.1.</strong></span> Some text</p>
      </div>
      <div class="theorem corollary style-definition">
        <p><span class="title"><strong>Corollary 1.1.2.</strong></span> Some text</p>
      </div>
      <div class="theorem proposition style-definition">
        <p><span class="title"><strong>Proposition 1.1.3.</strong></span> Some text</p>
      </div>
      <div class="theorem conjecture style-definition">
        <p><span class="title"><strong>Conjecture 1.2.</strong></span> Some text</p>
      </div>
    </section>
    <section id="my-section-1">
      <h2>My section</h2>
      <div class="theorem definition style-definition">
        <p><span class="title"><strong>Definition 1.</strong></span> Some text</p>
      </div>
      <div class="theorem example style-definition">
        <p><span class="title"><strong>Example.</strong></span> Some text</p>
      </div>
      <div class="theorem exercise style-definition">
        <p><span class="title"><strong>Exercise 1.1.4.</strong></span> Some text</p>
      </div>
      <div class="theorem remark style-remark">
        <p><span class="title"><em>Remark</em>. </span>Some text</p>
      </div>
    </section>
    <section id="my-subsection-1">
      <h3><span class="count">1.2</span> My subsection</h3>
      <div class="theorem solution style-remark">
        <p><span class="title"><em>Solution 1.3</em>. </span>Some text</p>
      </div>
      <div class="theorem exercise style-definition">
        <p><span class="title"><strong>Exercise 1.2.1.</strong></span> Some text</p>
      </div>
      <div class="theorem proof style-remark">
        <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
      </div>
      <div class="theorem solution style-remark">
        <p><span class="title"><em>Solution 1.4</em>. </span>Some text</p>
      </div>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('ignore an unsupported boxout', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \begin{document}
    \begin{theorem2}
    An \verb|example\n| of \emph{this}!
    \end{theorem2}
    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    An \`example\\n\` of *this*!
  `);

  expect(markdown).toBe(expectedMarkdown);
});

test('nested theorems', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{proposition}{Proposition}
    \begin{document}

    \begin{proposition}Let $S$.

    a

    b
    \begin{proof}Let:
    \end{proof}
    c
    \end{proposition}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      proposition:
        style: definition
        heading: Proposition
    ---

    ::::proposition
    Let $S$.

    a

    b

    :::proof
    Let:
    :::

    c
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);
});

test('qed placement', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \begin{document}

    \begin{proof}We must:
    \begin{enumerate}
    \item Let:
    \item Let
    \[
    S\qedhere
    \]
    \end{enumerate}
    \end{proof}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    :::proof
    We must:

    1. Let:

    2. Let

       $$
       S\qedhere
       $$
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem proof style-remark">
      <p><span class="title"><em>Proof</em>. </span>We must:</p>
      <ol>
        <li>
          <p>Let:</p>
        </li>
        <li>
          <p>Let</p>
          <p class="maths"><code class="latex">S\qedhere</code></p>
        </li>
      </ol>
      <p><span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('qed placement 2', async () => {
  const latex = String.raw`
    \begin{proof}
    Observe that\sidenote{If we substitute}.
    \end{proof}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ::::proof
    Observe that:sidenote[sn-1].

    :::sidenotecontent[sn-1]
    If we substitute
    :::
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem proof style-remark">
      <p><span class="title"><em>Proof</em>. </span>Observe that<span class="sidenote"><sup><a id="sn-ref-sn-1" href="#sn-def-sn-1">1</a></sup><span class="sidenote-label"> (sidenote: </span><small class="sidenote-content"><span><sup><a id="sn-def-sn-1" href="#sn-ref-sn-1">1</a></sup>If we substitute</span></small><span class="sidenote-label">)</span></span>.<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath,amsthm}
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}

    \begin{document}

    \begin{theorem}
    \[\mathbf{a}\]
    \end{theorem}

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
    ---

    :::theorem
    $$
    \mathbf{a}
    $$
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 1.</strong></span> </p>
      <p class="maths"><code class="latex">\mathbf{a}</code></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug 2', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{thm}{Theorem}[section]
    \begin{document}

    \begin{thm}[Clairaut's Theroem] abc [Roughly speaking] Then
    \end{thm}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      thm:
        style: definition
        heading: Theorem
        numberWithin: h2
    ---

    :::thm[Clairaut's Theroem]
    abc \[Roughly speaking] Then
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem thm style-definition">
      <p><span class="title"><strong>Theorem 0.1 (Clairaut's Theroem).</strong></span> abc [Roughly speaking] Then</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug 3', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[section]
    \begin{document}

    \begin{theorem}
      a
      \subsection{Remark}
      b
    \end{theorem}

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

    :::theorem
    a

    ### Remark

    b
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 0.1.</strong></span> a</p>
      <h3 id="remark"><span class="count">0.1</span> Remark</h3>
      <p>b</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug 4', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \newtheorem{dfn}{Definition}[section]
    \newtheorem{lem}[dfn]{Lemma}
    \begin{document}

    \begin{lem}[Rolle's Theorem]\label{lem:Rolle}
    Suppose that
    \end{lem}

    \begin{proof}[Proof of \cref{lem:Rolle}.]
    By the extremal value theorem
    \end{proof}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      dfn:
        heading: Definition
        numberWithin: h2
      lem:
        heading: Lemma
        referenceCounter: dfn
    ---

    :::lem[Rolle's Theorem]{#lem-rolle}
    Suppose that
    :::

    :::proof[Proof of @lem-rolle.]
    By the extremal value theorem
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem lem" id="lem-rolle">
      <p><span class="title"><strong>Lemma 0.1 (Rolle's Theorem).</strong></span> Suppose that</p>
    </div>
    <div class="theorem proof style-remark">
      <p><span class="title"><em>Proof of <a href="#lem-rolle" class="ref">Lemma 0.1</a>.</em>. </span>By the extremal value theorem<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug 5', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \newtheorem{dfn}{Definition2}[section]
    \newtheorem{thm}[dfn]{Theorem2}
    \begin{document}

    \setcounter{section}{4}
    \fancysection{Alpha}
    \begin{dfn}
    Bravo.
    \end{dfn}
    \begin{thm}
    Charlie.
    \end{thm}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      dfn:
        heading: Definition2
        numberWithin: h2
      thm:
        heading: Theorem2
        referenceCounter: dfn
    ---

    ::set-counter{type="h2" value="4"}

    ## Alpha {.unnumbered}

    :::dfn
    Bravo.
    :::

    :::thm
    Charlie.
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="alpha">Alpha</h2>
    <div class="theorem dfn">
      <p><span class="title"><strong>Definition2 4.1.</strong></span> Bravo.</p>
    </div>
    <div class="theorem thm">
      <p><span class="title"><strong>Theorem2 4.2.</strong></span> Charlie.</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug 6', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}[section]
    \newtheorem{lemma}[theorem]{Lemma}
    \begin{document}

    \section{Alpha}
    \begin{lemma} \label{lem:normalremark}
    Let $G$ be a group:
    \begin{description}
    \item[a)] $H$ is normal.
    \end{description}
    \end{lemma}

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
      lemma:
        style: definition
        heading: Lemma
        referenceCounter: theorem
    ---

    ## Alpha

    :::lemma{#lem-normalremark}
    Let $G$ be a group:

    a)

    :   $H$ is normal.
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="alpha"><span class="count">1</span> Alpha</h2>
    <div class="theorem lemma style-definition" id="lem-normalremark">
      <p><span class="title"><strong>Lemma 1.1.</strong></span> Let <code class="latex">G</code> be a group:</p>
      <dl>
        <dt>a)</dt>
        <dd>
          <p><code class="latex">H</code> is normal.</p>
        </dd>
      </dl>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug 7', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \begin{document}

    \begin{theorem}
    \begin{enumerate}
    \item there.
    \end{enumerate}
    \end{theorem}

    \begin{proof}
    \begin{enumerate}
    \item The
    \end{enumerate}
    We claim
    \end{proof}

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
    ---

    :::theorem
    1. there.
    :::

    :::proof
    1. The

    We claim
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem style-definition">
      <p><span class="title"><strong>Theorem 1.</strong></span> </p>
      <ol>
        <li>there.</li>
      </ol>
    </div>
    <div class="theorem proof style-remark">
      <p><span class="title"><em>Proof</em>. </span></p>
      <ol>
        <li>The</li>
      </ol>
      <p>We claim<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('theorem name with star at the end', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \newtheorem*{theorem*}{Theorem}
    \begin{document}

    \begin{theorem*}
    A holomorphic function
    \end{theorem*}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    theorems:
      theorem-star:
        heading: Theorem
        unnumbered: true
    ---

    :::theorem-star
    A holomorphic function
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="theorem theorem-star">
      <p><span class="title"><strong>Theorem.</strong></span> A holomorphic function</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('ligatures in theorem names', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \newtheorem{proposition}{Proposition}
    \begin{document}

    l'H\^opital's rule.

    \begin{proposition}[l'H\^opital's rule]
    If
    \end{proposition}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      proposition:
        heading: Proposition
    ---

    l’Hôpital’s rule.

    :::proposition[l’Hôpital’s rule]
    If
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <p>l’Hôpital’s rule.</p>
    <div class="theorem proposition">
      <p><span class="title"><strong>Proposition 1 (l’Hôpital’s rule).</strong></span> If</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('references in theorem names', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \usepackage[overload]{keytheorems}
    \usepackage{zref-clever}
    \usepackage[colorlinks,bookmarks=false]{hyperref}
    \zcsetup{noabbrev, cap, nameinlink}
    \newtheorem{prop}{Proposition}
    \begin{document}

    \begin{prop}[Conservative]
    \label{prop:conservative}
    \end{prop}

    \section{Proof of \zcref{prop:conservative}}

    \begin{prop}[Restatement of \zcref{prop:conservative}]
    Hello
    \end{prop}

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      prop:
        heading: Proposition
    ---

    :::prop[Conservative]{#prop-conservative}

    :::

    ## Proof of @prop-conservative

    :::prop[Restatement of @prop-conservative]
    Hello
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <div class="theorem prop" id="prop-conservative">
      <p><span class="title"><strong>Proposition 1 (Conservative).</strong></span> </p>
    </div>
    <h2 id="proof-of-prop-conservative"><span class="count">1</span> Proof of <a href="#prop-conservative" class="ref">Proposition 1</a></h2>
    <div class="theorem prop">
      <p><span class="title"><strong>Proposition 2 (Restatement of <a href="#prop-conservative" class="ref">Proposition 1</a>).</strong></span> Hello</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
