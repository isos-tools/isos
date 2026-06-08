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
        style: remark
        heading: Solution
        numberWithin: h3
    ---

    ### Bravo

    :::solution
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

    :::solution
    See @fig-ex-3.

    ![Example 3](ex3.png){#fig-ex-3}
    :::

    | Col1 | Col2 | Col3 |
    | ---: | :--: | :--- |
    |    A |   B  | C    |

    : My table 2 {#tbl-letters-2}

    See @tbl-letters-2.

    :::solution
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
    <div class="theorem solution style-remark">
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
    <h2 id="delta"><span class="count">Chapter 1:</span> Delta</h2>
    <div class="theorem solution style-remark">
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
    <div class="theorem solution style-remark">
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

test('section references in book with parts', async () => {
  const latex = String.raw`
    \documentclass[12pt,a4paper,oneside]{book}
    \usepackage{zref-clever}
    \usepackage[colorlinks,bookmarks=false]{hyperref}
    \zcsetup{noabbrev, cap, nameinlink}
    \begin{document}

    \part{Motion of point particles} % this

    \chapter{Motion in central force fields}

    \section{Central force fields}

    \subsection{Equation of the path}
    \label{sec:eqofpath}

    Hello

    \subsection{Another}
    As discussed in \zcref{sec:eqofpath}.

    \chapter{Another chapter}

    \section{Another section}

    \subsection{Another subsection}
    \label{sec:anothersubsec}

    Another

    \subsection{Another subsection}
    As discussed in \zcref{sec:anothersubsec}.

    \paragraph{Another paragraph}

    \subparagraph{Another subparagraph}

    \end{document}
  `;

  const markdown = await testProcessor.latex(latex);
  // console.log(markdown);

  const expectedMarkdown = unindentStringAndTrim(String.raw`
    ---
    documentClass: book
    hasPart: true
    ---

    ## Motion of point particles

    ### Motion in central force fields

    #### Central force fields

    ##### Equation of the path {#sec-eqofpath}

    Hello

    ##### Another

    As discussed in @sec-eqofpath.

    ### Another chapter

    #### Another section

    ##### Another subsection {#sec-anothersubsec}

    Another

    ##### Another subsection

    As discussed in @sec-anothersubsec.

    ###### Another paragraph

    ###### Another subparagraph
  `);

  expect(markdown).toBe(expectedMarkdown);

  const html = await testProcessor.md(markdown);
  // console.log(html);

  const expectedHtml = unindentStringAndTrim(String.raw`
    <h2 id="motion-of-point-particles"><span class="count">Part 1:</span> Motion of point particles</h2>
    <h3 id="motion-in-central-force-fields"><span class="count">Chapter 1:</span> Motion in central force fields</h3>
    <h4 id="central-force-fields"><span class="count">1.1</span> Central force fields</h4>
    <h5 id="sec-eqofpath"><span class="count">1.1.1</span> Equation of the path</h5>
    <p>Hello</p>
    <h5 id="another"><span class="count">1.1.2</span> Another</h5>
    <p>As discussed in <a href="#sec-eqofpath" class="ref">Section 1.1.1</a>.</p>
    <h3 id="another-chapter"><span class="count">Chapter 2:</span> Another chapter</h3>
    <h4 id="another-section"><span class="count">2.1</span> Another section</h4>
    <h5 id="sec-anothersubsec"><span class="count">2.1.1</span> Another subsection</h5>
    <p>Another</p>
    <h5 id="another-subsection"><span class="count">2.1.2</span> Another subsection</h5>
    <p>As discussed in <a href="#sec-anothersubsec" class="ref">Section 2.1.1</a>.</p>
    <h6 id="another-paragraph">Another paragraph</h6>
    <h6 id="another-subparagraph">Another subparagraph</h6>
  `);

  expect(html).toBe(expectedHtml);
});
