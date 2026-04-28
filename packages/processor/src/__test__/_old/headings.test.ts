import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('headings with counters and attributes', async () => {
  const latex = `
    \\title{Alfa}
    \\section{Bravo \\textbf{hi}}
    \\subsection{Charlie} \\label{hi}
    \\subsubsection{\\textbf{Delta} hi}
    \\paragraph{Echo}
    \\subparagraph{Foxtrot}
    \\paragraph{Golf}
    \\subparagraph{Hotel}
    \\section*{India}
    \\section{Juliett}
    \\subsection*{\\textbf{Kilo}}
    \\section{Lima}
    \\subsection{Mike}
    \\subsubsection{November}
    \\subsection{Oscar}
    \\subsubsection{Papa}
    \\subsubsection*{Quebec \\textbf{hi}}
    \\subsubsection{Romeo}
  `;

  const markdown = await testProcessor.latex(latex);

  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    # Alfa

    ## Bravo **hi**

    ### Charlie {#hi}

    #### **Delta** hi

    ##### Echo

    ###### Foxtrot

    ##### Golf

    ###### Hotel

    ## India {.starred}

    ## Juliett

    ### **Kilo** {.starred}

    ## Lima

    ### Mike

    #### November

    ### Oscar

    #### Papa

    #### Quebec **hi** {.starred}

    #### Romeo
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  // console.log(html);

  const expected = unindentStringAndTrim(`
    <h1 id="alfa">Alfa</h1>
    <section id="bravo-hi">
      <h2><span class="count">1.</span> Bravo <strong>hi</strong></h2>
      <section id="hi">
        <h3><span class="count">1.1.</span> Charlie</h3>
        <section id="delta-hi">
          <h4><span class="count">1.1.1.</span> <strong>Delta</strong> hi</h4>
          <section id="echo">
            <h5>Echo</h5>
            <section id="foxtrot">
              <h6>Foxtrot</h6>
            </section>
          </section>
          <section id="golf">
            <h5>Golf</h5>
            <section id="hotel">
              <h6>Hotel</h6>
            </section>
          </section>
        </section>
      </section>
    </section>
    <section id="india">
      <h2>India</h2>
    </section>
    <section id="juliett">
      <h2><span class="count">2.</span> Juliett</h2>
      <section id="kilo">
        <h3><strong>Kilo</strong></h3>
      </section>
    </section>
    <section id="lima">
      <h2><span class="count">3.</span> Lima</h2>
      <section id="mike">
        <h3><span class="count">3.1.</span> Mike</h3>
        <section id="november">
          <h4><span class="count">3.1.1.</span> November</h4>
        </section>
      </section>
      <section id="oscar">
        <h3><span class="count">3.2.</span> Oscar</h3>
        <section id="papa">
          <h4><span class="count">3.2.1.</span> Papa</h4>
        </section>
        <section id="quebec-hi">
          <h4>Quebec <strong>hi</strong></h4>
        </section>
        <section id="romeo">
          <h4><span class="count">3.2.2.</span> Romeo</h4>
        </section>
      </section>
    </section>
  `);

  expect(html).toBe(expected);
});

