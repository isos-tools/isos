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
