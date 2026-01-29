import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('newhideabletheorem', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{report}
    \usepackage{amsthm}
    \usepackage[most]{tcolorbox}

    \NewDocumentCommand{\newhideabletheorem}{O{}O{}momo}{
      \newtheoremstyle{nosolstyle}
        {}{}
        {\ifnosols\color{#1}\else\normalcolor\fi}{}
        {\normalcolor\bfseries}{}
        { }{}
      \theoremstyle{nosolstyle}
      \newtheorem{#3}{#5}[#6]
      \tcolorboxenvironment{#3}{colback={#1}, colframe={#2}}
    }

    \theoremstyle{remark}

    \newhideabletheorem[
      pdf=emptybox,
      isos=clicktoshow,
    ][
      colback=white!80!yellow,
      colframe=blue!50!black,
    ]{solution}{Solution}[chapter]

    \begin{document}

    \begin{solution}
    Hi
    \end{solution}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    documentClass: report
    theorems:
      solution:
        numberWithin: h2
        hideable: clicktoshow
        framed: true
    ---

    ::: {#sol-1}
    Hi
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="remark solution framed hideable-clicktoshow" id="sol-1">
      <p><span class="title"><em>Solution 0.1</em>. </span>Hi</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('newhideabletheorem hide', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{report}
    \theoremstyle{remark}
    \newhideabletheorem[hide][]{solution}{Solution}[chapter]

    \begin{document}

    \begin{solution}
    Hi
    \end{solution}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    documentClass: report
    theorems:
      solution:
        numberWithin: h2
        hideable: hide
        framed: true
    ---

    ::: {#sol-1}
    Hi
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="remark solution framed hideable-hide" id="sol-1">
      <p><span class="title"><em>Solution 0.1</em>. </span>Hi</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('newhideabletheorem emptybox', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{report}
    \theoremstyle{remark}
    \newhideabletheorem[emptybox][]{solution}{Solution}[chapter]

    \begin{document}

    \begin{solution}
    Hi
    \end{solution}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    documentClass: report
    theorems:
      solution:
        numberWithin: h2
        hideable: hide
        framed: true
    ---

    ::: {#sol-1}
    Hi
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="remark solution framed hideable-hide" id="sol-1">
      <p><span class="title"><em>Solution 0.1</em>. </span>Hi</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});

test('newhideabletheorem not framed', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{report}
    \theoremstyle{remark}
    \newhideabletheorem[framed=false][]{solution}{Solution}[chapter]

    \begin{document}

    \begin{solution}
    Hi
    \end{solution}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    documentClass: report
    theorems:
      solution:
        numberWithin: h2
        hideable: clicktoshow
    ---

    ::: {#sol-1}
    Hi
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="remark solution hideable-clicktoshow" id="sol-1">
      <p><span class="title"><em>Solution 0.1</em>. </span>Hi</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
