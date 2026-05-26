import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { pdfLatexFixtureToHtml } from '../../../test-utils/pdflatex-to-html';

test.skip('course', async () => {
  const markdown = await testProcessor.fixture('course/index.tex');
  console.log(markdown);
  // return;
  const html = await testProcessor.md(markdown);
  console.log(html);
});

test('account for colons in text', async () => {
  const markdown = await testProcessor.latex(String.raw`
    Note that $ \arg(z) $ has infinitely many values: if $ \theta $.
  `);
  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>Note that <code class="latex">\arg(z)</code> has infinitely many values: if <code class="latex">\theta</code>.</p>
  `);

  expect(html).toBe(expectedHtml);
});
