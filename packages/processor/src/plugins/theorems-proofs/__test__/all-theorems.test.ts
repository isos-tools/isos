import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';
// @ts-ignore
// import { pdfLatexToHtml } from '../../../test-utils/pdflatex-to-html';

test('all theorems with default styles', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \newtheorem{lemma}{Lemma}
    \newtheorem{corollary}{Corollary}
    \newtheorem{proposition}{Proposition}
    \newtheorem{conjecture}{Conjecture}
    \newtheorem{definition}{Definition}
    \newtheorem{example}{Example}
    \newtheorem{exercise}{Exercise}

    \theoremstyle{remark}
    \newtheorem{solution}{Solution}
    \newtheorem{remark}{Remark}

    \begin{document}

    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}

    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}

    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 1..</strong> Some text</p>
  //   <p><strong>Lemma 1..</strong> Some text</p>
  //   <p><strong>Corollary 1..</strong> Some text</p>
  //   <p><strong>Proposition 1..</strong> Some text</p>
  //   <p><strong>Conjecture 1..</strong> Some text</p>
  //   <p><strong>Definition 1..</strong> Some text</p>
  //   <p><strong>Example 1..</strong> Some text</p>
  //   <p><strong>Exercise 1..</strong> Some text</p>
  //   <p><em>Solution</em> 1<em>.</em> Some text</p>
  //   <p><em>Remark</em> 1<em>.</em> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p><strong>Theorem 2..</strong> Some text</p>
  //   <p><strong>Lemma 2..</strong> Some text</p>
  //   <p><strong>Corollary 2..</strong> Some text</p>
  //   <p><strong>Proposition 2..</strong> Some text</p>
  //   <p><strong>Conjecture 2..</strong> Some text</p>
  //   <p><strong>Definition 2..</strong> Some text</p>
  //   <p><strong>Example 2..</strong> Some text</p>
  //   <p><strong>Exercise 2..</strong> Some text</p>
  //   <p><em>Solution</em> 2<em>.</em> Some text</p>
  //   <p><em>Remark</em> 2<em>.</em> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {#thm-1}
    Some text
    :::

    ::: {#lem-1}
    Some text
    :::

    ::: {#cor-1}
    Some text
    :::

    ::: {#prp-1}
    Some text
    :::

    ::: {#cnj-1}
    Some text
    :::

    ::: {#def-1}
    Some text
    :::

    ::: {#exm-1}
    Some text
    :::

    ::: {#exr-1}
    Some text
    :::

    ::: {#sol-1}
    Some text
    :::

    ::: {#rem-1}
    Some text
    :::

    ::: {.proof}
    Some text
    :::

    ::: {#thm-2}
    Some text
    :::

    ::: {#lem-2}
    Some text
    :::

    ::: {#cor-2}
    Some text
    :::

    ::: {#prp-2}
    Some text
    :::

    ::: {#cnj-2}
    Some text
    :::

    ::: {#def-2}
    Some text
    :::

    ::: {#exm-2}
    Some text
    :::

    ::: {#exr-2}
    Some text
    :::

    ::: {#sol-2}
    Some text
    :::

    ::: {#rem-2}
    Some text
    :::

    ::: {.proof}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);

  // const expectedQuartoHtml = unindentStringAndTrim(`
  //   <div id="thm-1" class="theorem">
  //     <p><span class="title"><strong>Theorem 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="lem-1" class="theorem lemma">
  //     <p><span class="title"><strong>Lemma 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="cor-1" class="theorem corollary">
  //     <p><span class="title"><strong>Corollary 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="prp-1" class="theorem proposition">
  //     <p><span class="title"><strong>Proposition 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="cnj-1" class="theorem conjecture">
  //     <p><span class="title"><strong>Conjecture 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="def-1" class="theorem definition">
  //     <p><span class="title"><strong>Definition 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="exm-1" class="theorem example">
  //     <p><span class="title"><strong>Example 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="exr-1" class="theorem exercise">
  //     <p><span class="title"><strong>Exercise 1.</strong></span> Some text</p>
  //   </div>
  //   <div id="sol-1" class="proof solution">
  //     <p><span class="title"><em>Solution 1</em>. </span>Some text</p>
  //   </div>
  //   <div id="rem-1" class="proof remark">
  //     <p><span class="title"><em>Remark 1</em>. </span>Some text</p>
  //   </div>
  //   <div class="proof">
  //     <p><span class="title"><em>Proof</em>. </span>Some text</p>
  //   </div>
  //   <div id="thm-2" class="theorem">
  //     <p><span class="title"><strong>Theorem 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="lem-2" class="theorem lemma">
  //     <p><span class="title"><strong>Lemma 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="cor-2" class="theorem corollary">
  //     <p><span class="title"><strong>Corollary 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="prp-2" class="theorem proposition">
  //     <p><span class="title"><strong>Proposition 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="cnj-2" class="theorem conjecture">
  //     <p><span class="title"><strong>Conjecture 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="def-2" class="theorem definition">
  //     <p><span class="title"><strong>Definition 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="exm-2" class="theorem example">
  //     <p><span class="title"><strong>Example 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="exr-2" class="theorem exercise">
  //     <p><span class="title"><strong>Exercise 2.</strong></span> Some text</p>
  //   </div>
  //   <div id="sol-2" class="proof solution">
  //     <p><span class="title"><em>Solution 2</em>. </span>Some text</p>
  //   </div>
  //   <div id="rem-2" class="proof remark">
  //     <p><span class="title"><em>Remark 2</em>. </span>Some text</p>
  //   </div>
  //   <div class="proof">
  //     <p><span class="title"><em>Proof</em>. </span>Some text</p>
  //   </div>
  // `);

  // expect(quartoHtml).toBe(expectedQuartoHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-1">
      <p><span class="title"><strong>Lemma 1.</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-1">
      <p><span class="title"><strong>Corollary 1.</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-1">
      <p><span class="title"><strong>Proposition 1.</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-1">
      <p><span class="title"><strong>Conjecture 1.</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-1">
      <p><span class="title"><strong>Definition 1.</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-1">
      <p><span class="title"><strong>Example 1.</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-1">
      <p><span class="title"><strong>Exercise 1.</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-1">
      <p><span class="title"><em>Solution 1</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-1">
      <p><span class="title"><em>Remark 1</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
    <div class="definition theorem" id="thm-2">
      <p><span class="title"><strong>Theorem 2.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-2">
      <p><span class="title"><strong>Lemma 2.</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-2">
      <p><span class="title"><strong>Corollary 2.</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-2">
      <p><span class="title"><strong>Proposition 2.</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-2">
      <p><span class="title"><strong>Conjecture 2.</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-2">
      <p><span class="title"><strong>Definition 2.</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-2">
      <p><span class="title"><strong>Example 2.</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-2">
      <p><span class="title"><strong>Exercise 2.</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-2">
      <p><span class="title"><em>Solution 2</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-2">
      <p><span class="title"><em>Remark 2</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('all theorems with plain styles', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \newtheorem{theorem}{Theorem}
    \newtheorem{lemma}{Lemma}
    \newtheorem{corollary}{Corollary}
    \newtheorem{proposition}{Proposition}
    \newtheorem{conjecture}{Conjecture}
    \newtheorem{definition}{Definition}
    \newtheorem{example}{Example}
    \newtheorem{exercise}{Exercise}
    \newtheorem{solution}{Solution}
    \newtheorem{remark}{Remark}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}

    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}
    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 1..</strong><em> Some text</em></p>
  //   <p><strong>Lemma 1..</strong><em> Some text</em></p>
  //   <p><strong>Corollary 1..</strong><em> Some text</em></p>
  //   <p><strong>Proposition 1..</strong><em> Some text</em></p>
  //   <p><strong>Conjecture 1..</strong><em> Some text</em></p>
  //   <p><strong>Definition 1..</strong><em> Some text</em></p>
  //   <p><strong>Example 1..</strong><em> Some text</em></p>
  //   <p><strong>Exercise 1..</strong><em> Some text</em></p>
  //   <p><strong>Solution 1..</strong><em> Some text</em></p>
  //   <p><strong>Remark 1..</strong><em> Some text</em></p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p><strong>Theorem 2..</strong><em> Some text</em></p>
  //   <p><strong>Lemma 2..</strong><em> Some text</em></p>
  //   <p><strong>Corollary 2..</strong><em> Some text</em></p>
  //   <p><strong>Proposition 2..</strong><em> Some text</em></p>
  //   <p><strong>Conjecture 2..</strong><em> Some text</em></p>
  //   <p><strong>Definition 2..</strong><em> Some text</em></p>
  //   <p><strong>Example 2..</strong><em> Some text</em></p>
  //   <p><strong>Exercise 2..</strong><em> Some text</em></p>
  //   <p><strong>Solution 2..</strong><em> Some text</em></p>
  //   <p><strong>Remark 2..</strong><em> Some text</em></p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        style: plain
      lemma:
        style: plain
      corollary:
        style: plain
      proposition:
        style: plain
      conjecture:
        style: plain
      definition:
        style: plain
      example:
        style: plain
      exercise:
        style: plain
      solution:
        style: plain
      remark:
        style: plain
    ---

    ::: {#thm-1}
    Some text
    :::

    ::: {#lem-1}
    Some text
    :::

    ::: {#cor-1}
    Some text
    :::

    ::: {#prp-1}
    Some text
    :::

    ::: {#cnj-1}
    Some text
    :::

    ::: {#def-1}
    Some text
    :::

    ::: {#exm-1}
    Some text
    :::

    ::: {#exr-1}
    Some text
    :::

    ::: {#sol-1}
    Some text
    :::

    ::: {#rem-1}
    Some text
    :::

    ::: {.proof}
    Some text
    :::

    ::: {#thm-2}
    Some text
    :::

    ::: {#lem-2}
    Some text
    :::

    ::: {#cor-2}
    Some text
    :::

    ::: {#prp-2}
    Some text
    :::

    ::: {#cnj-2}
    Some text
    :::

    ::: {#def-2}
    Some text
    :::

    ::: {#exm-2}
    Some text
    :::

    ::: {#exr-2}
    Some text
    :::

    ::: {#sol-2}
    Some text
    :::

    ::: {#rem-2}
    Some text
    :::

    ::: {.proof}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="plain theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 1.</strong></span> Some text</p>
    </div>
    <div class="plain lemma" id="lem-1">
      <p><span class="title"><strong>Lemma 1.</strong></span> Some text</p>
    </div>
    <div class="plain corollary" id="cor-1">
      <p><span class="title"><strong>Corollary 1.</strong></span> Some text</p>
    </div>
    <div class="plain proposition" id="prp-1">
      <p><span class="title"><strong>Proposition 1.</strong></span> Some text</p>
    </div>
    <div class="plain conjecture" id="cnj-1">
      <p><span class="title"><strong>Conjecture 1.</strong></span> Some text</p>
    </div>
    <div class="plain definition" id="def-1">
      <p><span class="title"><strong>Definition 1.</strong></span> Some text</p>
    </div>
    <div class="plain example" id="exm-1">
      <p><span class="title"><strong>Example 1.</strong></span> Some text</p>
    </div>
    <div class="plain exercise" id="exr-1">
      <p><span class="title"><strong>Exercise 1.</strong></span> Some text</p>
    </div>
    <div class="plain solution" id="sol-1">
      <p><span class="title"><strong>Solution 1.</strong></span> Some text</p>
    </div>
    <div class="plain remark" id="rem-1">
      <p><span class="title"><strong>Remark 1.</strong></span> Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
    <div class="plain theorem" id="thm-2">
      <p><span class="title"><strong>Theorem 2.</strong></span> Some text</p>
    </div>
    <div class="plain lemma" id="lem-2">
      <p><span class="title"><strong>Lemma 2.</strong></span> Some text</p>
    </div>
    <div class="plain corollary" id="cor-2">
      <p><span class="title"><strong>Corollary 2.</strong></span> Some text</p>
    </div>
    <div class="plain proposition" id="prp-2">
      <p><span class="title"><strong>Proposition 2.</strong></span> Some text</p>
    </div>
    <div class="plain conjecture" id="cnj-2">
      <p><span class="title"><strong>Conjecture 2.</strong></span> Some text</p>
    </div>
    <div class="plain definition" id="def-2">
      <p><span class="title"><strong>Definition 2.</strong></span> Some text</p>
    </div>
    <div class="plain example" id="exm-2">
      <p><span class="title"><strong>Example 2.</strong></span> Some text</p>
    </div>
    <div class="plain exercise" id="exr-2">
      <p><span class="title"><strong>Exercise 2.</strong></span> Some text</p>
    </div>
    <div class="plain solution" id="sol-2">
      <p><span class="title"><strong>Solution 2.</strong></span> Some text</p>
    </div>
    <div class="plain remark" id="rem-2">
      <p><span class="title"><strong>Remark 2.</strong></span> Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('all theorems with custom headings', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Alfa}
    \newtheorem{lemma}{Bravo}
    \newtheorem{corollary}{Charlie}
    \newtheorem{proposition}{Delta}
    \newtheorem{conjecture}{Echo}
    \newtheorem{definition}{Foxtrot}
    \newtheorem{example}{Golf}
    \newtheorem{exercise}{Hotel}

    \theoremstyle{remark}
    \newtheorem{solution}{India}
    \newtheorem{remark}{Juliett}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}

    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}
    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Alfa 1..</strong> Some text</p>
  //   <p><strong>Bravo 1..</strong> Some text</p>
  //   <p><strong>Charlie 1..</strong> Some text</p>
  //   <p><strong>Delta 1..</strong> Some text</p>
  //   <p><strong>Echo 1..</strong> Some text</p>
  //   <p><strong>Foxtrot 1..</strong> Some text</p>
  //   <p><strong>Golf 1..</strong> Some text</p>
  //   <p><strong>Hotel 1..</strong> Some text</p>
  //   <p><em>India</em> 1<em>.</em> Some text</p>
  //   <p><em>Juliett</em> 1<em>.</em> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p><strong>Alfa 2..</strong> Some text</p>
  //   <p><strong>Bravo 2..</strong> Some text</p>
  //   <p><strong>Charlie 2..</strong> Some text</p>
  //   <p><strong>Delta 2..</strong> Some text</p>
  //   <p><strong>Echo 2..</strong> Some text</p>
  //   <p><strong>Foxtrot 2..</strong> Some text</p>
  //   <p><strong>Golf 2..</strong> Some text</p>
  //   <p><strong>Hotel 2..</strong> Some text</p>
  //   <p><em>India</em> 2<em>.</em> Some text</p>
  //   <p><em>Juliett</em> 2<em>.</em> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p>1</p>
  //   1
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        heading: Alfa
      lemma:
        heading: Bravo
      corollary:
        heading: Charlie
      proposition:
        heading: Delta
      conjecture:
        heading: Echo
      definition:
        heading: Foxtrot
      example:
        heading: Golf
      exercise:
        heading: Hotel
      solution:
        heading: India
      remark:
        heading: Juliett
    ---

    ::: {#thm-1}
    Some text
    :::

    ::: {#lem-1}
    Some text
    :::

    ::: {#cor-1}
    Some text
    :::

    ::: {#prp-1}
    Some text
    :::

    ::: {#cnj-1}
    Some text
    :::

    ::: {#def-1}
    Some text
    :::

    ::: {#exm-1}
    Some text
    :::

    ::: {#exr-1}
    Some text
    :::

    ::: {#sol-1}
    Some text
    :::

    ::: {#rem-1}
    Some text
    :::

    ::: {.proof}
    Some text
    :::

    ::: {#thm-2}
    Some text
    :::

    ::: {#lem-2}
    Some text
    :::

    ::: {#cor-2}
    Some text
    :::

    ::: {#prp-2}
    Some text
    :::

    ::: {#cnj-2}
    Some text
    :::

    ::: {#def-2}
    Some text
    :::

    ::: {#exm-2}
    Some text
    :::

    ::: {#exr-2}
    Some text
    :::

    ::: {#sol-2}
    Some text
    :::

    ::: {#rem-2}
    Some text
    :::

    ::: {.proof}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Alfa 1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-1">
      <p><span class="title"><strong>Bravo 1.</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-1">
      <p><span class="title"><strong>Charlie 1.</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-1">
      <p><span class="title"><strong>Delta 1.</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-1">
      <p><span class="title"><strong>Echo 1.</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-1">
      <p><span class="title"><strong>Foxtrot 1.</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-1">
      <p><span class="title"><strong>Golf 1.</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-1">
      <p><span class="title"><strong>Hotel 1.</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-1">
      <p><span class="title"><em>India 1</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-1">
      <p><span class="title"><em>Juliett 1</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
    <div class="definition theorem" id="thm-2">
      <p><span class="title"><strong>Alfa 2.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-2">
      <p><span class="title"><strong>Bravo 2.</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-2">
      <p><span class="title"><strong>Charlie 2.</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-2">
      <p><span class="title"><strong>Delta 2.</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-2">
      <p><span class="title"><strong>Echo 2.</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-2">
      <p><span class="title"><strong>Foxtrot 2.</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-2">
      <p><span class="title"><strong>Golf 2.</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-2">
      <p><span class="title"><strong>Hotel 2.</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-2">
      <p><span class="title"><em>India 2</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-2">
      <p><span class="title"><em>Juliett 2</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('all theorems with custom counters', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \newtheorem{lemma}[theorem]{Lemma}
    \newtheorem{corollary}[theorem]{Corollary}
    \newtheorem{proposition}[theorem]{Proposition}
    \newtheorem{conjecture}[theorem]{Conjecture}
    \newtheorem{definition}{Definition}
    \newtheorem{example}[definition]{Example}
    \newtheorem{exercise}[definition]{Exercise}

    \theoremstyle{remark}
    \newtheorem{solution}[definition]{Solution}
    \newtheorem{remark}[definition]{Remark}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}

    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}
    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 1..</strong> Some text</p>
  //   <p><strong>Lemma 2..</strong> Some text</p>
  //   <p><strong>Corollary 3..</strong> Some text</p>
  //   <p><strong>Proposition 4..</strong> Some text</p>
  //   <p><strong>Conjecture 5..</strong> Some text</p>
  //   <p><strong>Definition 1..</strong> Some text</p>
  //   <p><strong>Example 2..</strong> Some text</p>
  //   <p><strong>Exercise 3..</strong> Some text</p>
  //   <p><em>Solution</em> 4<em>.</em> Some text</p>
  //   <p><em>Remark</em> 5<em>.</em> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p><strong>Theorem 6..</strong> Some text</p>
  //   <p><strong>Lemma 7..</strong> Some text</p>
  //   <p><strong>Corollary 8..</strong> Some text</p>
  //   <p><strong>Proposition 9..</strong> Some text</p>
  //   <p><strong>Conjecture 10..</strong> Some text</p>
  //   <p><strong>Definition 6..</strong> Some text</p>
  //   <p><strong>Example 7..</strong> Some text</p>
  //   <p><strong>Exercise 8..</strong> Some text</p>
  //   <p><em>Solution</em> 9<em>.</em> Some text</p>
  //   <p><em>Remark</em> 10<em>.</em> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      lemma:
        referenceCounter: theorem
      corollary:
        referenceCounter: theorem
      proposition:
        referenceCounter: theorem
      conjecture:
        referenceCounter: theorem
      example:
        referenceCounter: definition
      exercise:
        referenceCounter: definition
      solution:
        referenceCounter: definition
      remark:
        referenceCounter: definition
    ---

    ::: {#thm-1}
    Some text
    :::

    ::: {#lem-1}
    Some text
    :::

    ::: {#cor-1}
    Some text
    :::

    ::: {#prp-1}
    Some text
    :::

    ::: {#cnj-1}
    Some text
    :::

    ::: {#def-1}
    Some text
    :::

    ::: {#exm-1}
    Some text
    :::

    ::: {#exr-1}
    Some text
    :::

    ::: {#sol-1}
    Some text
    :::

    ::: {#rem-1}
    Some text
    :::

    ::: {.proof}
    Some text
    :::

    ::: {#thm-2}
    Some text
    :::

    ::: {#lem-2}
    Some text
    :::

    ::: {#cor-2}
    Some text
    :::

    ::: {#prp-2}
    Some text
    :::

    ::: {#cnj-2}
    Some text
    :::

    ::: {#def-2}
    Some text
    :::

    ::: {#exm-2}
    Some text
    :::

    ::: {#exr-2}
    Some text
    :::

    ::: {#sol-2}
    Some text
    :::

    ::: {#rem-2}
    Some text
    :::

    ::: {.proof}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 1.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-1">
      <p><span class="title"><strong>Lemma 2.</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-1">
      <p><span class="title"><strong>Corollary 3.</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-1">
      <p><span class="title"><strong>Proposition 4.</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-1">
      <p><span class="title"><strong>Conjecture 5.</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-1">
      <p><span class="title"><strong>Definition 1.</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-1">
      <p><span class="title"><strong>Example 2.</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-1">
      <p><span class="title"><strong>Exercise 3.</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-1">
      <p><span class="title"><em>Solution 4</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-1">
      <p><span class="title"><em>Remark 5</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
    <div class="definition theorem" id="thm-2">
      <p><span class="title"><strong>Theorem 6.</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-2">
      <p><span class="title"><strong>Lemma 7.</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-2">
      <p><span class="title"><strong>Corollary 8.</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-2">
      <p><span class="title"><strong>Proposition 9.</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-2">
      <p><span class="title"><strong>Conjecture 10.</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-2">
      <p><span class="title"><strong>Definition 6.</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-2">
      <p><span class="title"><strong>Example 7.</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-2">
      <p><span class="title"><strong>Exercise 8.</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-2">
      <p><span class="title"><em>Solution 9</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-2">
      <p><span class="title"><em>Remark 10</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('all theorems with custom names', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \newtheorem{lemma}{Lemma}
    \newtheorem{corollary}{Corollary}
    \newtheorem{proposition}{Proposition}
    \newtheorem{conjecture}{Conjecture}
    \newtheorem{definition}{Definition}
    \newtheorem{example}{Example}
    \newtheorem{exercise}{Exercise}

    \theoremstyle{remark}
    \newtheorem{solution}{Solution}
    \newtheorem{remark}{Remark}

    \begin{document}
    \begin{theorem}[Alpha] Some text \end{theorem}
    \begin{lemma}[Bravo] Some text \end{lemma}
    \begin{corollary}[Charlie] Some text \end{corollary}
    \begin{proposition}[Delta] Some text \end{proposition}
    \begin{conjecture}[Echo Beco] Some text \end{conjecture}
    \begin{definition}[Foxtrot] Some text \end{definition}
    \begin{example}[Golf] Some text \end{example}
    \begin{exercise}[Hotel] Some text \end{exercise}
    \begin{solution}[India] Some text \end{solution}
    \begin{remark}[Juliett] Some text \end{remark}
    \begin{proof}[Kilo] Some text \end{proof}

    \begin{theorem}[Lima] Some text \end{theorem}
    \begin{lemma}[Mike] Some text \end{lemma}
    \begin{corollary}[November] Some text \end{corollary}
    \begin{proposition}[Oscar] Some text \end{proposition}
    \begin{conjecture}[Papa] Some text \end{conjecture}
    \begin{definition}[Quebec] Some text \end{definition}
    \begin{example}[Romeo] Some text \end{example}
    \begin{exercise}[Sierra] Some text \end{exercise}
    \begin{solution}[Tango] Some text \end{solution}
    \begin{remark}[Uniform] Some text \end{remark}
    \begin{proof}[Victor] Some text \end{proof}
    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem 1.</strong> (Alpha)<strong>..</strong> Some text</p>
  //   <p><strong>Lemma 1.</strong> (Bravo)<strong>..</strong> Some text</p>
  //   <p><strong>Corollary 1.</strong> (Charlie)<strong>..</strong> Some text</p>
  //   <p><strong>Proposition 1.</strong> (Delta)<strong>..</strong> Some text</p>
  //   <p><strong>Conjecture 1.</strong> (Echo Beco)<strong>..</strong> Some text</p>
  //   <p><strong>Definition 1.</strong> (Foxtrot)<strong>..</strong> Some text</p>
  //   <p><strong>Example 1.</strong> (Golf)<strong>..</strong> Some text</p>
  //   <p><strong>Exercise 1.</strong> (Hotel)<strong>..</strong> Some text</p>
  //   <p><em>Solution</em> 1 (India)<em>.</em> Some text</p>
  //   <p><em>Remark</em> 1 (Juliett)<em>.</em> Some text</p>
  //   <p><em>Kilo.</em> Some text</p>
  //   <p><strong>Theorem 2.</strong> (Lima)<strong>..</strong> Some text</p>
  //   <p><strong>Lemma 2.</strong> (Mike)<strong>..</strong> Some text</p>
  //   <p><strong>Corollary 2.</strong> (November)<strong>..</strong> Some text</p>
  //   <p><strong>Proposition 2.</strong> (Oscar)<strong>..</strong> Some text</p>
  //   <p><strong>Conjecture 2.</strong> (Papa)<strong>..</strong> Some text</p>
  //   <p><strong>Definition 2.</strong> (Quebec)<strong>..</strong> Some text</p>
  //   <p><strong>Example 2.</strong> (Romeo)<strong>..</strong> Some text</p>
  //   <p><strong>Exercise 2.</strong> (Sierra)<strong>..</strong> Some text</p>
  //   <p><em>Solution</em> 2 (Tango)<em>.</em> Some text</p>
  //   <p><em>Remark</em> 2 (Uniform)<em>.</em> Some text</p>
  //   <p><em>Victor.</em> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {#thm-1 name="Alpha"}
    Some text
    :::

    ::: {#lem-1 name="Bravo"}
    Some text
    :::

    ::: {#cor-1 name="Charlie"}
    Some text
    :::

    ::: {#prp-1 name="Delta"}
    Some text
    :::

    ::: {#cnj-1 name="Echo Beco"}
    Some text
    :::

    ::: {#def-1 name="Foxtrot"}
    Some text
    :::

    ::: {#exm-1 name="Golf"}
    Some text
    :::

    ::: {#exr-1 name="Hotel"}
    Some text
    :::

    ::: {#sol-1 name="India"}
    Some text
    :::

    ::: {#rem-1 name="Juliett"}
    Some text
    :::

    ::: {.proof name="Kilo"}
    Some text
    :::

    ::: {#thm-2 name="Lima"}
    Some text
    :::

    ::: {#lem-2 name="Mike"}
    Some text
    :::

    ::: {#cor-2 name="November"}
    Some text
    :::

    ::: {#prp-2 name="Oscar"}
    Some text
    :::

    ::: {#cnj-2 name="Papa"}
    Some text
    :::

    ::: {#def-2 name="Quebec"}
    Some text
    :::

    ::: {#exm-2 name="Romeo"}
    Some text
    :::

    ::: {#exr-2 name="Sierra"}
    Some text
    :::

    ::: {#sol-2 name="Tango"}
    Some text
    :::

    ::: {#rem-2 name="Uniform"}
    Some text
    :::

    ::: {.proof name="Victor"}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 1 (Alpha).</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-1">
      <p><span class="title"><strong>Lemma 1 (Bravo).</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-1">
      <p><span class="title"><strong>Corollary 1 (Charlie).</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-1">
      <p><span class="title"><strong>Proposition 1 (Delta).</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-1">
      <p><span class="title"><strong>Conjecture 1 (Echo Beco).</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-1">
      <p><span class="title"><strong>Definition 1 (Foxtrot).</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-1">
      <p><span class="title"><strong>Example 1 (Golf).</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-1">
      <p><span class="title"><strong>Exercise 1 (Hotel).</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-1">
      <p><span class="title"><em>Solution 1 (India)</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-1">
      <p><span class="title"><em>Remark 1 (Juliett)</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Kilo</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
    <div class="definition theorem" id="thm-2">
      <p><span class="title"><strong>Theorem 2 (Lima).</strong></span> Some text</p>
    </div>
    <div class="definition lemma" id="lem-2">
      <p><span class="title"><strong>Lemma 2 (Mike).</strong></span> Some text</p>
    </div>
    <div class="definition corollary" id="cor-2">
      <p><span class="title"><strong>Corollary 2 (November).</strong></span> Some text</p>
    </div>
    <div class="definition proposition" id="prp-2">
      <p><span class="title"><strong>Proposition 2 (Oscar).</strong></span> Some text</p>
    </div>
    <div class="definition conjecture" id="cnj-2">
      <p><span class="title"><strong>Conjecture 2 (Papa).</strong></span> Some text</p>
    </div>
    <div class="definition" id="def-2">
      <p><span class="title"><strong>Definition 2 (Quebec).</strong></span> Some text</p>
    </div>
    <div class="definition example" id="exm-2">
      <p><span class="title"><strong>Example 2 (Romeo).</strong></span> Some text</p>
    </div>
    <div class="definition exercise" id="exr-2">
      <p><span class="title"><strong>Exercise 2 (Sierra).</strong></span> Some text</p>
    </div>
    <div class="remark solution" id="sol-2">
      <p><span class="title"><em>Solution 2 (Tango)</em>. </span>Some text</p>
    </div>
    <div class="remark" id="rem-2">
      <p><span class="title"><em>Remark 2 (Uniform)</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Victor</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('all theorems unnumbered', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}

    \theoremstyle{definition}
    \newtheorem*{theorem}{Theorem}
    \newtheorem*{lemma}{Lemma}
    \newtheorem*{corollary}{Corollary}
    \newtheorem*{proposition}{Proposition}
    \newtheorem*{conjecture}{Conjecture}
    \newtheorem*{definition}{Definition}
    \newtheorem*{example}{Example}
    \newtheorem*{exercise}{Exercise}

    \theoremstyle{remark}
    \newtheorem*{solution}{Solution}
    \newtheorem*{remark}{Remark}

    \begin{document}
    \begin{theorem} Some text \end{theorem}
    \begin{lemma} Some text \end{lemma}
    \begin{corollary} Some text \end{corollary}
    \begin{proposition} Some text \end{proposition}
    \begin{conjecture} Some text \end{conjecture}
    \begin{definition} Some text \end{definition}
    \begin{example} Some text \end{example}
    \begin{exercise} Some text \end{exercise}
    \begin{solution} Some text \end{solution}
    \begin{remark} Some text \end{remark}
    \begin{proof} Some text \end{proof}

    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml(latex);
  // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Theorem..</strong> Some text</p>
  //   <p><strong>Lemma..</strong> Some text</p>
  //   <p><strong>Corollary..</strong> Some text</p>
  //   <p><strong>Proposition..</strong> Some text</p>
  //   <p><strong>Conjecture..</strong> Some text</p>
  //   <p><strong>Definition..</strong> Some text</p>
  //   <p><strong>Example..</strong> Some text</p>
  //   <p><strong>Exercise..</strong> Some text</p>
  //   <p><em>Solution.</em> Some text</p>
  //   <p><em>Remark.</em> Some text</p>
  //   <p><em>Proof.</em> Some text</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      theorem:
        unnumbered: true
      lemma:
        unnumbered: true
      corollary:
        unnumbered: true
      proposition:
        unnumbered: true
      conjecture:
        unnumbered: true
      definition:
        unnumbered: true
      example:
        unnumbered: true
      exercise:
        unnumbered: true
      solution:
        unnumbered: true
      remark:
        unnumbered: true
    ---

    ::: {.thm.unnumbered}
    Some text
    :::

    ::: {.lem.unnumbered}
    Some text
    :::

    ::: {.cor.unnumbered}
    Some text
    :::

    ::: {.prp.unnumbered}
    Some text
    :::

    ::: {.cnj.unnumbered}
    Some text
    :::

    ::: {.def.unnumbered}
    Some text
    :::

    ::: {.exm.unnumbered}
    Some text
    :::

    ::: {.exr.unnumbered}
    Some text
    :::

    ::: {.sol.unnumbered}
    Some text
    :::

    ::: {.rem.unnumbered}
    Some text
    :::

    ::: {.proof}
    Some text
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="definition theorem">
      <p><span class="title"><strong>Theorem.</strong></span> Some text</p>
    </div>
    <div class="definition lemma">
      <p><span class="title"><strong>Lemma.</strong></span> Some text</p>
    </div>
    <div class="definition corollary">
      <p><span class="title"><strong>Corollary.</strong></span> Some text</p>
    </div>
    <div class="definition proposition">
      <p><span class="title"><strong>Proposition.</strong></span> Some text</p>
    </div>
    <div class="definition conjecture">
      <p><span class="title"><strong>Conjecture.</strong></span> Some text</p>
    </div>
    <div class="definition">
      <p><span class="title"><strong>Definition.</strong></span> Some text</p>
    </div>
    <div class="definition example">
      <p><span class="title"><strong>Example.</strong></span> Some text</p>
    </div>
    <div class="definition exercise">
      <p><span class="title"><strong>Exercise.</strong></span> Some text</p>
    </div>
    <div class="remark solution">
      <p><span class="title"><em>Solution</em>. </span>Some text</p>
    </div>
    <div class="remark">
      <p><span class="title"><em>Remark</em>. </span>Some text</p>
    </div>
    <div class="remark proof">
      <p><span class="title"><em>Proof</em>. </span>Some text<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
