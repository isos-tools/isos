import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('emph to italics', async () => {
  const markdown = await testProcessor.latex(String.raw`\emph{hi 1.2}`);
  expect(markdown).toBe('*hi 1.2*');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p><em>hi 1.2</em></p>');
});

test('{\\em value} to italics', async () => {
  const markdown = await testProcessor.latex(
    String.raw`What is the {\em financial value} of an object?`,
  );
  expect(markdown).toBe('What is the *financial value* of an object?');
  const html = await testProcessor.md(markdown);
  expect(html).toBe(
    '<p>What is the <em>financial value</em> of an object?</p>',
  );
});

test('textit to italics', async () => {
  const markdown = await testProcessor.latex(String.raw`\textit{hi 1.2}`);
  expect(markdown).toBe('*hi 1.2*');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p><em>hi 1.2</em></p>');
});

test('textbf to strong', async () => {
  const markdown = await testProcessor.latex(String.raw`\textbf{hi 1.2}`);
  expect(markdown).toBe('**hi 1.2**');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p><strong>hi 1.2</strong></p>');
});

test('bf to strong', async () => {
  const markdown = await testProcessor.latex(String.raw`{\bf (hi 1.2)}`);
  expect(markdown).toBe('**(hi 1.2)**');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p><strong>(hi 1.2)</strong></p>');
});

test('textbf emph to italic strong', async () => {
  const markdown = await testProcessor.latex(
    String.raw`\textbf{\emph{hi 1.2}}`,
  );
  expect(markdown).toBe('***hi 1.2***');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p><em><strong>hi 1.2</strong></em></p>');
});

test('emph textbf to italic strong', async () => {
  const markdown = await testProcessor.latex(
    String.raw`\emph{\textbf{hi 1.2}}`,
  );
  expect(markdown).toBe('***hi 1.2***');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p><em><strong>hi 1.2</strong></em></p>');
});

test('superscript', async () => {
  const markdown = await testProcessor.latex(
    String.raw`hello\textsuperscript{hi 1.2}`,
  );
  expect(markdown).toBe('hello^hi 1.2^');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>hello<sup>hi 1.2</sup></p>');
});

test('subscript', async () => {
  const markdown = await testProcessor.latex(
    String.raw`hello\textsubscript{hi 1.2}`,
  );
  expect(markdown).toBe('hello~hi 1.2~');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>hello<sub>hi 1.2</sub></p>');
});

test('strikethrough', async () => {
  const markdown = await testProcessor.latex(
    String.raw`strike \sout{through}`,
  );
  expect(markdown).toBe('strike ~~through~~');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>strike <del>through</del></p>');
});

test('displayquote to blockquote', async () => {
  const markdown = await testProcessor.latex(
    unindentStringAndTrim(String.raw`
      hi
      \begin{displayquote}
      hello \emph{oh hai!}
      \end{displayquote}
      yo
    `),
  );
  expect(markdown).toBe(
    unindentStringAndTrim(`
    hi

    > hello *oh hai!*

    yo
  `),
  );
  const html = await testProcessor.md(markdown);
  expect(html).toBe(
    unindentStringAndTrim(`
      <p>hi</p>
      <blockquote>
        <p>hello <em>oh hai!</em></p>
      </blockquote>
      <p>yo</p>
    `),
  );
});

test('endash', async () => {
  const html = await testProcessor.md('hi–');
  expect(html).toBe('<p>hi–</p>');
});

test('endash to 2 dashes', async () => {
  const markdown = await testProcessor.latex(String.raw`hi\textendash`);
  expect(markdown).toBe('hi--');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>hi–</p>');
});

test('emdash', async () => {
  const html = await testProcessor.md('hi—');
  expect(html).toBe('<p>hi—</p>');
});

test('emdash to 3 dashes', async () => {
  const markdown = await testProcessor.latex(String.raw`hi\textemdash`);
  expect(markdown).toBe('hi---');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>hi—</p>');
});

test('url to link', async () => {
  const markdown = await testProcessor.latex(
    String.raw`\url{http://www.yahoo.com}`,
  );
  expect(markdown).toBe('<http://www.yahoo.com>');
  const html = await testProcessor.md(markdown);
  expect(html).toBe(
    '<p><a href="http://www.yahoo.com" target="_blank">http://www.yahoo.com</a></p>',
  );
});

test('external href to link', async () => {
  const markdown = await testProcessor.latex(
    String.raw`\href{http://www.yahoo.com}{Yahoo}`,
  );
  expect(markdown).toBe('[Yahoo](http://www.yahoo.com)');
  const html = await testProcessor.md(markdown);
  expect(html).toBe(
    '<p><a href="http://www.yahoo.com" target="_blank">Yahoo</a></p>',
  );
});

test('anchor href to link', async () => {
  const markdown = '[Yahoo](#yahoo)';
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p><a href="#yahoo">Yahoo</a></p>');
});

test('open and close single quotation marks', async () => {
  const markdown = await testProcessor.latex("`obviously true'");
  expect(markdown).toBe('‘obviously true’');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>‘obviously true’</p>');
});

test('open and close double quotation marks', async () => {
  const markdown = await testProcessor.latex("``obviously true''");
  expect(markdown).toBe('“obviously true”');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>“obviously true”</p>');
});

test('escaped ampersand', async () => {
  const markdown = await testProcessor.latex(String.raw`Trefethen \& Bau`);
  expect(markdown).toBe('Trefethen & Bau');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>Trefethen &amp; Bau</p>');
});

test('{\\bf x} in mathmode', async () => {
  const markdown = await testProcessor.latex('obeying ${\\bf z}$.');
  expect(markdown).toBe('obeying ${\\bf z}$.');
  const html = await testProcessor.md(markdown);
  expect(html).toBe('<p>obeying <code class="latex">{\\bf z}</code>.</p>');
});
