import { expect, test } from 'vitest';

import { testProcessor, unindentStringAndTrim } from '@isos/test-utils';

test('mixed counts', async () => {
  const latex = String.raw`
    \documentclass{report}
    \usepackage{float}
    \usepackage[in]{fullpage}
    \usepackage{amsthm}
    \usepackage{graphicx}
    \usepackage[colorlinks=true,bookmarks=false,linkcolor=blue]{hyperref}
    \usepackage[noabbrev, capitalise, nameinlink]{cleveref}
    \theoremstyle{remark}
    \newtheorem{solution}{Solution}[section]
    \begin{document}

    \section{Bravo}

    \begin{solution}
    See \cref{fig:ex1}.
    \begin{figure}[H]
    \centering
    \includegraphics*[width=3in]{ex1.png}
    \caption{Example 1}
    \label{fig:ex1}
    \end{figure}
    \end{solution}

    \section{Charlie}

    \begin{table}[H]
    \centering
    \caption{My table}
    \begin{tabular}{|r|c|l|}
    Col1 & Col2 & Col3 \\
    A & B & C \\
    \end{tabular}
    \label{tbl:letters1}
    \end{table}

    See \cref{tbl:letters1}.

    \chapter{Delta}

    \begin{solution}
    See \cref{fig:ex3}.
    \begin{figure}[H]
    \centering
    \includegraphics*[width=3in]{ex3.png}
    \caption{Example 3}
    \label{fig:ex3}
    \end{figure}
    \end{solution}

    \begin{table}[H]
    \centering
    \caption{My table 2}
    \begin{tabular}{|r|c|l|}
    Col1 & Col2 & Col3 \\
    A & B & C \\
    \end{tabular}
    \label{tbl:letters2}
    \end{table}

    See \cref{tbl:letters2}.

    \begin{solution}
    See \cref{fig:ex4}.
    \begin{figure}[H]
    \centering
    \includegraphics*[width=3in]{fig/ex4.png}
    \caption{Example 4}
    \label{fig:ex4}
    \end{figure}
    \end{solution}

    \begin{table}[H]
    \centering
    \caption{My table 3}
    \begin{tabular}{|r|c|l|}
    Col1 & Col2 & Col3 \\
    A & B & C \\
    \end{tabular}
    \label{tbl:letters3}
    \end{table}

    See \cref{tbl:letters3}.

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);
  // return;

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    documentClass: report
    theorems:
      solution:
        numberWithin: h3
    ---

    ### Bravo

    ::: {#sol-1}
    See @fig-ex-1.

    ![Example 1](ex1.png){#fig-ex-1}

    :::

    ### Charlie

    | Col1 | Col2 | Col3 |
    | ---: | :--: | :--- |
    |    A |   B  | C    |

    : My table {#tbl-letters-1}

    See @tbl-letters-1.

    ## Delta

    ::: {#sol-2}
    See @fig-ex-3.

    ![Example 3](ex3.png){#fig-ex-3}

    :::

    | Col1 | Col2 | Col3 |
    | ---: | :--: | :--- |
    |    A |   B  | C    |

    : My table 2 {#tbl-letters-2}

    See @tbl-letters-2.

    ::: {#sol-3}
    See @fig-ex-4.

    ![Example 4](fig/ex4.png){#fig-ex-4}

    :::

    | Col1 | Col2 | Col3 |
    | ---: | :--: | :--- |
    |    A |   B  | C    |

    : My table 3 {#tbl-letters-3}

    See @tbl-letters-3.
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);
  // return;

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h3 id="bravo"><span class="count">0.1</span> Bravo</h3>
    <div class="remark solution" id="sol-1">
      <p><span class="title"><em>Solution 0.1.1</em>. </span>See <a href="#fig-ex-1" class="ref">Figure 1</a>.</p>
      <figure id="fig-ex-1">
        <div class="fig-content">
          <p><img src="ex1.png" alt="Image" /></p>
        </div>
        <figcaption><strong>Figure 1:</strong> Example 1</figcaption>
      </figure>
    </div>
    <h3 id="charlie"><span class="count">0.2</span> Charlie</h3>
    <figure id="tbl-letters-1">
      <figcaption><strong>Table 1:</strong> My table</figcaption>
      <table>
        <thead>
          <tr>
            <th style="text-align:right;">Col1</th>
            <th style="text-align:center;">Col2</th>
            <th style="text-align:left;">Col3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:right;">A</td>
            <td style="text-align:center;">B</td>
            <td style="text-align:left;">C</td>
          </tr>
        </tbody>
      </table>
    </figure>

    <p>See <a href="#tbl-letters-1" class="ref">Table 1</a>.</p>
    <h2 id="delta"><span class="count">1</span> Delta</h2>
    <div class="remark solution" id="sol-2">
      <p><span class="title"><em>Solution 1.0.1</em>. </span>See <a href="#fig-ex-3" class="ref">Figure 1.1</a>.</p>
      <figure id="fig-ex-3">
        <div class="fig-content">
          <p><img src="ex3.png" alt="Image" /></p>
        </div>
        <figcaption><strong>Figure 1.1:</strong> Example 3</figcaption>
      </figure>
    </div>
    <figure id="tbl-letters-2">
      <figcaption><strong>Table 1.1:</strong> My table 2</figcaption>
      <table>
        <thead>
          <tr>
            <th style="text-align:right;">Col1</th>
            <th style="text-align:center;">Col2</th>
            <th style="text-align:left;">Col3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:right;">A</td>
            <td style="text-align:center;">B</td>
            <td style="text-align:left;">C</td>
          </tr>
        </tbody>
      </table>
    </figure>

    <p>See <a href="#tbl-letters-2" class="ref">Table 1.1</a>.</p>
    <div class="remark solution" id="sol-3">
      <p><span class="title"><em>Solution 1.0.2</em>. </span>See <a href="#fig-ex-4" class="ref">Figure 1.2</a>.</p>
      <figure id="fig-ex-4">
        <div class="fig-content">
          <p><img src="fig/ex4.png" alt="Image" /></p>
        </div>
        <figcaption><strong>Figure 1.2:</strong> Example 4</figcaption>
      </figure>
    </div>
    <figure id="tbl-letters-3">
      <figcaption><strong>Table 1.2:</strong> My table 3</figcaption>
      <table>
        <thead>
          <tr>
            <th style="text-align:right;">Col1</th>
            <th style="text-align:center;">Col2</th>
            <th style="text-align:left;">Col3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align:right;">A</td>
            <td style="text-align:center;">B</td>
            <td style="text-align:left;">C</td>
          </tr>
        </tbody>
      </table>
    </figure>

    <p>See <a href="#tbl-letters-3" class="ref">Table 1.2</a>.</p>
  `);

  expect(html).toBe(expectedHtml);
});
