import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('toc addtocontents', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}
    \tableofcontents
    \addtocontents{toc}{\noindent\textit{Chapters with an asterisk.}\par \vspace{0.5cm}}

    \section{Revision*}\label{revision}

    Hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    tableOfContentsPrefix: |
      *Chapters with an asterisk.*
    ---

    ## Revision\* {#revision}

    Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const tocHtml = await testProcessor.mdToToc(markdown);
  // console.log(tocHtml);
  // return;

  const expectedTocHtml = unindentStringAndTrim(String.raw`
    <p class="toc-content"><em>Chapters with an asterisk.</em></p>
    <ol>
      <li class="depth-2"><a href="#revision"><span class="heading-count depth-2" data-id="revision"></span>Revision*</a></li>
    </ol>
  `);

  expect(tocHtml).toBe(expectedTocHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="revision"><span class="count">1</span> Revision*</h2>
    <p>Hello</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('multiple toc addtocontents', async () => {
  const latex = String.raw`
    \documentclass{article}
    \begin{document}
    \tableofcontents
    \addtocontents{toc}{\noindent\textit{Chapters with an asterisk.}\par \vspace{0.5cm}}

    \section{Revision*}\label{revision}

    \addtocontents{toc}{\setcounter{tocdepth}{2}}

    Hello

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    tableOfContentsPrefix: |
      *Chapters with an asterisk.*
    ---

    ## Revision\* {#revision}

    Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const tocHtml = await testProcessor.mdToToc(markdown);
  // console.log(tocHtml);
  // return;

  const expectedTocHtml = unindentStringAndTrim(String.raw`
    <p class="toc-content"><em>Chapters with an asterisk.</em></p>
    <ol>
      <li class="depth-2"><a href="#revision"><span class="heading-count depth-2" data-id="revision"></span>Revision*</a></li>
    </ol>
  `);

  expect(tocHtml).toBe(expectedTocHtml);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="revision"><span class="count">1</span> Revision*</h2>
    <p>Hello</p>
  `);

  expect(html).toBe(expectedHtml);
});
