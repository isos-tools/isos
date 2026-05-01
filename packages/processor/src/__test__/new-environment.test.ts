import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('newenvironment', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \documentclass{article}

    \newenvironment{rems}{\paragraph{Remarks}\begin{enumerate}}{\end{enumerate}}

    \begin{document}

    \begin{rems}
      \item a.
      \item b.
      \item c.
    \end{rems}

    \end{document}
  `);

  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ##### Remarks

    1. a.

    2. b.

    3. c.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h5 id="remarks">Remarks</h5>
    <ol>
      <li>
        <p>a.</p>
      </li>
      <li>
        <p>b.</p>
      </li>
      <li>
        <p>c.</p>
      </li>
    </ol>
  `);

  expect(html).toBe(expectedHtml);
});

test('newenvironment with argument', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \documentclass{article}

    \newenvironment{algorithm}[1][\unskip]{%
      \smallskip\par\noindent\textbf{Algorithm}\quad\emph{#1}\indent
    }{%
    \vspace*{1em}
    }

    \begin{document}

    \begin{algorithm}[Classical Gram--Schmidt algorithm]
    Hello
    \end{algorithm}

    \end{document}
  `);

  // possible alternative:
  // ---
  // environments:
  //   algorithm:
  //     signature: o
  //     begin: **Algorithm** *#1*
  // ---

  // :::algorithm[Classical Gram--Schmidt algorithm]
  // Hello
  // :::

  const expectedMarkdown = unindentStringAndTrim(`
    **Algorithm** *Classical Gram--Schmidt algorithm* Hello
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <p><strong>Algorithm</strong> <em>Classical Gram–Schmidt algorithm</em> Hello</p>
  `);

  expect(html).toBe(expectedHtml);
});
