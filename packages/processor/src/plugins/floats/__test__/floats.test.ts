import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('numberwithin', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{float}
    \numberwithin{figure}{section}
    \numberwithin{table}{section}

    \begin{document}

    \section{Hello}

    \begin{figure}[H]
      Alpha
      \caption{Bravo}
    \end{figure}

    \begin{table}[H]
      Alpha
      \caption{Bravo}
    \end{table}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    figure:
      numberWithin: h2
    table:
      numberWithin: h2
    ---

    ## Hello

    :::figure
    Alpha

    Bravo
    :::

    Alpha Bravo
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="hello"><span class="count">1</span> Hello</h2>
    <figure>
      <div class="fig-content">Alpha</div>
      <figcaption><strong>Figure 1.1:</strong> Bravo</figcaption>
    </figure>
    <p>Alpha Bravo</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});

test('counterwithin', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{amsmath}
    \usepackage{float}
    \counterwithin{figure}{section}
    \counterwithin{table}{section}

    \begin{document}

    \section{Hello}

    \begin{figure}[H]
    \centering
    \begin{tabular}{|l|c|r|}
    A & B & C \\
    D & E & F \\
    \end{tabular}
    \caption{Bravo}
    \end{figure}

    \begin{table}[H]
    \centering
    \begin{tabular}{|l|c|r|}
    A & B & C \\
    D & E & F \\
    \end{tabular}
    \caption{Delta}
    \end{table}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(`
    ---
    figure:
      counterWithin: h2
    table:
      counterWithin: h2
    ---

    ## Hello

    :::figure
    | A  |  B  |  C |
    | :- | :-: | -: |
    | D  |  E  |  F |

    Bravo
    :::

    | A  |  B  |  C |
    | :- | :-: | -: |
    | D  |  E  |  F |

    : Delta
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <h2 id="hello"><span class="count">1</span> Hello</h2>
    <figure>
      <div class="fig-content">
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">A</th>
              <th style="text-align:center;">B</th>
              <th style="text-align:right;">C</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:left;">D</td>
              <td style="text-align:center;">E</td>
              <td style="text-align:right;">F</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figcaption><strong>Figure 1:</strong> Bravo</figcaption>
    </figure>
    <figure>
      <figcaption><strong>Table 1:</strong> Delta</figcaption>
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">A</th>
            <th style="text-align:center;">B</th>
            <th style="text-align:right;">C</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:left;">D</td>
            <td style="text-align:center;">E</td>
            <td style="text-align:right;">F</td>
          </tr>
        </tbody>
      </table>
    </figure>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(markdown);
  // console.log(quartoHtml);
});
