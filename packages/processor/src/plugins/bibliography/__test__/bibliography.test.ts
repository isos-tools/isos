import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('bibliography small', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage[colorlinks]{hyperref}

    \begin{document}

    See \cite[26.9, 26.14]{Fraleigh} and \cite[Theorem 26.17]{Fraleigh}.

    \begin{thebibliography}{O09}

    \bibitem{Fraleigh} J.B. Fraleigh,
    A first course in abstract algebra, 7th edition, Pearson

    \end{thebibliography}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    references:
      - id: fraleigh
        label: J.B. Fraleigh, A first course in abstract algebra, 7th edition, Pearson
    ---

    See [@fraleigh 26.9, 26.14] and [@fraleigh Theorem 26.17].
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 1</a> 26.9, 26.14]</span> and <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 1</a> Theorem 26.17]</span>.</p>
    <section class="bibliography">
      <h2>References</h2>
      <ol>
        <li id="bib-fraleigh">
          <p>J.B. Fraleigh, A first course in abstract algebra, 7th edition, Pearson</p>
        </li>
      </ol>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('syntax bug', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}

    \begin{document}

    \begin{thebibliography}{O09}
    \bibitem{stewart} I. Stewart, Galois Theory, 3rd edition, Chapman\&Hall/CRC Mathematics
    \end{thebibliography}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    references:
      - id: stewart
        label: I. Stewart, Galois Theory, 3rd edition, Chapman&Hall/CRC Mathematics
    ---
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noIcons: true });
  // console.log(html);
  // return

  const expectedHtml = unindentStringAndTrim(`
    <section class="bibliography">
      <h2>References</h2>
      <ol>
        <li id="bib-stewart">
          <p>I. Stewart, Galois Theory, 3rd edition, Chapman&amp;Hall/CRC Mathematics</p>
        </li>
      </ol>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});

test('bibliography large', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage[colorlinks]{hyperref}

    \begin{document}

    \begin{enumerate}
    \item See \cite[26.9, 26.14]{Fraleigh}.
    \item See \cite[Theorem 26.17]{Fraleigh}.
    \item See \cite[Theorem 45.29]{Fraleigh}.
    \item See \cite[Section 31]{Fraleigh}.
    \item See \cite[\S51]{Fraleigh}.
    \item See \cite[Chapter 13]{stewart}.
    \item See \cite[Section 35]{Fraleigh}.
    \item See \cite[34.5]{Fraleigh}.
    \item See \cite[Section 9]{Fraleigh}.
    \item See \cite[Theorem 15.15]{Fraleigh}.
    \item See \cite[Theorem 36.3]{Fraleigh}.
    \item See \cite[Chapter 7]{stewart}.
    \item See \cite[Chapter 24]{stewart}.
    \end{enumerate}

    \clearpage

    \begin{thebibliography}{O09}

    \bibitem{baker} A.~Baker,
    An introduction to Galois theory, lecture notes
    \bibitem{Fraleigh} J.B. Fraleigh,
    A first course in abstract algebra, 7th edition, Pearson
    \bibitem{howie} J. Howie, Fields and Galois Thoery,
    Springer
    \bibitem{hungerford} T.W. Hungerford, Algebra, Springer
    \bibitem{stewart} I. Stewart, Galois Theory, 3rd edition, Chapman\&Hall/CRC Mathematics
    \bibitem{weintraub} S. Weintraub, Galois Thoery,
    Springer

    \end{thebibliography}

    \clearpage

    The end.

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    references:
      - id: baker
        label: A. Baker, An introduction to Galois theory, lecture notes
      - id: fraleigh
        label: J.B. Fraleigh, A first course in abstract algebra, 7th edition, Pearson
      - id: howie
        label: J. Howie, Fields and Galois Thoery, Springer
      - id: hungerford
        label: T.W. Hungerford, Algebra, Springer
      - id: stewart
        label: I. Stewart, Galois Theory, 3rd edition, Chapman&Hall/CRC Mathematics
      - id: weintraub
        label: S. Weintraub, Galois Thoery, Springer
    ---

    1. See [@fraleigh 26.9, 26.14].

    2. See [@fraleigh Theorem 26.17].

    3. See [@fraleigh Theorem 45.29].

    4. See [@fraleigh Section 31].

    5. See [@fraleigh §51].

    6. See [@stewart Chapter 13].

    7. See [@fraleigh Section 35].

    8. See [@fraleigh 34.5].

    9. See [@fraleigh Section 9].

    10. See [@fraleigh Theorem 15.15].

    11. See [@fraleigh Theorem 36.3].

    12. See [@stewart Chapter 7].

    13. See [@stewart Chapter 24].

    The end.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown, { noIcons: true });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <ol>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> 26.9, 26.14]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> Theorem 26.17]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> Theorem 45.29]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> Section 31]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> §51]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-stewart" class="ref">Reference 5</a> Chapter 13]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> Section 35]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> 34.5]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> Section 9]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> Theorem 15.15]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-fraleigh" class="ref">Reference 2</a> Theorem 36.3]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-stewart" class="ref">Reference 5</a> Chapter 7]</span>.</p>
      </li>
      <li>
        <p>See <span class="cite">[<a href="#bib-stewart" class="ref">Reference 5</a> Chapter 24]</span>.</p>
      </li>
    </ol>
    <p>The end.</p>
    <section class="bibliography">
      <h2>References</h2>
      <ol>
        <li id="bib-baker">
          <p>A. Baker, An introduction to Galois theory, lecture notes</p>
        </li>
        <li id="bib-fraleigh">
          <p>J.B. Fraleigh, A first course in abstract algebra, 7th edition, Pearson</p>
        </li>
        <li id="bib-howie">
          <p>J. Howie, Fields and Galois Thoery, Springer</p>
        </li>
        <li id="bib-hungerford">
          <p>T.W. Hungerford, Algebra, Springer</p>
        </li>
        <li id="bib-stewart">
          <p>I. Stewart, Galois Theory, 3rd edition, Chapman&amp;Hall/CRC Mathematics</p>
        </li>
        <li id="bib-weintraub">
          <p>S. Weintraub, Galois Thoery, Springer</p>
        </li>
      </ol>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});
