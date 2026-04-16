import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('newcommands with theorem expansion are not supported', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{amsart}

    \usepackage[overload]{keytheorems}
    \usepackage{zref-clever}
    \zcsetup{noabbrev, cap, nameinlink}
    \usepackage[colorlinks]{hyperref}

    \newtheorem{theorem}{Theorem}[section]
    \newcommand{\btheo}{\begin{theorem}}
    \newcommand{\etheo}{\end{theorem}}
    \begin{document}

    \btheo\label{thm:sr}
    Let $A$ be a Banach algebra.
    \etheo

    \begin{proof}[Proof of \zcref{thm:sr}]
    Assume by contradiction
    \end{proof}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    documentClass: amsart
    preambleWarnings:
      - message: \\newcommands with broken environments are not supported
        info: Remove (2) \\newcommands which \\begin an environment but don't end it (or
          vice versa).  A supported alternative for this purpose is \\newenvironment.
    theorems:
      theorem:
        style: plain
        numberWithin: h2
    ---

    :warn[**lost label:** \`thm:sr\`] Let $A$ be a Banach algebra.

    ::: {.proof name="Proof of @thm-sr"}
    Assume by contradiction
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);
  // return;

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <section class="preamble-warnings">
      <h2>Preamble warnings:</h2>
      <dl>
        <dt>\\newcommands with broken environments are not supported</dt>
        <dd>Remove (2) \\newcommands which \\begin an environment but don't end it (or vice versa). A supported alternative for this purpose is \\newenvironment.</dd>
      </dl>
    </section>
    <p> <span class="warn"><strong>lost label:</strong> <code>thm:sr</code></span> Let <code class="latex">A</code> be a Banach algebra.</p>
    <div class="remark proof">
      <p><span class="title"><em>Proof of  <span class="warn"><strong>unknown ref:</strong> <code>thm-sr</code></span> </em>. </span>Assume by contradiction<span class="qed"> q.e.d.</span></p>
    </div>
  `);

  expect(html).toBe(expectedHtml);
});
