import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('verb to inline code', async () => {
  const markdown = await testProcessor.latex(
    String.raw`an \verb|example| of`,
  );
  expect(markdown).toBe('an `example` of');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>an <code>example</code> of</p>');
});

test('mintinline to inline code', async () => {
  const markdown = await testProcessor.latex(
    String.raw`an \mintinline{java}{example} of`,
  );
  expect(markdown).toBe("an `{java} 'example'` of");
  const html = await testProcessor.md("an `{java} 'example'` of");
  expect(html).toBe(
    '<p>an <code class="language-java">example</code> of</p>',
  );
});

test('verbatim to code', async () => {
  const markdown = await testProcessor.latex(
    unindentStringAndTrim(String.raw`
      hi
      \begin{verbatim}
      hello \emph{oh hai!}
      \end{verbatim}
      yo
    `),
  );

  // console.log(markdown);
  // return;

  expect(markdown).toBe(
    unindentStringAndTrim(`
    hi

    \`\`\`
    hello \\emph{oh hai!}
    \`\`\`

    yo
  `),
  );
  const html = await testProcessor.md(markdown);

  // console.log(markdown);
  // return;

  expect(html).toBe(
    unindentStringAndTrim(`
      <p>hi</p>
      <pre><code>hello \\emph{oh hai!}
      </code></pre>
      <p>yo</p>
    `),
  );
});

test('minted to code', async () => {
  const markdown = await testProcessor.latex(
    unindentStringAndTrim(String.raw`
      hi
      \begin{minted}{csharp}
      hello
      \end{minted}
      yo
    `),
  );
  expect(markdown).toBe(
    unindentStringAndTrim(`
    hi

    \`\`\`csharp
    hello
    \`\`\`

    yo
  `),
  );
  const html = await testProcessor.md(markdown);
  expect(html).toBe(
    unindentStringAndTrim(`
      <p>hi</p>
      <pre><code class="language-csharp">hello</code></pre>
      <p>yo</p>
    `),
  );
});
