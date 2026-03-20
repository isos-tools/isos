import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('comment staff', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{comment}

    % Staff version
    \includecomment{staff}
    \excludecomment{student}

    % Student version
    % \excludecomment{staff}
    % \includecomment{student}

    \begin{document}

    \begin{student}
    Student
    \end{student}

    \begin{staff}
    Staff
    \end{staff}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(`Staff`);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(`<p>Staff</p>`);

  expect(html).toBe(expectedHtml);
});

test('comment student', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{comment}

    % Staff version
    % \includecomment{staff}
    % \excludecomment{student}

    % Student version
    \excludecomment{staff}
    \includecomment{student}

    \begin{document}

    \begin{student}
    Student
    \end{student}

    \begin{staff}
    Staff
    \end{staff}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(`Student`);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(`<p>Student</p>`);

  expect(html).toBe(expectedHtml);
});

test('comment include both', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{comment}

    \includecomment{staff}
    \includecomment{student}

    \begin{document}

    \begin{student}
    Student
    \end{student}

    \begin{staff}
    Staff
    \end{staff}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(`
    Student

    Staff
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(`
    <p>Student</p>
    <p>Staff</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('comment exclude both', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{comment}

    \excludecomment{student}
    \excludecomment{staff}

    \begin{document}

    \begin{student}
    Student
    \end{student}

    \begin{staff}
    Staff
    \end{staff}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(``);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(``);

  expect(html).toBe(expectedHtml);
});

test('comment env', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{comment}

    \begin{document}

    Hi

    \begin{comment}
    Hello
    \end{comment}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);

  const expectedMarkdown = unindentStringAndTrim(`Hi`);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);

  const expectedHtml = unindentStringAndTrim(`<p>Hi</p>`);

  expect(html).toBe(expectedHtml);
});
