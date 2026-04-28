import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';
// @ts-ignore
// import { pdfLatexToHtml } from '../../../test-utils/pdflatex-to-html';

test('custom theorem', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \newtheorem{conv}{Convention}
    \begin{document}

    \begin{conv}[Pythagorean]
    \label{conv:line}
    Cras mattis.

    Cras justo odio.
    \end{conv}

    See~\cref{conv:line}.

    \end{document}
  `);

  // const latexHtml = await pdfLatexToHtml.mupdf(latex);
  // // console.log(latexHtml);

  // const expectedLatexHtml = unindentStringAndTrim(`
  //   <p><strong>Convention 1</strong> (Pythagorean)<strong>.</strong><em> Cras mattis.</em></p>
  //   <p><em>Cras justo odio.</em></p>
  //   <p>See Convention 1.</p>
  //   <p>1</p>
  // `);

  // expect(latexHtml).toBe(expectedLatexHtml);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  // TODO: default theorem attributes under custom should be removed
  const expectedMarkdown = unindentStringAndTrim(`
    ---
    theorems:
      custom:
        - name: conv
          abbr: conv
          style: plain
          heading: Convention
          unnumbered: false
          type: theorem
    ---

    ::: {#conv-line name="Pythagorean"}
    Cras mattis.

    Cras justo odio.
    :::

    See @conv-line.
  `);

  expect(markdown).toBe(expectedMarkdown);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);

  // const expectedQuartoHtml = unindentStringAndTrim(`
  //   <div id="conv-line">
  //     <p>Cras mattis.</p>
  //     <p>Cras justo odio.</p>
  //   </div>
  //   <p>See <span class="citation" data-cites="conv-line">@conv-line</span>.</p>
  // `);

  // expect(quartoHtml).toBe(expectedQuartoHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <div class="plain conv" id="conv-line">
      <p><span class="title"><strong>Convention 1 (Pythagorean).</strong></span> Cras mattis.</p>
      <p>Cras justo odio.</p>
    </div>
    <p>See <a href="#conv-line" class="ref">Convention 1</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});