test('headings on environments', async () => {
  const latex = `
    \\documentclass{amsproc}

    \\newtheorem{theorem}{Theorem}[section]
    \\newtheorem{lemma}[theorem]{Lemma}
    \\newtheorem{proposition}[theorem]{Proposition}
    \\newtheorem{corollary}[theorem]{Corollary}

    \\theoremstyle{definition}
    \\newtheorem{definition}[theorem]{Definition}
    \\newtheorem{notation}[theorem]{Notation}
    \\newtheorem{example}[theorem]{Example}
    \\newtheorem{xca}[theorem]{Exercise}

    \\newenvironment{solution}{\\begin{proof}[Solution]}{\\end{proof}}

    \\theoremstyle{remark}
    \\newtheorem{remark}[theorem]{Remark}

    \\begin{document}

    \\section*{PART I. DIFFERENTIATION}

    \\section{Limits}

    \\begin{lemma}

    \\end{lemma}

    \\begin{example}
    Test
    \\end{example}

    \\begin{definition}
    Test
    \\end{definition}

    \\begin{proposition}
    Test
    \\end{proposition}

    \\section{Introduction to differentiation} \\label{CMS1}

    \\begin{definition} \\label{CMD1.1}
    Test
    \\end{definition}

    \\begin{lemma}
    Test
    \\end{lemma}

    \\begin{example}
    Test
    \\end{example}

    \\begin{solution}
    Test
    \\end{solution}

    \\begin{example} \\label{CME1.3}
    Test
    \\end{example}

    \\begin{solution}
    Test
    \\end{solution}

    \\begin{example} \\label{CME1.4}
    Test
    \\end{example}

    \\begin{solution}
    Test
    \\end{solution}

    \\begin{definition} \\label{CMD1.5}
    Test
    \\end{definition}

    \\begin{definition} \\label{CMD1.6}
    Test
    \\end{definition}

    \\begin{example} \\label{CME1.7}
    Test
    \\end{example}

    \\begin{definition} \\label{CMD1.8}
    Test
    \\end{definition}

    \\section{Power series} \\label{CMS2}

    \\begin{theorem} \\label{power}
    Test
    \\end{theorem}

    \\begin{theorem}[Ratio Test] \\label{CMT2.2}
    Test
    \\end{theorem}

    \\begin{example} \\label{CME2.1}
    Test
    \\end{example}

    \\end{document}
  `;

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        heading: Theorem
        numberWithin: section
      lemma:
        heading: Lemma
        referenceCounter: theorem
      proposition:
        heading: Proposition
        referenceCounter: theorem
      corollary:
        heading: Corollary
        referenceCounter: theorem
      definition:
        heading: Definition
        referenceCounter: theorem
      notation:
        heading: Notation
        referenceCounter: theorem
      example:
        heading: Example
        referenceCounter: theorem
      xca:
        heading: Exercise
        referenceCounter: theorem
      remark:
        heading: Remark
        referenceCounter: theorem
    ---

    ## PART I. DIFFERENTIATION {.starred}

    ## Limits

    :::lemma

    :::

    :::example
    Test
    :::

    :::definition
    Test
    :::

    :::proposition
    Test
    :::

    ## Introduction to differentiation {#CMS1}

    :::definition{id="CMD1.1"}
    Test
    :::

    :::lemma
    Test
    :::

    :::example
    Test
    :::

    :::solution
    Test
    :::

    :::example{id="CME1.3"}
    Test
    :::

    :::solution
    Test
    :::

    :::example{id="CME1.4"}
    Test
    :::

    :::solution
    Test
    :::

    :::definition{id="CMD1.5"}
    Test
    :::

    :::definition{id="CMD1.6"}
    Test
    :::

    :::example{id="CME1.7"}
    Test
    :::

    :::definition{id="CMD1.8"}
    Test
    :::

    ## Power series {#CMS2}

    :::theorem{#power}
    Test
    :::

    :::theorem{id="CMT2.2"}
    Test
    :::

    :::example{id="CME2.1"}
    Test
    :::
  `);
  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <section id="part-i-differentiation">
      <h2>PART I. DIFFERENTIATION</h2>
    </section>
    <section id="limits">
      <h2><span class="count">1.</span> Limits</h2>
      <div id="lemma-11" class="boxout lemma">
        <p><span class="type">Lemma <span class="count">1.1.</span></span></p>
      </div>
      <div id="example-12" class="boxout example">
        <p><span class="type">Example <span class="count">1.2.</span></span> Test</p>
      </div>
      <div id="definition-13" class="boxout definition">
        <p><span class="type">Definition <span class="count">1.3.</span></span> Test</p>
      </div>
      <div id="proposition-14" class="boxout proposition">
        <p><span class="type">Proposition <span class="count">1.4.</span></span> Test</p>
      </div>
    </section>
    <section id="cms1">
      <h2><span class="count">2.</span> Introduction to differentiation</h2>
      <div id="cmd11" class="boxout definition">
        <p><span class="type">Definition <span class="count">2.1.</span></span> Test</p>
      </div>
      <div id="lemma-22" class="boxout lemma">
        <p><span class="type">Lemma <span class="count">2.2.</span></span> Test</p>
      </div>
      <div id="example-23" class="boxout example">
        <p><span class="type">Example <span class="count">2.3.</span></span> Test</p>
      </div>
      <div id="solution-1" class="boxout solution">
        <p><span class="type">Solution.</span> Test<span class="proof-box">◻</span></p>
      </div>
      <div id="cme13" class="boxout example">
        <p><span class="type">Example <span class="count">2.4.</span></span> Test</p>
      </div>
      <div id="solution-2" class="boxout solution">
        <p><span class="type">Solution.</span> Test<span class="proof-box">◻</span></p>
      </div>
      <div id="cme14" class="boxout example">
        <p><span class="type">Example <span class="count">2.5.</span></span> Test</p>
      </div>
      <div id="solution-3" class="boxout solution">
        <p><span class="type">Solution.</span> Test<span class="proof-box">◻</span></p>
      </div>
      <div id="cmd15" class="boxout definition">
        <p><span class="type">Definition <span class="count">2.6.</span></span> Test</p>
      </div>
      <div id="cmd16" class="boxout definition">
        <p><span class="type">Definition <span class="count">2.7.</span></span> Test</p>
      </div>
      <div id="cme17" class="boxout example">
        <p><span class="type">Example <span class="count">2.8.</span></span> Test</p>
      </div>
      <div id="cmd18" class="boxout definition">
        <p><span class="type">Definition <span class="count">2.9.</span></span> Test</p>
      </div>
    </section>
    <section id="cms2">
      <h2><span class="count">3.</span> Power series</h2>
      <div id="power" class="boxout theorem">
        <p><span class="type">Theorem <span class="count">3.1.</span></span> Test</p>
      </div>
      <div id="cmt22" class="boxout theorem">
        <p><span class="type">Theorem <span class="count">3.2.</span></span> Test</p>
      </div>
      <div id="cme21" class="boxout example">
        <p><span class="type">Example <span class="count">3.3.</span></span> Test</p>
      </div>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});
