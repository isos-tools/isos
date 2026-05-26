import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';
// @ts-ignore
import { markdownToPandocHtml } from '@isos/test-utils/md-to-pandoc-html';
// @ts-ignore
import { markdownToQuartoHtml } from '@isos/test-utils/md-to-quarto-html';

test('tables', async () => {
  const latex = String.raw`
    \documentclass{article}
    \usepackage{float}
    \usepackage{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \begin{document}

    \begin{table}[H]
      \caption{My \textbf{fancy} caption}
      \begin{tabular}{lll}
        Col1 & Col2 & Col3 \\
        A & B & C \\
      \end{tabular}
      \label{tbl:letters1}
    \end{table}

    \begin{table}[H]
      \begin{tabular}{lll}
        Col1 & Col2 & Col3 \\
        D & E & F \\
      \end{tabular}
      \label{tbl:letters2}
    \end{table}

    \begin{tabular}{lll}
      Col1 & Col2 & Col3 \\
      G & H & I \\
    \end{tabular}

    \begin{table}[H]
      \caption{My \textbf{fancy} caption}
      \begin{tabular}{lll}
        Col1 & Col2 & Col3 \\
        J & K & L \\
      \end{tabular}
    \end{table}

    See \autoref{tbl:letters1} and \autoref{tbl:letters2} and \autoref{tbl:letters3}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    | Col1 | Col2 | Col3 |
    | :--- | :--- | :--- |
    | A    | B    | C    |

    : My **fancy** caption {#tbl-letters-1}

    | Col1 | Col2 | Col3 |
    | :--- | :--- | :--- |
    | D    | E    | F    |

    : {#tbl-letters-2}

    | Col1 | Col2 | Col3 |
    | :--- | :--- | :--- |
    | G    | H    | I    |

    | Col1 | Col2 | Col3 |
    | :--- | :--- | :--- |
    | J    | K    | L    |

    : My **fancy** caption

    See @tbl-letters-1 and @tbl-letters-2 and @tbl-letters-3.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <figure id="tbl-letters-1">
      <figcaption><strong>Table 1:</strong> My <strong>fancy</strong> caption</figcaption>
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Col1</th>
            <th style="text-align:left;">Col2</th>
            <th style="text-align:left;">Col3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:left;">A</td>
            <td style="text-align:left;">B</td>
            <td style="text-align:left;">C</td>
          </tr>
        </tbody>
      </table>
    </figure>

    <figure id="tbl-letters-2">
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Col1</th>
            <th style="text-align:left;">Col2</th>
            <th style="text-align:left;">Col3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:left;">D</td>
            <td style="text-align:left;">E</td>
            <td style="text-align:left;">F</td>
          </tr>
        </tbody>
      </table>
    </figure>

    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Col1</th>
          <th style="text-align:left;">Col2</th>
          <th style="text-align:left;">Col3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align:left;">G</td>
          <td style="text-align:left;">H</td>
          <td style="text-align:left;">I</td>
        </tr>
      </tbody>
    </table>
    <figure>
      <figcaption><strong>Table 2:</strong> My <strong>fancy</strong> caption</figcaption>
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Col1</th>
            <th style="text-align:left;">Col2</th>
            <th style="text-align:left;">Col3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:left;">J</td>
            <td style="text-align:left;">K</td>
            <td style="text-align:left;">L</td>
          </tr>
        </tbody>
      </table>
    </figure>

    <p>See <a href="#tbl-letters-1" class="ref">Table 1</a> and <span class="warn"><strong>unknown ref:</strong> <code>tbl-letters-2</code></span> and <span class="warn"><strong>unknown ref:</strong> <code>tbl-letters-3</code></span> .</p>
  `);

  expect(html).toBe(expectedHtml);

  // const quartoHtml = await markdownToQuartoHtml(expectedMarkdown);
  // console.log(quartoHtml);
});

test('syntax bug', async () => {
  const markdown = unindentStringAndTrim(`
    ## Introduction {#sec-introduction}

    :::table{#tbl-table}

    ![](table.png)

    An *image* treated like a table

    :::

    :::table{#tbl-chair}

    | A | B |
    |---|---|
    | C | D |

    A *table* treated like a table

    :::

    See @sec-introduction and @tbl-table and @tbl-chair.
  `);

  const html = await testProcessor.md(markdown, {
    noSections: false,
  });
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(`
    <section id="sec-introduction">
      <h2><span class="count">1</span> Introduction</h2>
      <figure id="tbl-table" class="table">
        <figcaption><strong>Table 1:</strong> An <em>image</em> treated like a table</figcaption>
        <div class="fig-content"><img src="table.png" alt="Image" /></div>
      </figure>
      <figure id="tbl-chair" class="table">
        <figcaption><strong>Table 2:</strong> A <em>table</em> treated like a table</figcaption>
        <div class="fig-content">
          <table>
            <thead>
              <tr>
                <th>A</th>
                <th>B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>C</td>
                <td>D</td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>
      <p>See <a href="#sec-introduction" class="ref">Section 1</a> and <a href="#tbl-table" class="ref">Table 1</a> and <a href="#tbl-chair" class="ref">Table 2</a>.</p>
    </section>
  `);

  expect(html).toBe(expectedHtml);
});
