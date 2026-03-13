import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('itemize to ul', async () => {
  const markdown = await testProcessor.latex(String.raw`
    Let.
    \begin{itemize}
    \item one
    \item two
    \end{itemize}
    me.
  `);

  const expectedMarkdown = unindentStringAndTrim(`
    Let.

    * one

    * two

    me.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(`
    <p>Let.</p>
    <ul>
      <li>
        <p>one</p>
      </li>
      <li>
        <p>two</p>
      </li>
    </ul>
    <p>me.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('enumerate to ol with setcounter', async () => {
  const latex = String.raw`
    Let.
    \begin{enumerate}
    \setcounter{enumi}{7}
    \item one
    \item two
    \end{enumerate}
    me.
  `;
  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    Let.

    8. one

    9. two

    me.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <p>Let.</p>
    <ol start="8">
      <li>
        <p>one</p>
      </li>
      <li>
        <p>two</p>
      </li>
    </ol>
    <p>me.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test.skip('enumerate to ol with styling', async () => {
  const latex = String.raw`
    \begin{enumerate}[label=\alph*.]
    \item Alpha
    \item Bravo
    \item Charlie
    \end{enumerate}
    In addition:
    \begin{enumerate}[label=(\alph*)]
    \setcounter{enumi}{3}
    \item Delta
    \end{enumerate}
  `;
  const markdown = await testProcessor.latex(latex);
  console.log(markdown);
  // return;

  // const expectedMarkdown = unindentStringAndTrim(`
  //   1. Alpha

  //   2. Bravo

  //   3. Charlie

  //   In addition:

  //   a) Delta
  // `);

  // // expect(markdown).toBe(expectedMarkdown);

  // const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);
  // return;

  // const expectedHtml = unindentStringAndTrim(`
  //   <p>Let.</p>
  //   <ol start="8">
  //     <li>
  //       <p>one</p>
  //     </li>
  //     <li>
  //       <p>two</p>
  //     </li>
  //   </ol>
  //   <p>me.</p>
  // `);

  // expect(html).toBe(expectedHtml);
});

test.skip('enumerate to ol with labels', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{enumitem}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}

    \begin{document}

    \section{Section}
    The following:
    \begin{enumerate}
      \item
        \begin{enumerate}
          \item
          \begin{enumerate}
            \item
            \begin{enumerate}
              \item \label{hello} More
            \end{enumerate}
          \end{enumerate}
        \end{enumerate}
    \end{enumerate}

    Refer to \ref{hello}.

    \end{document}
  `;
  const markdown = await testProcessor.latex(latex);
  console.log(markdown);
  // return;

  // const expectedMarkdown = unindentStringAndTrim(`
  //   1. Alpha

  //   2. Bravo

  //   3. Charlie

  //   In addition:

  //   a) Delta
  // `);

  // // expect(markdown).toBe(expectedMarkdown);

  // const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);
  // return;

  // const expectedHtml = unindentStringAndTrim(`
  //   <p>Let.</p>
  //   <ol start="8">
  //     <li>
  //       <p>one</p>
  //     </li>
  //     <li>
  //       <p>two</p>
  //     </li>
  //   </ol>
  //   <p>me.</p>
  // `);

  // expect(html).toBe(expectedHtml);
});

test('description to dl', async () => {
  const markdown = await testProcessor.latex(String.raw`
    Let.
    \begin{description}
    \item[one] two
    \item three
    \item[four] five
    \end{description}
    me.
  `);

  const expectedMarkdown = unindentStringAndTrim(`
    Let.

    one
    :   two
    :   three

    four
    :   five

    me.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(`
    <p>Let.</p>
    <dl>
      <dt>one</dt>
      <dd>two
      </dd>
      <dd>three
      </dd>
      <dt>four</dt>
      <dd>five
      </dd>
    </dl>
    <p>me.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test.skip('description with newlines to dl', async () => {
  const markdown = await testProcessor.latex(String.raw`
    \begin{description}
    \item[Nabla identities] $a$,\\
      $b$,\\
      $c$.
    \end{description}
  `);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Nabla identities
    :   $a$,\
        $b$,\
        $c$.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <dl>
      <dt>Nabla identities</dt>
      <dd><code class="latex">a</code>,<br />
        <code class="latex">b</code>,<br />
        <code class="latex">c</code>.
      </dd>
    </dl>
  `);

  expect(html).toBe(expectedHtml);
});

test('warn on enumerate with hardcoded labels', async () => {
  const markdown = await testProcessor.latex(String.raw`
    Let.
    \begin{enumerate}
    \item one
    \item two
    \end{enumerate}
    or
    \begin{enumerate}
    \item[i)] three
    \item[ii)] four
    \end{enumerate}
    me.
  `);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Let.

    1. one

    2. two

    or

    1. :warn[**hardcoded item labels are not supported in enumerate lists**] three

    2. :warn[**hardcoded item labels are not supported in enumerate lists**] four

    me.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <p>Let.</p>
    <ol>
      <li>
        <p>one</p>
      </li>
      <li>
        <p>two</p>
      </li>
    </ol>
    <p>or</p>
    <ol>
      <li>
        <p> <span class="warn"><strong>hardcoded item labels are not supported in enumerate lists</strong></span> three</p>
      </li>
      <li>
        <p> <span class="warn"><strong>hardcoded item labels are not supported in enumerate lists</strong></span> four</p>
      </li>
    </ol>
    <p>me.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('warn on itemize with hardcoded labels', async () => {
  const markdown = await testProcessor.latex(String.raw`
    Let.
    \begin{itemize}
    \item one
    \item two
    \end{itemize}
    or
    \begin{itemize}
    \item[i)] three
    \item[ii)] four
    \end{itemize}
    me.
  `);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    Let.

    * one

    * two

    or

    * :warn[**hardcoded item labels are not supported in itemize lists**] three

    * :warn[**hardcoded item labels are not supported in itemize lists**] four

    me.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(`
    <p>Let.</p>
    <ul>
      <li>
        <p>one</p>
      </li>
      <li>
        <p>two</p>
      </li>
    </ul>
    <p>or</p>
    <ul>
      <li>
        <p> <span class="warn"><strong>hardcoded item labels are not supported in itemize lists</strong></span> three</p>
      </li>
      <li>
        <p> <span class="warn"><strong>hardcoded item labels are not supported in itemize lists</strong></span> four</p>
      </li>
    </ul>
    <p>me.</p>
  `);

  expect(html).toBe(expectedHtml);
});
