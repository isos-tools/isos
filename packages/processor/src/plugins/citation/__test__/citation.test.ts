import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test.skip('citations small', async () => {
  const latex = unindentStringAndTrim(String.raw`
    \documentclass{article}
    \usepackage{amsrefs}

    \usepackage{zref-clever}
    \usepackage[colorlinks,bookmarks=false]{hyperref}
    \zcsetup{noabbrev, cap, nameinlink}

    \begin{document}

    See \cite[26.9, 26.14]{ArnoldClassicalMechanics}.

    \begin{bibdiv}
      \begin{biblist}
        \bib{ArnoldClassicalMechanics}{book}{
          author={Arnol\cprime d, V. I.},
          title={Mathematical methods of classical mechanics},
          series={Graduate Texts in Mathematics},
          volume={60},
          edition={2},
          note={Translated from the Russian by K. Vogtmann and A. Weinstein},
          publisher={Springer-Verlag, New York},
          date={1989},
          pages={xvi+508},
          isbn={0-387-96890-3},
          review={\MR{997295}},
          doi={10.1007/978-1-4757-2063-1},
        }
      \end{biblist}
    \end{bibdiv}

    \end{document}
  `);

  const markdown = await testProcessor.latex(latex);
  console.log(markdown);
  return;

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
