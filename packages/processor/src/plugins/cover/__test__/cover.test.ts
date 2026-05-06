import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('cover', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}
    \title{How to \emph{Structure} a LaTeX Document}
    \author{David \emph{McArthur}}
    \date{29 \emph{May} 2025}
    \maketitle

    \begin{abstract}
    My abstract.

    Has multiple paragraphs.
    \end{abstract}

    \section{Introduction}

    Paragraph

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: How to *Structure* a LaTeX Document
    date: 29 *May* 2025
    author:
      name: David *McArthur*
    abstract: |-
      My abstract.

      Has multiple paragraphs.
    ---

    :::make-title
    :::

    ## Introduction

    Paragraph
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section>
      <header>
        <h1>How to <em>Structure</em> a LaTeX Document</h1>
        <p class="author">Written by David <em>McArthur</em></p>
        <p class="date">29 <em>May</em> 2025</p>
        <aside aria-labelledby="h-abstract" class="abstract">
          <h2 id="h-abstract">Abstract</h2>
          <p>My abstract.</p>
          <p>Has multiple paragraphs.</p>
        </aside>
      </header>
    </section>
    <section id="introduction">
      <h2><span class="count">1</span> Introduction</h2>
      <p>Paragraph</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('cover with just title', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}
    \title{How to \emph{Structure} a LaTeX Document}
    \maketitle

    Hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: How to *Structure* a LaTeX Document
    ---

    :::make-title
    :::

    Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <header>
      <h1>How to <em>Structure</em> a LaTeX Document</h1>
    </header>
    <p>Hello</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('cover with author with ORCID', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{orcidlink}
    \begin{document}
    \title{How to \emph{Structure} a LaTeX Document}
    \author{David \emph{McArthur} Esq. \orcidlink{0000-0002-1825-0097}}
    \date{29 \emph{May} 2025}
    \maketitle

    Hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: How to *Structure* a LaTeX Document
    date: 29 *May* 2025
    author:
      orcid: 0000-0002-1825-0097
      name: David *McArthur* Esq.
    ---

    :::make-title
    :::

    Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section>
      <header>
        <h1>How to <em>Structure</em> a LaTeX Document</h1>
        <p class="author">Written by David <em>McArthur</em> Esq. <a href="https://orcid.org/0000-0002-1825-0097" target="_blank" class="orcid" title="ORCID link"><svg viewBox="0 0 256 256">
              <path fill="#A6CE39" d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"></path>
              <g>
                <path fill="fff" d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z"></path>
                <path fill="fff" d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5
            c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"></path>
                <path fill="fff" d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1
            C84.2,46.7,88.7,51.3,88.7,56.8z"></path>
              </g>
            </svg></a></p>
        <p class="date">29 <em>May</em> 2025</p>
      </header>
      <p>Hello</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('cover with multiple authors with ORCIDs', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{authblk}
    \usepackage{orcidlink}
    \begin{document}
    \title{How to \emph{Structure} a LaTeX Document}
    \author[1]{David \emph{McArthur} \orcidlink{0000-0002-1825-0097}}
    \author[2]{Ivor Question \orcidlink{0000-0002-1825-0097}}
    \affil[1]{Department of Mathematics, University X}
    \affil[2]{Department of Biology, University Y}
    \date{29 \emph{May} 2025}
    \maketitle

    Hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: How to *Structure* a LaTeX Document
    date: 29 *May* 2025
    author:
      - orcid: 0000-0002-1825-0097
        name: David *McArthur*
        affiliation: Department of Mathematics, University X
      - orcid: 0000-0002-1825-0097
        name: Ivor Question
        affiliation: Department of Biology, University Y
    ---

    :::make-title
    :::

    Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section>
      <header>
        <h1>How to <em>Structure</em> a LaTeX Document</h1>
        <div class="authors">
          <p>Written by:</p>
          <ul>
            <li>David <em>McArthur</em> <a href="https://orcid.org/0000-0002-1825-0097" target="_blank" class="orcid" title="ORCID link"><svg viewBox="0 0 256 256">
                  <path fill="#A6CE39" d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"></path>
                  <g>
                    <path fill="fff" d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z"></path>
                    <path fill="fff" d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5
            c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"></path>
                    <path fill="fff" d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1
            C84.2,46.7,88.7,51.3,88.7,56.8z"></path>
                  </g>
                </svg></a>, <span class="affiliation">Department of Mathematics, University X</span></li>
            <li>Ivor Question <a href="https://orcid.org/0000-0002-1825-0097" target="_blank" class="orcid" title="ORCID link"><svg viewBox="0 0 256 256">
                  <path fill="#A6CE39" d="M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z"></path>
                  <g>
                    <path fill="fff" d="M86.3,186.2H70.9V79.1h15.4v48.4V186.2z"></path>
                    <path fill="fff" d="M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5
            c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z"></path>
                    <path fill="fff" d="M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1
            C84.2,46.7,88.7,51.3,88.7,56.8z"></path>
                  </g>
                </svg></a>, <span class="affiliation">Department of Biology, University Y</span></li>
          </ul>
        </div>
        <p class="date">29 <em>May</em> 2025</p>
      </header>
      <p>Hello</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('cover with all empty values', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{authblk}
    \usepackage{orcidlink}
    \begin{document}
    \title{}
    \author{}
    \date{}
    \abstract{}
    \maketitle

    Hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    :::make-title
    :::

    Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Hello</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('cover attributes with no maketitle', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}
    \title{How to \emph{Structure} a LaTeX Document}
    \author{David \emph{McArthur}}
    \date{29 \emph{May} 2025}
    %\maketitle

    Paragraph

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Paragraph
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Paragraph</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('maketitle under content', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}
    \title{How to \emph{Structure} a LaTeX Document}
    \author{David \emph{McArthur}}
    \date{29 \emph{May} 2025}

    \section{Introduction}

    Paragraph

    \maketitle

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: How to *Structure* a LaTeX Document
    date: 29 *May* 2025
    author:
      name: David *McArthur*
    ---

    ## Introduction

    Paragraph

    :::make-title
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section id="introduction">
      <h2><span class="count">1</span> Introduction</h2>
      <p>Paragraph</p>
      <header>
        <h1>How to <em>Structure</em> a LaTeX Document</h1>
        <p class="author">Written by David <em>McArthur</em></p>
        <p class="date">29 <em>May</em> 2025</p>
      </header>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('pagestyle', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}

    \pagestyle{plain}

    hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>hello</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('fancytitle under content', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}
    \title{How to \emph{Structure} a LaTeX Document}
    \author{David \emph{McArthur}}
    \date{29 \emph{May} 2025}

    \section{Introduction}

    Paragraph

    \fancytitle

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: How to *Structure* a LaTeX Document
    date: 29 *May* 2025
    author:
      name: David *McArthur*
    ---

    ## Introduction

    Paragraph

    :::make-title
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section id="introduction">
      <h2><span class="count">1</span> Introduction</h2>
      <p>Paragraph</p>
      <header>
        <h1>How to <em>Structure</em> a LaTeX Document</h1>
        <p class="author">Written by David <em>McArthur</em></p>
        <p class="date">29 <em>May</em> 2025</p>
      </header>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('fancytitle with set-counter', async () => {
  const latex = String.raw`
    \documentclass{article}
    \title{How to \emph{Structure} a LaTeX Document}
    \author{David \emph{McArthur}}
    \date{29 \emph{May} 2025}

    \begin{document}
    \setcounter{section}{1}
    \fancytitle

    Bla
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: How to *Structure* a LaTeX Document
    date: 29 *May* 2025
    author:
      name: David *McArthur*
    ---

    ::set-counter{type="h2" value="1"}

    :::make-title
    :::

    Bla
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section>
      <header>
        <h1>How to <em>Structure</em> a LaTeX Document</h1>
        <p class="author">Written by David <em>McArthur</em></p>
        <p class="date">29 <em>May</em> 2025</p>
      </header>
      <p>Bla</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('title with formatting', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{bbding}
    \usepackage[colorlinks=true,bookmarks=false,linkcolor=blue]{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}

    \title{
      \vspace*{0.1\textheight}
      \Huge{LECTURES}\\[0.4\baselineskip]
      \Large{ON}\\[0.6\baselineskip]
      \Huge{GALOIS THEORY}\\[\baselineskip]
    }
    \author{
      Author Name\\
      \href{mailto:email@glasgow.ac.uk}{email@glasgow.ac.uk}\\[0.08\textheight ]
      \FiveStarOpenCircled\\[0.5\baselineskip]
    }
    \date{
      \small{\scshape January -- March 2026}\\[0.01\textheight]
      \Large{4H/5E Galois Theory}\\
    }

    \begin{document}
    \maketitle

    Hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    title: LECTURES ON GALOIS THEORY
    date: |-
      January -- March 2026\
      4H/5E Galois Theory
    author:
      name: |-
        Author Name\
        <email@glasgow.ac.uk>
    ---

    :::make-title
    :::

    Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noSections: false });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section>
      <header>
        <h1>LECTURES ON GALOIS THEORY</h1>
        <p class="author">Written by Author Name<br />
          <a href="mailto:email@glasgow.ac.uk" target="_blank">email@glasgow.ac.uk</a>
        </p>
        <p class="date">January – March 2026<br />
          4H/5E Galois Theory</p>
      </header>
      <p>Hello</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});
