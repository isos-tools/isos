import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

// @ts-ignore
// import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// @ts-ignore
// import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('tables', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsthm}
    \theoremstyle{definition}
    \newtheorem{theorem}{Theorem}
    \begin{document}
    \begin{theorem}
    Hi.
    \begin{figure}[h!]
    \begin{tabular}{c|c|c}
    Date gilt matures   & Coupon &	Price  \\
      7th December 2028  & $6\%$ & $\pounds 120.66$\\
      7th June 2021 & $8\%$ & $\pounds 134.70$
    \end{tabular}
    \end{figure}
    Hello.
    \end{theorem}
    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    :::: {#thm-1}
    Hi.

    ::: {.fig}

    | Date gilt matures | Coupon |       Price      |
    | :---------------: | :----: | :--------------: |
    | 7th December 2028 |  $6\%$ | $\pounds 120.66$ |
    |   7th June 2021   |  $8\%$ | $\pounds 134.70$ |

    :::

    Hello.
    ::::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 1.</strong></span> Hi.</p>
      <figure>
        <div class="fig-content">
          <table>
            <thead>
              <tr>
                <th style="text-align:center;">Date gilt matures</th>
                <th style="text-align:center;">Coupon</th>
                <th style="text-align:center;">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align:center;">7th December 2028</td>
                <td style="text-align:center;"><code class="latex">6\%</code></td>
                <td style="text-align:center;"><code class="latex">\pounds 120.66</code></td>
              </tr>
              <tr>
                <td style="text-align:center;">7th June 2021</td>
                <td style="text-align:center;"><code class="latex">8\%</code></td>
                <td style="text-align:center;"><code class="latex">\pounds 134.70</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>
      <p>Hello.</p>
    </div>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('table syntax bug', async () => {
  const latex = String.raw`
    \begin{theorem}
    has truth table
    \begin{center}
    \begin{tabular}{c|c|c}
    $ P $ & $ Q $ & $ P \implies Q $ \\
    \hline
    T & T & T \\
    T & F & F \\
    F & T & T \\
    F & F & T
    \end{tabular}.
    \end{center}
    \end{theorem}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(`
    ::: {#thm-1}
    has truth table

    | $P$ | $Q$ | $P \\implies Q$ |
    | :-: | :-: | :------------: |
    |  T  |  T  |        T       |
    |  T  |  F  |        F       |
    |  F  |  T  |        T       |
    |  F  |  F  |        T       |

    .
    :::
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(expectedMarkdown);
  // console.log(html);

  const expected = unindentStringAndTrim(`
    <div class="definition theorem" id="thm-1">
      <p><span class="title"><strong>Theorem 1.</strong></span> has truth table</p>
      <table>
        <thead>
          <tr>
            <th style="text-align:center;"><code class="latex">P</code></th>
            <th style="text-align:center;"><code class="latex">Q</code></th>
            <th style="text-align:center;"><code class="latex">P \\implies Q</code></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:center;">T</td>
            <td style="text-align:center;">T</td>
            <td style="text-align:center;">T</td>
          </tr>
          <tr>
            <td style="text-align:center;">T</td>
            <td style="text-align:center;">F</td>
            <td style="text-align:center;">F</td>
          </tr>
          <tr>
            <td style="text-align:center;">F</td>
            <td style="text-align:center;">T</td>
            <td style="text-align:center;">T</td>
          </tr>
          <tr>
            <td style="text-align:center;">F</td>
            <td style="text-align:center;">F</td>
            <td style="text-align:center;">T</td>
          </tr>
        </tbody>
      </table>
      <p>.</p>
    </div>
  `);

  expect(html).toBe(expected);
});
