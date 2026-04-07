import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('maths with nested newcommand expansion', async () => {
  const latex = String.raw`
    \documentclass{article}
    \newcommand{\lge}{\left\{} % links geschweift
    \newcommand{\rge}{\right\}} % rechts geschweift
    \newcommand{\gekl}[1]{\lge #1 \rge} % geschweifte Klammer
    \newcommand{\menge}[2]{\gekl{#1 \colon #2}} % Menge
    \begin{document}

    the space  $\ell^2 = \menge{a}{b}$ giving the norms

    \end{document}
  `;

  // console.log(unindentStringAndTrim(latex));

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    the space $\ell^{2} = \left\{ a \colon b \right\}$ giving the norms
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <p>the space <code class="latex">\ell^{2} = \left\{ a \colon b \right\}</code> giving the norms</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('maths with def expansion', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsfonts}
    \def\Rz{\mathbb{R}}
    \begin{document}

    So $\lambda \in \Rz$.

    \end{document}
  `;

  // console.log(unindentStringAndTrim(latex));

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    preambleWarnings:
      - message: \def is not supported
        info: Replace all (1) \def commands with \newcommand.  Try compiling with
          pdftex, it may warn you to use \renewcommand if a command already exists.
    ---

    So $\lambda \in \Rz$.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section class="preamble-warnings">
      <h2>Preamble warnings:</h2>
      <dl>
        <dt>\def is not supported</dt>
        <dd>Replace all (1) \def commands with \newcommand. Try compiling with pdftex, it may warn you to use \renewcommand if a command already exists.</dd>
      </dl>
    </section>
    <p>So <code class="latex">\lambda \in \Rz</code>.</p>
  `);

  expect(html).toBe(expectedHtml);
});

test('maths with def expansion with arguments', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsfonts}
    \def\Rz<#1>{\mathbb{#1}}
    \begin{document}

    So $\lambda \in \Rz<hi>$.

    \end{document}
  `;

  // console.log(unindentStringAndTrim(latex));

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    preambleWarnings:
      - message: \def is not supported
        info: Replace all (1) \def commands with \newcommand.  Try compiling with
          pdftex, it may warn you to use \renewcommand if a command already exists.
    ---

    So $\lambda \in \Rz<hi>$.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <section class="preamble-warnings">
      <h2>Preamble warnings:</h2>
      <dl>
        <dt>\def is not supported</dt>
        <dd>Replace all (1) \def commands with \newcommand. Try compiling with pdftex, it may warn you to use \renewcommand if a command already exists.</dd>
      </dl>
    </section>
    <p>So <code class="latex">\lambda \in \Rz<hi></code>.</p>
  `);

  expect(html).toBe(expectedHtml);
});
